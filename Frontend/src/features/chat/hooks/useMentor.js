import { useState, useCallback } from "react"
import { sendChatMessage } from "../../../services/chat.service"
import { useUserContext } from "../../../hooks/useUserContext"

export const useMentor = () => {
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const { context: userContext } = useUserContext()

  const sendMessage = useCallback(
    async (userMessage) => {
      if (!userMessage.trim()) return

      // Add user message
      const newUserMessage = {
        id: Date.now(),
        role: "user",
        text: userMessage,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newUserMessage])

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

        // Call backend AI service
        const response = await sendChatMessage(userMessage, context)

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

        setMessages((prev) => [...prev, botMessage])
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

        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsTyping(false)
      }
    },
    [userContext]
  )

  return {
    messages,
    isTyping,
    sendMessage,
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
  const isHelpful = aiText.includes("here are") || aiText.includes("based on")
  const isEmpathetic = aiText.includes("understand") || aiText.includes("help you")
  const isPositive = aiText.includes("great") || aiText.includes("excellent") || aiText.includes("eligible")

  // Sentiment priority
  if (userConfused) return "empathetic"
  if (userHappy || isPositive) return "happy"
  if (isHelpful) return "helpful"
  if (isEmpathetic) return "empathetic"

  return "calm"
}
