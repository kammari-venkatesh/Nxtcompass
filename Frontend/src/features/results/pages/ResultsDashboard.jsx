import { mockResults } from "../mock/mockResults"
import SummaryCards from "../components/SummaryCards"
import ProbabilityGauge from "../components/ProbabilityGauge"
import CollegeCard from "../components/CollegeCard"
import "../results.css"

const ResultsDashboard = () => {
  const { profile, summary, colleges } = mockResults

  return (
    <div className="results-dashboard">
      {/* Header Section */}
      <div className="results-header">
        <div className="results-header-content">
          <h1>Your College Prediction Results</h1>
          <p className="results-subtitle">
            Based on your rank, category, and preferences
          </p>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-label">Exam</span>
              <span className="stat-value">{profile.exam}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Your Rank</span>
              <span className="stat-value">{profile.rank.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Category</span>
              <span className="stat-value">{profile.category}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">State</span>
              <span className="stat-value">{profile.homeState}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="results-content">
        {/* Left Column: Summary */}
        <div className="results-left">
          {/* Summary Cards */}
          <SummaryCards summary={summary} />

          {/* Help Text */}
          <div className="results-help-card">
            <h3>📊 Understanding Your Results</h3>
            <ul className="help-list">
              <li>
                <strong>High Chance:</strong> Very likely to get admission
              </li>
              <li>
                <strong>Moderate Chance:</strong> Good probability based on cutoffs
              </li>
              <li>
                <strong>Ambitious:</strong> Stretch goals, cutoff is close
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Colleges */}
        <div className="results-right">
          {/* Filter/Sort Controls */}
          <div className="results-controls">
            <div className="control-group">
              <label>Sort by</label>
              <select defaultValue="probability">
                <option value="probability">Probability (High to Low)</option>
                <option value="rank">Rank Gap</option>
                <option value="nirf">NIRF Rating</option>
                <option value="package">Avg Package</option>
              </select>
            </div>

            <div className="control-group">
              <label>Filter by</label>
              <select defaultValue="all">
                <option value="all">All Colleges</option>
                <option value="high">High Chance</option>
                <option value="moderate">Moderate Chance</option>
                <option value="ambitious">Ambitious</option>
              </select>
            </div>
          </div>

          {/* Colleges Grid */}
          <div className="colleges-grid">
            {colleges.length > 0 ? (
              colleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))
            ) : (
              <div className="no-results">
                <p>No colleges match your filters</p>
              </div>
            )}
          </div>

          {/* Results Footer */}
          <div className="results-footer">
            <p>
              💡 <strong>Pro Tip:</strong> Visit college websites to check
              for updates on cutoffs, eligibility, and special quotas.
            </p>
            <button className="btn-secondary">
              Export Results as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsDashboard
