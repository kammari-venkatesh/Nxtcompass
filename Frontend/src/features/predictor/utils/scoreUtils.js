/**
 * scoreUtils
 * ----------
 * Conservative utilities for converting exam scores.
 * These are APPROXIMATIONS, not guarantees.
 */

/* -------------------------------
   Exam Candidate Estimates
   (rounded, conservative)
-------------------------------- */
const EXAM_CANDIDATES = {
  "jee-main": 1100000,   // ~11 lakh
  "jee-adv": 250000,     // appeared for JEE Main; qualified fewer
  "neet": 1800000,       // ~18 lakh
  "bitsat": 300000,
  "viteee": 250000,
  "eamcet": 300000,
}

/* -------------------------------
   Percentile → Approx Rank
-------------------------------- */
export const percentileToRank = (examId, percentile) => {
  const totalCandidates = EXAM_CANDIDATES[examId]

  if (!totalCandidates) return null
  if (percentile < 0 || percentile > 100) return null

  // Conservative formula:
  // Rank ≈ (100 - percentile) / 100 * totalCandidates
  const approxRank =
    Math.round(((100 - percentile) / 100) * totalCandidates)

  // Rank should never be less than 1
  return Math.max(1, approxRank)
}

/* -------------------------------
   Validate Rank Input
-------------------------------- */
export const isValidRank = (rank) => {
  if (!rank) return false
  const value = Number(rank)
  return Number.isInteger(value) && value > 0
}

/* -------------------------------
   Validate Percentile Input
-------------------------------- */
export const isValidPercentile = (percentile) => {
  const value = Number(percentile)
  return !isNaN(value) && value >= 0 && value <= 100
}
