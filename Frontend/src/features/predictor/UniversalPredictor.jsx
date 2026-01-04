import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/navigation/Navbar'
import GlassCard from '../../components/ui/GlassCard'
import Button from '../../components/ui/Button'

import AdaptiveExamStep from './steps/AdaptiveExamStep'
import AdaptiveDetailsStep from './steps/AdaptiveDetailsStep'
import PreferencesStep from './steps/PreferencesStep'
import ProbabilityMeter from './components/ProbabilityMeter'

import { getExamConfig, examRequiresField } from './constants/examConfig'
import { runPredictor } from '../../services/predictor.service'
import { percentileToRank } from './utils/scoreUtils'

import './UniversalPredictor.css'

const UniversalPredictor = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Core state
  const [examId, setExamId] = useState(null)
  const [formData, setFormData] = useState({})

  // Preferences (optional)
  const [branches, setBranches] = useState([])
  const [budget, setBudget] = useState(800000)
  const [locations, setLocations] = useState('')

  const examConfig = getExamConfig(examId)

  const canProceedStep1 = () => examId !== null
  const canProceedStep2 = () => {
    if (!examConfig) return false

    // Check required fields based on exam
    if (examRequiresField(examId, 'rank') && !formData.rank) return false
    if (examRequiresField(examId, 'score') && !formData.score) return false
    if (examRequiresField(examId, 'percentile') && !formData.percentile) return false
    if (!formData.category) return false
    if (examRequiresField(examId, 'gender') && !formData.gender) return false
    if (examRequiresField(examId, 'homeState') && !formData.homeState) return false
    if (examRequiresField(examId, 'localRegion') && !formData.localRegion) return false
    if (examRequiresField(examId, 'quotaType') && !formData.quotaType) return false

    // CAT/MBA requirements
    if (examRequiresField(examId, 'academicProfile')) {
      if (!formData.tenth || !formData.twelfth || !formData.graduation) return false
    }
    if (examRequiresField(examId, 'workExperience') && formData.workExperience === undefined) return false

    return true
  }

  const goNext = () => {
    if (step === 1 && canProceedStep1()) {
      setStep(2)
    } else if (step === 2 && canProceedStep2()) {
      setStep(3)
    }
  }

  const goBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      // Convert form data to API payload
      let rank = formData.rank

      // Handle percentile to rank conversion
      if (formData.percentile) {
        rank = percentileToRank(formData.percentile, examId)
      }

      // Handle score to rank conversion (simplified)
      if (formData.score) {
        // For BITSAT or score-based exams, we'd need a conversion table
        // For now, use a simplified approach
        rank = Math.floor((450 - parseInt(formData.score)) * 100)
      }

      const payload = {
        examId,
        rank: parseInt(rank),
        category: formData.category,
        homeState: formData.homeState,
        gender: formData.gender,
        localRegion: formData.localRegion,
        quotaType: formData.quotaType,
        preferredBranches: branches.length > 0 ? branches : undefined
      }

      const response = await runPredictor(payload)

      // Navigate to results with data
      navigate('/predictor/results', {
        state: {
          results: response.results,
          input: {
            ...payload,
            examName: examConfig.name
          }
        }
      })
    } catch (err) {
      setError(err.message || 'Prediction failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="universal-predictor">
        <div className="container universal-predictor-container">
          <GlassCard className="universal-predictor-card">
            {/* Header */}
            <div className="predictor-header">
              <h1 className="predictor-title">Universal College Predictor</h1>
              <p className="predictor-subtitle">
                Adaptive prediction engine for {examConfig ? examConfig.name : 'all entrance exams'}
              </p>
            </div>

            {/* Progress Stepper */}
            <div className="predictor-stepper">
              {[1, 2, 3].map((n) => (
                <div key={n} className="stepper-item">
                  <div className={`stepper-circle ${step >= n ? 'active' : ''} ${step > n ? 'completed' : ''}`}>
                    {step > n ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      n
                    )}
                  </div>
                  {n < 3 && <div className={`stepper-line ${step > n ? 'active' : ''}`}></div>}
                </div>
              ))}
            </div>

            {/* Step 1: Exam Selection */}
            {step === 1 && (
              <>
                <AdaptiveExamStep
                  selectedExam={examId}
                  onSelect={setExamId}
                />

                <div className="predictor-actions">
                  <Button
                    variant="primary"
                    fullWidth
                    disabled={!canProceedStep1()}
                    onClick={goNext}
                  >
                    Next: Enter Details →
                  </Button>
                </div>
              </>
            )}

            {/* Step 2: Adaptive Details */}
            {step === 2 && (
              <>
                <AdaptiveDetailsStep
                  examId={examId}
                  formData={formData}
                  onChange={setFormData}
                />

                {/* Real-time Probability Meter */}
                {formData.rank && formData.category && (
                  <ProbabilityMeter
                    rank={formData.rank}
                    category={formData.category}
                    examId={examId}
                  />
                )}

                <div className="predictor-actions">
                  <Button variant="ghost" onClick={goBack}>
                    ← Back
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    disabled={!canProceedStep2()}
                    onClick={goNext}
                  >
                    Next: Preferences →
                  </Button>
                </div>
              </>
            )}

            {/* Step 3: Preferences (Optional) */}
            {step === 3 && (
              <>
                <div className="preferences-header">
                  <h2>Set Your Preferences (Optional)</h2>
                  <p>Help us narrow down colleges that match your needs</p>
                </div>

                <PreferencesStep
                  branches={branches}
                  budget={budget}
                  locations={locations}
                  onBranchesChange={setBranches}
                  onBudgetChange={setBudget}
                  onLocationsChange={setLocations}
                />

                {error && (
                  <div className="error-alert">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4M12 16h.01" />
                    </svg>
                    <p>{error}</p>
                  </div>
                )}

                <div className="predictor-actions">
                  <Button variant="ghost" onClick={goBack} disabled={loading}>
                    ← Back
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="loading-spinner"></div>
                        Analyzing Colleges...
                      </>
                    ) : (
                      'Get Predictions →'
                    )}
                  </Button>
                </div>
              </>
            )}
          </GlassCard>
        </div>
      </main>
    </>
  )
}

export default UniversalPredictor
