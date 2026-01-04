import "../results.css"

const ProbabilityGauge = ({ value }) => {
  // Determine chance level based on probability
  const getChanceLevel = (prob) => {
    if (prob >= 75) return "high"
    if (prob >= 50) return "moderate"
    return "ambitious"
  }

  // Determine color based on chance level
  const getGaugeColor = (prob) => {
    if (prob >= 75) return "#00D9FF" // Cyan
    if (prob >= 50) return "#FF9500" // Orange
    return "#B845FF" // Purple
  }

  const chanceLevel = getChanceLevel(value)
  const gaugeColor = getGaugeColor(value)

  // SVG circle properties
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div className={`probability-gauge probability-gauge--${chanceLevel}`}>
      {/* SVG Circle */}
      <svg
        className="gauge-svg"
        viewBox="0 0 120 120"
        width="120"
        height="120"
      >
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="8"
        />

        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke={gaugeColor}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="gauge-progress"
          style={{
            "--circumference": circumference,
            "--offset": strokeDashoffset,
          }}
        />
      </svg>

      {/* Center Text */}
      <div className="gauge-center">
        <span className="gauge-value">{value}%</span>
        <span className="gauge-label">{chanceLevel}</span>
      </div>
    </div>
  )
}

export default ProbabilityGauge
