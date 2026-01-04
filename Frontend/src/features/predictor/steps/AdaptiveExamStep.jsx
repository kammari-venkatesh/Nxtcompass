import { useState } from 'react'
import GlassCard from '../../../components/ui/GlassCard'
import { EXAM_STREAMS, EXAMS_BY_STREAM } from '../constants/examConfig'
import './AdaptiveExamStep.css'

const AdaptiveExamStep = ({ selectedExam, onSelect }) => {
  const [activeStream, setActiveStream] = useState(EXAM_STREAMS.ENGINEERING)

  const streamIcons = {
    [EXAM_STREAMS.ENGINEERING]: '⚙️',
    [EXAM_STREAMS.MEDICAL]: '⚕️',
    [EXAM_STREAMS.MANAGEMENT]: '💼',
    [EXAM_STREAMS.LAW]: '⚖️',
    [EXAM_STREAMS.DESIGN]: '🎨'
  }

  return (
    <div className="adaptive-exam-step">
      <h2 className="exam-step-title">Select Your Stream & Entrance Exam</h2>
      <p className="exam-step-subtitle">Choose your career stream first, then select the specific exam</p>

      {/* Stream Tabs */}
      <div className="stream-tabs">
        {Object.values(EXAM_STREAMS).map((stream) => (
          <button
            key={stream}
            className={`stream-tab ${activeStream === stream ? 'active' : ''}`}
            onClick={() => setActiveStream(stream)}
          >
            <span className="stream-tab-icon">{streamIcons[stream]}</span>
            <span className="stream-tab-label">{stream}</span>
          </button>
        ))}
      </div>

      {/* Exam Cards for Selected Stream */}
      <div className="exam-cards-container">
        <div className="exam-cards-grid">
          {EXAMS_BY_STREAM[activeStream]?.map((exam) => (
            <GlassCard
              key={exam.id}
              className={`exam-card ${selectedExam === exam.id ? 'exam-card-selected' : ''}`}
              onClick={() => onSelect(exam.id)}
              hover={true}
            >
              <div className="exam-card-header">
                <span className="exam-card-icon">{exam.icon}</span>
                <span className={`exam-card-scope exam-scope-${exam.scope.toLowerCase()}`}>
                  {exam.scope}
                </span>
              </div>

              <h3 className="exam-card-name">{exam.name}</h3>

              <div className="exam-card-stats">
                <div className="exam-stat">
                  <span className="exam-stat-icon">👥</span>
                  <span className="exam-stat-value">
                    {(exam.totalCandidates / 100000).toFixed(1)}L+ candidates
                  </span>
                </div>
              </div>

              {selectedExam === exam.id && (
                <div className="exam-card-selected-indicator">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Selected</span>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      {selectedExam && (
        <div className="exam-selection-info glass">
          <svg className="info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <p>
            The form will adapt to collect exam-specific information for{' '}
            <strong>{EXAMS_BY_STREAM[activeStream]?.find(e => e.id === selectedExam)?.name}</strong>
          </p>
        </div>
      )}
    </div>
  )
}

export default AdaptiveExamStep
