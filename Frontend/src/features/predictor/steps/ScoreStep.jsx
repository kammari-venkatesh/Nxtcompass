import {
  percentileToRank,
  isValidPercentile,
  isValidRank,
} from "../utils/scoreUtils"
import "./ScoreStep.css"

const SCORE_TYPES = {
  RANK: "rank",
  PERCENTILE: "percentile",
}

const ScoreStep = ({
  exam,
  scoreType,
  value,
  onScoreTypeChange,
  onValueChange,
}) => {
  const numericValue = Number(value)

  let helperText = ""
  let estimatedRank = null

  if (scoreType === SCORE_TYPES.PERCENTILE) {
    if (!isValidPercentile(numericValue)) {
      helperText = "Percentile must be between 0 and 100"
    } else {
      estimatedRank = percentileToRank(exam, numericValue)
      helperText = "Estimated rank shown below (approximate)"
    }
  }

  if (scoreType === SCORE_TYPES.RANK) {
    if (!isValidRank(numericValue)) {
      helperText = "Rank must be a positive integer"
    } else {
      helperText = "Rank entered successfully"
    }
  }

  return (
    <div className="score-step">
      <h2>Enter Your Exam Performance</h2>

      <p className="score-subtitle">
        Choose the information you have for {exam.toUpperCase()}
      </p>

      {/* Score Type Selection */}
      <div className="score-type">
        <label>
          <input
            type="radio"
            checked={scoreType === SCORE_TYPES.PERCENTILE}
            onChange={() => onScoreTypeChange(SCORE_TYPES.PERCENTILE)}
          />
          Percentile
        </label>

        <label>
          <input
            type="radio"
            checked={scoreType === SCORE_TYPES.RANK}
            onChange={() => onScoreTypeChange(SCORE_TYPES.RANK)}
          />
          Rank
        </label>
      </div>

      {/* Input */}
      <div className="score-input">
        <input
          type="number"
          placeholder={
            scoreType === SCORE_TYPES.PERCENTILE
              ? "Enter percentile (e.g. 95.5)"
              : "Enter rank (e.g. 45230)"
          }
          value={value || ""}
          onChange={(e) => onValueChange(e.target.value)}
        />

        <p className="score-helper">{helperText}</p>

        {/* Estimated Rank Display */}
        {estimatedRank && (
          <p className="score-helper">
            Approximate Rank: <strong>{estimatedRank.toLocaleString()}</strong>
          </p>
        )}
      </div>
    </div>
  )
}

export default ScoreStep
