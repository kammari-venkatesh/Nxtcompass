import "./CategoryStep.css"

const CATEGORIES = [
  { id: "general", label: "General / Unreserved" },
  { id: "ews", label: "EWS" },
  { id: "obc", label: "OBC-NCL" },
  { id: "sc", label: "SC" },
  { id: "st", label: "ST" },
  { id: "pwd", label: "PwD" },
]

const STATES = [
  "Andhra Pradesh",
  "Telangana",
  "Karnataka",
  "Tamil Nadu",
  "Maharashtra",
  "Kerala",
  "Delhi",
  "Uttar Pradesh",
  "Rajasthan",
  "Madhya Pradesh",
]

const CategoryStep = ({
  category,
  state,
  onCategoryChange,
  onStateChange,
}) => {
  return (
    <div className="category-step">
      <h2>Category & Home State</h2>

      <p className="category-subtitle">
        Category and home state are used to apply reservation
        and state quota benefits during prediction.
      </p>

      {/* Category */}
      <div className="field">
        <label>Category</label>
        <select
          value={category || ""}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="" disabled>
            Select category
          </option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* State */}
      <div className="field">
        <label>Home State</label>
        <select
          value={state || ""}
          onChange={(e) => onStateChange(e.target.value)}
        >
          <option value="" disabled>
            Select home state
          </option>
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <p className="category-note">
        Your information is used only for prediction accuracy
        and is not shared.
      </p>
    </div>
  )
}

export default CategoryStep
