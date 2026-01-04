import { useState, useEffect } from "react"
import ChatWindow from "./components/ChatWindow"
import "./zenith.css"

const contextMessages = [
  "Confused about ranks?",
  "Engineering vs Medical?",
  "Need career guidance?",
  "Feeling overwhelmed?",
  "What's your passion?",
  "Let's plan your future",
]

const AICounselor = () => {
  const [open, setOpen] = useState(false)
  const [contextMessage, setContextMessage] = useState(contextMessages[0])
  const [messageIndex, setMessageIndex] = useState(0)

  // Rotate context messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % contextMessages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setContextMessage(contextMessages[messageIndex])
  }, [messageIndex])

  return (
    <>
      {/* Holographic Orb */}
      <div className="ai-orb-container">
        <button
          className={`ai-orb ${open ? "ai-orb-active" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Open Zenith AI Mentor"
          title="Talk to Zenith AI"
        >
          <div className="ai-orb-core">
            <div className="ai-orb-pulse"></div>
            <div className="ai-orb-pulse ai-orb-pulse-2"></div>
            <div className="ai-orb-glow"></div>
          </div>
        </button>

        {!open && (
          <div className="ai-orb-tooltip">
            <span className="ai-orb-message">{contextMessage}</span>
          </div>
        )}
      </div>

      {/* Immersive Focus Modal */}
      {open && (
        <>
          <div className="ai-backdrop" onClick={() => setOpen(false)} />
          <div className="ai-immersive-panel">
            <ChatWindow onClose={() => setOpen(false)} />
          </div>
        </>
      )}
    </>
  )
}

export default AICounselor
