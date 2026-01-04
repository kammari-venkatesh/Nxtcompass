import { useNavigate } from "react-router-dom"
import Button from "../../../components/ui/Button"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import "../dashboard.css"

const SavedColleges = ({ colleges = [], onRemove }) => {
  const navigate = useNavigate()

  return (
    <div className="saved-colleges-container">
      {colleges.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📍</div>
          <h3 className="empty-state-title">No Saved Colleges Yet</h3>
          <p className="empty-state-text">
            Use the Predictor to find colleges that match your profile and save
            them for later.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate("/predictor")}
          >
            Start Predictor
          </Button>
        </div>
      ) : (
        <motion.div className="colleges-grid" layout>
          <AnimatePresence initial={false}>
            {colleges.map((college) => (
              <motion.div
                key={college.id}
                layout="position"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="saved-college-card"
              >
              <div className="college-header">
                <h4 className="college-name">{college.name}</h4>
                <button
                  className="college-unsave-btn"
                  title="Remove from saved"
                  aria-label="Remove from saved"
                  onClick={() => onRemove?.(college.id)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="college-branch">{college.branch}</p>

              <div className="college-stats">
                <div className="stat">
                  <span className="stat-value">{college.probability}%</span>
                  <span className="stat-label">Chance</span>
                </div>
                <div className="stat">
                  <span className="stat-value">#{college.nirf}</span>
                  <span className="stat-label">NIRF Rank</span>
                </div>
              </div>

              <div className="college-actions">
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => navigate(`/college/${college.id}`)}
                >
                  View Details
                </Button>
              </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

export default SavedColleges
