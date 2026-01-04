import { useState } from "react"
import ChatWidget from "./ChatWidget"

const ChatContainer = ({ context }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <button
        className="chat-toggle-btn"
        onClick={() => setOpen((prev) => !prev)}
      >
        🤖 AI Counselor
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="chat-container">
          <div className="chat-header">
            <h3>NxtCompass AI</h3>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <ChatWidget context={context} />
        </div>
      )}
    </>
  )
}

export default ChatContainer
