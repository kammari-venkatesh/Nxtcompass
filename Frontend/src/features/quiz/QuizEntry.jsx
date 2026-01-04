import { useNavigate } from "react-router-dom"
import Navbar from "../../components/navigation/Navbar"
import GlassCard from "../../components/ui/GlassCard"
import Button from "../../components/ui/Button"
import MegaFooter from "../../components/footer/MegaFooter"
import "./QuizEntry.css"

const QuizEntry = () => {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />
      <main className="quiz-entry">
        <div className="container quiz-entry-container">

          <GlassCard className="quiz-entry-card">
            <h1 className="quiz-title">Career Quiz</h1>

            <p className="quiz-subtitle">
              Discover your ideal career path and engineering branch
              through a short, interactive quiz.
            </p>

            <ul className="quiz-features">
              <li>⏱ Takes 8–10 minutes</li>
              <li>🎯 No right or wrong answers</li>
              <li>🧠 Based on interests & aptitude</li>
              <li>📊 Proven accuracy with real students</li>
            </ul>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate("/quiz/start")}
            >
              Start Quiz →
            </Button>

            <p className="quiz-footer-text">
              Already completed the quiz?{" "}
              <span onClick={() => navigate("/quiz/results")}>
                View your results
              </span>
            </p>
          </GlassCard>

        </div>
      </main>
      <MegaFooter />
    </>
  )
}

export default QuizEntry
