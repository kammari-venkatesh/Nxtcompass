import { useNavigate } from "react-router-dom"
import Button from "../../../components/ui/Button"
import "../dashboard.css"

const PredictionHistory = ({ history = [] }) => {
  const navigate = useNavigate()

  return (
    <div className="prediction-history-container">
      {history.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3 className="empty-state-title">No Predictions Yet</h3>
          <p className="empty-state-text">
            Take the Quiz to get personalized college recommendations based on
            your profile.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate("/quiz")}
          >
            Start Quiz
          </Button>
        </div>
      ) : (
        <div className="history-list">
          {history.map((prediction) => (
            <div key={prediction.id} className="history-item">
              <div className="history-main">
                <div className="history-exam">
                  <h4 className="exam-name">{prediction.exam}</h4>
                  <p className="exam-date">{prediction.date}</p>
                </div>

                <div className="history-details">
                  <div className="detail">
                    <span className="detail-label">Rank</span>
                    <span className="detail-value">#{prediction.rank}</span>
                  </div>
                  <div className="detail">
                    <span className="detail-label">Category</span>
                    <span className="detail-value">{prediction.category}</span>
                  </div>
                  {prediction.topMatch && (
                    <div className="detail">
                      <span className="detail-label">Top Match</span>
                      <span className="detail-value">
                        {prediction.topMatch}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="history-actions">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/predictor/results', {
                    state: { input: prediction.input }
                  })}
                >
                  View Results
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PredictionHistory
