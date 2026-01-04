import { calculateProbability } from "./cutoffAnalyzer.js"

/**
 * Predictor Engine
 * ----------------
 * Input:
 *  - rank
 *  - category
 *  - homeState
 *  - preferredBranches[]
 *
 * Output:
 *  - list of colleges with probability score
 */

export const predictColleges = ({
  rank,
  category,
  homeState,
  preferredBranches = [],
  cutoffs,
}) => {
  const results = []

  cutoffs.forEach((cutoff) => {
    // category mismatch
    if (cutoff.category !== category) return

    // branch preference filter (optional)
    if (
      preferredBranches.length > 0 &&
      !preferredBranches.includes(cutoff.branch)
    ) {
      return
    }

    // Use closingRank as the main cutoff rank
    const cutoffRank = cutoff.closingRank || cutoff.openingRank
    if (!cutoffRank) return // Skip if no rank data

    // Use cutoffAnalyzer for probability calculation
    const analysis = calculateProbability({
      userRank: rank,
      cutoffRank: cutoffRank,
    })

    // Home state advantage - cutoff doesn't have homeState, so we skip this
    // You can add this logic later if you populate college info in the cutoff
    let finalProbability = analysis.probability

    results.push({
      collegeId: cutoff.college, // This is the ObjectId from the cutoff model
      branch: cutoff.branch,
      cutoffRank: cutoffRank,
      yourRank: rank,
      margin: cutoffRank - rank,
      probability: finalProbability,
      label: analysis.label,
      reason: analysis.reason,
      year: cutoff.year,
    })
  })

  // sort by probability DESC, then margin DESC
  results.sort((a, b) => {
    if (b.probability !== a.probability) {
      return b.probability - a.probability
    }
    return b.margin - a.margin
  })

  return results
}
