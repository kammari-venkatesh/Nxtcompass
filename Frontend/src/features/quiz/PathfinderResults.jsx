import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./pathfinderResults.css"

const PathfinderResults = () => {
  const navigate = useNavigate()
  const [archetype, setArchetype] = useState(null)
  const [streamCounts, setStreamCounts] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Retrieve results from session storage
    const archetypeJson = sessionStorage.getItem("pathfinderArchetype")
    const streamsJson = sessionStorage.getItem("pathfinderStreams")

    if (!archetypeJson || !streamsJson) {
      navigate("/pathfinder")
      return
    }

    setArchetype(JSON.parse(archetypeJson))
    setStreamCounts(JSON.parse(streamsJson))

    // Show loading animation briefly
    setTimeout(() => {
      setIsLoading(false)
    }, 2500)
  }, [navigate])

  if (isLoading) {
    return (
      <div className="pathfinder-results-page">
        <div className="pathfinder-bg">
          <div className="pathfinder-orb pathfinder-orb-1"></div>
          <div className="pathfinder-orb pathfinder-orb-2"></div>
        </div>

        <div className="pathfinder-results-loading">
          <div className="pathfinder-results-animation">
            <div className="pathfinder-synapse"></div>
            <div className="pathfinder-synapse"></div>
            <div className="pathfinder-synapse"></div>
          </div>
          <h2>Analyzing Your Choices...</h2>
          <p>Mapping your natural instincts to career archetypes</p>
        </div>
      </div>
    )
  }

  if (!archetype || !streamCounts) {
    return null
  }

  const total = Object.values(streamCounts).reduce((sum, count) => sum + count, 0)
  const percentages = Object.entries(streamCounts)
    .map(([stream, count]) => ({
      stream,
      count,
      percentage: (count / total) * 100
    }))
    .sort((a, b) => b.percentage - a.percentage)

  return (
    <div className="pathfinder-results-page">
      <div className="pathfinder-bg">
        <div className="pathfinder-orb pathfinder-orb-1"></div>
        <div className="pathfinder-orb pathfinder-orb-2"></div>
        <div className="pathfinder-orb pathfinder-orb-3"></div>
      </div>

      <div className="pathfinder-results-container">
        {/* Header */}
        <div className="pathfinder-results-header">
          <div className="pathfinder-results-badge glass">✨ Your Career Archetype</div>
          <div className="pathfinder-results-icon">{archetype.icon}</div>
          <h1 className="pathfinder-results-title text-gradient">{archetype.title}</h1>
          <p className="pathfinder-results-subtitle">{archetype.subtitle}</p>
        </div>

        {/* Archetype Card */}
        <div className="pathfinder-archetype-card glass">
          <h3>Who You Are</h3>
          <p className="pathfinder-archetype-description">{archetype.description}</p>
        </div>

        {/* Stream Distribution */}
        <div className="pathfinder-distribution-card glass">
          <h3>Your Stream Distribution</h3>
          <p className="pathfinder-distribution-subtitle">
            Based on your situational judgments and gut reactions
          </p>

          <div className="pathfinder-distribution-bars">
            {percentages.map(({ stream, percentage }) => (
              <div key={stream} className="pathfinder-distribution-item">
                <div className="pathfinder-distribution-label">
                  <span className="pathfinder-distribution-icon">
                    {stream === "ENGINEERING" && "🔧"}
                    {stream === "MEDICAL" && "⚕️"}
                    {stream === "CREATIVE" && "🎨"}
                    {stream === "COMMERCE" && "📊"}
                  </span>
                  <span className="pathfinder-distribution-name">{stream}</span>
                </div>
                <div className="pathfinder-distribution-bar-bg">
                  <div
                    className={`pathfinder-distribution-bar-fill pathfinder-stream-${stream.toLowerCase()}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="pathfinder-distribution-percentage">
                  {Math.round(percentage)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Career Paths */}
        <div className="pathfinder-careers-card glass">
          <h3>Suggested Career Paths</h3>
          <p className="pathfinder-careers-subtitle">
            These careers align strongly with your archetype
          </p>

          <div className="pathfinder-careers-grid">
            {archetype.careers.map((career, index) => (
              <div key={index} className="pathfinder-career-item glass-hover">
                <div className="pathfinder-career-icon">🎯</div>
                <p>{career}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="pathfinder-next-steps">
          <h3>What's Next?</h3>
          <div className="pathfinder-next-steps-grid">
            <div className="pathfinder-next-step-card glass-hover">
              <div className="pathfinder-next-step-icon">🧠</div>
              <h4>Deep Dive with AI Mentor</h4>
              <p>Chat with Zenith AI to explore your archetype in depth</p>
              <button
                className="pathfinder-next-step-btn"
                onClick={() => navigate("/chat")}
              >
                Talk to Zenith →
              </button>
            </div>

            <div className="pathfinder-next-step-card glass-hover">
              <div className="pathfinder-next-step-icon">📝</div>
              <h4>Write Your Career Manifesto</h4>
              <p>Get AI-powered psychometric analysis through open-ended writing</p>
              <button
                className="pathfinder-next-step-btn"
                onClick={() => navigate("/manifesto")}
              >
                Start Manifesto →
              </button>
            </div>

            <div className="pathfinder-next-step-card glass-hover">
              <div className="pathfinder-next-step-icon">🎓</div>
              <h4>Explore College Recommendations</h4>
              <p>Find colleges that align with your career path</p>
              <button
                className="pathfinder-next-step-btn"
                onClick={() => navigate("/colleges")}
              >
                Browse Colleges →
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pathfinder-results-actions">
          <button
            className="pathfinder-results-btn pathfinder-results-btn-secondary glass-hover"
            onClick={() => navigate("/pathfinder")}
          >
            ← Retake Quiz
          </button>
          <button
            className="pathfinder-results-btn pathfinder-results-btn-primary"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default PathfinderResults
