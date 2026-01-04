import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import MegaFooter from "../../components/footer/MegaFooter"
import "./careerManifesto.css"

// The 5 Realms of Career Discovery
const REALMS = [
  {
    id: "curiosity",
    title: "The Realm of Curiosity",
    icon: "🌍",
    question: "If you were given a $10 Million grant to solve ONE global problem, what would it be and how would you start solving it? Be specific.",
    aiInsight: "Reveals your values and what truly matters to you",
    minWords: 50,
    placeholder: "Example: I would tackle ocean pollution by developing biodegradable fishing nets and organizing beach cleanups...",
  },
  {
    id: "flow",
    title: "The Realm of Flow",
    icon: "⚡",
    question: "Describe the last time you were so focused on a task that you forgot to eat or check your phone. What were you doing?",
    aiInsight: "Reveals your true passion and what makes you lose track of time",
    minWords: 50,
    placeholder: "Example: I was coding a game and spent 6 hours straight debugging without realizing...",
  },
  {
    id: "friction",
    title: "The Realm of Friction",
    icon: "⚠️",
    question: "What is one subject or task in school that makes you angry or bored? Why do you hate it?",
    aiInsight: "Reveals what career paths to avoid",
    minWords: 40,
    placeholder: "Example: I hate memorizing historical dates because it feels meaningless without understanding why events happened...",
  },
  {
    id: "creation",
    title: "The Realm of Creation",
    icon: "🤖",
    question: "If you could build a robot to do your chores, what specific functions would you program it to do first?",
    aiInsight: "Reveals your logical and systematic thinking patterns",
    minWords: 40,
    placeholder: "Example: I'd program it to organize my desk by category and priority, then clean my room systematically...",
  },
  {
    id: "leadership",
    title: "The Realm of Leadership",
    icon: "👥",
    question: "Your team is losing a competition. Do you: Take charge, Analyze what went wrong silently, or Cheer everyone up? Explain your choice.",
    aiInsight: "Reveals your natural role in teams",
    minWords: 40,
    placeholder: "Example: I would analyze what went wrong because understanding the problem is the first step to solving it...",
  },
]

const CareerManifesto = () => {
  const navigate = useNavigate()
  const [currentRealm, setCurrentRealm] = useState(0)
  const [responses, setResponses] = useState({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const textareaRef = useRef(null)

  const realm = REALMS[currentRealm]
  const currentResponse = responses[realm.id] || ""
  const wordCount = currentResponse.trim().split(/\s+/).filter(Boolean).length
  const isMinWordsMet = wordCount >= realm.minWords
  const progress = ((currentRealm + 1) / REALMS.length) * 100

  // Auto-focus textarea
  useEffect(() => {
    textareaRef.current?.focus()
  }, [currentRealm])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
    }
  }, [currentResponse])

  const handleResponseChange = (value) => {
    setResponses({
      ...responses,
      [realm.id]: value,
    })
  }

  const handleNext = () => {
    if (currentRealm < REALMS.length - 1) {
      setCurrentRealm(currentRealm + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentRealm > 0) {
      setCurrentRealm(currentRealm - 1)
    }
  }

  const handleSubmit = async () => {
    setIsAnalyzing(true)

    // Store responses in sessionStorage for the analysis page
    sessionStorage.setItem("careerManifestoResponses", JSON.stringify(responses))

    // Navigate to analysis page after animation
    setTimeout(() => {
      navigate("/manifesto/analysis")
    }, 2000)
  }

  // AI Nudge system
  const getAINudge = () => {
    if (wordCount === 0) return null
    if (wordCount < 20) return "That's interesting! Can you tell me more about the 'why'?"
    if (wordCount < realm.minWords) return `Just ${realm.minWords - wordCount} more words to go...`
    return null
  }

  const aiNudge = getAINudge()

  return (
    <div className="manifesto-page">
      {/* Background Effects */}
      <div className="manifesto-bg">
        <div className="manifesto-orb manifesto-orb-1"></div>
        <div className="manifesto-orb manifesto-orb-2"></div>
        <div className="manifesto-orb manifesto-orb-3"></div>
      </div>

      {/* Progress Bar */}
      <div className="manifesto-progress-container">
        <div className="manifesto-progress-bar">
          <div className="manifesto-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="manifesto-progress-text">
          Realm {currentRealm + 1} of {REALMS.length}
        </p>
      </div>

      {/* Main Content */}
      <div className="manifesto-container">
        {!isAnalyzing ? (
          <>
            {/* Realm Header */}
            <div className="manifesto-header">
              <div className="manifesto-realm-icon">{realm.icon}</div>
              <h1 className="manifesto-realm-title text-gradient">{realm.title}</h1>
              <p className="manifesto-realm-insight">{realm.aiInsight}</p>
            </div>

            {/* Question */}
            <div className="manifesto-question-card glass">
              <p className="manifesto-question">{realm.question}</p>
            </div>

            {/* Zen Mode Editor */}
            <div className="manifesto-editor-container glass">
              <textarea
                ref={textareaRef}
                className="manifesto-editor"
                placeholder={realm.placeholder}
                value={currentResponse}
                onChange={(e) => handleResponseChange(e.target.value)}
                rows={6}
              />

              {/* Word Counter */}
              <div className="manifesto-word-counter">
                <span className={wordCount >= realm.minWords ? "manifesto-word-count-met" : ""}>
                  {wordCount} words
                </span>
                <span className="manifesto-word-min">
                  {wordCount >= realm.minWords ? "✓ Ready" : `Min: ${realm.minWords}`}
                </span>
              </div>

              {/* AI Nudge */}
              {aiNudge && (
                <div className="manifesto-ai-nudge">
                  <div className="manifesto-ai-wave"></div>
                  <p>{aiNudge}</p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="manifesto-nav">
              <button
                className="manifesto-btn manifesto-btn-secondary"
                onClick={handleBack}
                disabled={currentRealm === 0}
              >
                ← Back
              </button>

              <div className="manifesto-realm-dots">
                {REALMS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`manifesto-dot ${idx === currentRealm ? "manifesto-dot-active" : ""} ${
                      responses[REALMS[idx].id] ? "manifesto-dot-completed" : ""
                    }`}
                  ></div>
                ))}
              </div>

              <button
                className="manifesto-btn manifesto-btn-primary"
                onClick={handleNext}
                disabled={!isMinWordsMet}
              >
                {currentRealm === REALMS.length - 1 ? "Analyze My Mind →" : "Next Realm →"}
              </button>
            </div>
          </>
        ) : (
          <div className="manifesto-analyzing">
            <div className="manifesto-analyzing-animation">
              <div className="manifesto-synapse"></div>
              <div className="manifesto-synapse"></div>
              <div className="manifesto-synapse"></div>
            </div>
            <h2 className="text-gradient">AI is Connecting the Dots...</h2>
            <p>Analyzing your responses across all 5 realms</p>
          </div>
        )}
      </div>

      <MegaFooter />
    </div>
  )
}

export default CareerManifesto
