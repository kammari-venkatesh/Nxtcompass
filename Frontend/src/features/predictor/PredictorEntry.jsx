import { useNavigate } from "react-router-dom"
import Navbar from "../../components/navigation/Navbar"
import GlassCard from "../../components/ui/GlassCard"
import Button from "../../components/ui/Button"
import MegaFooter from "../../components/footer/MegaFooter"
import "./PredictorEntry.css"

const PredictorEntry = () => {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />
      <main className="predictor-entry">
        <div className="container predictor-entry-container">

          <GlassCard className="predictor-entry-card">
            <h1 className="predictor-title">
              College Predictor
            </h1>

            <p className="predictor-subtitle">
              Predict the colleges you can realistically get based on
              your exam rank, category, and preferences.
            </p>

            <ul className="predictor-features">
              <li>🎯 Based on previous years' cutoff data</li>
              <li>📊 Category & state quota aware</li>
              <li>⚡ Takes less than 2 minutes</li>
              <li>🔒 Your data stays private</li>
            </ul>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate("/predictor/start")}
            >
              Start Prediction →
            </Button>
          </GlassCard>

        </div>
      </main>
      <MegaFooter />
    </>
  )
}

export default PredictorEntry
