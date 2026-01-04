import { useState, useCallback } from "react"

export const useChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm your AI Counselor. How can I help you with your career planning today?",
    },
  ])
  const [isTyping, setIsTyping] = useState(false)

  const sendUserMessage = useCallback((userMessage) => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "user",
        content: userMessage,
      },
    ])

    // Simulate AI response
    setIsTyping(true)
    setTimeout(() => {
      const botResponses = [
        "That's a great question! Let me help you explore that further.",
        "Based on your interests and scores, I'd recommend considering colleges that align with your career goals.",
        "Have you thought about internships? They can be valuable for gaining practical experience.",
        "Your profile looks promising! You have good chances at top institutions.",
        "Let's discuss your preferences more. What kind of environment do you prefer for studying?",
      ]
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "bot",
          content: randomResponse,
        },
      ])
      setIsTyping(false)
    }, 1500)
  }, [])

  return {
    messages,
    isTyping,
    sendUserMessage,
  }
}
