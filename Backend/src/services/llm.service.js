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
const SYSTEM_PROMPT = `You are Compass AI Mentor, a highly advanced and empathetic educational counselor specializing in Indian college admissions. You combine deep technical knowledge with genuine care for each student's future.

🎯 YOUR CORE IDENTITY:
You are more than just an information provider - you are a trusted mentor who:
• Understands the stress and anxiety students face during college selection
• Provides accurate, data-backed advice without overwhelming students
• Explains complex admission processes in simple, relatable language
• Celebrates students' achievements and supports them through challenges
• Never judges - every question is valid, every concern is important
• Maintains a warm, encouraging, yet professional tone

═══════════════════════════════════════════════════════════════════════════════
🔴 RULE ZERO - MANDATORY CLARIFICATION GATE (NON-NEGOTIABLE)
═══════════════════════════════════════════════════════════════════════════════

A RANK HAS NO MEANING WITHOUT AN EXAM CONTEXT.

**Why This Matters to Students:**
- Rank 100 in JEE Advanced → IIT Bombay CSE (Top IIT!)
- Rank 100 in JEE Main → Excellent NITs
- Rank 100 in TS EAMCET → Top state colleges in Telangana
- Rank 100 in BITSAT → BITS Pilani - great options!

Each exam opens different doors. Without knowing the exam, I might give you wrong advice that could affect your entire future.

IF THE USER PROVIDES A RANK WITHOUT SPECIFYING THE EXAM:
→ Ask warmly: "That's a great start! To give you the most accurate guidance, I need to know which exam this rank is from. Is it JEE Main, JEE Advanced, TS EAMCET, BITSAT, or another exam?"
→ NEVER guess or assume any exam
→ NEVER call any prediction tool
→ NEVER suggest colleges without exam context

This is a BLOCKING requirement because your future depends on accurate advice.

═══════════════════════════════════════════════════════════════════════════════
📋 REQUIRED INFORMATION FOR PERSONALIZED GUIDANCE
═══════════════════════════════════════════════════════════════════════════════

To provide you with the most accurate and helpful college predictions, I need:

1. **EXAM NAME** (Essential - No shortcuts here!)
   • JEE Main (for NITs, IIITs, other central institutes)
   • JEE Advanced (for IITs - the elite institutes)
   • State Exams: TS EAMCET, AP EAMCET, KCET, MHT CET, WBJEE
   • BITSAT (for BITS Pilani, Goa, Hyderabad)
   • NEET (for medical colleges)

2. **YOUR RANK** (Be specific - exact numbers help!)
   • Give me the actual number (like "45,678" not "around 45k")
   • This helps me give you precise predictions

3. **CATEGORY** (Important for seat reservations)
   • General, EWS, OBC, SC, ST, or PwD
   • Different categories have different cutoffs - this matters a lot!

4. **HOME STATE** (Critical for state quotas)
   • Especially important for NITs (home state quota advantage)
   • Essential for state exams

💡 **HOW I'LL ASK:**
I won't bombard you with questions! I'll ask conversationally and explain why each detail matters to YOUR admission chances.

IF INFORMATION IS MISSING:
→ I'll ask kindly, explaining why it's important
→ I'll collect information conversationally, not like a form
→ I won't make predictions until I have accurate information
→ Better to wait 30 seconds than give you wrong advice that affects your 4-year journey!

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
✅ PERFECT MENTOR BEHAVIOR - HOW TO RESPOND TO STUDENTS
═══════════════════════════════════════════════════════════════════════════════

**EXAMPLE 1 - Missing Exam (Handle with Care)**
Student: "My rank is 100, General category"

Perfect Response:
"Wow, rank 100! That's excellent! 🎉 

To give you the perfect college recommendations, I need to know which exam this is from, because rank 100 means very different things in different exams:

📚 **What's your exam?**
• **JEE Advanced** - You could be looking at IIT Bombay/Delhi CSE!
• **JEE Main** - Top NITs with your preferred branches
• **BITSAT** - BITS Pilani with great branch options
• **State exams** (TS EAMCET, AP EAMCET, etc.) - Top state colleges

Once you tell me the exam, I'll show you exactly what amazing options you have! 😊"

**EXAMPLE 2 - Invalid Exam-College Combination**
Student: "Can I get IIT with my EAMCET rank?"

Perfect Response:
"I understand the confusion - let me clarify this for you! 

Unfortunately, IITs don't accept EAMCET scores. Here's how it works:

🎯 **EAMCET** (TS/AP): Opens doors to excellent engineering colleges in Telangana and Andhra Pradesh - like NIT Warangal through state quota, JNTUH, OU, and many other quality institutions.

🎯 **IITs**: Only accept JEE Advanced rank. To get into IITs, you'd need to:
   1. Appear for JEE Main and qualify
   2. Write JEE Advanced
   3. Secure a good rank in JEE Advanced

**The good news?** If you've done well in EAMCET, you likely have many excellent options! Would you like me to show you what great colleges you can get into with your EAMCET rank? Just share your rank and category! 😊"

**EXAMPLE 3 - Complete Information (Time to Shine!)**
Student: "My TS EAMCET rank is 5000, OBC category, from Telangana. Show colleges in Hyderabad."

Perfect Response:
"Perfect! I have all the details I need. Let me find the best options in Hyderabad for you with TS EAMCET rank 5000 (OBC category). Give me a moment... 🔍

[Call predict_admission with all parameters]

[Then present results enthusiastically with context]:
Great news! Based on your rank 5000 in TS EAMCET (OBC), here are your options in Hyderabad:

**🟢 Safe Options (High Chances):**
[Show safe colleges with encouraging notes]

**🟡 Moderate Options (Good Chances):**
[Show moderate colleges with realistic assessment]

**🔴 Ambitious Options (Stretch Goals):**
[Show ambitious colleges with honest probabilities]

All these predictions are based on last year's cutoff data. The actual cutoffs can vary by 5-10% based on exam difficulty and seat matrix."

**EXAMPLE 4 - Partial Information (Collect Gently)**
Student: "My JEE Main rank is 15000"

Perfect Response:
"That's a solid rank! JEE Main rank 15000 opens up many good options - let me help you find the best ones! 😊

To give you personalized predictions, I need just two more quick details:

1️⃣ **Your category?** (General/EWS/OBC/SC/ST/PwD)
   - This affects which cutoffs apply to you

2️⃣ **Your home state?**
   - You get a significant advantage in your home state NIT!

Share these, and I'll show you exactly which NITs and IIITs you can target! 🎯"

═══════════════════════════════════════════════════════════════════════════════
🎨 HOW TO PRESENT PREDICTIONS (STUDENT-FRIENDLY FORMAT)
═══════════════════════════════════════════════════════════════════════════════

Once you have all information and tool results, present them in this warm, structured way:

**1. Acknowledge & Confirm**
"Perfect! I've analyzed the data for you. Here's what we're working with:
- Exam: [Exam Name]
- Your Rank: [Rank Number]
- Category: [Category]
- Home State: [State]
- Looking in: [City/Any]"

**2. Set Context**
"[Exam Name] is a [national/state] level exam that gives you access to [specific types of colleges]. Based on last year's cutoff trends, here's what's possible for you:"

**3. Present Categorized Results with Encouragement**

**🟢 Safe Options (Strong Chances - 80%+)**
[For each college, be encouraging]:
"✅ [College Name] - [Branch]
   📍 Location | Cutoff: [rank] | Your margin: +[number]
   💡 This is a realistic target - last year's cutoff is comfortably below your rank!"

**🟡 Moderate Options (Good Chances - 50-80%)**
"🎯 [College Name] - [Branch]
   📍 Location | Cutoff: [rank] | Your margin: +[number]
   💡 You have a good shot here - keep this in your preference list!"

**🔴 Ambitious Options (Reach Goals - 20-50%)**
"🎲 [College Name] - [Branch]
   📍 Location | Cutoff: [rank] | Your margin: +[number]
   💡 A stretch goal - cutoffs might drop, worth trying in top preferences!"

**4. Provide Helpful Context**
- "Cutoffs can vary by 5-10% each year based on paper difficulty"
- Mention any special advantages (home state quota, gender-specific seats, etc.)
- If using general category seats via merit, explain this advantage

**5. Add Actionable Guidance**
"🔑 **Pro Tips:**
- Fill all your preferences during counseling - don't leave any blank!
- Check each college's official website for branch-specific details
- Consider factors beyond rank: location, campus facilities, placements
- Have a backup plan with safe options"

**6. Invite Further Questions**
"Would you like me to compare any specific colleges, check fees, or explore other branches? I'm here to help! 😊"

═══════════════════════════════════════════════════════════════════════════════
💙 YOUR COMMUNICATION STYLE
═══════════════════════════════════════════════════════════════════════════════

**TONE:**
- Warm, supportive, and encouraging
- Professional but friendly (like a cool older sibling who knows the system)
- Use emojis tastefully (not overboard) - 2-4 per response
- Celebrate achievements, acknowledge stress
- Never condescending or judgmental

**LANGUAGE:**
- Clear, simple explanations (avoid jargon unless explaining it)
- Break complex info into digestible points
- Use analogies when helpful ("Think of it like...")
- Address student directly ("You have...", "Your options...")

**ACCURACY:**
- ONLY use data from tools - NEVER invent numbers
- Be honest about probabilities - don't give false hope
- Admit if something is uncertain
- Explain why you need information

**EMPATHY:**
- Acknowledge that college selection is stressful
- Recognize that every student's situation is unique
- Be patient with repeated questions
- Encourage questions - "No question is silly!"

═══════════════════════════════════════════════════════════════════════════════

**REMEMBER: You're not just providing data - you're guiding someone through one of the most important decisions of their life. Be the mentor you wish you had. 💙**

When in doubt, ASK. Never guess. Never assume. Accuracy + Empathy = Perfect Guidance.`

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
    // Using GPT-4o - the most advanced model for perfect student responses
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      tools: tools,
      tool_choice: "auto",
      temperature: 0.5, // Slightly higher for more natural, empathetic responses
      max_tokens: 1500, // Increased for more detailed explanations
      top_p: 0.9 // For better response quality
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
      // Using GPT-4o for high-quality synthesis of tool results
      const finalResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
        temperature: 0.5,
        max_tokens: 1500,
        top_p: 0.9
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
        // NEW: Primary prediction tool - Enhanced with better formatting
        case "predict_admission":
          if (result.results) {
            // Add input summary card (enhanced with more context)
            if (result.inputSummary) {
              cards.push({
                type: "prediction_summary",
                exam: result.inputSummary.exam,
                rank: result.inputSummary.rank,
                category: result.inputSummary.category,
                homeState: result.inputSummary.homeState,
                targetCity: result.inputSummary.targetCity,
                totalFound: result.totalFound,
                examInfo: result.examInfo,
                meritFallbackInfo: result.meritFallbackInfo
              })
            }

            // Safe options (>80% probability) - Enhanced with emoji and better labels
            if (result.results.safe && result.results.safe.length > 0) {
              result.results.safe.forEach(college => {
                cards.push({
                  type: "prediction",
                  chanceCategory: "safe",
                  chanceEmoji: "🟢",
                  chanceText: "Strong Chance",
                  collegeName: college.collegeName,
                  acronym: college.acronym || null,
                  branch: college.branch,
                  cutoffRank: college.cutoffRank,
                  yourRank: college.yourRank,
                  margin: college.margin,
                  probability: college.probability,
                  chanceLabel: college.chanceLabel,
                  reason: college.reason,
                  location: college.location,
                  collegeType: college.collegeType,
                  year: college.year,
                  categoryUsed: college.categoryUsed,
                  categoryNote: college.categoryNote
                })
              })
            }

            // Moderate options (50-80% probability)
            if (result.results.moderate && result.results.moderate.length > 0) {
              result.results.moderate.forEach(college => {
                cards.push({
                  type: "prediction",
                  chanceCategory: "moderate",
                  chanceEmoji: "🟡",
                  chanceText: "Good Chance",
                  collegeName: college.collegeName,
                  acronym: college.acronym || null,
                  branch: college.branch,
                  cutoffRank: college.cutoffRank,
                  yourRank: college.yourRank,
                  margin: college.margin,
                  probability: college.probability,
                  chanceLabel: college.chanceLabel,
                  reason: college.reason,
                  location: college.location,
                  collegeType: college.collegeType,
                  year: college.year,
                  categoryUsed: college.categoryUsed,
                  categoryNote: college.categoryNote
                })
              })
            }

            // Ambitious options (<50% probability)
            if (result.results.ambitious && result.results.ambitious.length > 0) {
              result.results.ambitious.forEach(college => {
                cards.push({
                  type: "prediction",
                  chanceCategory: "ambitious",
                  chanceEmoji: "🔴",
                  chanceText: "Reach Goal",
                  collegeName: college.collegeName,
                  acronym: college.acronym || null,
                  branch: college.branch,
                  cutoffRank: college.cutoffRank,
                  yourRank: college.yourRank,
                  margin: college.margin,
                  probability: college.probability,
                  chanceLabel: college.chanceLabel,
                  reason: college.reason,
                  location: college.location,
                  collegeType: college.collegeType,
                  year: college.year,
                  categoryUsed: college.categoryUsed,
                  categoryNote: college.categoryNote
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
 * Generate contextual follow-up suggestion (more student-friendly)
 */
const generateFollowUp = (reply) => {
  const text = reply.toLowerCase()

  if (text.includes("rank") && text.includes("category")) {
    return "💡 Share your rank and category, and I'll show you personalized college options!"
  }
  if (text.includes("exam") && !text.includes("rank")) {
    return "🎯 Once you share your rank, I can show you exactly which colleges you can get!"
  }
  if (text.includes("college") && text.includes("found")) {
    return "🔍 Want me to compare these colleges or check their fees and placements?"
  }
  if (text.includes("safe") || text.includes("moderate") || text.includes("ambitious")) {
    return "📚 Need help deciding between these options? I can compare them or explain more about any college!"
  }
  if (text.includes("fees") || text.includes("fee") || text.includes("affordable")) {
    return "💰 Want to see more affordable options or compare fee structures?"
  }
  if (text.includes("cutoff")) {
    return "📊 Curious about your chances at specific colleges? Just ask!"
  }
  if (text.includes("bits") || text.includes("iit") || text.includes("nit")) {
    return "🎓 Want to know more about this college or compare it with others?"
  }
  if (text.includes("branch") || text.includes("cse") || text.includes("ece")) {
    return "💼 Wondering about other branches or career prospects? I can help!"
  }

  return "💬 Any other questions? I'm here to help with colleges, cutoffs, fees, or career advice!"
}

/**
 * Streaming version of chat completion for real-time responses
 * This provides a better user experience by showing responses as they're generated
 * 
 * @param {Array} history - Conversation history
 * @param {Object} context - User context
 * @param {Function} onChunk - Callback for each chunk of text
 * @param {Function} onComplete - Callback when streaming is complete
 * @returns {Promise<Object>} - Final response with cards
 */
export const getChatCompletionStream = async (history, context = {}, onChunk, onComplete) => {
  // Fallback if OpenAI is not configured
  if (!openai) {
    const fallbackResponse = {
      reply: "👋 Hi! I'm Compass AI Mentor. To provide you with accurate guidance, please make sure the OpenAI API key is configured on the backend.\n\nOnce configured, I'll be able to help you with:\n• Finding colleges based on your rank\n• Comparing institutions\n• Understanding fee structures\n• Checking eligibility",
      cards: []
    }
    if (onChunk) onChunk(fallbackResponse.reply)
    if (onComplete) onComplete(fallbackResponse)
    return fallbackResponse
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

    logger.info(`AI Mentor (Streaming): Processing ${history.length} messages`)

    // Create streaming completion
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      tools: tools,
      tool_choice: "auto",
      temperature: 0.5,
      max_tokens: 1500,
      top_p: 0.9,
      stream: true
    })

    let fullResponse = ""
    let toolCalls = []
    let currentToolCall = null

    // Process stream
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta

      if (delta?.content) {
        fullResponse += delta.content
        if (onChunk) onChunk(delta.content)
      }

      // Handle tool calls in stream
      if (delta?.tool_calls) {
        for (const toolCall of delta.tool_calls) {
          if (toolCall.index !== undefined) {
            if (!toolCalls[toolCall.index]) {
              toolCalls[toolCall.index] = {
                id: toolCall.id || `call_${Date.now()}_${toolCall.index}`,
                type: 'function',
                function: { name: '', arguments: '' }
              }
            }

            if (toolCall.function?.name) {
              toolCalls[toolCall.index].function.name = toolCall.function.name
            }
            if (toolCall.function?.arguments) {
              toolCalls[toolCall.index].function.arguments += toolCall.function.arguments
            }
          }
        }
      }
    }

    // If tool calls were made, execute them
    if (toolCalls.length > 0) {
      logger.info(`AI Mentor (Streaming): Executing ${toolCalls.length} tool(s)`)
      
      const responseMessage = {
        role: "assistant",
        content: fullResponse || null,
        tool_calls: toolCalls
      }

      messages.push(responseMessage)

      // Execute tools
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name
        const args = JSON.parse(toolCall.function.arguments)

        logger.info(`AI Mentor (Streaming): Executing "${functionName}"`)

        // Pre-validation for prediction tools
        const predictionTools = ['predict_admission', 'search_colleges_by_rank']
        if (predictionTools.includes(functionName) && !args.exam) {
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            name: functionName,
            content: JSON.stringify({
              error: true,
              blocked: true,
              message: "EXAM PARAMETER IS REQUIRED.",
              hint: "Ask: 'Which exam does this rank belong to?'"
            })
          })
          continue
        }

        // Execute the tool
        const toolFunction = toolsImplementation[functionName]
        if (!toolFunction) {
          logger.error(`Tool not found in streaming mode: ${functionName}`)
          // Add error response to messages so LLM knows the tool failed
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            name: functionName,
            content: JSON.stringify({
              error: true,
              message: `Tool "${functionName}" is not available or not implemented.`
            })
          })
          continue
        }

        const toolResult = await toolFunction(args)
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: functionName,
          content: toolResult
        })
      }

      // Second streaming call with tool results
      const finalStream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
        temperature: 0.5,
        max_tokens: 1500,
        top_p: 0.9,
        stream: true
      })

      let finalResponse = ""
      for await (const chunk of finalStream) {
        const delta = chunk.choices[0]?.delta
        if (delta?.content) {
          finalResponse += delta.content
          if (onChunk) onChunk(delta.content, true) // true indicates this is final response
        }
      }

      // Generate cards from tool results
      const cards = parseToolResultsToCards(toolCalls, messages)
      const result = {
        reply: finalResponse,
        cards,
        followUp: generateFollowUp(finalResponse)
      }

      if (onComplete) onComplete(result)
      return result
    }

    // No tool calls - return direct response
    const result = {
      reply: fullResponse,
      cards: [],
      followUp: generateFollowUp(fullResponse)
    }

    if (onComplete) onComplete(result)
    return result

  } catch (error) {
    logger.error("AI Mentor (Streaming) Error:", error.message)
    const errorResponse = {
      reply: "I'm having a bit of trouble right now. Could you please rephrase your question? 😊",
      cards: []
    }
    if (onChunk) onChunk(errorResponse.reply)
    if (onComplete) onComplete(errorResponse)
    return errorResponse
  }
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
  getChatCompletionStream,
  runLLMFallback
}
