import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { pathfinderQuestions, calculateArchetype } from "./PathfinderQuestions"
import "./pathfinderQuiz.css"

const PathfinderQuiz = () => {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [streamCounts, setStreamCounts] = useState({
    ENGINEERING: 0,
    MEDICAL: 0,
    CREATIVE: 0,
    COMMERCE: 0
  })
  const [selectedOption, setSelectedOption] = useState(null)
  const [showInsight, setShowInsight] = useState(false)
  const [hoverTime, setHoverTime] = useState(0)
  const [showEscapeHatch, setShowEscapeHatch] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [flippedCard, setFlippedCard] = useState(null)

  const hoverTimerRef = useRef(null)
  const questionTimerRef = useRef(null)

  // Reset timers when question changes
  useEffect(() => {
    setHoverTime(0)
    setShowEscapeHatch(false)
    setQuestionStartTime(Date.now())
    setSelectedOption(null)
    setShowInsight(false)
    setFlippedCard(null)
  }, [currentQuestion])

  // Confusion detection - 15s hover timer
  const handleOptionHover = (optionId) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)

    hoverTimerRef.current = setTimeout(() => {
      setHoverTime(prev => prev + 1)
      if (hoverTime >= 14) {
        setShowEscapeHatch(true)
      }
    }, 1000)
  }

  const handleOptionLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
    }
  }

  // Handle option selection with gut feeling timer
  const handleOptionSelect = (option) => {
    const answerTime = (Date.now() - questionStartTime) / 1000 // in seconds
    const isGutFeeling = answerTime < 5

    setSelectedOption(option.id)
    setFlippedCard(option.id)

    // Apply weight (2x for gut feeling, 1x for thoughtful)
    const weight = isGutFeeling ? 2 : 1

    setStreamCounts(prev => ({
      ...prev,
      [option.stream]: prev[option.stream] + weight
    }))

    // Show insight briefly
    setShowInsight(true)

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < pathfinderQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        // Quiz complete - navigate to results
        const archetype = calculateArchetype(streamCounts)
        sessionStorage.setItem("pathfinderArchetype", JSON.stringify(archetype))
        sessionStorage.setItem("pathfinderStreams", JSON.stringify(streamCounts))
        navigate("/pathfinder/results")
      }
    }, 2000)
  }

  // Get dominant stream for background
  const getDominantStream = () => {
    const entries = Object.entries(streamCounts)
    if (entries.every(([_, count]) => count === 0)) return "NEUTRAL"
    const dominant = entries.sort((a, b) => b[1] - a[1])[0]
    return dominant[0]
  }

  const question = pathfinderQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / pathfinderQuestions.length) * 100
  const dominantStream = getDominantStream()

  return (
    <div className={`pathfinder-quiz-page pathfinder-bg-${dominantStream.toLowerCase()}`}>
      <div className="pathfinder-bg">
        <div className="pathfinder-orb pathfinder-orb-1"></div>
        <div className="pathfinder-orb pathfinder-orb-2"></div>
        <div className="pathfinder-orb pathfinder-orb-3"></div>
      </div>

      {/* Progress Bar */}
      <div className="pathfinder-progress-container">
        <div className="pathfinder-progress-bar">
          <div
            className="pathfinder-progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="pathfinder-progress-text">
          Question {currentQuestion + 1} of {pathfinderQuestions.length}
        </div>
      </div>

      {/* Escape Hatch */}
      {showEscapeHatch && (
        <div className="pathfinder-escape-hatch glass">
          <div className="pathfinder-escape-icon">🤔</div>
          <p>Feeling confused? Not sure which option fits you?</p>
          <button
            className="pathfinder-escape-btn"
            onClick={() => navigate("/manifesto")}
          >
            Try the Career Manifesto Instead →
          </button>
        </div>
      )}

      {/* Question Card */}
      <div className="pathfinder-container">
        <div className="pathfinder-question-card glass">
          <div className="pathfinder-scenario-badge">{question.scenario}</div>

          <div className="pathfinder-illustration">{question.illustration}</div>

          <h2 className="pathfinder-question">{question.question}</h2>

          <div className="pathfinder-options">
            {question.options.map((option) => (
              <div
                key={option.id}
                className={`pathfinder-option glass-hover ${
                  selectedOption === option.id ? "pathfinder-option-selected" : ""
                } ${flippedCard === option.id ? "pathfinder-option-flipped" : ""}`}
                onClick={() => handleOptionSelect(option)}
                onMouseEnter={() => handleOptionHover(option.id)}
                onMouseLeave={handleOptionLeave}
              >
                <div className="pathfinder-option-front">
                  <div className="pathfinder-option-id">{option.id}</div>
                  <div className="pathfinder-option-text">{option.text}</div>
                </div>

                {flippedCard === option.id && (
                  <div className="pathfinder-option-back">
                    <div className="pathfinder-insight-icon">✨</div>
                    <p className="pathfinder-insight">{option.insight}</p>
                    <div className="pathfinder-stream-badge">{option.stream}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stream Distribution Indicator */}
        <div className="pathfinder-stream-indicator glass">
          <h4>Your Current Profile</h4>
          <div className="pathfinder-stream-bars">
            {Object.entries(streamCounts).map(([stream, count]) => {
              const total = Object.values(streamCounts).reduce((sum, c) => sum + c, 0)
              const percentage = total > 0 ? (count / total) * 100 : 0

              return (
                <div key={stream} className="pathfinder-stream-bar-item">
                  <div className="pathfinder-stream-label">
                    <span className={`pathfinder-stream-icon pathfinder-stream-${stream.toLowerCase()}`}>
                      {stream === "ENGINEERING" && "🔧"}
                      {stream === "MEDICAL" && "⚕️"}
                      {stream === "CREATIVE" && "🎨"}
                      {stream === "COMMERCE" && "📊"}
                    </span>
                    <span>{stream}</span>
                  </div>
                  <div className="pathfinder-stream-bar-bg">
                    <div
                      className={`pathfinder-stream-bar-fill pathfinder-stream-${stream.toLowerCase()}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="pathfinder-stream-percentage">{Math.round(percentage)}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button
        className="pathfinder-back-btn glass-hover"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>
    </div>
  )
}

export default PathfinderQuiz
