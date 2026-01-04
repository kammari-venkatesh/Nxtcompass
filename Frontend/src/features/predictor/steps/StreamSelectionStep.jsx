import { STREAMS } from '../constants/streams'
import GlassCard from '../../../components/ui/GlassCard'
import './StreamSelectionStep.css'

const StreamSelectionStep = ({ selectedStream, onSelect }) => {
  return (
    <div className="stream-selection-step">
      <div className="streams-grid">
        {STREAMS.map((stream) => (
          <GlassCard
            key={stream.id}
            className={`stream-card ${selectedStream === stream.id ? 'stream-card-selected' : ''}`}
            onClick={() => onSelect(stream.id)}
            hover={true}
          >
            <div className="stream-card-icon">{stream.icon}</div>
            <h3 className="stream-card-name">{stream.name}</h3>
            <p className="stream-card-description">{stream.description}</p>

            <div className="stream-card-exams">
              <span className="exams-label">Common Exams:</span>
              <div className="exams-tags">
                {stream.exams.slice(0, 3).map((exam, idx) => (
                  <span key={idx} className="exam-tag">{exam}</span>
                ))}
                {stream.exams.length > 3 && (
                  <span className="exam-tag more">+{stream.exams.length - 3} more</span>
                )}
              </div>
            </div>

            {selectedStream === stream.id && (
              <div className="stream-selected-indicator">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span>Selected</span>
              </div>
            )}
          </GlassCard>
        ))}
      </div>

      {selectedStream && (
        <div className="stream-info-banner glass">
          <svg className="info-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <p>
            You've selected <strong>{STREAMS.find(s => s.id === selectedStream)?.name}</strong>.
            Next, you'll choose specific colleges for this stream.
          </p>
        </div>
      )}
    </div>
  )
}

export default StreamSelectionStep
