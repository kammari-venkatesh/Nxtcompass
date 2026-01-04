import { Link } from "react-router-dom"
import GlassCard from "../../components/ui/GlassCard"
import "./TriPathCards.css"

const TriPathCards = () => {
  const paths = [
    {
      id: 1,
      icon: "🎯",
      title: "College Predictor",
      description: "Get accurate college predictions based on your exam score, stream, and preferences.",
      link: "/predictor",
      cta: "Start Predicting"
    },
    {
      id: 2,
      icon: "📚",
      title: "Career Quiz",
      description: "Discover your ideal career path through our AI-powered career assessment.",
      link: "/quiz",
      cta: "Take Quiz"
    },
    {
      id: 3,
      icon: "🤖",
      title: "AI Mentor",
      description: "Chat with our AI mentor for instant answers about colleges, careers, and more.",
      link: "/chat",
      cta: "Start Chatting"
    }
  ]

  return (
    <section className="tri-paths">
      <div className="tri-paths-container container">
        <div className="tri-paths-header">
          <h2 className="tri-paths-title">Three Ways to Find Your Path</h2>
          <p className="tri-paths-subtitle">
            Choose your own journey to college success
          </p>
        </div>

        <div className="tri-paths-grid">
          {paths.map(path => (
            <Link key={path.id} to={path.link} className="tri-path-link">
              <GlassCard className="tri-path-card" hover={true}>
                <div className="tri-path-icon">{path.icon}</div>
                <h3 className="tri-path-title">{path.title}</h3>
                <p className="tri-path-description">{path.description}</p>
                <div className="tri-path-cta">{path.cta} →</div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TriPathCards
