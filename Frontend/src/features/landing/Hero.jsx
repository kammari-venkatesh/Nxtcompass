import { Link } from "react-router-dom"
import Button from "../../components/ui/Button"
import "./Hero.css"

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container container">
        <div className="hero-content">
          <h1 className="hero-title">
            Find Your Perfect College Match
          </h1>

          <p className="hero-subtitle">
            AI-powered college predictions, career guidance, and study resources tailored for Indian students.
          </p>

          <div className="hero-actions">
            <Link to="/predictor">
              <Button variant="primary" size="lg">
                Start Predictor
              </Button>
            </Link>
            <Link to="/quiz">
              <Button variant="secondary" size="lg">
                Take Career Quiz
              </Button>
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Students</span>
            </div>
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Colleges</span>
            </div>
            <div className="stat">
              <span className="stat-number">98%</span>
              <span className="stat-label">Success</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-gradient-1"></div>
          <div className="hero-gradient-2"></div>
        </div>
      </div>
    </section>
  )
}

export default Hero
