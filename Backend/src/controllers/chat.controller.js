import { getChatCompletion } from "../services/llm.service.js"
import claudeService from "../services/claude.service.js"
import groqService from "../services/groq.service.js"
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
    let actualModelUsed = 'rule-based' // Track which service actually responded

    // Determine which LLM service to use
    // Priority: Groq (FREE!) > Claude ($$) > GPT-4o ($$) > Rule-based
    const preferredModel = req.body.model || process.env.PREFERRED_MODEL || 'auto'
    
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

      // Model selection logic with FREE Groq priority
      try {
        if (preferredModel === 'groq' && groqService.isAvailable()) {
          logger.info("Using Groq (Llama 3.1 70B) - FREE!")
          response = await groqService.getGroqChatCompletion(history, context || {})
          actualModelUsed = 'groq-llama-3.3-70b'
        } else if (preferredModel === 'claude' && claudeService.isAvailable()) {
          logger.info("Using Claude 3.5 Sonnet for empathetic responses")
          response = await claudeService.getClaudeChatCompletion(history, context || {})
          actualModelUsed = 'claude-3.5-sonnet'
        } else if (preferredModel === 'openai' || preferredModel === 'gpt-4o') {
          logger.info("Using GPT-4o")
          response = await getChatCompletion(history, context || {})
          actualModelUsed = 'gpt-4o-mini'
        } else if (preferredModel === 'auto') {
          // Auto-select: Groq (FREE!) > Claude > GPT-4o
          if (groqService.isAvailable()) {
            logger.info("🎉 Auto-selected: Groq (FREE - Llama 3.1 70B)")
            response = await groqService.getGroqChatCompletion(history, context || {})
            actualModelUsed = 'groq-llama-3.3-70b'
          } else if (claudeService.isAvailable()) {
            logger.info("Auto-selected: Claude 3.5 Sonnet")
            response = await claudeService.getClaudeChatCompletion(history, context || {})
            actualModelUsed = 'claude-3.5-sonnet'
          } else {
            logger.info("Auto-selected: GPT-4o")
            response = await getChatCompletion(history, context || {})
            actualModelUsed = 'gpt-4o-mini'
          }
        } else {
          // Default fallback
          logger.info("Using GPT-4o (default)")
          response = await getChatCompletion(history, context || {})
          actualModelUsed = 'gpt-4o-mini'
        }
      } catch (llmError) {
        logger.error("LLM Error:", llmError.message)
        // Fall back to rule-based AI counselor
        logger.info("Falling back to rule-based AI counselor")
        const lastMessage = history[history.length - 1]
        response = await runAICounselor({ 
          message: lastMessage?.content || '', 
          context: context || {} 
        })
        actualModelUsed = 'rule-based'
      }
    } else {
      // Legacy mode - single message
      logger.info("Chat API: Legacy single message mode")

      // Try LLM services first, fall back to rule-based if needed
      try {
        const singleMessageHistory = [{ role: "user", content: message }]
        
        if (preferredModel === 'groq' && groqService.isAvailable()) {
          response = await groqService.getGroqChatCompletion(singleMessageHistory, context || {})
          actualModelUsed = 'groq-llama-3.3-70b'
        } else if (preferredModel === 'claude' && claudeService.isAvailable()) {
          response = await claudeService.getClaudeChatCompletion(singleMessageHistory, context || {})
          actualModelUsed = 'claude-3.5-sonnet'
        } else if (preferredModel === 'auto') {
          // Auto-select FREE option first
          if (groqService.isAvailable()) {
            response = await groqService.getGroqChatCompletion(singleMessageHistory, context || {})
            actualModelUsed = 'groq-llama-3.3-70b'
          } else if (claudeService.isAvailable()) {
            response = await claudeService.getClaudeChatCompletion(singleMessageHistory, context || {})
            actualModelUsed = 'claude-3.5-sonnet'
          } else {
            response = await getChatCompletion(singleMessageHistory, context || {})
            actualModelUsed = 'gpt-4o-mini'
          }
        } else {
          response = await getChatCompletion(singleMessageHistory, context || {})
          actualModelUsed = 'gpt-4o-mini'
        }
      } catch (error) {
        logger.warn("LLM failed, falling back to rule-based:", error.message)
        response = await runAICounselor({ message, context: context || {} })
        actualModelUsed = 'rule-based'
      }
    }

    res.status(200).json({
      success: true,
      reply: response.reply,
      cards: response.cards || [],
      followUp: response.followUp || null,
      actionCard: response.actionCard || null,
      emotionalAnalysis: response.emotionalAnalysis || null,
      model: actualModelUsed // Report the actual model that generated this response
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

/**
 * POST /api/chat/stream
 * Streaming endpoint for real-time AI responses
 * Uses Server-Sent Events (SSE) for progressive response delivery
 */
export const chatWithAIStream = async (req, res, next) => {
  try {
    const { history, context } = req.body

    // Validate input
    if (!history || !Array.isArray(history) || history.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Conversation history is required for streaming",
      })
    }

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()

    // Import streaming function
    const { getChatCompletionStream } = await import("../services/llm.service.js")

    // Send chunks as they arrive
    const onChunk = (text, isFinal = false) => {
      res.write(`data: ${JSON.stringify({ type: 'chunk', content: text, isFinal })}\n\n`)
    }

    // Send complete response with cards
    const onComplete = (result) => {
      res.write(`data: ${JSON.stringify({ 
        type: 'complete', 
        reply: result.reply,
        cards: result.cards,
        followUp: result.followUp 
      })}\n\n`)
      res.write('data: [DONE]\n\n')
      res.end()
    }

    // Start streaming
    await getChatCompletionStream(history, context || {}, onChunk, onComplete)

  } catch (error) {
    logger.error("Chat Stream Controller Error:", error.message)
    // Send error through SSE
    res.write(`data: ${JSON.stringify({ 
      type: 'error', 
      message: 'An error occurred while processing your request' 
    })}\n\n`)
    res.end()
  }
}

export default {
  chatWithAI,
  simpleChat,
  chatWithAIStream,
}
