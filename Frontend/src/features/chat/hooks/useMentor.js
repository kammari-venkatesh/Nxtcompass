import { useState, useCallback, useRef } from "react"
import { sendChatMessage } from "../../../services/chat.service"
import { useUserContext } from "../../../hooks/useUserContext"

/**
 * useMentor Hook - Manages Zenith AI Mentor conversation state
 *
 * Features:
 * - Maintains full conversation history for context-aware responses
 * - Sends history to backend for Agentic RAG processing
 * - Handles typing indicators and error states
 * - Detects sentiment for avatar mood
 */
export const useMentor = () => {
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const { context: userContext } = useUserContext()
  const messagesRef = useRef([])

  /**
   * Convert internal messages to API format
   * Internal: { id, role, text, ... }
   * API: { role, content }
   */
  const formatHistoryForAPI = useCallback((msgs) => {
    return msgs
      .filter(msg => msg.role === "user" || msg.role === "bot")
      .map(msg => ({
        role: msg.role === "bot" ? "assistant" : "user",
        content: msg.text
      }))
  }, [])

  const sendMessage = useCallback(
    async (userMessage) => {
      if (!userMessage.trim()) return

      // Add user message to state
      const newUserMessage = {
        id: Date.now(),
        role: "user",
        text: userMessage,
        timestamp: new Date(),
      }

      // Update messages state and ref
      setMessages((prev) => {
        const updatedMessages = [...prev, newUserMessage]
        messagesRef.current = updatedMessages
        return updatedMessages
      })

      // Start typing indicator
      setIsTyping(true)

      try {
        // Prepare context from UserContext
        const context = {
          rank: userContext?.rank,
          category: userContext?.category,
          homeState: userContext?.homeState,
          branches: userContext?.branches,
        }

        // Format full conversation history for API (including the new message)
        const allMessages = [...messagesRef.current]
        const history = formatHistoryForAPI(allMessages)

        // Call backend with full history for Agentic RAG
        const response = await sendChatMessage(null, context, history)

        // Detect sentiment from AI response for avatar mood
        const sentiment = detectSentiment(response.reply, userMessage)

        // Create bot message with backend response
        const botMessage = {
          id: Date.now() + 1,
          role: "bot",
          text: response.reply,
          cards: response.cards || [],
          followUp: response.followUp,
          timestamp: new Date(),
          sentiment: sentiment,
        }

        setMessages((prev) => {
          const updated = [...prev, botMessage]
          messagesRef.current = updated
          return updated
        })
      } catch (error) {
        console.error("AI Mentor Error:", error)

        // Error message
        const errorMessage = {
          id: Date.now() + 1,
          role: "bot",
          text: "I'm having trouble connecting right now. Please try again in a moment.",
          cards: [],
          timestamp: new Date(),
          sentiment: "empathetic",
        }

        setMessages((prev) => {
          const updated = [...prev, errorMessage]
          messagesRef.current = updated
          return updated
        })
      } finally {
        setIsTyping(false)
      }
    },
    [userContext, formatHistoryForAPI]
  )

  /**
   * Clear conversation history
   */
  const clearMessages = useCallback(() => {
    setMessages([])
    messagesRef.current = []
  }, [])

  return {
    messages,
    isTyping,
    sendMessage,
    clearMessages,
  }
}

/**
 * Detect sentiment from AI response and user message for avatar mood
 */
const detectSentiment = (aiReply, userMessage) => {
  const userText = userMessage.toLowerCase()
  const aiText = aiReply.toLowerCase()

  // User sentiment analysis
  const confusedKeywords = ["confused", "don't know", "unsure", "help", "lost", "worried", "scared"]
  const happyKeywords = ["excited", "happy", "great", "thanks", "thank you"]

  const userConfused = confusedKeywords.some((k) => userText.includes(k))
  const userHappy = happyKeywords.some((k) => userText.includes(k))

  // AI response type detection
  const isHelpful = aiText.includes("here are") || aiText.includes("based on") || aiText.includes("found")
  const isEmpathetic = aiText.includes("understand") || aiText.includes("help you")
  const isPositive = aiText.includes("great") || aiText.includes("excellent") || aiText.includes("eligible")
  const isAsking = aiText.includes("what's your rank") || aiText.includes("tell me") || aiText.includes("could you")

  // Sentiment priority
  if (userConfused) return "empathetic"
  if (userHappy || isPositive) return "happy"
  if (isAsking) return "curious"
  if (isHelpful) return "helpful"
  if (isEmpathetic) return "empathetic"

  return "calm"
}

export default useMentor
