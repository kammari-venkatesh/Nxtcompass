import { useState } from "react"
import { sendChatMessage } from "../../services/chat.service"

const ChatWidget = ({ context = {} }) => {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text:
        "Hi! I'm NxtCompass AI 🤖. I can help you with colleges, cutoffs, fees, and comparisons.",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: "user", text: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await sendChatMessage(input, context)

      const botMessage = {
        role: "bot",
        text: res.reply,
        cards: res.cards || [],
        followUp: res.followUp || null,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Sorry, I ran into an issue. Please try again.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-widget">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.role}`}
          >
            <p className="chat-message-text">{msg.text}</p>

            {msg.cards &&
              msg.cards.map((card, i) => (
                <div key={i} className="chat-card">
                  <strong>{card.collegeName || card.name || card.college}</strong>
                  {card.branch && <p>Branch: {card.branch}</p>}
                  {card.fees && <p>Fees: ₹{card.fees.toLocaleString()}</p>}
                  {card.generalFee && <p>General Fee: ₹{card.generalFee.toLocaleString()}</p>}
                  {card.closingRank && <p>Closing Rank: {card.closingRank.toLocaleString()}</p>}
                  {card.cutoffRank && <p>Cutoff: {card.cutoffRank.toLocaleString()}</p>}
                  {card.margin && <p>Margin: {card.margin > 0 ? '+' : ''}{card.margin.toLocaleString()}</p>}
                  {card.probability && <p>Chance: {card.probability}</p>}
                  {card.nirfRank && <p>NIRF Rank: {card.nirfRank}</p>}
                  {card.location && <p>📍 {card.location}</p>}
                </div>
              ))}

            {msg.followUp && (
              <p className="chat-followup">💡 {msg.followUp}</p>
            )}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask me about colleges, fees, cutoffs..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  )
}

export default ChatWidget
