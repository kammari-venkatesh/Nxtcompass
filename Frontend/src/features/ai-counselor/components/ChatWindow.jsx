import { useState, useRef, useEffect } from "react"
import { useChat } from "../hooks/useChat"
import ChatMessage from "./ChatMessage"
import "../zenith.css"

const EXAMPLE_PROMPTS = [
  "I have rank 5000 in General category. What colleges can I get?",
  "Compare NIT Trichy vs NIT Warangal for CSE",
  "What are the best colleges for Computer Science under rank 10000?",
  "Show me affordable NITs with good placements",
]

const ChatWindow = ({ onClose }) => {
  const { messages, isTyping, sendUserMessage } = useChat()
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [showExamples, setShowExamples] = useState(true)
  const messagesEndRef = useRef(null)

  const handleExampleClick = (prompt) => {
    sendUserMessage(prompt)
    setShowExamples(false)
  }

  const handleSend = () => {
    if (input.trim()) {
      sendUserMessage(input)
      setInput("")
      setShowExamples(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoiceInput = () => {
    setIsListening(!isListening)
    // Voice recognition would be implemented here
    // For now, just toggle the state for visual feedback
  }

  const handleSuggestion = () => {
    const suggestions = [
      "What are the best colleges for Computer Science?",
      "How do I choose between Engineering and Medical?",
      "What's the cutoff for NIT Trichy?",
      "I'm feeling confused about my career path",
    ]
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
    setInput(randomSuggestion)
  }

  // Calculate avatar mood based on AI state
  const getAvatarMood = () => {
    if (isTyping) return "thinking"
    if (isListening) return "empathetic"

    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === "bot") {
        const text = lastMessage.text.toLowerCase()
        if (text.includes("great") || text.includes("excellent") || text.includes("amazing")) {
          return "happy"
        }
        if (text.includes("understand") || text.includes("normal") || text.includes("okay")) {
          return "empathetic"
        }
      }
    }
    return "calm"
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const avatarMood = getAvatarMood()

  return (
    <div className="zenith-chat-window">
      {/* Close Button */}
      <button className="zenith-close-btn" onClick={onClose} aria-label="Close chat">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Emotional Avatar */}
      <div className="zenith-avatar-container">
        <div className={`zenith-avatar zenith-avatar-${avatarMood}`}>
          <div className="zenith-avatar-core"></div>
          <div className="zenith-avatar-ring"></div>
          <div className="zenith-avatar-particles">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="zenith-avatar-name">
          <h3 className="text-gradient">Zenith AI Mentor</h3>
          <p className="zenith-avatar-status">
            {isTyping ? "Thinking..." : isListening ? "Listening..." : "Here to guide you"}
          </p>
        </div>
      </div>

      {/* Messages with Liquid Background */}
      <div className="zenith-messages-container">
        <div className="zenith-liquid-bg">
          <div className="zenith-liquid-blob zenith-liquid-blob-1"></div>
          <div className="zenith-liquid-blob zenith-liquid-blob-2"></div>
        </div>

        <div className="zenith-messages">
          {messages.length === 1 && showExamples && (
            <div className="zenith-welcome">
              <p className="zenith-welcome-text">Try asking:</p>
              <div className="zenith-example-prompts">
                {EXAMPLE_PROMPTS.map((prompt, index) => (
                  <button
                    key={index}
                    className="zenith-example-btn"
                    onClick={() => handleExampleClick(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isTyping && (
            <div className="chat-message bot-message">
              <div className="zenith-typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Enhanced Input Area */}
      <div className="zenith-input-container">
        <div className="zenith-input-wrapper">
          <button
            className={`zenith-voice-btn ${isListening ? "zenith-voice-active" : ""}`}
            onClick={handleVoiceInput}
            aria-label="Voice input"
            title="Voice Mode"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
            </svg>
          </button>

          <textarea
            className="zenith-input"
            placeholder="Share your thoughts, ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />

          <button
            className="zenith-magic-btn"
            onClick={handleSuggestion}
            aria-label="Get suggestion"
            title="Get a suggestion"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
            </svg>
          </button>

          <button
            className="zenith-send-btn"
            onClick={handleSend}
            disabled={!input.trim()}
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow
