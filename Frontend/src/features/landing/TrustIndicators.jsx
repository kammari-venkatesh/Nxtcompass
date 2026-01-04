import GlassCard from "../../components/ui/GlassCard"
import "./TrustIndicators.css"

const TrustIndicators = () => {
  return (
    <section className="trust">
      <div className="container">
        <div className="trust-grid">

          <GlassCard className="trust-card">
            <h2>2.5L+</h2>
            <p>Students Helped</p>
          </GlassCard>

          <GlassCard className="trust-card">
            <h2>98%</h2>
            <p>Prediction Accuracy</p>
          </GlassCard>

          <GlassCard className="trust-card">
            <h2>50+</h2>
            <p>Exams Covered</p>
          </GlassCard>

          <GlassCard className="trust-card">
            <h2>5000+</h2>
            <p>Colleges Listed</p>
          </GlassCard>

        </div>
      </div>
    </section>
  )
}

export default TrustIndicators
