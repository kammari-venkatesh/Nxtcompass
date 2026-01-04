import "./QuizCard.css"

const QuizCard = ({
  question,
  onAnswer,
  onHover,
  onLeave,
  selectedOption,
  showInsight,
}) => {
  if (!question) return null

  return (
    <div className="quiz-card-container">
      <div className="quiz-card glass">
        <div className="quiz-scenario-badge">{question.scenario}</div>

        <div className="quiz-illustration">{question.illustration}</div>

        <h2 className="quiz-question">{question.question}</h2>

        <div className="quiz-options">
          {question.options.map((option) => (
            <div
              key={option.id}
              className={`quiz-option glass-hover ${
                selectedOption === option.id ? "quiz-option-selected" : ""
              } ${selectedOption === option.id && showInsight ? "quiz-option-flipped" : ""}`}
              onClick={() => !selectedOption && onAnswer(option)}
              onMouseEnter={onHover}
              onMouseLeave={onLeave}
              style={{ cursor: selectedOption ? "default" : "pointer" }}
            >
              {selectedOption === option.id && showInsight ? (
                <div className="quiz-option-back">
                  <div className="quiz-insight-icon">✨</div>
                  <p className="quiz-insight">{option.insight}</p>
                  <div className="quiz-stream-badge">{option.stream}</div>
                </div>
              ) : (
                <div className="quiz-option-front">
                  <div className="quiz-option-id">{option.id}</div>
                  <div className="quiz-option-text">{option.text}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuizCard
