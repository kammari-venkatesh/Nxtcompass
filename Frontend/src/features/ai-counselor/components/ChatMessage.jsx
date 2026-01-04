import "./ChatMessage.css"

const ChatMessage = ({ message }) => {
  const isUser = message.type === "user"
  const isBot = message.type === "bot"

  return (
    <div className={`chat-message ${message.type}`}>
      <div className={`message-bubble ${isUser ? "user" : "bot"}`}>
        <p className="message-text">{message.content}</p>
        <span className="message-time">
          {new Date(message.id).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  )
}

export default ChatMessage
