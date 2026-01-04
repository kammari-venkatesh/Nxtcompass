import OpenAI from "openai"
import logger from "../utils/logger.js"

// Check if API key is configured
const hasValidApiKey = () => {
  const apiKey = process.env.OPENAI_API_KEY
  return apiKey && apiKey !== "sk-your-api-key-here" && apiKey.startsWith("sk-")
}

// Only initialize OpenAI if valid key exists
let openai = null
if (hasValidApiKey()) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
  logger.info("OpenAI LLM service initialized")
} else {
  logger.warn("OpenAI API key not configured - LLM fallback disabled")
}

/**
 * LLM Fallback Service
 *
 * CRITICAL RULES:
 * - LLM NEVER invents colleges, cutoffs, ranks, or fees
 * - LLM NEVER accesses MongoDB directly
 * - LLM only provides conceptual guidance, explanations, and clarifications
 * - Low temperature to minimize hallucination
 * - Strict system prompt constraints
 *
 * USE CASES:
 * ✅ "I'm confused about choosing between Engineering and Medical"
 * ✅ "What should I do after getting 45k rank?"
 * ✅ "Should I choose CSE or ECE?"
 *
 * NOT FOR:
 * ❌ "What's the cutoff for IIT Bombay?" (use rule-based)
 * ❌ "Compare NIT Warangal vs IIIT Hyderabad" (use rule-based)
 * ❌ "Show me fees" (use rule-based)
 */
export const runLLMFallback = async ({
  message,
  context = {},
  allowedColleges = [],
}) => {
  // If OpenAI is not configured, return helpful fallback
  if (!openai) {
    logger.info("LLM fallback requested but API key not configured - using static response")
    return {
      reply: "I'd love to help with that! To give you the most accurate information, please ask me about:\n\n• Specific colleges (\"Compare IIT Delhi vs NIT Trichy\")\n• College fees (\"What are the fees for NIT Warangal?\")\n• Cutoff ranks (\"Show me CSE cutoffs\")\n• Your eligibility (\"Can I get into BITS Pilani?\")\n\nI have access to real college data and can help you make informed decisions!",
      cards: [],
      followUp: "Try asking about specific colleges or cutoffs!"
    }
  }

  try {
    const systemPrompt = `You are Compass AI, a college counselor assistant specializing in Indian engineering admissions.

STRICT RULES YOU MUST FOLLOW:
1. DO NOT invent colleges, cutoffs, ranks, or fees
2. DO NOT make up numerical data or statistics
3. DO NOT guarantee admission to any college
4. ONLY provide conceptual guidance, explanations, and career advice
5. If asked about specific data (cutoffs, fees, ranks), tell the user to use the College Predictor or ask for specific colleges
6. Be empathetic, concise, and supportive
7. Ask clarifying questions when needed
8. Reference the user's context when available

User Context:
${context.rank ? `- JEE Rank: ${context.rank}` : "- Rank: Not provided"}
${context.category ? `- Category: ${context.category}` : "- Category: Not provided"}
${context.homeState ? `- Home State: ${context.homeState}` : "- Home State: Not provided"}
${context.branches && context.branches.length > 0 ? `- Interested Branches: ${context.branches.join(", ")}` : "- Branches: Not specified"}

Known Colleges in Database:
${allowedColleges.length > 0 ? allowedColleges.slice(0, 20).join(", ") + (allowedColleges.length > 20 ? "... and more" : "") : "No college data provided"}

RESPONSE STYLE:
- Be warm and encouraging
- Use bullet points for clarity
- Keep responses under 150 words
- End with actionable next steps or questions`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.3, // LOW temperature to minimize hallucination
      max_tokens: 300,
    })

    const reply = completion.choices[0].message.content

    logger.info("LLM Fallback used for message:", message.substring(0, 50))

    return {
      reply,
      cards: [], // LLM doesn't generate data cards
      followUp: "Want me to check specific colleges or cutoffs for you?",
    }
  } catch (error) {
    logger.error("LLM Fallback error:", error.message)

    // Graceful fallback if LLM fails
    return {
      reply: "I'd love to help with that! Could you be more specific? For example:\n\n• Ask about specific colleges (\"Compare IIT Delhi vs NIT Trichy\")\n• Check cutoffs (\"What's the cutoff for CSE?\")\n• Ask about fees (\"Show me affordable colleges\")\n\nI have access to real college data and can give you accurate information.",
      cards: [],
    }
  }
}

export default {
  runLLMFallback,
}
