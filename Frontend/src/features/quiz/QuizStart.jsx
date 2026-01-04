import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/navigation/Navbar"
import QuizCard from "./QuizCard"
import { quizQuestions, initializeScores, updateScores, calculateResults } from "./QuizEngine"
import "./QuizStart.css"

const QuizStart = () => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scores, setScores] = useState(initializeScores())
  const [selectedOption, setSelectedOption] = useState(null)
  const [showInsight, setShowInsight] = useState(false)
  const [showEscapeHatch, setShowEscapeHatch] = useState(false)

  const hoverTimerRef = useRef(null)
  const questionStartTimeRef = useRef(0)

  const currentQuestion = quizQuestions[currentIndex]

  // Initialize timer on mount and cleanup on unmount
  useEffect(() => {
    questionStartTimeRef.current = Date.now()

    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current)
      }
    }
  }, [])

  // Confusion detection - 15s hover timer
  const handleOptionHover = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)

    hoverTimerRef.current = setTimeout(() => {
      setShowEscapeHatch(true)
    }, 15000) // 15 seconds
  }

  const handleOptionLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
    }
  }

  // Handle option selection with gut feeling timer
  const handleAnswer = (option) => {
    const answerTime = (Date.now() - questionStartTimeRef.current) / 1000 // in seconds
    const isGutFeeling = answerTime < 5
    const weight = isGutFeeling ? 2 : 1

    setSelectedOption(option.id)
    setShowInsight(true)

    // Update scores with weight
    const updatedScores = updateScores(scores, option.stream, weight)
    setScores(updatedScores)

    // Move to next question or finish quiz
    setTimeout(() => {
      if (currentIndex < quizQuestions.length - 1) {
        setCurrentIndex(prev => prev + 1)
        // Reset state for next question
        setShowEscapeHatch(false)
        setSelectedOption(null)
        setShowInsight(false)
        questionStartTimeRef.current = Date.now()
      } else {
        const results = calculateResults(updatedScores)
        navigate("/quiz/results", { state: { results } })
      }
    }, 1800)
  }

  // Get dominant stream for background
  const getDominantStream = () => {
    const entries = Object.entries(scores)
    if (entries.every(([, count]) => count === 0)) return "NEUTRAL"
    const dominant = entries.sort((a, b) => b[1] - a[1])[0]
    return dominant[0]
  }

  const progress = ((currentIndex + 1) / quizQuestions.length) * 100
  const dominantStream = getDominantStream()

  return (
    <>
      <Navbar />
      <main className={`quiz-start-page quiz-bg-${dominantStream.toLowerCase()}`}>
        <div className="quiz-page-bg">
          <div className="quiz-orb quiz-orb-1"></div>
          <div className="quiz-orb quiz-orb-2"></div>
          <div className="quiz-orb quiz-orb-3"></div>
        </div>

        {/* Progress Bar */}
        <div className="quiz-progress-container">
          <div className="quiz-progress-bar">
            <div
              className="quiz-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="quiz-progress-text">
            Question {currentIndex + 1} of {quizQuestions.length}
          </div>
        </div>

        {/* Escape Hatch */}
        {showEscapeHatch && (
          <div className="quiz-escape-hatch glass">
            <div className="quiz-escape-icon">🤔</div>
            <p>Feeling confused? Not sure which option fits you?</p>
            <button
              className="quiz-escape-btn"
              onClick={() => navigate("/manifesto")}
            >
              Try the Career Manifesto Instead →
            </button>
          </div>
        )}

        {/* Quiz Card */}
        <QuizCard
          question={currentQuestion}
          index={currentIndex}
          total={quizQuestions.length}
          onAnswer={handleAnswer}
          onHover={handleOptionHover}
          onLeave={handleOptionLeave}
          selectedOption={selectedOption}
          showInsight={showInsight}
        />

        {/* Stream Distribution Indicator */}
        <div className="quiz-stream-indicator glass">
          <h4>Your Current Profile</h4>
          <div className="quiz-stream-bars">
            {Object.entries(scores).map(([stream, count]) => {
              const total = Object.values(scores).reduce((sum, c) => sum + c, 0)
              const percentage = total > 0 ? (count / total) * 100 : 0

              return (
                <div key={stream} className="quiz-stream-bar-item">
                  <div className="quiz-stream-label">
                    <span className={`quiz-stream-icon quiz-stream-${stream.toLowerCase()}`}>
                      {stream === "ENGINEERING" && "🔧"}
                      {stream === "MEDICAL" && "⚕️"}
                      {stream === "CREATIVE" && "🎨"}
                      {stream === "COMMERCE" && "📊"}
                    </span>
                    <span>{stream}</span>
                  </div>
                  <div className="quiz-stream-bar-bg">
                    <div
                      className={`quiz-stream-bar-fill quiz-stream-${stream.toLowerCase()}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="quiz-stream-percentage">{Math.round(percentage)}%</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Back Button */}
        <button
          className="quiz-back-btn glass-hover"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </main>
    </>
  )
}

export default QuizStart
