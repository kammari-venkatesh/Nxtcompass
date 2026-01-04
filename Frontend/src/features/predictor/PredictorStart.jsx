import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/navigation/Navbar"
import GlassCard from "../../components/ui/GlassCard"
import Button from "../../components/ui/Button"
import { runPredictorFetch } from "../../services/predictor.service.fetch"
import "./PredictorStart.css"

// ADAPTIVE PREDICTOR - Exam-specific form fields
const EXAM_STREAMS = {
  ENGINEERING: 'Engineering',
  MEDICINE: 'Medicine',
  MBA: 'MBA',
  LAW: 'Law',
  DESIGN: 'Design'
}

const EXAMS_CONFIG = {
  // ENGINEERING EXAMS
  'jee-main': {
    name: 'JEE Main',
    stream: EXAM_STREAMS.ENGINEERING,
    icon: '⚙️',
    inputType: 'percentile_or_marks', // User can enter percentile OR marks (300 max)
    maxMarks: 300,
    fields: ['scoreInput', 'category', 'gender', 'homeState']
  },
  'jee-adv': {
    name: 'JEE Advanced',
    stream: EXAM_STREAMS.ENGINEERING,
    icon: '🎓',
    inputType: 'rank_or_marks', // User can enter rank OR marks (360 max)
    maxMarks: 360,
    fields: ['scoreInput', 'category', 'gender']
  },
  'ts-eamcet': {
    name: 'TS EAMCET',
    stream: EXAM_STREAMS.ENGINEERING,
    icon: '🏛️',
    inputType: 'rank_or_marks', // Marks out of 160
    maxMarks: 160,
    fields: ['scoreInput', 'category', 'gender', 'localRegion']
  },
  'ap-eamcet': {
    name: 'AP EAMCET',
    stream: EXAM_STREAMS.ENGINEERING,
    icon: '🏛️',
    inputType: 'rank_or_marks', // Marks out of 160
    maxMarks: 160,
    fields: ['scoreInput', 'category', 'gender', 'localRegion']
  },
  'bitsat': {
    name: 'BITSAT',
    stream: EXAM_STREAMS.ENGINEERING,
    icon: '🔬',
    inputType: 'rank_or_score', // Score out of 450
    maxMarks: 450,
    fields: ['scoreInput', 'category']
  },
  'viteee': {
    name: 'VITEEE',
    stream: EXAM_STREAMS.ENGINEERING,
    icon: '🎯',
    inputType: 'rank_or_marks',
    maxMarks: 125,
    fields: ['scoreInput', 'category']
  },
  'comedk': {
    name: 'COMEDK UGET',
    stream: EXAM_STREAMS.ENGINEERING,
    icon: '🎓',
    inputType: 'rank_or_marks',
    maxMarks: 180,
    fields: ['scoreInput', 'category', 'homeState']
  },
  'mht-cet': {
    name: 'MHT-CET',
    stream: EXAM_STREAMS.ENGINEERING,
    icon: '🏛️',
    inputType: 'percentile_or_marks',
    maxMarks: 200,
    fields: ['scoreInput', 'category', 'homeState']
  },

  // MEDICINE EXAMS
  'neet': {
    name: 'NEET UG',
    stream: EXAM_STREAMS.MEDICINE,
    icon: '⚕️',
    inputType: 'rank_or_marks', // Marks out of 720
    maxMarks: 720,
    fields: ['scoreInput', 'category', 'quotaType', 'homeState']
  },

  // MBA EXAMS
  'cat': {
    name: 'CAT',
    stream: EXAM_STREAMS.MBA,
    icon: '💼',
    inputType: 'percentile_or_score',
    maxMarks: 300,
    fields: ['scoreInput', 'category', 'academicProfile', 'workExperience']
  },
  'xat': {
    name: 'XAT',
    stream: EXAM_STREAMS.MBA,
    icon: '📊',
    inputType: 'percentile_or_score',
    maxMarks: 100,
    fields: ['scoreInput', 'category', 'academicProfile', 'workExperience']
  },
  'cmat': {
    name: 'CMAT',
    stream: EXAM_STREAMS.MBA,
    icon: '📈',
    inputType: 'percentile_or_score',
    maxMarks: 400,
    fields: ['scoreInput', 'category', 'academicProfile']
  },
  'mat': {
    name: 'MAT',
    stream: EXAM_STREAMS.MBA,
    icon: '💡',
    inputType: 'percentile_or_score',
    maxMarks: 200,
    fields: ['scoreInput', 'category', 'workExperience']
  },

  // LAW EXAMS
  'clat': {
    name: 'CLAT',
    stream: EXAM_STREAMS.LAW,
    icon: '⚖️',
    inputType: 'rank_or_marks', // Marks out of 120
    maxMarks: 120,
    fields: ['scoreInput', 'category', 'homeState']
  },
  'ailet': {
    name: 'AILET',
    stream: EXAM_STREAMS.LAW,
    icon: '📜',
    inputType: 'rank_or_marks',
    maxMarks: 150,
    fields: ['scoreInput', 'category']
  },

  // DESIGN EXAMS
  'nift': {
    name: 'NIFT',
    stream: EXAM_STREAMS.DESIGN,
    icon: '🎨',
    inputType: 'rank_or_score',
    maxMarks: 200,
    fields: ['scoreInput', 'category']
  },
  'uceed': {
    name: 'UCEED',
    stream: EXAM_STREAMS.DESIGN,
    icon: '✏️',
    inputType: 'rank_or_marks',
    maxMarks: 300,
    fields: ['scoreInput', 'category']
  },
  'ceed': {
    name: 'CEED',
    stream: EXAM_STREAMS.DESIGN,
    icon: '🖌️',
    inputType: 'rank_or_marks',
    maxMarks: 100,
    fields: ['scoreInput', 'category']
  }
}

const PredictorStart = () => {
  const navigate = useNavigate()
  const [currentStream, setCurrentStream] = useState(EXAM_STREAMS.ENGINEERING)
  const [selectedExam, setSelectedExam] = useState(null)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [inputMode, setInputMode] = useState('primary') // 'primary' or 'secondary'

  const examsByStream = Object.entries(EXAMS_CONFIG).reduce((acc, [id, config]) => {
    if (!acc[config.stream]) acc[config.stream] = []
    acc[config.stream].push({ id, ...config })
    return acc
  }, {})

  const selectedExamConfig = selectedExam ? EXAMS_CONFIG[selectedExam] : null

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const canSubmit = () => {
    if (!selectedExam) return false
    const config = EXAMS_CONFIG[selectedExam]

    const isValid = config.fields.every(field => {
      if (field === 'scoreInput') {
        const hasInput = formData.inputValue && formData.inputType
        console.log('Score Input Check:', { inputValue: formData.inputValue, inputType: formData.inputType, valid: hasInput })
        return hasInput
      }
      if (field === 'academicProfile') {
        return formData.tenth && formData.twelfth && formData.graduation
      }
      const fieldValid = !!formData[field]
      console.log(`Field ${field} Check:`, { value: formData[field], valid: fieldValid })
      return fieldValid
    })

    console.log('Can Submit:', isValid, 'Form Data:', formData)
    return isValid
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log('Starting prediction...')
      console.log('Form Data:', formData)
      console.log('Selected Exam:', selectedExam, selectedExamConfig)

      let calculatedRank = null

      // Convert input to rank based on input type
      if (formData.inputType === 'rank') {
        calculatedRank = parseInt(formData.inputValue)
      } else if (formData.inputType === 'percentile') {
        // Percentile to rank conversion (approximate)
        calculatedRank = Math.floor((100 - parseFloat(formData.inputValue)) * 10000)
      } else if (formData.inputType === 'marks' || formData.inputType === 'score') {
        // Marks/Score to rank conversion (exam-specific)
        const maxMarks = selectedExamConfig.maxMarks
        const marksObtained = parseInt(formData.inputValue)
        const percentage = (marksObtained / maxMarks) * 100

        // Approximate rank based on percentage (can be refined with actual data)
        if (percentage >= 99) calculatedRank = Math.floor(Math.random() * 1000) + 1
        else if (percentage >= 95) calculatedRank = Math.floor(Math.random() * 5000) + 1000
        else if (percentage >= 90) calculatedRank = Math.floor(Math.random() * 10000) + 5000
        else if (percentage >= 80) calculatedRank = Math.floor(Math.random() * 20000) + 15000
        else if (percentage >= 70) calculatedRank = Math.floor(Math.random() * 30000) + 35000
        else calculatedRank = Math.floor(Math.random() * 50000) + 65000
      }

      console.log('Calculated Rank:', calculatedRank)

      // Backend expects: rank, category, homeState, preferredBranches
      const payload = {
        rank: calculatedRank,
        category: formData.category || 'General',
        homeState: formData.homeState || null,
        preferredBranches: formData.preferredBranches || []
      }

      console.log('Sending payload to API:', payload)

      const response = await runPredictorFetch(payload)

      console.log('API Response:', response)

      navigate("/predictor/results", {
        state: {
          results: response.results,
          input: payload
        }
      })
    } catch (err) {
      console.error('Prediction Error:', err)
      console.error('Error Details:', {
        message: err.message,
        response: err.response,
        stack: err.stack
      })
      setError(err.message || "Prediction failed. Please try again.")
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="predictor-start">
        <div className="container predictor-start-container">
          <GlassCard className="predictor-start-card">
            <div className="predictor-header">
              <h1 className="predictor-title text-gradient">Universal College Predictor</h1>
              <p className="predictor-subtitle">Adaptive prediction engine that changes based on your exam</p>
            </div>

            {/* STREAM TABS */}
            <div className="stream-tabs">
              {Object.values(EXAM_STREAMS).map(stream => (
                <button
                  key={stream}
                  className={`stream-tab ${currentStream === stream ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentStream(stream)
                    setSelectedExam(null)
                    setInputMode('primary')
                    setFormData({})
                  }}
                >
                  {stream}
                </button>
              ))}
            </div>

            {/* EXAM SELECTION */}
            <div className="exam-selection">
              <h3 className="section-title">Select Your Exam</h3>
              <div className="exam-grid">
                {examsByStream[currentStream]?.map(exam => (
                  <div
                    key={exam.id}
                    className={`exam-card glass-hover ${selectedExam === exam.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedExam(exam.id)
                      setInputMode('primary')
                      // Initialize with default input type based on exam
                      const defaultInputType = exam.inputType.startsWith('rank') ? 'rank' :
                                              exam.inputType.startsWith('percentile') ? 'percentile' : 'rank'
                      setFormData({ inputType: defaultInputType, inputValue: '' })
                    }}
                  >
                    <div className="exam-icon">{exam.icon}</div>
                    <div className="exam-name">{exam.name}</div>
                    {selectedExam === exam.id && (
                      <div className="exam-check">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ADAPTIVE FORM - Changes based on selected exam */}
            {selectedExam && selectedExamConfig && (
              <div className="adaptive-form">
                <div className="form-header">
                  <h3>Predicting for: <span className="text-gradient">{selectedExamConfig.name}</span></h3>
                  <p>The form below is customized for {selectedExamConfig.name} requirements</p>
                </div>

                <div className="form-fields">
                  {/* DUAL INPUT SYSTEM - Rank/Marks/Percentile/Score */}
                  {selectedExamConfig.fields.includes('scoreInput') && (
                    <div className="form-group score-input-group">
                      {/* Toggle Buttons */}
                      <div className="input-mode-toggle">
                        {selectedExamConfig.inputType === 'rank_or_marks' && (
                          <>
                            <button
                              type="button"
                              className={`toggle-btn ${inputMode === 'primary' ? 'active' : ''}`}
                              onClick={() => {
                                setInputMode('primary')
                                setFormData({ ...formData, inputValue: '', inputType: 'rank' })
                              }}
                            >
                              🏆 Rank
                            </button>
                            <button
                              type="button"
                              className={`toggle-btn ${inputMode === 'secondary' ? 'active' : ''}`}
                              onClick={() => {
                                setInputMode('secondary')
                                setFormData({ ...formData, inputValue: '', inputType: 'marks' })
                              }}
                            >
                              📝 Marks
                            </button>
                          </>
                        )}
                        {selectedExamConfig.inputType === 'percentile_or_marks' && (
                          <>
                            <button
                              type="button"
                              className={`toggle-btn ${inputMode === 'primary' ? 'active' : ''}`}
                              onClick={() => {
                                setInputMode('primary')
                                setFormData({ ...formData, inputValue: '', inputType: 'percentile' })
                              }}
                            >
                              📊 Percentile
                            </button>
                            <button
                              type="button"
                              className={`toggle-btn ${inputMode === 'secondary' ? 'active' : ''}`}
                              onClick={() => {
                                setInputMode('secondary')
                                setFormData({ ...formData, inputValue: '', inputType: 'marks' })
                              }}
                            >
                              📝 Marks
                            </button>
                          </>
                        )}
                        {selectedExamConfig.inputType === 'rank_or_score' && (
                          <>
                            <button
                              type="button"
                              className={`toggle-btn ${inputMode === 'primary' ? 'active' : ''}`}
                              onClick={() => {
                                setInputMode('primary')
                                setFormData({ ...formData, inputValue: '', inputType: 'rank' })
                              }}
                            >
                              🏆 Rank
                            </button>
                            <button
                              type="button"
                              className={`toggle-btn ${inputMode === 'secondary' ? 'active' : ''}`}
                              onClick={() => {
                                setInputMode('secondary')
                                setFormData({ ...formData, inputValue: '', inputType: 'score' })
                              }}
                            >
                              ⭐ Score
                            </button>
                          </>
                        )}
                        {selectedExamConfig.inputType === 'percentile_or_score' && (
                          <>
                            <button
                              type="button"
                              className={`toggle-btn ${inputMode === 'primary' ? 'active' : ''}`}
                              onClick={() => {
                                setInputMode('primary')
                                setFormData({ ...formData, inputValue: '', inputType: 'percentile' })
                              }}
                            >
                              📊 Percentile
                            </button>
                            <button
                              type="button"
                              className={`toggle-btn ${inputMode === 'secondary' ? 'active' : ''}`}
                              onClick={() => {
                                setInputMode('secondary')
                                setFormData({ ...formData, inputValue: '', inputType: 'score' })
                              }}
                            >
                              ⭐ Score
                            </button>
                          </>
                        )}
                      </div>

                      {/* Input Field */}
                      <label className="form-label">
                        <span className="label-icon">
                          {inputMode === 'primary' && selectedExamConfig.inputType.startsWith('rank') && '🏆'}
                          {inputMode === 'primary' && selectedExamConfig.inputType.startsWith('percentile') && '📊'}
                          {inputMode === 'secondary' && formData.inputType === 'marks' && '📝'}
                          {inputMode === 'secondary' && formData.inputType === 'score' && '⭐'}
                        </span>
                        {inputMode === 'primary' && selectedExamConfig.inputType.startsWith('rank') && 'All India Rank *'}
                        {inputMode === 'primary' && selectedExamConfig.inputType.startsWith('percentile') && 'Percentile *'}
                        {inputMode === 'secondary' && formData.inputType === 'marks' && `Marks (out of ${selectedExamConfig.maxMarks}) *`}
                        {inputMode === 'secondary' && formData.inputType === 'score' && `Score (out of ${selectedExamConfig.maxMarks}) *`}
                      </label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder={
                          inputMode === 'primary' && selectedExamConfig.inputType.startsWith('rank') ? 'Enter your rank' :
                          inputMode === 'primary' && selectedExamConfig.inputType.startsWith('percentile') ? 'Enter percentile (e.g., 99.5)' :
                          inputMode === 'secondary' && formData.inputType === 'marks' ? `Enter marks out of ${selectedExamConfig.maxMarks}` :
                          `Enter score out of ${selectedExamConfig.maxMarks}`
                        }
                        value={formData.inputValue || ''}
                        onChange={(e) => handleFormChange('inputValue', e.target.value)}
                        step={formData.inputType === 'percentile' ? '0.01' : '1'}
                        max={inputMode === 'secondary' ? selectedExamConfig.maxMarks : undefined}
                      />
                      <span className="form-hint">
                        {inputMode === 'primary' && selectedExamConfig.inputType.startsWith('rank') && 'If you don\'t know your rank, switch to Marks mode'}
                        {inputMode === 'primary' && selectedExamConfig.inputType.startsWith('percentile') && 'Percentile is calculated by NTA based on your marks'}
                        {inputMode === 'secondary' && 'We\'ll automatically convert your marks/score to rank for prediction'}
                      </span>
                    </div>
                  )}

                  {/* CATEGORY */}
                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">👤</span>
                      Category *
                    </label>
                    <select
                      className="form-select"
                      value={formData.category || ''}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                    >
                      <option value="">Select Category</option>
                      <option value="General">General</option>
                      <option value="EWS">EWS</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="PwD">PwD</option>
                    </select>
                  </div>

                  {/* GENDER */}
                  {selectedExamConfig.fields.includes('gender') && (
                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-icon">⚧</span>
                        Gender *
                      </label>
                      <div className="radio-group">
                        {['Male', 'Female', 'Other'].map(g => (
                          <label key={g} className="radio-label">
                            <input
                              type="radio"
                              name="gender"
                              value={g}
                              checked={formData.gender === g}
                              onChange={(e) => handleFormChange('gender', e.target.value)}
                            />
                            <span>{g}</span>
                          </label>
                        ))}
                      </div>
                      <span className="form-hint">Some institutes have gender-based reservations</span>
                    </div>
                  )}

                  {/* HOME STATE (for JEE Main, COMEDK, MHT-CET, CLAT, NEET) */}
                  {selectedExamConfig.fields.includes('homeState') && (
                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-icon">📍</span>
                        Home State *
                      </label>
                      <select
                        className="form-select"
                        value={formData.homeState || ''}
                        onChange={(e) => handleFormChange('homeState', e.target.value)}
                      >
                        <option value="">Select State</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Assam">Assam</option>
                      </select>
                      <span className="form-hint">
                        {selectedExam === 'jee-main' && <><strong>Critical for NITs:</strong> Home state quota significantly improves chances</>}
                        {selectedExam === 'comedk' && <><strong>For Karnataka colleges:</strong> State quota available for Karnataka domicile</>}
                        {selectedExam === 'mht-cet' && <><strong>For Maharashtra colleges:</strong> State quota benefits for Maharashtra students</>}
                        {selectedExam === 'clat' && <><strong>For NLUs:</strong> Some NLUs have domicile-based reservations</>}
                        {selectedExam === 'neet' && <><strong>For State Quota:</strong> 85% seats reserved for state domicile holders</>}
                      </span>
                    </div>
                  )}

                  {/* LOCAL REGION (for EAMCET) */}
                  {selectedExamConfig.fields.includes('localRegion') && (
                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-icon">🏛️</span>
                        Local Region *
                      </label>
                      <select
                        className="form-select"
                        value={formData.localRegion || ''}
                        onChange={(e) => handleFormChange('localRegion', e.target.value)}
                      >
                        <option value="">Select Local Region</option>
                        {selectedExam === 'ts-eamcet' && (
                          <>
                            <option value="OU">OU - Osmania University Region</option>
                            <option value="NU">NU - Kakatiya University Region</option>
                            <option value="SVU">SVU - Sri Venkateswara University Region</option>
                            <option value="NL">NL - Non-Local</option>
                          </>
                        )}
                        {selectedExam === 'ap-eamcet' && (
                          <>
                            <option value="AU">AU - Andhra University Region</option>
                            <option value="SVU">SVU - Sri Venkateswara University Region</option>
                            <option value="OU">OU - Osmania University Region</option>
                            <option value="NL">NL - Non-Local</option>
                          </>
                        )}
                      </select>
                      <span className="form-hint">
                        <strong>VITAL FOR EAMCET:</strong> Local region is CRITICAL for state college admissions. Women get massive reservation!
                      </span>
                    </div>
                  )}

                  {/* QUOTA TYPE (for NEET) */}
                  {selectedExamConfig.fields.includes('quotaType') && (
                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-icon">🎯</span>
                        Quota Type *
                      </label>
                      <div className="quota-cards">
                        <div
                          className={`quota-card ${formData.quotaType === 'AIQ' ? 'selected' : ''}`}
                          onClick={() => handleFormChange('quotaType', 'AIQ')}
                        >
                          <h4>All India Quota (15%)</h4>
                          <p>Open to candidates from all states</p>
                        </div>
                        <div
                          className={`quota-card ${formData.quotaType === 'STATE' ? 'selected' : ''}`}
                          onClick={() => handleFormChange('quotaType', 'STATE')}
                        >
                          <h4>State Quota (85%)</h4>
                          <p>Reserved for state domicile holders</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ACADEMIC PROFILE (for CAT) */}
                  {selectedExamConfig.fields.includes('academicProfile') && (
                    <div className="form-group academic-profile">
                      <label className="form-label">
                        <span className="label-icon">📚</span>
                        Academic Profile *
                      </label>
                      <p className="form-hint">IIMs consider your complete academic background</p>
                      <div className="academic-inputs">
                        <input
                          type="number"
                          className="form-input"
                          placeholder="10th %"
                          value={formData.tenth || ''}
                          onChange={(e) => handleFormChange('tenth', e.target.value)}
                        />
                        <input
                          type="number"
                          className="form-input"
                          placeholder="12th %"
                          value={formData.twelfth || ''}
                          onChange={(e) => handleFormChange('twelfth', e.target.value)}
                        />
                        <input
                          type="number"
                          className="form-input"
                          placeholder="Grad %"
                          value={formData.graduation || ''}
                          onChange={(e) => handleFormChange('graduation', e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* WORK EXPERIENCE (for MBA) */}
                  {selectedExamConfig.fields.includes('workExperience') && (
                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-icon">💼</span>
                        Work Experience (months) *
                      </label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Enter total work experience"
                        value={formData.workExperience || ''}
                        onChange={(e) => handleFormChange('workExperience', e.target.value)}
                      />
                      <span className="form-hint">Some IIMs prefer candidates with work experience</span>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="error-message">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4M12 16h.01" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Debug Info - Shows validation status */}
                {import.meta.env.DEV && (
                  <div style={{
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    marginTop: '20px',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: 'monospace'
                  }}>
                    <strong style={{ color: 'var(--cyan)' }}>Validation Status:</strong><br />
                    Can Submit: {canSubmit() ? '✅ Yes' : '❌ No'}<br />
                    Input Value: {formData.inputValue || '❌ Missing'}<br />
                    Input Type: {formData.inputType || '❌ Missing'}<br />
                    Category: {formData.category || '❌ Missing'}<br />
                    {selectedExamConfig?.fields.includes('gender') && (
                      <>Gender: {formData.gender || '❌ Missing'}<br /></>
                    )}
                    {selectedExamConfig?.fields.includes('homeState') && (
                      <>Home State: {formData.homeState || '❌ Missing'}<br /></>
                    )}
                  </div>
                )}

                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={!canSubmit() || loading}
                  style={{ marginTop: '24px' }}
                >
                  {loading ? 'Analyzing Colleges...' : '🎯 Get Predictions'}
                </Button>

                {!canSubmit() && !loading && (
                  <p style={{
                    textAlign: 'center',
                    color: 'rgba(255, 69, 69, 0.9)',
                    fontSize: '14px',
                    marginTop: '12px'
                  }}>
                    ⚠️ Please fill all required fields to continue
                  </p>
                )}
              </div>
            )}
          </GlassCard>
        </div>
      </main>
    </>
  )
}

export default PredictorStart
