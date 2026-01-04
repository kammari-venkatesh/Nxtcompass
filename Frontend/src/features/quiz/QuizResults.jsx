import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Navbar from "../../components/navigation/Navbar"
import MegaFooter from "../../components/footer/MegaFooter"
import "./QuizResults.css"

const QuizResults = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Show loading animation briefly
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (!location.state || !location.state.results) {
    return (
      <>
        <Navbar />
        <main className="quiz-results-page">
          <div className="quiz-results-error glass">
            <h1>No Results Found</h1>
            <p>Please complete the quiz to view your career archetype.</p>
            <button
              className="quiz-results-btn quiz-results-btn-primary"
              onClick={() => navigate("/quiz")}
            >
              Take Quiz
            </button>
          </div>
        </main>
      </>
    )
  }

  const { results } = location.state
  const { title, subtitle, description, careers, icon, percentages } = results

  // Sort percentages for display
  const sortedStreams = Object.entries(percentages)
    .map(([stream, percentage]) => ({ stream, percentage }))
    .sort((a, b) => b.percentage - a.percentage)

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="quiz-results-page">
          <div className="quiz-page-bg">
            <div className="quiz-orb quiz-orb-1"></div>
            <div className="quiz-orb quiz-orb-2"></div>
          </div>

          <div className="quiz-results-loading">
            <div className="quiz-results-animation">
              <div className="quiz-synapse"></div>
              <div className="quiz-synapse"></div>
              <div className="quiz-synapse"></div>
            </div>
            <h2>Analyzing Your Choices...</h2>
            <p>Mapping your natural instincts to career archetypes</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="quiz-results-page">
        <div className="quiz-page-bg">
          <div className="quiz-orb quiz-orb-1"></div>
          <div className="quiz-orb quiz-orb-2"></div>
          <div className="quiz-orb quiz-orb-3"></div>
        </div>

        <div className="quiz-results-container">
          {/* Header */}
          <div className="quiz-results-header">
            <div className="quiz-results-badge glass">✨ Your Career Archetype</div>
            <div className="quiz-results-icon">{icon}</div>
            <h1 className="quiz-results-title text-gradient">{title}</h1>
            <p className="quiz-results-subtitle">{subtitle}</p>
          </div>

          {/* Archetype Card */}
          <div className="quiz-archetype-card glass">
            <h3>Who You Are</h3>
            <p className="quiz-archetype-description">{description}</p>
          </div>

          {/* Stream Distribution */}
          <div className="quiz-distribution-card glass">
            <h3>Your Stream Distribution</h3>
            <p className="quiz-distribution-subtitle">
              Based on your situational judgments and gut reactions
            </p>

            <div className="quiz-distribution-bars">
              {sortedStreams.map(({ stream, percentage }) => (
                <div key={stream} className="quiz-distribution-item">
                  <div className="quiz-distribution-label">
                    <span className="quiz-distribution-icon">
                      {stream === "ENGINEERING" && "🔧"}
                      {stream === "MEDICAL" && "⚕️"}
                      {stream === "CREATIVE" && "🎨"}
                      {stream === "COMMERCE" && "📊"}
                    </span>
                    <span className="quiz-distribution-name">{stream}</span>
                  </div>
                  <div className="quiz-distribution-bar-bg">
                    <div
                      className={`quiz-distribution-bar-fill quiz-stream-${stream.toLowerCase()}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="quiz-distribution-percentage">
                    {Math.round(percentage)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Career Paths */}
          <div className="quiz-careers-card glass">
            <h3>Suggested Career Paths</h3>
            <p className="quiz-careers-subtitle">
              These careers align strongly with your archetype
            </p>

            <div className="quiz-careers-grid">
              {careers.map((career, index) => (
                <div key={index} className="quiz-career-item glass-hover">
                  <div className="quiz-career-icon">🎯</div>
                  <p>{career}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="quiz-next-steps">
            <h3>What's Next?</h3>
            <div className="quiz-next-steps-grid">
              <div className="quiz-next-step-card glass-hover">
                <div className="quiz-next-step-icon">🧠</div>
                <h4>Deep Dive with AI Mentor</h4>
                <p>Chat with Compass AI to explore your archetype in depth</p>
                <button
                  className="quiz-next-step-btn"
                  onClick={() => navigate("/chat")}
                >
                  Talk to Compass →
                </button>
              </div>

              <div className="quiz-next-step-card glass-hover">
                <div className="quiz-next-step-icon">📝</div>
                <h4>Write Your Career Manifesto</h4>
                <p>Get AI-powered psychometric analysis through open-ended writing</p>
                <button
                  className="quiz-next-step-btn"
                  onClick={() => navigate("/manifesto")}
                >
                  Start Manifesto →
                </button>
              </div>

              <div className="quiz-next-step-card glass-hover">
                <div className="quiz-next-step-icon">🎓</div>
                <h4>Explore College Recommendations</h4>
                <p>Find colleges that align with your career path</p>
                <button
                  className="quiz-next-step-btn"
                  onClick={() => navigate("/predictor")}
                >
                  Browse Colleges →
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="quiz-results-actions">
            <button
              className="quiz-results-btn quiz-results-btn-secondary glass-hover"
              onClick={() => navigate("/quiz")}
            >
              ← Retake Quiz
            </button>
            <button
              className="quiz-results-btn quiz-results-btn-primary"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
      <MegaFooter />
    </>
  )
}

export default QuizResults
