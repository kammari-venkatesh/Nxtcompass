import { useEffect, useState } from 'react'
import './ProbabilityMeter.css'

const ProbabilityMeter = ({ rank, category, examId }) => {
  const [probability, setProbability] = useState(0)
  const [displayProbability, setDisplayProbability] = useState(0)

  useEffect(() => {
    if (!rank || !category) {
      setProbability(0)
      return
    }

    // Simplified probability calculation based on rank
    // This is a rough estimation for visual feedback
    let estimatedProb = 0

    if (rank <= 1000) {
      estimatedProb = 95
    } else if (rank <= 5000) {
      estimatedProb = 85
    } else if (rank <= 15000) {
      estimatedProb = 70
    } else if (rank <= 50000) {
      estimatedProb = 50
    } else if (rank <= 100000) {
      estimatedProb = 30
    } else {
      estimatedProb = 15
    }

    // Adjust for category
    if (category === 'OBC-NCL') {
      estimatedProb += 5
    } else if (category === 'SC' || category === 'ST') {
      estimatedProb += 10
    } else if (category === 'EWS') {
      estimatedProb += 3
    }

    setProbability(Math.min(estimatedProb, 100))
  }, [rank, category])

  // Animated probability display
  useEffect(() => {
    let start = 0
    const end = probability
    const duration = 1500
    const stepTime = 20
    const steps = duration / stepTime
    const increment = (end - start) / steps

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplayProbability(end)
        clearInterval(timer)
      } else {
        setDisplayProbability(Math.floor(start))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [probability])

  const getProbabilityLevel = () => {
    if (displayProbability >= 75) return 'high'
    if (displayProbability >= 50) return 'moderate'
    if (displayProbability >= 25) return 'low'
    return 'very-low'
  }

  const getProbabilityLabel = () => {
    if (displayProbability >= 75) return 'High Chance'
    if (displayProbability >= 50) return 'Moderate Chance'
    if (displayProbability >= 25) return 'Low Chance'
    return 'Very Low Chance'
  }

  const level = getProbabilityLevel()
  const label = getProbabilityLabel()

  return (
    <div className={`probability-meter glass ${level}`}>
      <div className="probability-header">
        <h3 className="probability-title">Admission Probability</h3>
        <p className="probability-subtitle">Real-time estimation based on your inputs</p>
      </div>

      <div className="probability-gauge">
        {/* SVG Circle Gauge */}
        <svg className="gauge-svg" viewBox="0 0 200 200">
          {/* Background Circle */}
          <circle
            className="gauge-bg"
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="12"
          />

          {/* Progress Circle */}
          <circle
            className={`gauge-progress gauge-progress-${level}`}
            cx="100"
            cy="100"
            r="85"
            fill="none"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 85}`}
            strokeDashoffset={`${2 * Math.PI * 85 * (1 - displayProbability / 100)}`}
            transform="rotate(-90 100 100)"
          />

          {/* Center Text */}
          <text
            x="100"
            y="95"
            textAnchor="middle"
            className="gauge-percentage"
            fill="rgba(255, 255, 255, 0.95)"
            fontSize="42"
            fontWeight="700"
          >
            {displayProbability}%
          </text>
          <text
            x="100"
            y="115"
            textAnchor="middle"
            className="gauge-label"
            fill="rgba(255, 255, 255, 0.7)"
            fontSize="14"
            fontWeight="500"
          >
            {label}
          </text>
        </svg>
      </div>

      {/* Probability Indicators */}
      <div className="probability-indicators">
        <div className={`indicator ${level === 'high' ? 'active' : ''}`}>
          <div className="indicator-bar high-bar"></div>
          <span className="indicator-label">High</span>
        </div>
        <div className={`indicator ${level === 'moderate' ? 'active' : ''}`}>
          <div className="indicator-bar moderate-bar"></div>
          <span className="indicator-label">Moderate</span>
        </div>
        <div className={`indicator ${level === 'low' ? 'active' : ''}`}>
          <div className="indicator-bar low-bar"></div>
          <span className="indicator-label">Low</span>
        </div>
        <div className={`indicator ${level === 'very-low' ? 'active' : ''}`}>
          <div className="indicator-bar very-low-bar"></div>
          <span className="indicator-label">Very Low</span>
        </div>
      </div>

      {displayProbability > 0 && (
        <div className="probability-note">
          <svg className="note-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <p>
            This is an estimated probability. Actual predictions will be more accurate based on historical cutoff data.
          </p>
        </div>
      )}
    </div>
  )
}

export default ProbabilityMeter
