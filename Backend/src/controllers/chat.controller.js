import { getChatCompletion } from "../services/llm.service.js"
import { runAICounselor } from "../services/ai.service.js"
import logger from "../utils/logger.js"

/**
 * Chat Controller for Zenith AI Mentor
 *
 * Supports two modes:
 * 1. Agentic RAG (with history) - Full conversation context
 * 2. Legacy single message - Backward compatible
 */

/**
 * POST /api/chat
 *
 * Body format (Agentic RAG with history):
 * {
 *   history: [
 *     { role: 'user', content: 'Hello' },
 *     { role: 'assistant', content: 'Hi there!' },
 *     { role: 'user', content: 'I want CSE' }
 *   ],
 *   context: {
 *     rank?: Number,
 *     category?: String,
 *     homeState?: String,
 *     branches?: [String]
 *   }
 * }
 *
 * OR Legacy format (single message):
 * {
 *   message: String,
 *   context: { ... }
 * }
 */
export const chatWithAI = async (req, res, next) => {
  try {
    const { message, history, context } = req.body

    // Validate input - need either message or history
    if (!message && (!history || !Array.isArray(history) || history.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Either 'message' or 'history' array is required",
      })
    }

    let response

    // Check if using Agentic RAG mode (with history)
    if (history && Array.isArray(history) && history.length > 0) {
      logger.info(`Chat API: Agentic RAG mode with ${history.length} messages`)

      // Validate history format
      const validHistory = history.every(
        msg => msg.role && msg.content &&
        ['user', 'assistant', 'system'].includes(msg.role)
      )

      if (!validHistory) {
        return res.status(400).json({
          success: false,
          message: "Invalid history format. Each message must have 'role' and 'content'.",
        })
      }

      // Use Agentic RAG with full conversation history
      response = await getChatCompletion(history, context || {})
    } else {
      // Legacy mode - single message
      logger.info("Chat API: Legacy single message mode")

      // Try Agentic RAG first, fall back to rule-based if needed
      try {
        const singleMessageHistory = [{ role: "user", content: message }]
        response = await getChatCompletion(singleMessageHistory, context || {})
      } catch (error) {
        logger.warn("Agentic RAG failed, falling back to rule-based:", error.message)
        response = await runAICounselor({ message, context: context || {} })
      }
    }

    res.status(200).json({
      success: true,
      reply: response.reply,
      cards: response.cards || [],
      followUp: response.followUp || null,
    })
  } catch (error) {
    logger.error("Chat Controller Error:", error.message)
    next(error)
  }
}

/**
 * POST /api/chat/simple
 * Simple endpoint for quick queries without conversation history
 */
export const simpleChat = async (req, res, next) => {
  try {
    const { message, context } = req.body

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      })
    }

    // Use rule-based AI counselor for simple queries
    const response = await runAICounselor({
      message,
      context: context || {},
    })

    res.status(200).json({
      success: true,
      ...response,
    })
  } catch (error) {
    logger.error("Simple Chat Error:", error.message)
    next(error)
  }
}

export default {
  chatWithAI,
  simpleChat,
}
