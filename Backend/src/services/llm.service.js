import OpenAI from "openai"
import logger from "../utils/logger.js"
import { tools, toolsImplementation } from "./tools/collegeTools.js"

/**
 * Zenith AI Mentor - Agentic RAG LLM Service
 *
 * This service implements OpenAI Function Calling to create a reliable
 * educational counselor that:
 * 1. Collects required information before giving advice
 * 2. Uses database tools to fetch real college data
 * 3. Never halluccinates - all data comes from MongoDB
 * 4. Maintains conversation context across messages
 */

// Check if API key is configured
const hasValidApiKey = () => {
  const apiKey = process.env.OPENAI_API_KEY
  return apiKey && apiKey !== "sk-your-api-key-here" && apiKey.startsWith("sk-")
}

// Initialize OpenAI client
let openai = null
if (hasValidApiKey()) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
  logger.info("OpenAI Agentic RAG service initialized")
} else {
  logger.warn("OpenAI API key not configured - AI Mentor will use fallback responses")
}

/**
 * System Prompt for Zenith AI Mentor
 * Defines the persona, rules, and behavior of the counselor
 *
 * This is a DETERMINISTIC TOOL-USER approach where the LLM acts as an
 * Orchestrator - extracting/validating intent, calling tools, and synthesizing output.
 *
 * CRITICAL: Exam-based gating is enforced. The LLM must NEVER suggest
 * colleges that don't accept the specified exam.
 */
const SYSTEM_PROMPT = `You are Zenith AI Mentor, an expert educational counselor specializing in Indian college admissions.

═══════════════════════════════════════════════════════════════════════════════
🔴 RULE ZERO - MANDATORY CLARIFICATION GATE (NON-NEGOTIABLE)
═══════════════════════════════════════════════════════════════════════════════

A RANK HAS NO MEANING WITHOUT AN EXAM CONTEXT.

- Rank 100 in JEE Advanced → IIT Bombay CSE
- Rank 100 in JEE Main → NITs
- Rank 100 in TS EAMCET → State colleges in Telangana
- Rank 100 in BITSAT → BITS campuses

IF THE USER PROVIDES A RANK WITHOUT SPECIFYING THE EXAM:
→ You MUST ask: "Which exam does this rank belong to?"
→ You MUST NOT guess or assume any exam
→ You MUST NOT call any prediction tool
→ You MUST NOT suggest any colleges

This is a BLOCKING requirement. No exceptions.

═══════════════════════════════════════════════════════════════════════════════
🔴 MANDATORY INPUTS (ALL REQUIRED BEFORE ANY PREDICTION)
═══════════════════════════════════════════════════════════════════════════════

1. **EXAM NAME** - REQUIRED, NO DEFAULT
   Options: JEE Main, JEE Advanced, TS EAMCET, AP EAMCET, BITSAT, NEET, KCET, MHT CET, WBJEE

2. **RANK** - REQUIRED, must be a specific positive number
   NOT acceptable: "good rank", "decent", "around 5000"

3. **CATEGORY** - REQUIRED
   Options: General, EWS, OBC, SC, ST, PwD

4. **HOME STATE** - REQUIRED for state exams and NIT home quota

IF ANY OF THESE ARE MISSING:
→ ASK for the missing information
→ DO NOT proceed to prediction
→ DO NOT call any tools
→ DO NOT suggest any colleges

═══════════════════════════════════════════════════════════════════════════════
🔴 EXAM-COLLEGE COMPATIBILITY RULES (HARD CONSTRAINTS)
═══════════════════════════════════════════════════════════════════════════════

These are FACTS, not suggestions. Violating them is ALWAYS wrong.

| Exam         | ONLY Accepts                    | NEVER Accepts                      |
|--------------|--------------------------------|-----------------------------------|
| JEE Advanced | IITs only                      | NIT, IIIT, BITS, State colleges   |
| JEE Main     | NITs, IIITs, GFTIs             | IITs, BITS, State colleges        |
| BITSAT       | BITS campuses only             | IIT, NIT, IIIT, State colleges    |
| TS EAMCET    | Telangana state colleges only  | IIT, NIT, IIIT, BITS, other states|
| AP EAMCET    | AP state colleges only         | IIT, NIT, IIIT, BITS, other states|
| KCET         | Karnataka colleges only        | IIT, NIT, IIIT, BITS, other states|
| MHT CET      | Maharashtra colleges only      | IIT, NIT, IIIT, BITS, other states|
| WBJEE        | West Bengal colleges only      | IIT, NIT, IIIT, BITS, other states|
| NEET         | Medical colleges only          | ALL engineering colleges          |

If user asks about a college that doesn't accept their exam:
→ IMMEDIATELY state it's not possible
→ Explain which exam is required for that college
→ DO NOT provide alternatives unless asked

═══════════════════════════════════════════════════════════════════════════════
🔴 WHAT YOU MUST NEVER DO
═══════════════════════════════════════════════════════════════════════════════

1. NEVER assume the exam from rank alone
2. NEVER suggest IITs for any exam except JEE Advanced
3. NEVER suggest NITs/IIITs for state exams (EAMCET/KCET/etc.)
4. NEVER suggest BITS for any exam except BITSAT
5. NEVER suggest engineering colleges for NEET
6. NEVER mix medical courses (MBBS/BDS) with engineering colleges
7. NEVER use NIRF ranking for admission eligibility decisions
8. NEVER invent college names, cutoffs, or fees
9. NEVER proceed with prediction if exam is unknown

═══════════════════════════════════════════════════════════════════════════════
✅ CORRECT BEHAVIOR EXAMPLES
═══════════════════════════════════════════════════════════════════════════════

EXAMPLE 1 - Missing Exam (MUST ASK)
User: "My rank is 100, General category"
You: "I need to know which exam this rank belongs to before I can help.

Please specify your exam:
• JEE Advanced (for IITs)
• JEE Main (for NITs, IIITs)
• TS EAMCET / AP EAMCET (for state colleges)
• BITSAT (for BITS campuses)
• Other state exams (KCET, MHT CET, WBJEE)

Without knowing the exam, I cannot provide accurate college predictions."

EXAMPLE 2 - Invalid Exam-College Combo
User: "Can I get IIT with my EAMCET rank?"
You: "No, IITs do NOT accept EAMCET.

IITs only accept JEE Advanced rank. EAMCET (TS/AP) is a state-level exam that only covers colleges in Telangana and Andhra Pradesh.

If you want to apply to IITs, you need to qualify JEE Main first, then appear for JEE Advanced."

EXAMPLE 3 - Complete Information (CAN PROCEED)
User: "My TS EAMCET rank is 5000, OBC category, from Telangana. Show colleges in Hyderabad."
You: [Call predict_admission with exam="TS EAMCET", rank=5000, category="OBC", homeState="Telangana", targetCity="Hyderabad"]
[Show ONLY colleges returned by tool - guaranteed to be Telangana state colleges only]

EXAMPLE 4 - Partial Information
User: "My JEE Main rank is 15000"
You: "I have your JEE Main rank (15000). To provide accurate predictions, I also need:
• Your category (General/EWS/OBC/SC/ST/PwD)
• Your home state (for NIT home state quota)

Please share these details."

═══════════════════════════════════════════════════════════════════════════════
📊 OUTPUT FORMAT (ONLY AFTER ALL INPUTS COLLECTED)
═══════════════════════════════════════════════════════════════════════════════

**Input Summary**
- Exam: [Exam Name]
- Rank: [Rank Number]
- Category: [Category]
- Home State: [State]
- Target City: [City, if specified]

**Exam Scope**
- [Exam] is a [National/State] level exam
- Eligible: [What this exam covers]
- NOT eligible: [What this exam does NOT cover]

**Predictions** (from tool results ONLY)
- Safe Options (>80%): [List]
- Moderate Options (50-80%): [List]
- Ambitious Options (<50%): [List]

**Data Source**: All predictions based on historical cutoff data from counselling records.

═══════════════════════════════════════════════════════════════════════════════

Remember: Students trust you with life decisions.
When in doubt, ASK. Never guess. Never assume. Respect exam boundaries.`

/**
 * Process chat with Agentic RAG
 * @param {Array} history - Array of {role, content} messages
 * @param {Object} context - Optional user context (rank, category, etc.)
 * @returns {Object} - { reply, cards, followUp }
 */
export const getChatCompletion = async (history, context = {}) => {
  // Fallback if OpenAI is not configured
  if (!openai) {
    logger.info("OpenAI not configured - using static fallback")
    return {
      reply: "👋 Hi! I'm Zenith AI Mentor. I can help you with:\n\n• Finding colleges based on your rank\n• Comparing different institutions\n• Understanding fee structures\n• Checking your eligibility\n\nTo get started, please tell me:\n1. Your exam rank\n2. Which exam (JEE Main/EAMCET/etc.)\n3. Your category (General/OBC/SC/ST)",
      cards: [],
      followUp: "What's your exam rank?"
    }
  }

  try {
    // Build context message if available
    let contextMessage = ""
    if (context.rank || context.category || context.homeState || context.branches) {
      contextMessage = "\n\n[User Context: "
      if (context.rank) contextMessage += `Rank: ${context.rank}, `
      if (context.category) contextMessage += `Category: ${context.category}, `
      if (context.homeState) contextMessage += `State: ${context.homeState}, `
      if (context.branches?.length) contextMessage += `Interested in: ${context.branches.join(', ')}`
      contextMessage += "]"
    }

    // Prepare messages array with system prompt
    const messages = [
      { role: "system", content: SYSTEM_PROMPT + contextMessage },
      ...history
    ]

    logger.info(`AI Mentor: Processing ${history.length} messages`)

    // First LLM call - let it decide to respond or use tools
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      tools: tools,
      tool_choice: "auto",
      temperature: 0.4, // Balanced between creativity and accuracy
      max_tokens: 800
    })

    const responseMessage = response.choices[0].message

    // Check if the AI wants to use tools
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      logger.info(`AI Mentor: Calling ${responseMessage.tool_calls.length} tool(s)`)

      // Add assistant's tool call intent to messages
      messages.push(responseMessage)

      // Execute each tool call
      for (const toolCall of responseMessage.tool_calls) {
        const functionName = toolCall.function.name
        const args = JSON.parse(toolCall.function.arguments)

        logger.info(`AI Mentor: Executing tool "${functionName}" with args:`, args)

        // ============================================
        // PRE-VALIDATION GATE: Enforce exam requirement
        // This catches cases where LLM tries to bypass rules
        // ============================================
        const predictionTools = ['predict_admission', 'search_colleges_by_rank']
        if (predictionTools.includes(functionName)) {
          if (!args.exam) {
            logger.warn(`BLOCKED: ${functionName} called without exam parameter`)
            messages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              name: functionName,
              content: JSON.stringify({
                error: true,
                blocked: true,
                message: "EXAM PARAMETER IS REQUIRED. A rank has no meaning without knowing which exam it belongs to.",
                requiredAction: "You MUST ask the user which exam their rank belongs to before making predictions.",
                validExams: ["JEE Main", "JEE Advanced", "TS EAMCET", "AP EAMCET", "BITSAT", "NEET", "KCET", "MHT CET", "WBJEE"],
                hint: "Ask: 'Which exam does this rank belong to? (JEE Main, JEE Advanced, TS EAMCET, AP EAMCET, BITSAT, etc.)'"
              })
            })
            continue
          }
        }

        // Execute the tool
        const toolFunction = toolsImplementation[functionName]
        if (!toolFunction) {
          logger.error(`Tool not found: ${functionName}`)
          continue
        }

        const toolResult = await toolFunction(args)

        // Add tool result to messages
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: functionName,
          content: toolResult
        })
      }

      // Second LLM call - generate response with tool results
      const finalResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.4,
        max_tokens: 800
      })

      const reply = finalResponse.choices[0].message.content

      // Parse tool results to generate cards
      const cards = parseToolResultsToCards(responseMessage.tool_calls, messages)

      return {
        reply,
        cards,
        followUp: generateFollowUp(reply)
      }
    }

    // No tool calls - direct response
    return {
      reply: responseMessage.content,
      cards: [],
      followUp: generateFollowUp(responseMessage.content)
    }

  } catch (error) {
    logger.error("AI Mentor Error:", error.message)
    logger.error("AI Mentor Full Error:", error)

    // Check for specific OpenAI errors
    if (error.code === 'invalid_api_key') {
      logger.error("Invalid OpenAI API Key!")
    }
    if (error.status === 401) {
      logger.error("OpenAI Authentication failed - check API key")
    }
    if (error.status === 429) {
      logger.error("OpenAI Rate limit exceeded")
    }

    // Graceful error handling with more info in dev
    const isDev = process.env.NODE_ENV === 'development'
    return {
      reply: isDev
        ? `Error: ${error.message}. Please check the backend logs.`
        : "I'm having a bit of trouble right now. Could you please rephrase your question? Or try asking about:\n• Your college options based on rank\n• Specific college information\n• Fee comparisons",
      cards: [],
      followUp: "What would you like to know?"
    }
  }
}

/**
 * Parse tool results into displayable cards
 * Converts raw tool JSON responses into frontend-friendly card objects
 */
const parseToolResultsToCards = (toolCalls, messages) => {
  const cards = []

  try {
    for (const toolCall of toolCalls) {
      const toolResultMessage = messages.find(
        m => m.role === "tool" && m.tool_call_id === toolCall.id
      )

      if (!toolResultMessage) continue

      const result = JSON.parse(toolResultMessage.content)

      // Skip error results but allow results without 'found' property
      if (result.error) continue

      // Generate cards based on tool type
      switch (toolCall.function.name) {
        // NEW: Primary prediction tool
        case "predict_admission":
          if (result.results) {
            // Add input summary card
            if (result.inputSummary) {
              cards.push({
                type: "prediction_summary",
                exam: result.inputSummary.exam,
                rank: result.inputSummary.rank,
                category: result.inputSummary.category,
                homeState: result.inputSummary.homeState,
                totalFound: result.totalFound
              })
            }

            // Safe options (>80% probability)
            if (result.results.safe && result.results.safe.length > 0) {
              result.results.safe.forEach(college => {
                cards.push({
                  type: "prediction",
                  chanceCategory: "safe",
                  collegeName: college.collegeName,
                  branch: college.branch,
                  cutoffRank: college.cutoffRank,
                  yourRank: college.yourRank,
                  margin: college.margin,
                  probability: college.probability,
                  chanceLabel: college.chanceLabel,
                  reason: college.reason,
                  location: college.location,
                  collegeType: college.collegeType,
                  year: college.year
                })
              })
            }

            // Moderate options (50-80% probability)
            if (result.results.moderate && result.results.moderate.length > 0) {
              result.results.moderate.forEach(college => {
                cards.push({
                  type: "prediction",
                  chanceCategory: "moderate",
                  collegeName: college.collegeName,
                  branch: college.branch,
                  cutoffRank: college.cutoffRank,
                  yourRank: college.yourRank,
                  margin: college.margin,
                  probability: college.probability,
                  chanceLabel: college.chanceLabel,
                  reason: college.reason,
                  location: college.location,
                  collegeType: college.collegeType,
                  year: college.year
                })
              })
            }

            // Ambitious options (<50% probability)
            if (result.results.ambitious && result.results.ambitious.length > 0) {
              result.results.ambitious.forEach(college => {
                cards.push({
                  type: "prediction",
                  chanceCategory: "ambitious",
                  collegeName: college.collegeName,
                  branch: college.branch,
                  cutoffRank: college.cutoffRank,
                  yourRank: college.yourRank,
                  margin: college.margin,
                  probability: college.probability,
                  chanceLabel: college.chanceLabel,
                  reason: college.reason,
                  location: college.location,
                  collegeType: college.collegeType,
                  year: college.year
                })
              })
            }
          }
          break

        // NEW: Eligibility check tool
        case "check_college_eligibility":
          cards.push({
            type: "eligibility_check",
            collegeName: result.collegeName,
            examProvided: result.examProvided,
            eligible: result.eligible,
            requiredExam: result.requiredExam || null,
            message: result.message,
            suggestion: result.suggestion || null
          })
          break

        case "search_colleges_by_rank":
          if (result.colleges) {
            result.colleges.forEach(college => {
              cards.push({
                type: "eligibility",
                collegeName: college.collegeName,
                branch: college.branch,
                cutoffRank: college.cutoffRank,
                location: college.location,
                probability: college.admissionChance,
                margin: college.marginFromCutoff
              })
            })
          }
          break

        case "get_college_details":
          if (result.college) {
            cards.push({
              type: "college",
              collegeName: result.college.name,
              location: result.college.location,
              nirfRank: result.college.nirfRank,
              fees: result.college.fees,
              branches: result.college.branches
            })
          }
          break

        case "compare_colleges":
          if (result.comparison) {
            result.comparison.forEach(college => {
              cards.push({
                type: "comparison",
                collegeName: college.name,
                location: college.location,
                fees: college.generalFees,
                nirfRank: college.nirfRank
              })
            })
          }
          break

        case "get_cutoff_data":
          if (result.cutoffs) {
            result.cutoffs.forEach(cutoff => {
              cards.push({
                type: "cutoff",
                collegeName: result.collegeName,
                branch: cutoff.branch,
                closingRank: cutoff.closingRank,
                category: cutoff.category,
                year: cutoff.year
              })
            })
          }
          break

        case "get_affordable_colleges":
          if (result.colleges) {
            result.colleges.forEach(college => {
              cards.push({
                type: "fees",
                collegeName: college.name,
                location: college.location,
                generalFee: college.fees,
                nirfRank: college.nirfRank
              })
            })
          }
          break
      }
    }
  } catch (error) {
    logger.error("Error parsing tool results to cards:", error)
  }

  return cards
}

/**
 * Generate contextual follow-up suggestion
 */
const generateFollowUp = (reply) => {
  const text = reply.toLowerCase()

  if (text.includes("rank") && text.includes("category")) {
    return "Share your rank and category to get personalized recommendations!"
  }
  if (text.includes("college") && text.includes("found")) {
    return "Want to compare any of these colleges?"
  }
  if (text.includes("fees") || text.includes("fee")) {
    return "Need help finding affordable options?"
  }
  if (text.includes("cutoff")) {
    return "Want to check your eligibility for these colleges?"
  }

  return "What else would you like to know?"
}

/**
 * Legacy fallback function for backward compatibility
 */
export const runLLMFallback = async ({ message, context = {} }) => {
  // Convert single message to history format
  const history = [{ role: "user", content: message }]
  return getChatCompletion(history, context)
}

export default {
  getChatCompletion,
  runLLMFallback
}
