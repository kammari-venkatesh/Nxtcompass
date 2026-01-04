import { examRequiresField, getExamConfig, CATEGORIES, GENDER_OPTIONS, INDIAN_STATES, LOCAL_REGIONS, QUOTA_TYPES } from '../constants/examConfig'
import './AdaptiveDetailsStep.css'

const AdaptiveDetailsStep = ({ examId, formData, onChange }) => {
  const examConfig = getExamConfig(examId)

  if (!examConfig) {
    return <div className="error-message">Invalid exam selection</div>
  }

  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value })
  }

  const requiresRank = examRequiresField(examId, 'rank')
  const requiresScore = examRequiresField(examId, 'score')
  const requiresPercentile = examRequiresField(examId, 'percentile')
  const requiresHomeState = examRequiresField(examId, 'homeState')
  const requiresLocalRegion = examRequiresField(examId, 'localRegion')
  const requiresGender = examRequiresField(examId, 'gender')
  const requiresQuotaType = examRequiresField(examId, 'quotaType')
  const requiresAcademicProfile = examRequiresField(examId, 'academicProfile')
  const requiresWorkExperience = examRequiresField(examId, 'workExperience')

  return (
    <div className="adaptive-details-step">
      <div className="details-header">
        <h2 className="details-title">Enter Your Details for {examConfig.name}</h2>
        <p className="details-subtitle">
          We'll collect only the relevant information needed for {examConfig.name} prediction
        </p>
      </div>

      <div className="details-form">
        {/* Rank Input (for rank-based exams) */}
        {requiresRank && (
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🏆</span>
              Your Rank
              <span className="required-indicator">*</span>
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter your rank"
              value={formData.rank || ''}
              onChange={(e) => handleChange('rank', e.target.value)}
              min="1"
              max={examConfig.totalCandidates}
            />
            <span className="form-hint">
              Enter rank between 1 and {examConfig.totalCandidates.toLocaleString()}
            </span>
          </div>
        )}

        {/* Score Input (for score-based exams like BITSAT) */}
        {requiresScore && (
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📊</span>
              Your Score
              <span className="required-indicator">*</span>
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter your score"
              value={formData.score || ''}
              onChange={(e) => handleChange('score', e.target.value)}
              min="0"
              max="450"
            />
            <span className="form-hint">Enter your total score</span>
          </div>
        )}

        {/* Percentile Input (for CAT, XAT, etc.) */}
        {requiresPercentile && (
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📈</span>
              Your Percentile
              <span className="required-indicator">*</span>
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter your percentile"
              value={formData.percentile || ''}
              onChange={(e) => handleChange('percentile', e.target.value)}
              min="0"
              max="100"
              step="0.01"
            />
            <span className="form-hint">Enter percentile between 0 and 100</span>
          </div>
        )}

        {/* Category Selection (required for all exams) */}
        <div className="form-group">
          <label className="form-label">
            <span className="label-icon">👤</span>
            Category
            <span className="required-indicator">*</span>
          </label>
          <select
            className="form-select"
            value={formData.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="">Select your category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Gender Selection */}
        {requiresGender && (
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">⚧</span>
              Gender
              <span className="required-indicator">*</span>
            </label>
            <div className="radio-group">
              {GENDER_OPTIONS.map((option) => (
                <label key={option.value} className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value={option.value}
                    checked={formData.gender === option.value}
                    onChange={(e) => handleChange('gender', e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-text">{option.label}</span>
                </label>
              ))}
            </div>
            <span className="form-hint">
              Some institutes have gender-based reservations
            </span>
          </div>
        )}

        {/* Home State Selection (for JEE, CLAT, etc.) */}
        {requiresHomeState && (
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📍</span>
              Home State
              <span className="required-indicator">*</span>
            </label>
            <select
              className="form-select"
              value={formData.homeState || ''}
              onChange={(e) => handleChange('homeState', e.target.value)}
            >
              <option value="">Select your home state</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <span className="form-hint">
              Critical for NIT home state quota and state college admissions
            </span>
          </div>
        )}

        {/* Local Region (for EAMCET) */}
        {requiresLocalRegion && (
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🏛️</span>
              Local Region
              <span className="required-indicator">*</span>
            </label>
            <select
              className="form-select"
              value={formData.localRegion || ''}
              onChange={(e) => handleChange('localRegion', e.target.value)}
            >
              <option value="">Select your local region</option>
              {examId === 'ts-eamcet' && LOCAL_REGIONS.TS.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
              {examId === 'ap-eamcet' && LOCAL_REGIONS.AP.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>
            <span className="form-hint">
              <strong>Important:</strong> Local area reservation significantly impacts admission chances
            </span>
          </div>
        )}

        {/* Quota Type (for NEET) */}
        {requiresQuotaType && (
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🎯</span>
              Quota Type
              <span className="required-indicator">*</span>
            </label>
            <div className="quota-cards">
              {QUOTA_TYPES.map((quota) => (
                <div
                  key={quota.value}
                  className={`quota-card ${formData.quotaType === quota.value ? 'selected' : ''}`}
                  onClick={() => handleChange('quotaType', quota.value)}
                >
                  <div className="quota-card-header">
                    <input
                      type="radio"
                      name="quotaType"
                      value={quota.value}
                      checked={formData.quotaType === quota.value}
                      onChange={(e) => handleChange('quotaType', e.target.value)}
                    />
                    <span className="quota-label">{quota.label}</span>
                  </div>
                  <p className="quota-description">{quota.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Academic Profile (for CAT/MBA) */}
        {requiresAcademicProfile && (
          <div className="form-group-section">
            <h3 className="section-title">Academic Profile</h3>
            <p className="section-subtitle">IIMs consider your complete academic background</p>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  10th Percentage
                  <span className="required-indicator">*</span>
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g., 85.5"
                  value={formData.tenth || ''}
                  onChange={(e) => handleChange('tenth', e.target.value)}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  12th Percentage
                  <span className="required-indicator">*</span>
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g., 88.2"
                  value={formData.twelfth || ''}
                  onChange={(e) => handleChange('twelfth', e.target.value)}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Graduation Percentage
                  <span className="required-indicator">*</span>
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g., 75.3"
                  value={formData.graduation || ''}
                  onChange={(e) => handleChange('graduation', e.target.value)}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        )}

        {/* Work Experience (for MBA) */}
        {requiresWorkExperience && (
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">💼</span>
              Work Experience (in months)
              <span className="required-indicator">*</span>
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter total work experience in months"
              value={formData.workExperience || ''}
              onChange={(e) => handleChange('workExperience', e.target.value)}
              min="0"
              max="240"
            />
            <span className="form-hint">
              Some IIMs prefer candidates with work experience
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdaptiveDetailsStep
