import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { analyzeManifesto } from "../../services/manifesto.service"
import MegaFooter from "../../components/footer/MegaFooter"
import "./manifestoAnalysis.css"

const ManifestoAnalysis = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        // Get responses from sessionStorage
        const responsesJson = sessionStorage.getItem("careerManifestoResponses")
        if (!responsesJson) {
          navigate("/manifesto")
          return
        }

        const responses = JSON.parse(responsesJson)

        // Call AI analysis API
        const result = await analyzeManifesto(responses)

        // Simulate loading for better UX
        setTimeout(() => {
          setAnalysis(result)
          setIsLoading(false)
        }, 3000)
      } catch (err) {
        console.error("Analysis error:", err)
        setError(err.message)
        setIsLoading(false)
      }
    }

    loadAnalysis()
  }, [navigate])

  const handleContinueToQuiz = () => {
    // Store archetype for quiz adaptation
    sessionStorage.setItem("careerArchetype", analysis.archetype)
    navigate("/pathfinder")
  }

  if (isLoading) {
    return (
      <div className="analysis-page">
        <div className="analysis-bg">
          <div className="analysis-orb analysis-orb-1"></div>
          <div className="analysis-orb analysis-orb-2"></div>
        </div>

        <div className="analysis-loading">
          <div className="analysis-brain-animation">
            <div className="analysis-neuron"></div>
            <div className="analysis-neuron"></div>
            <div className="analysis-neuron"></div>
            <div className="analysis-neuron"></div>
          </div>
          <h2 className="text-gradient">Analyzing Your Mind...</h2>
          <div className="analysis-insights">
            <p className="analysis-insight-item">✓ Mapping your values and curiosities</p>
            <p className="analysis-insight-item">✓ Understanding your flow states</p>
            <p className="analysis-insight-item">✓ Identifying your natural strengths</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="analysis-page">
        <div className="analysis-error glass">
          <h2>Unable to Analyze</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/manifesto")} className="analysis-btn">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="analysis-page">
      <div className="analysis-bg">
        <div className="analysis-orb analysis-orb-1"></div>
        <div className="analysis-orb analysis-orb-2"></div>
      </div>

      <div className="analysis-container">
        <h1 className="analysis-header text-gradient">Your Career Hypothesis</h1>
        <p className="analysis-subheader">Based on your responses across all 5 realms</p>

        {/* Archetype Card */}
        <div className="analysis-archetype-card glass">
          <div className="analysis-archetype-badge">{analysis.archetype}</div>
          <h2 className="analysis-archetype-title">{analysis.archetypeTitle}</h2>
          <p className="analysis-archetype-description">{analysis.description}</p>
        </div>

        {/* Suggested Paths */}
        <div className="analysis-paths">
          <h3 className="analysis-section-title">Suggested Career Paths</h3>
          <div className="analysis-paths-grid">
            {analysis.suggestedPaths.map((path, idx) => (
              <div key={idx} className="analysis-path-card glass-hover">
                <div className="analysis-path-icon">{path.icon}</div>
                <h4>{path.title}</h4>
                <p>{path.description}</p>
                <div className="analysis-path-match">
                  <div className="analysis-path-match-bar">
                    <div
                      className="analysis-path-match-fill"
                      style={{ width: `${path.matchPercentage}%` }}
                    ></div>
                  </div>
                  <span>{path.matchPercentage}% Match</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Traits */}
        <div className="analysis-traits">
          <h3 className="analysis-section-title">Your Key Traits</h3>
          <div className="analysis-traits-grid">
            {analysis.keyTraits.map((trait, idx) => (
              <div key={idx} className="analysis-trait-card glass">
                <div className="analysis-trait-icon">{trait.icon}</div>
                <h4>{trait.name}</h4>
                <p>{trait.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pros and Cons */}
        <div className="analysis-pros-cons">
          <div className="analysis-pros glass">
            <h3>✓ Strengths</h3>
            <ul>
              {analysis.pros.map((pro, idx) => (
                <li key={idx}>{pro}</li>
              ))}
            </ul>
          </div>

          <div className="analysis-cons glass">
            <h3>⚠ Growth Areas</h3>
            <ul>
              {analysis.cons.map((con, idx) => (
                <li key={idx}>{con}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="analysis-cta">
          <div className="analysis-cta-content glass">
            <h3>Ready to Validate This Hypothesis?</h3>
            <p>
              Take the Clarity Quiz to confirm your aptitudes and discover if your interests align with your abilities.
            </p>
            <button className="analysis-btn analysis-btn-primary" onClick={handleContinueToQuiz}>
              Take the Clarity Quiz →
            </button>
          </div>
        </div>
      </div>

      <MegaFooter />
    </div>
  )
}

export default ManifestoAnalysis
