import "../results.css"

const CollegeCard = ({ college }) => {
  const {
    name,
    branch,
    probability,
    chanceLevel,
    lastYearCutoff,
    yourRank,
    nirf,
    distanceKm,
    totalFees,
    avgPackage,
    highestPackage,
  } = college

  const rankGap = lastYearCutoff - yourRank
  const isPositiveGap = rankGap > 0

  return (
    <div className={`college-card college-card--${chanceLevel}`}>
      {/* Header */}
      <div className="college-header">
        <div className="college-info">
          <h3 className="college-name">{name}</h3>
          <p className="college-branch">{branch}</p>
        </div>

        <div className="college-badge">
          <span className={`chance-badge chance-badge--${chanceLevel}`}>
            {probability}%
          </span>
        </div>
      </div>

      {/* Cutoff Comparison */}
      <div className="college-cutoff">
        <div className="cutoff-item">
          <span className="cutoff-label">Last Year Cutoff</span>
          <span className="cutoff-value">{lastYearCutoff.toLocaleString()}</span>
        </div>

        <div className="cutoff-item">
          <span className="cutoff-label">Your Rank</span>
          <span className="cutoff-value your-rank">
            {yourRank.toLocaleString()}
          </span>
        </div>

        <div className={`cutoff-gap ${isPositiveGap ? "positive" : "negative"}`}>
          <span className="gap-label">Rank Gap</span>
          <span className="gap-value">
            {isPositiveGap ? "+" : ""}{rankGap.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Key Stats */}
      <div className="college-stats">
        <div className="stat">
          <span className="stat-icon">🎓</span>
          <span className="stat-label">NIRF Rank</span>
          <span className="stat-value">{nirf}</span>
        </div>

        <div className="stat">
          <span className="stat-icon">📍</span>
          <span className="stat-label">Distance</span>
          <span className="stat-value">{distanceKm} km</span>
        </div>

        <div className="stat">
          <span className="stat-icon">💰</span>
          <span className="stat-label">4-Year Fees</span>
          <span className="stat-value">₹{(totalFees / 100000).toFixed(1)}L</span>
        </div>
      </div>

      {/* Placement Stats */}
      <div className="college-placement">
        <div className="placement-item">
          <span className="placement-label">Average Package</span>
          <span className="placement-value">₹{avgPackage} LPA</span>
        </div>

        <div className="placement-item">
          <span className="placement-label">Highest Package</span>
          <span className="placement-value">₹{highestPackage} LPA</span>
        </div>
      </div>

      {/* Action */}
      <button className="college-cta">View Details →</button>
    </div>
  )
}

export default CollegeCard
