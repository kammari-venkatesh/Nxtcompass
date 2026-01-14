import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useMentor } from "./hooks/useMentor"
import "./zenithMentor.css"

const ZenithMentor = () => {
  const navigate = useNavigate()
  const { messages: chatMessages, isTyping, sendMessage } = useMentor()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef(null)

  // Welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: "welcome",
      role: "bot",
      text: "Hey there! I'm Compass, your personal AI career mentor. I'm here to help you navigate this exciting (and sometimes overwhelming) journey of choosing your college and career path. I have access to real college data, cutoffs, fees, and can help you make informed decisions. What's on your mind today?",
      timestamp: new Date(),
      sentiment: "calm"
    }
    setMessages([welcomeMessage])
  }, [])

  // Sync backend messages with local state
  useEffect(() => {
    if (chatMessages.length > 0) {
      setMessages(prev => {
        // Only add new messages that aren't already in state
        const existingIds = new Set(prev.map(m => m.id))
        const newMessages = chatMessages.filter(m => !existingIds.has(m.id))
        return [...prev, ...newMessages]
      })
    }
  }, [chatMessages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userInput = input
    setInput("")

    // Send to backend via useMentor hook
    await sendMessage(userInput)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoiceInput = () => {
    setIsListening(!isListening)
    // TODO: Implement Web Speech API for voice input
  }

  const handleSuggestion = () => {
    const suggestions = [
      "Compare IIT Bombay vs IIT Delhi",
      "What are the fees for NIT Trichy?",
      "Show me cutoffs for Computer Science",
      "Can I get into BITS Pilani with my rank?",
      "What are affordable engineering colleges?",
      "Compare NIT Warangal vs IIIT Hyderabad"
    ]
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
    setInput(randomSuggestion)
  }

  // Calculate avatar mood based on latest message sentiment
  const getAvatarMood = () => {
    if (isTyping) return "thinking"
    if (isListening) return "empathetic"

    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === "bot" && lastMessage.sentiment) {
        return lastMessage.sentiment
      }
    }
    return "calm"
  }

  const avatarMood = getAvatarMood()

  const handleCardAction = (action) => {
    if (action && action.startsWith('/')) {
      navigate(action)
    }
  }

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      lowConfidence: '💙',
      urgency: '⏰',
      confusion: '💡',
      excitement: '🎉',
      gratitude: '🙏',
      determination: '💪',
      neutral: '😊'
    }
    return moodEmojis[mood] || '😊'
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  return (
    <div className="zenith-mentor-page">
      {/* Background Effects */}
      <div className="zenith-page-bg">
        <div className="zenith-gradient-orb zenith-gradient-orb-1"></div>
        <div className="zenith-gradient-orb zenith-gradient-orb-2"></div>
        <div className="zenith-gradient-orb zenith-gradient-orb-3"></div>
      </div>

      {/* Main Container */}
      <div className="zenith-mentor-container">
        {/* Back to Home Button */}
        <button
          className="zenith-back-home-btn glass-hover"
          onClick={() => navigate("/")}
          aria-label="Back to Home"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Home</span>
        </button>

        {/* Header with Avatar */}
        <div className="zenith-mentor-header">
          <div className={`zenith-mentor-avatar zenith-mentor-avatar-${avatarMood}`}>
            <div className="zenith-mentor-avatar-core"></div>
            <div className="zenith-mentor-avatar-ring"></div>
            <div className="zenith-mentor-avatar-particles">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="zenith-mentor-info">
            <h1 className="text-gradient">Compass AI Mentor</h1>
            <p className="zenith-mentor-tagline">
              {isTyping ? "✨ Analyzing your question..." : isListening ? "🎤 Listening..." : "💙 Your personal career companion"}
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="zenith-mentor-messages">
          <div className="zenith-mentor-messages-inner">
            {messages.map((msg) => (
              <div key={msg.id} className={`zenith-message zenith-message-${msg.role}`}>
                {msg.role === "bot" && (
                  <div className="zenith-message-avatar">
                    <div className="zenith-message-avatar-icon">C</div>
                  </div>
                )}

                <div className="zenith-message-content">
                  <div className="zenith-message-bubble">
                    <p>{msg.text}</p>
                  </div>

                  {/* Cards */}
                  {msg.cards && msg.cards.length > 0 && (
                    <div className="zenith-message-cards">
                      {msg.cards.map((card, idx) => {
                        // Enhanced prediction cards
                        if (card.type === "prediction") {
                          return (
                            <div key={idx} className={`zenith-card zenith-card-prediction zenith-card-${card.chanceCategory} glass-hover`}>
                              <div className="zenith-card-header">
                                <div className="zenith-card-icon">{card.chanceEmoji}</div>
                                <div className="zenith-card-chance-badge">{card.chanceText}</div>
                              </div>
                              <div className="zenith-card-content">
                                <h4>{card.collegeName} {card.acronym && <span className="zenith-card-acronym">({card.acronym})</span>}</h4>
                                <p className="zenith-card-branch">🎓 {card.branch}</p>
                                <p className="zenith-card-location">📍 {card.location}</p>
                                <div className="zenith-card-stats">
                                  <div className="zenith-stat-item">
                                    <span className="zenith-stat-label">Cutoff Rank:</span>
                                    <span className="zenith-stat-value">{card.cutoffRank}</span>
                                  </div>
                                  <div className="zenith-stat-item">
                                    <span className="zenith-stat-label">Your Rank:</span>
                                    <span className="zenith-stat-value">{card.yourRank}</span>
                                  </div>
                                  <div className="zenith-stat-item">
                                    <span className="zenith-stat-label">Margin:</span>
                                    <span className="zenith-stat-value zenith-positive">+{card.margin}</span>
                                  </div>
                                  <div className="zenith-stat-item">
                                    <span className="zenith-stat-label">Probability:</span>
                                    <span className="zenith-stat-value">{card.probability}%</span>
                                  </div>
                                </div>
                                {card.reason && (
                                  <p className="zenith-card-reason">💡 {card.reason}</p>
                                )}
                                {card.categoryNote && (
                                  <p className="zenith-card-note">ℹ️ {card.categoryNote}</p>
                                )}
                              </div>
                            </div>
                          )
                        }

                        // Prediction summary card
                        if (card.type === "prediction_summary") {
                          return (
                            <div key={idx} className="zenith-card zenith-card-summary glass-hover">
                              <div className="zenith-card-icon">📋</div>
                              <div className="zenith-card-content">
                                <h4>Your Profile Summary</h4>
                                <div className="zenith-summary-grid">
                                  <div className="zenith-summary-item">
                                    <span className="zenith-summary-label">Exam:</span>
                                    <span className="zenith-summary-value">{card.exam}</span>
                                  </div>
                                  <div className="zenith-summary-item">
                                    <span className="zenith-summary-label">Rank:</span>
                                    <span className="zenith-summary-value">{card.rank}</span>
                                  </div>
                                  <div className="zenith-summary-item">
                                    <span className="zenith-summary-label">Category:</span>
                                    <span className="zenith-summary-value">{card.category}</span>
                                  </div>
                                  <div className="zenith-summary-item">
                                    <span className="zenith-summary-label">Home State:</span>
                                    <span className="zenith-summary-value">{card.homeState}</span>
                                  </div>
                                </div>
                                <p className="zenith-summary-total">Found {card.totalFound} matching options! 🎉</p>
                                {card.meritFallbackInfo && (
                                  <p className="zenith-summary-note">✨ {card.meritFallbackInfo.note}</p>
                                )}
                              </div>
                            </div>
                          )
                        }

                        // Eligibility check card
                        if (card.type === "eligibility_check") {
                          return (
                            <div key={idx} className={`zenith-card zenith-card-eligibility-check ${card.eligible ? 'zenith-eligible-yes' : 'zenith-eligible-no'} glass-hover`}>
                              <div className="zenith-card-icon">{card.eligible ? '✅' : '❌'}</div>
                              <div className="zenith-card-content">
                                <h4>{card.collegeName}</h4>
                                <p className="zenith-card-exam">Exam: {card.examProvided}</p>
                                <p className={`zenith-eligibility-status ${card.eligible ? 'eligible' : 'not-eligible'}`}>
                                  {card.message}
                                </p>
                                {!card.eligible && card.requiredExam && (
                                  <p className="zenith-required-exam">Required: {card.requiredExam}</p>
                                )}
                                {card.suggestion && (
                                  <p className="zenith-card-suggestion">💡 {card.suggestion}</p>
                                )}
                              </div>
                            </div>
                          )
                        }

                        // Backend card types: fees, cutoff, comparison, eligibility
                        if (card.type === "fees") {
                          return (
                            <div key={idx} className="zenith-card zenith-card-fees glass-hover">
                              <div className="zenith-card-icon">💰</div>
                              <div className="zenith-card-content">
                                <h4>{card.collegeName}</h4>
                                <p className="zenith-card-location">{card.location}</p>
                                <div className="zenith-card-fees-grid">
                                  <div className="zenith-fee-item">
                                    <span className="zenith-fee-label">General:</span>
                                    <span className="zenith-fee-value">₹{card.generalFee}</span>
                                  </div>
                                  <div className="zenith-fee-item">
                                    <span className="zenith-fee-label">OBC:</span>
                                    <span className="zenith-fee-value">₹{card.obcFee}</span>
                                  </div>
                                  <div className="zenith-fee-item">
                                    <span className="zenith-fee-label">SC:</span>
                                    <span className="zenith-fee-value">₹{card.scFee}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        }

                        if (card.type === "cutoff") {
                          return (
                            <div key={idx} className="zenith-card zenith-card-cutoff glass-hover">
                              <div className="zenith-card-icon">📊</div>
                              <div className="zenith-card-content">
                                <h4>{card.collegeName}</h4>
                                <p className="zenith-card-branch">{card.branch}</p>
                                <div className="zenith-card-cutoff-info">
                                  <div className="zenith-cutoff-item">
                                    <span className="zenith-cutoff-label">Opening Rank:</span>
                                    <span className="zenith-cutoff-value">{card.openingRank}</span>
                                  </div>
                                  <div className="zenith-cutoff-item">
                                    <span className="zenith-cutoff-label">Closing Rank:</span>
                                    <span className="zenith-cutoff-value">{card.closingRank}</span>
                                  </div>
                                  <div className="zenith-cutoff-badge">
                                    {card.category} • {card.year}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        }

                        if (card.type === "comparison") {
                          return (
                            <div key={idx} className="zenith-card zenith-card-comparison glass-hover">
                              <div className="zenith-card-icon">⚖️</div>
                              <div className="zenith-card-content">
                                <h4>{card.collegeName}</h4>
                                <p className="zenith-card-location">{card.location}</p>
                                <div className="zenith-card-comparison-stats">
                                  <div className="zenith-stat-item">
                                    <span className="zenith-stat-label">Fees:</span>
                                    <span className="zenith-stat-value">₹{card.fees}</span>
                                  </div>
                                  <div className="zenith-stat-item">
                                    <span className="zenith-stat-label">NIRF Rank:</span>
                                    <span className="zenith-stat-value">{card.nirfRank}</span>
                                  </div>
                                  <div className="zenith-stat-item">
                                    <span className="zenith-stat-label">Total Seats:</span>
                                    <span className="zenith-stat-value">{card.totalSeats}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        }

                        if (card.type === "eligibility") {
                          return (
                            <div key={idx} className="zenith-card zenith-card-eligibility glass-hover">
                              <div className="zenith-card-icon">🎯</div>
                              <div className="zenith-card-content">
                                <h4>{card.collegeName}</h4>
                                <p className="zenith-card-branch">{card.branch}</p>
                                <div className="zenith-card-eligibility-info">
                                  <div className="zenith-eligibility-item">
                                    <span className="zenith-eligibility-label">Cutoff Rank:</span>
                                    <span className="zenith-eligibility-value">{card.cutoffRank}</span>
                                  </div>
                                  <div className="zenith-eligibility-item">
                                    <span className="zenith-eligibility-label">Margin:</span>
                                    <span className="zenith-eligibility-value">+{card.margin}</span>
                                  </div>
                                  <div className={`zenith-probability-badge zenith-probability-${card.probability.toLowerCase()}`}>
                                    {card.probability} Probability
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        }

                        // Legacy card format (with title, description, icon, action)
                        return (
                          <div
                            key={idx}
                            className="zenith-card glass-hover"
                            onClick={() => card.action && handleCardAction(card.action)}
                            style={{ cursor: card.action ? 'pointer' : 'default' }}
                          >
                            <div className="zenith-card-icon">{card.icon}</div>
                            <div className="zenith-card-content">
                              <h4>{card.title}</h4>
                              <p>{card.description}</p>
                              {card.stat && <span className="zenith-card-stat">{card.stat}</span>}
                            </div>
                            {card.action && (
                              <div className="zenith-card-arrow">→</div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Zenith Action Card */}
                  {msg.actionCard && (
                    <div className="zenith-action-card">
                      <div className="zenith-action-card-header">
                        <span className="zenith-action-card-title">Your Next Steps</span>
                        <span className="zenith-action-card-mood">{getMoodEmoji(msg.actionCard.mood)}</span>
                      </div>
                      
                      {msg.actionCard.validation && (
                        <div className="zenith-action-card-validation">
                          💙 {msg.actionCard.validation}
                        </div>
                      )}
                      
                      <div className="zenith-action-card-steps">
                        {msg.actionCard.nextSteps?.map((step, idx) => (
                          <div key={idx} className="zenith-action-step">
                            <span className="zenith-step-number">{step.emoji} {step.number}</span>
                            <div className="zenith-step-content">
                              <strong>{step.action}</strong>
                              <p>{step.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {msg.actionCard.inspiration && (
                        <div className="zenith-action-card-inspiration">
                          ✨ {msg.actionCard.inspiration}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Follow-up */}
                  {msg.followUp && (
                    <div className="zenith-followup">
                      💡 {msg.followUp}
                    </div>
                  )}

                  <span className="zenith-message-time">
                    {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {msg.role === "user" && (
                  <div className="zenith-message-avatar">
                    <div className="zenith-message-avatar-icon zenith-message-avatar-user">You</div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="zenith-message zenith-message-bot">
                <div className="zenith-message-avatar">
                  <div className="zenith-message-avatar-icon">C</div>
                </div>
                <div className="zenith-message-content">
                  <div className="zenith-typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="zenith-mentor-input-area">
          <div className="zenith-mentor-input-wrapper">
            <button
              className={`zenith-input-btn zenith-voice-btn ${isListening ? "zenith-voice-active" : ""}`}
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
              className="zenith-mentor-input"
              placeholder="Share your thoughts, ask about colleges, careers, or just say what's on your mind..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />

            <button
              className="zenith-input-btn zenith-magic-btn"
              onClick={handleSuggestion}
              aria-label="Get suggestion"
              title="Get a suggestion"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
              </svg>
            </button>

            <button
              className="zenith-input-btn zenith-send-btn"
              onClick={handleSend}
              disabled={!input.trim()}
              aria-label="Send message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>

          <div className="zenith-mentor-hints">
            <span>Press Enter to send • Shift+Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ZenithMentor
