import { useNavigate } from "react-router-dom"
import "./careerDiscovery.css"

const CareerDiscovery = () => {
  const navigate = useNavigate()

  return (
    <section className="career-discovery-section">
      <div className="career-discovery-bg">
        <div className="career-discovery-orb career-discovery-orb-1"></div>
        <div className="career-discovery-orb career-discovery-orb-2"></div>
      </div>

      <div className="career-discovery-container">
        <div className="career-discovery-content">
          <div className="career-discovery-badge glass">✨ New Feature</div>

          <h2 className="career-discovery-title text-gradient">
            Don't Know Your Path? Write It Out.
          </h2>

          <p className="career-discovery-description">
            Forget ticking boxes. The <strong>Career Manifesto</strong> uses AI to understand your true passions
            through deep, open-ended questions. Discover your archetype—not through guesses, but through your own words.
          </p>

          <div className="career-discovery-features">
            <div className="career-discovery-feature glass-hover">
              <div className="career-discovery-feature-icon">🌍</div>
              <div className="career-discovery-feature-content">
                <h4>5 Psychological Realms</h4>
                <p>Write about your values, passions, and natural strengths</p>
              </div>
            </div>

            <div className="career-discovery-feature glass-hover">
              <div className="career-discovery-feature-icon">🧠</div>
              <div className="career-discovery-feature-content">
                <h4>AI Analysis</h4>
                <p>GPT-4 reads between the lines to reveal your true career fit</p>
              </div>
            </div>

            <div className="career-discovery-feature glass-hover">
              <div className="career-discovery-feature-icon">🎯</div>
              <div className="career-discovery-feature-content">
                <h4>Personalized Archetype</h4>
                <p>Get your unique career profile with tailored path recommendations</p>
              </div>
            </div>
          </div>

          <div className="career-discovery-cta">
            <button
              className="career-discovery-btn career-discovery-btn-primary"
              onClick={() => navigate("/manifesto")}
            >
              Start Your Career Manifesto →
            </button>
            <p className="career-discovery-cta-subtext">
              ⏱️ Takes 10-15 minutes • 💡 Reveals what tests can't
            </p>
          </div>
        </div>

        <div className="career-discovery-visual">
          <div className="career-discovery-card-stack">
            <div className="career-discovery-mini-card glass" style={{ transform: "rotate(-8deg) translateY(20px)" }}>
              <div className="career-discovery-mini-icon">🌍</div>
              <p>Curiosity</p>
            </div>
            <div className="career-discovery-mini-card glass" style={{ transform: "rotate(-4deg) translateY(10px)" }}>
              <div className="career-discovery-mini-icon">⚡</div>
              <p>Flow State</p>
            </div>
            <div className="career-discovery-mini-card glass" style={{ transform: "rotate(0deg)" }}>
              <div className="career-discovery-mini-icon">⚠️</div>
              <p>Friction</p>
            </div>
            <div className="career-discovery-mini-card glass" style={{ transform: "rotate(4deg) translateY(10px)" }}>
              <div className="career-discovery-mini-icon">🤖</div>
              <p>Creation</p>
            </div>
            <div className="career-discovery-mini-card glass" style={{ transform: "rotate(8deg) translateY(20px)" }}>
              <div className="career-discovery-mini-icon">👥</div>
              <p>Leadership</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CareerDiscovery
