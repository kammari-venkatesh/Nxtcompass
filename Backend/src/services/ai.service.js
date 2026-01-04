import College from "../models/College.model.js"
import Cutoff from "../models/Cutoff.model.js"
import logger from "../utils/logger.js"
import { runLLMFallback } from "./llm.service.js"

/**
 * AI Counselor Service
 *
 * ARCHITECTURE: HYBRID RULE-BASED + LLM FALLBACK
 *
 * PHILOSOPHY:
 * - Rule-based first (deterministic, safe, accurate)
 * - LLM only when rules are insufficient (vague questions, guidance)
 * - LLM NEVER invents data or touches MongoDB
 * - Context-aware AI counselor, not a toy
 *
 * PRINCIPLES:
 * - Deterministic for data queries (cutoffs, fees, comparisons)
 * - Conversational for guidance (career advice, confusion)
 * - Explainable
 * - Uses your data only
 */

/**
 * Extract college names from user message using fuzzy matching
 */
const extractCollegesFromMessage = async (message) => {
  const colleges = await College.find({}, "name acronym").lean()
  const text = message.toLowerCase()

  return colleges.filter((c) => {
    const nameMatch = text.includes(c.name.toLowerCase())
    const acronymMatch = c.acronym && text.includes(c.acronym.toLowerCase())
    return nameMatch || acronymMatch
  })
}

/**
 * Detect user intent from message with weighted scoring
 */
const detectIntent = (message) => {
  const text = message.toLowerCase()

  const scores = {
    FEES: 0,
    CUTOFF: 0,
    COMPARE: 0,
    ELIGIBILITY: 0,
    GENERAL: 0,
  }

  // Weighted scoring for better accuracy
  if (text.match(/fee|fees|cost|budget|affordable|cheap|expensive/)) scores.FEES += 2
  if (text.match(/cutoff|rank|chance|probability|score|percentile/)) scores.CUTOFF += 2
  if (text.match(/compare|vs|versus|better than|difference between/)) scores.COMPARE += 3
  if (text.match(/eligible|get into|can i get|admission|qualify/)) scores.ELIGIBILITY += 2

  // Find highest scoring intent
  const topIntent = Object.entries(scores).sort(
    (a, b) => b[1] - a[1]
  )[0][0]

  return scores[topIntent] === 0 ? "GENERAL" : topIntent
}

/**
 * Decide if message needs LLM fallback
 *
 * LLM is used for:
 * - Vague, conversational, or opinionated questions
 * - Career guidance and confusion
 * - Questions requiring empathy or explanation
 *
 * Rule-based is used for:
 * - Specific data queries (fees, cutoffs, comparisons)
 * - Questions with clear college names
 * - Eligibility checks with rank/category
 */
const needsLLMFallback = (intent, message) => {
  const text = message.toLowerCase()

  // Indicators that LLM should handle
  const llmIndicators = [
    "confused",
    "don't know",
    "should i",
    "what should i do",
    "help me decide",
    "worried",
    "scared",
    "overwhelmed",
    "advice",
    "suggest",
    "recommend",
    "which is better for me",
    "my situation",
  ]

  // Check for LLM indicators
  const hasLLMIndicator = llmIndicators.some((indicator) =>
    text.includes(indicator)
  )

  // Long messages (>80 chars) are often conversational
  const isLongMessage = message.length > 80

  // GENERAL intent means rules couldn't confidently classify
  const isGeneralIntent = intent === "GENERAL"

  // Use LLM if any condition is true
  if (hasLLMIndicator || (isGeneralIntent && isLongMessage)) {
    return true
  }

  return false
}

/**
 * Run AI Counselor
 * @param {Object} params - { message, context }
 * @returns {Object} - { reply, cards }
 */
export const runAICounselor = async ({ message, context = {} }) => {
  try {
    const intent = detectIntent(message)
    logger.info(`AI Counselor - Intent detected: ${intent}`)

    // DECISION POINT: Rule-based or LLM fallback?
    if (needsLLMFallback(intent, message)) {
      logger.info("AI Counselor - Using LLM fallback for conversational query")

      // Get college names to provide context to LLM
      const colleges = await College.find({}, "name").lean()

      return await runLLMFallback({
        message,
        context,
        allowedColleges: colleges.map((c) => c.name),
      })
    }

    // Continue with rule-based logic for data queries
    logger.info("AI Counselor - Using rule-based logic for data query")

    switch (intent) {
      case "FEES": {
        // Try to extract specific college from message
        const matchedColleges = await extractCollegesFromMessage(message)

        let colleges
        let reply

        if (matchedColleges.length > 0) {
          // User asked about specific college(s)
          const collegeIds = matchedColleges.map(c => c._id)
          colleges = await College.find({ _id: { $in: collegeIds } }).lean()
          reply = `Here's the fee structure for ${colleges.map(c => c.name).join(', ')}:`
        } else {
          // General fees query - show affordable options
          colleges = await College.find()
            .sort({ "fees.general": 1 })
            .limit(5)
            .lean()
          reply = "Based on your query about fees, here are some affordable options:"
        }

        const cards = colleges.map(c => ({
          type: "fees",
          collegeName: c.name,
          generalFee: c.fees?.general || "N/A",
          obcFee: c.fees?.obc || "N/A",
          scFee: c.fees?.sc || "N/A",
          location: `${c.city}, ${c.state}`,
        }))

        return {
          reply,
          cards,
          followUp: "Want to compare fees across categories?",
        }
      }

      case "CUTOFF": {
        // Try to extract specific college from message
        const matchedColleges = await extractCollegesFromMessage(message)
        const { rank, category, branch } = context

        let query = {}
        if (category) query.category = category
        if (branch) query.branch = branch

        // If specific college mentioned, filter by it
        if (matchedColleges.length > 0) {
          query.college = { $in: matchedColleges.map(c => c._id) }
        }

        const cutoffs = await Cutoff.find(query)
          .populate("college", "name acronym city state")
          .sort({ closingRank: 1 })
          .limit(10)
          .lean()

        let reply = "Based on cutoff data, here are colleges matching your criteria:"
        if (rank) {
          reply = `For rank ${rank}, here are colleges within your reach:`
        }
        if (matchedColleges.length > 0) {
          reply = `Here are the cutoff details for ${matchedColleges.map(c => c.name).join(', ')}:`
        }

        const cards = cutoffs.map(c => ({
          type: "cutoff",
          collegeName: c.college?.name || "Unknown",
          branch: c.branch,
          closingRank: c.closingRank,
          openingRank: c.openingRank,
          category: c.category,
          year: c.year,
        }))

        return {
          reply,
          cards,
          followUp: rank ? "Want detailed admission probability analysis?" : "Want to check your chances with your rank?",
        }
      }

      case "COMPARE": {
        // Extract colleges from message or use context
        const matchedColleges = await extractCollegesFromMessage(message)

        if (matchedColleges.length < 2) {
          return {
            reply: "Please mention at least two colleges to compare (example: IIT Bombay vs BITS Pilani).",
            cards: [],
          }
        }

        // Get detailed college info
        const collegeIds = matchedColleges.map(c => c._id)
        const colleges = await College.find({ _id: { $in: collegeIds } }).lean()

        const reply = "Here's a quick comparison based on fees and key metrics:"
        const cards = colleges.map(c => ({
          type: "comparison",
          collegeName: c.name,
          fees: c.fees?.general || "N/A",
          location: `${c.city}, ${c.state}`,
          nirfRank: c.nireRank || "N/A",
          totalSeats: c.totalSeats || "N/A",
        }))

        return {
          reply,
          cards,
          followUp: "Want a cutoff-based comparison too?",
        }
      }

      case "ELIGIBILITY": {
        // Check eligibility based on rank and preferences
        const { rank, category, branch } = context

        if (!rank || !category) {
          return {
            reply: "Tell me your rank and category and I'll check eligibility accurately.",
            cards: [],
          }
        }

        const query = {
          category,
          closingRank: { $gte: rank },
        }
        if (branch) query.branch = branch

        const eligibleCutoffs = await Cutoff.find(query)
          .populate("college", "name acronym city state")
          .sort({ closingRank: 1 })
          .limit(10)
          .lean()

        const reply = `Based on your rank ${rank} (${category}), you are eligible for:`
        const cards = eligibleCutoffs.map(c => ({
          type: "eligibility",
          collegeName: c.college?.name || "Unknown",
          branch: c.branch,
          cutoffRank: c.closingRank,
          margin: c.closingRank - rank,
          probability: c.closingRank - rank > 5000 ? "High" : c.closingRank - rank > 2000 ? "Moderate" : "Low",
        }))

        return {
          reply,
          cards,
          followUp: "Want me to rank these by probability?",
        }
      }

      case "GENERAL":
      default: {
        // General guidance with helpful suggestions
        const hasContext = context?.rank && context?.category

        let reply = "I'm your AI college counselor! I can help you with:\n\n"
        reply += "• 💰 College fees and affordability\n"
        reply += "• 📊 Cutoff ranks and admission chances\n"
        reply += "• ⚖️ Comparing colleges side-by-side\n"
        reply += "• 🎯 Finding colleges based on your rank\n\n"

        if (hasContext) {
          reply += `I see you have rank ${context.rank} (${context.category}). Try asking:\n`
          reply += `• "Can I get into IIT Bombay?"\n`
          reply += `• "Compare IIT Delhi vs NIT Warangal"\n`
          reply += `• "Show me affordable colleges"`
        } else {
          reply += "Try asking:\n"
          reply += `• "Compare IIT Bombay vs BITS Pilani"\n`
          reply += `• "What's the cutoff for NIT Warangal?"\n`
          reply += `• "Show me low fee colleges"`
        }

        return {
          reply,
          cards: [],
        }
      }
    }
  } catch (error) {
    logger.error("AI Counselor error:", error.message)
    return {
      reply: "I encountered an error processing your request. Please try again.",
      cards: [],
    }
  }
}

export default {
  runAICounselor,
  detectIntent,
}
