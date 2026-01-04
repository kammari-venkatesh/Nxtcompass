import "./PreferencesStep.css"

const BRANCHES = [
  { id: "cse", label: "Computer Science Engineering" },
  { id: "it", label: "Information Technology" },
  { id: "ece", label: "Electronics & Communication" },
  { id: "eee", label: "Electrical Engineering" },
  { id: "mech", label: "Mechanical Engineering" },
  { id: "civil", label: "Civil Engineering" },
]

const PreferencesStep = ({
  branches,
  budget,
  locations,
  onBranchesChange,
  onBudgetChange,
  onLocationsChange,
}) => {
  const toggleBranch = (id) => {
    if (branches.includes(id)) {
      onBranchesChange(branches.filter((b) => b !== id))
    } else {
      onBranchesChange([...branches, id])
    }
  }

  return (
    <div className="preferences-step">
      <h2>Preferences (Optional)</h2>

      <p className="preferences-subtitle">
        These help us rank colleges better — they won't reduce your chances.
      </p>

      {/* Branch Preference */}
      <div className="pref-section">
        <label>Preferred Branches</label>

        <div className="branch-chips">
          {BRANCHES.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`chip ${branches.includes(b.id) ? "active" : ""}`}
              onClick={() => toggleBranch(b.id)}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="pref-section">
        <label>Maximum Annual Fees (₹)</label>

        <input
          type="range"
          min="0"
          max="2000000"
          step="50000"
          value={budget}
          onChange={(e) => onBudgetChange(Number(e.target.value))}
        />

        <p className="budget-value">
          Up to ₹{budget.toLocaleString()} per year
        </p>
      </div>

      {/* Location */}
      <div className="pref-section">
        <label>Preferred Locations</label>

        <input
          type="text"
          placeholder="e.g. Telangana, Karnataka"
          value={locations}
          onChange={(e) => onLocationsChange(e.target.value)}
        />

        <p className="helper">
          Comma-separated states (leave empty for all India)
        </p>
      </div>
    </div>
  )
}

export default PreferencesStep
