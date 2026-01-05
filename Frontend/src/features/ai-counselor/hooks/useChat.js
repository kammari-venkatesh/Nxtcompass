import { useState, useCallback, useRef } from "react"
import { sendChatMessage } from "../../../services/chat.service"

export const useChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm Zenith AI Mentor. I can help you find colleges based on your rank, compare institutions, and guide your career decisions. What would you like to know?",
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesRef = useRef([])

  // Keep ref in sync with state
  messagesRef.current = messages

  const sendUserMessage = useCallback(async (userMessage) => {
    // Add user message
    const userMsg = {
      id: Date.now(),
      type: "user",
      content: userMessage,
    }

    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    try {
      // Format history for API (include all previous messages + new user message)
      const allMessages = [...messagesRef.current, userMsg]
      const history = allMessages.map(msg => ({
        role: msg.type === "bot" ? "assistant" : "user",
        content: msg.content
      }))

      // Call backend API with history
      const response = await sendChatMessage(null, {}, history)

      // Add bot response
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "bot",
          content: response.reply,
          cards: response.cards || [],
          followUp: response.followUp,
        },
      ])
    } catch (error) {
      console.error("AI Counselor Error:", error)

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "bot",
          content: "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }, [])

  return {
    messages,
    isTyping,
    sendUserMessage,
  }
}
