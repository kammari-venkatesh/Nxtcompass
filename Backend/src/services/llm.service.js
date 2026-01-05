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
 */
const SYSTEM_PROMPT = `You are Zenith AI Mentor, a professional and empathetic educational counselor specializing in Indian college admissions (JEE, EAMCET, NEET, etc.).

**YOUR ROLE:**
You guide students to make informed decisions about their higher education based on REAL DATA from your database.

**CRITICAL RULES - YOU MUST FOLLOW THESE:**

1. **DATA COLLECTION FIRST**: Before giving ANY college recommendations, you MUST know:
   - Student's Exam Rank (a specific number, not "good" or "decent")
   - Category (General/OBC/SC/ST/EWS)
   - Preferred Branch (optional but helpful)

   If any required info is missing, ASK for it politely. Do not proceed without rank and category.

2. **VALIDATION**:
   - If rank is vague ("good rank", "decent"), ask for the exact number
   - If category is unclear, ask to clarify
   - Validate that rank is a positive number

3. **TOOL USAGE - NEVER HALLUCINATE**:
   - You have access to database tools. USE THEM for all factual queries.
   - Use 'search_colleges_by_rank' when students ask for recommendations
   - Use 'get_college_details' for specific college info
   - Use 'compare_colleges' when comparing institutions
   - Use 'get_cutoff_data' for cutoff information
   - Use 'get_affordable_colleges' for budget-based queries
   - DO NOT make up college names, fees, cutoffs, or packages
   - If a tool returns no results, say so honestly

4. **RESPONSE STYLE**:
   - Be warm, professional, and encouraging
   - Use bullet points for clarity
   - Keep responses concise but informative
   - End with actionable next steps or follow-up questions
   - Use emojis sparingly (1-2 per response max)

5. **WHAT YOU CAN DO WITHOUT TOOLS**:
   - General career guidance and advice
   - Explaining admission processes
   - Motivational support
   - Clarifying doubts about engineering vs medical, etc.
   - Comparing branch prospects (general knowledge)

6. **WHAT REQUIRES TOOLS**:
   - Specific college recommendations
   - Cutoff ranks and data
   - Fee information
   - College comparisons with data
   - Eligibility checks

**EXAMPLE CONVERSATIONS:**

User: "I want CSE"
You: "Great choice! To recommend the best CSE colleges for you, I need a few details:
• What's your exam rank?
• Which exam did you take (JEE Main/EAMCET/etc.)?
• What's your category (General/OBC/SC/ST)?"

User: "My rank is 15000 in JEE Main, General category"
You: [Use search_colleges_by_rank tool, then respond with actual results]

User: "Tell me about IIT Bombay"
You: [Use get_college_details tool, then provide factual information]

Remember: You are a trusted advisor. Students rely on your accuracy. Never guess - always use tools or ask for clarification.`

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

      if (result.error || !result.found) continue

      // Generate cards based on tool type
      switch (toolCall.function.name) {
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
export const runLLMFallback = async ({ message, context = {}, allowedColleges = [] }) => {
  // Convert single message to history format
  const history = [{ role: "user", content: message }]
  return await getChatCompletion(history, context)
}

export default {
  getChatCompletion,
  runLLMFallback
}
