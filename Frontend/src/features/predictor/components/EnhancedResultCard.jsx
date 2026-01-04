import './EnhancedResultCard.css'

const EnhancedResultCard = ({ result, userRank }) => {
  const {
    college,
    branch,
    cutoffRank,
    probability,
    label,
    reason,
    margin
  } = result

  // Calculate comparison percentage for visual bar
  const calculateComparisonPercentage = () => {
    if (margin > 0) {
      // User rank is better - show how much better
      return Math.min((margin / cutoffRank) * 100, 100)
    } else {
      // User rank is worse - show how far behind
      return Math.max((margin / cutoffRank) * 100, -100)
    }
  }

  const comparisonPercentage = calculateComparisonPercentage()

  const getProbabilityColor = () => {
    if (probability >= 75) return 'high'
    if (probability >= 50) return 'moderate'
    if (probability >= 25) return 'low'
    return 'very-low'
  }

  const getTierBadge = () => {
    if (college.nireRank <= 50) return { label: 'Premier', class: 'tier-premier' }
    if (college.nireRank <= 150) return { label: 'Excellent', class: 'tier-excellent' }
    if (college.nireRank <= 300) return { label: 'Good', class: 'tier-good' }
    return { label: 'Standard', class: 'tier-standard' }
  }

  const probabilityColor = getProbabilityColor()
  const tierBadge = getTierBadge()

  return (
    <div className={`enhanced-result-card glass ${probabilityColor}`}>
      {/* Header Section */}
      <div className="result-card-header">
        <div className="college-info">
          <div className="college-badges">
            <span className={`tier-badge ${tierBadge.class}`}>
              {tierBadge.label}
            </span>
            <span className="college-type-badge">{college.type}</span>
          </div>

          <h3 className="college-name">{college.name}</h3>
          <p className="college-location">
            <svg className="location-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {college.city}, {college.state}
          </p>

          <div className="branch-tag">
            <svg className="branch-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            {branch}
          </div>
        </div>

        {/* Probability Badge */}
        <div className={`probability-badge probability-${probabilityColor}`}>
          <div className="probability-circle">
            <svg className="probability-ring" viewBox="0 0 100 100">
              <circle
                className="ring-bg"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="8"
              />
              <circle
                className="ring-progress"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - probability / 100)}`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <span className="probability-value">{probability}%</span>
          </div>
          <span className={`probability-label label-${probabilityColor}`}>{label}</span>
        </div>
      </div>

      {/* Rank Comparison Bars */}
      <div className="rank-comparison">
        <h4 className="comparison-title">Rank Comparison</h4>

        {/* Cutoff Rank Bar */}
        <div className="rank-item">
          <div className="rank-label-row">
            <span className="rank-label">Cutoff Rank</span>
            <span className="rank-value">{cutoffRank.toLocaleString()}</span>
          </div>
          <div className="rank-bar-container">
            <div
              className="rank-bar cutoff-bar"
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>

        {/* User Rank Bar */}
        <div className="rank-item">
          <div className="rank-label-row">
            <span className="rank-label">Your Rank</span>
            <span className="rank-value">{userRank.toLocaleString()}</span>
          </div>
          <div className="rank-bar-container">
            <div
              className={`rank-bar user-bar ${margin > 0 ? 'better' : 'worse'}`}
              style={{
                width: `${Math.abs((userRank / cutoffRank) * 100)}%`
              }}
            ></div>
          </div>
        </div>

        {/* Margin Indicator */}
        <div className="margin-indicator">
          <svg className="margin-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {margin > 0 ? (
              <path d="M12 19V5M5 12l7-7 7 7" />
            ) : (
              <path d="M12 5v14M5 12l7 7 7-7" />
            )}
          </svg>
          <span className={`margin-text ${margin > 0 ? 'positive' : 'negative'}`}>
            {margin > 0 ? `${margin.toLocaleString()} ranks ahead` : `${Math.abs(margin).toLocaleString()} ranks behind`}
          </span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="result-card-footer">
        <div className="info-grid">
          <div className="info-item">
            <span className="info-icon">💰</span>
            <div>
              <span className="info-label">Annual Fees</span>
              <span className="info-value">₹{(college.fees?.general || 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">📊</span>
            <div>
              <span className="info-label">Avg. Package</span>
              <span className="info-value">{college.avgPackage || '4-6 LPA'}</span>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">⭐</span>
            <div>
              <span className="info-label">Rating</span>
              <span className="info-value">{college.reviews?.rating || 4.0}/5</span>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="probability-reason">
          <svg className="reason-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <p>{reason}</p>
        </div>
      </div>
    </div>
  )
}

export default EnhancedResultCard
