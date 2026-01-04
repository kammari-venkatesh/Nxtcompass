/**
 * Calculates admission probability based on rank vs cutoff
 */
export const calculateProbability = ({
  userRank,
  cutoffRank,
}) => {
  const margin = cutoffRank - userRank

  if (margin >= 5000) {
    return {
      probability: 90,
      label: "HIGH",
      reason: "You are far ahead of last year cutoff",
    }
  }

  if (margin >= 2000) {
    return {
      probability: 80,
      label: "HIGH",
      reason: "You are comfortably ahead of cutoff",
    }
  }

  if (margin >= 500) {
    return {
      probability: 65,
      label: "MODERATE",
      reason: "You are slightly ahead of cutoff",
    }
  }

  if (margin >= -500) {
    return {
      probability: 45,
      label: "AMBITIOUS",
      reason: "You are close to cutoff, competition is high",
    }
  }

  return {
    probability: 20,
    label: "LOW",
    reason: "Your rank is below last year cutoff",
  }
}
