import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/navigation/Navbar'
import GlassCard from '../../components/ui/GlassCard'
import Button from '../../components/ui/Button'

import StreamSelectionStep from './steps/StreamSelectionStep'
import CollegeSelectionStep from './steps/CollegeSelectionStep'
import RankInputStep from './steps/RankInputStep'
import VerificationStep from './steps/VerificationStep'

import { runPredictor } from '../../services/predictor.service'

import './NewPredictorFlow.css'

const NewPredictorFlow = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Step 1: Stream Selection
  const [selectedStream, setSelectedStream] = useState(null)

  // Step 2: College Selection
  const [selectedColleges, setSelectedColleges] = useState([])

  // Step 3: Rank/Score Input
  const [rankData, setRankData] = useState({
    inputType: 'rank', // 'rank' or 'percentile'
    value: '',
    exam: '',
    category: '',
    state: '',
    gender: ''
  })

  const canProceedStep1 = () => selectedStream !== null
  const canProceedStep2 = () => selectedColleges.length > 0
  const canProceedStep3 = () => {
    return rankData.value && rankData.exam && rankData.category
  }

  const goNext = () => {
    if (step === 1 && canProceedStep1()) {
      setStep(2)
    } else if (step === 2 && canProceedStep2()) {
      setStep(3)
    } else if (step === 3 && canProceedStep3()) {
      setStep(4)
    }
  }

  const goBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const payload = {
        stream: selectedStream,
        colleges: selectedColleges.map(c => c._id || c.id),
        rank: parseInt(rankData.value),
        exam: rankData.exam,
        category: rankData.category,
        homeState: rankData.state,
        gender: rankData.gender
      }

      const response = await runPredictor(payload)

      // Navigate to results
      navigate('/predictor/results', {
        state: {
          results: response.results,
          input: payload,
          selectedColleges,
          streamName: selectedStream
        }
      })
    } catch (err) {
      setError(err.message || 'Prediction failed. Please try again.')
      setLoading(false)
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Select Your Stream'
      case 2: return 'Choose Colleges'
      case 3: return 'Enter Your Details'
      case 4: return 'Verify & Predict'
      default: return 'College Predictor'
    }
  }

  const getStepSubtitle = () => {
    switch (step) {
      case 1: return 'What course are you interested in?'
      case 2: return 'Select colleges you want to check admission chances for'
      case 3: return 'Provide your rank/percentile and other details'
      case 4: return 'Review your selections before prediction'
      default: return ''
    }
  }

  return (
    <>
      <Navbar />
      <main className="new-predictor-flow">
        <div className="container predictor-flow-container">
          <GlassCard className="predictor-flow-card">
            {/* Header */}
            <div className="flow-header">
              <h1 className="flow-title">{getStepTitle()}</h1>
              <p className="flow-subtitle">{getStepSubtitle()}</p>
            </div>

            {/* Progress Indicator */}
            <div className="flow-progress">
              <div className="progress-steps">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="progress-step-item">
                    <div className={`progress-circle ${step >= n ? 'active' : ''} ${step > n ? 'completed' : ''}`}>
                      {step > n ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        n
                      )}
                    </div>
                    <span className="progress-label">
                      {n === 1 ? 'Stream' : n === 2 ? 'Colleges' : n === 3 ? 'Details' : 'Verify'}
                    </span>
                    {n < 4 && <div className={`progress-line ${step > n ? 'completed' : ''}`}></div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="flow-content">
              {/* Step 1: Stream Selection */}
              {step === 1 && (
                <StreamSelectionStep
                  selectedStream={selectedStream}
                  onSelect={setSelectedStream}
                />
              )}

              {/* Step 2: College Selection */}
              {step === 2 && (
                <CollegeSelectionStep
                  stream={selectedStream}
                  selectedColleges={selectedColleges}
                  onSelectionChange={setSelectedColleges}
                />
              )}

              {/* Step 3: Rank Input */}
              {step === 3 && (
                <RankInputStep
                  stream={selectedStream}
                  rankData={rankData}
                  onChange={setRankData}
                />
              )}

              {/* Step 4: Verification */}
              {step === 4 && (
                <VerificationStep
                  stream={selectedStream}
                  selectedColleges={selectedColleges}
                  rankData={rankData}
                  onEdit={(stepNumber) => setStep(stepNumber)}
                />
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="flow-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                <p>{error}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flow-actions">
              {step > 1 && (
                <Button variant="ghost" onClick={goBack} disabled={loading}>
                  ← Back
                </Button>
              )}

              {step < 4 ? (
                <Button
                  variant="primary"
                  fullWidth
                  disabled={
                    (step === 1 && !canProceedStep1()) ||
                    (step === 2 && !canProceedStep2()) ||
                    (step === 3 && !canProceedStep3())
                  }
                  onClick={goNext}
                >
                  {step === 1 ? 'Continue to College Selection →' :
                   step === 2 ? 'Continue to Details →' :
                   'Review & Verify →'}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="btn-spinner"></div>
                      Analyzing Admission Chances...
                    </>
                  ) : (
                    '🎯 Get Predictions'
                  )}
                </Button>
              )}
            </div>
          </GlassCard>
        </div>
      </main>
    </>
  )
}

export default NewPredictorFlow
