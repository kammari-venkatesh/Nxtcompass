/**
 * Cutoff Analyzer Service
 * -----------------------
 * Provides probability calculation and rank normalization utilities
 * for college admission predictions.
 */

/**
 * Rank inflation factor per year
 * This accounts for increasing competition and more candidates appearing for exams
 * Approximate values based on historical JEE Main/EAMCET trends
 */
const RANK_INFLATION_FACTOR = 1.05 // ~5% inflation per year

/**
 * Normalizes a cutoff rank from a historical year to the target year
 * This helps compare current ranks with past cutoffs more accurately
 *
 * @param {number} cutoffRank - The historical cutoff rank
 * @param {number} cutoffYear - The year of the cutoff data
 * @param {number} targetYear - The year to normalize to (usually current year)
 * @returns {number} - Normalized cutoff rank
 *
 * Example: If 2023 cutoff was 50,000 and we're predicting for 2025,
 * the normalized cutoff would be 50,000 * 1.05^2 ≈ 55,125
 */
export const normalizeRankForYear = (cutoffRank, cutoffYear, targetYear) => {
  if (!cutoffRank || cutoffRank <= 0) return cutoffRank

  const yearDiff = targetYear - cutoffYear

  // Don't adjust if same year or future data (shouldn't happen)
  if (yearDiff <= 0) return cutoffRank

  // Apply compound inflation factor
  const normalizedRank = Math.round(cutoffRank * Math.pow(RANK_INFLATION_FACTOR, yearDiff))

  return normalizedRank
}

/**
 * Calculates admission probability based on rank vs cutoff
 * Uses a tiered system based on the margin between user rank and cutoff
 *
 * @param {number} userRank - The student's rank
 * @param {number} cutoffRank - The cutoff rank for the college/branch
 * @returns {Object} - { probability, label, reason }
 *
 * Probability Tiers:
 * | Margin (cutoffRank - userRank) | Probability | Label     | Description              |
 * |-------------------------------|-------------|-----------|--------------------------|
 * | >= 5000                       | 90%         | HIGH      | Far ahead of cutoff      |
 * | >= 2000                       | 80%         | HIGH      | Comfortably ahead        |
 * | >= 500                        | 65%         | MODERATE  | Slightly ahead           |
 * | >= -500                       | 45%         | AMBITIOUS | Close to cutoff          |
 * | >= -2000                      | 30%         | LOW       | Below cutoff but possible|
 * | < -2000                       | 15%         | VERY_LOW  | Significantly below      |
 */
export const calculateProbability = ({
  userRank,
  cutoffRank,
}) => {
  // Validate inputs
  if (!userRank || userRank <= 0) {
    return {
      probability: 0,
      label: "INVALID",
      reason: "Invalid user rank provided",
    }
  }

  if (!cutoffRank || cutoffRank <= 0) {
    return {
      probability: 0,
      label: "NO_DATA",
      reason: "No cutoff data available",
    }
  }

  const margin = cutoffRank - userRank

  // Far ahead of cutoff - very safe
  if (margin >= 5000) {
    return {
      probability: 90,
      label: "HIGH",
      reason: "You are far ahead of last year cutoff. Very safe option.",
    }
  }

  // Comfortably ahead
  if (margin >= 2000) {
    return {
      probability: 80,
      label: "HIGH",
      reason: "You are comfortably ahead of cutoff. Safe option.",
    }
  }

  // Slightly ahead
  if (margin >= 500) {
    return {
      probability: 65,
      label: "MODERATE",
      reason: "You are slightly ahead of cutoff. Good chances with some competition.",
    }
  }

  // Very close to cutoff - borderline
  if (margin >= -500) {
    return {
      probability: 45,
      label: "AMBITIOUS",
      reason: "You are very close to cutoff. Competition is high, but possible.",
    }
  }

  // Below cutoff but within reasonable range
  if (margin >= -2000) {
    return {
      probability: 30,
      label: "LOW",
      reason: "Your rank is below last year cutoff. Chances are low but not impossible.",
    }
  }

  // Significantly below cutoff
  return {
    probability: 15,
    label: "VERY_LOW",
    reason: "Your rank is significantly below cutoff. Consider other options.",
  }
}

/**
 * ENHANCED: Percentage-based probability calculation
 *
 * This function uses a PERCENTAGE-BASED approach instead of fixed margins.
 * This is more accurate because:
 * - A margin of 500 means different things for cutoff 1000 vs cutoff 50000
 * - Percentage-based calculation scales properly for all rank ranges
 *
 * @param {number} userRank - The student's rank
 * @param {number} cutoffRank - The cutoff rank for the college/branch
 * @returns {Object} - { probability, label, reason, color }
 *
 * Probability Tiers (Percentage-Based):
 * | User Rank vs Cutoff | Probability | Label      | Description                    |
 * |---------------------|-------------|------------|--------------------------------|
 * | <= 50% of cutoff    | 95%         | VERY_HIGH  | Far ahead - extremely safe     |
 * | <= 75% of cutoff    | 85%         | HIGH       | Comfortably ahead - very safe  |
 * | <= 100% of cutoff   | 70%         | GOOD       | Within cutoff - good chances   |
 * | <= 115% of cutoff   | 45%         | MODERATE   | Slightly above - borderline    |
 * | <= 130% of cutoff   | 25%         | LOW        | Above cutoff - reach option    |
 * | <= 150% of cutoff   | 15%         | VERY_LOW   | Significantly above - unlikely |
 * | > 150% of cutoff    | 5%          | NO_CHANCE  | Too far above - not realistic  |
 */
export const calculateProbabilityPercentage = (userRank, cutoffRank) => {
  // Validate inputs
  if (!userRank || userRank <= 0) {
    return {
      probability: 0,
      label: "INVALID",
      reason: "Invalid user rank provided",
      color: "gray"
    }
  }

  if (!cutoffRank || cutoffRank <= 0) {
    return {
      probability: 0,
      label: "NO_DATA",
      reason: "No cutoff data available",
      color: "gray"
    }
  }

  // Calculate percentage: how does user rank compare to cutoff?
  // Lower percentage = better (rank 500 vs cutoff 1000 = 50%)
  const percentage = (userRank / cutoffRank) * 100

  // Very Safe Zone: User rank is less than 50% of cutoff
  // e.g., Rank 500 vs Cutoff 1000
  if (percentage <= 50) {
    return {
      probability: 95,
      label: "VERY_HIGH",
      reason: "Your rank is far ahead of the cutoff. This is an extremely safe option.",
      color: "green"
    }
  }

  // Safe Zone: User rank is 50-75% of cutoff
  // e.g., Rank 750 vs Cutoff 1000
  if (percentage <= 75) {
    return {
      probability: 85,
      label: "HIGH",
      reason: "Your rank is comfortably ahead of the cutoff. Very safe option.",
      color: "green"
    }
  }

  // Good Zone: User rank is 75-100% of cutoff (within cutoff)
  // e.g., Rank 900 vs Cutoff 1000
  if (percentage <= 100) {
    return {
      probability: 70,
      label: "GOOD",
      reason: "Your rank is within the cutoff. Good chances of admission.",
      color: "teal"
    }
  }

  // Borderline Zone: User rank is 100-115% of cutoff
  // e.g., Rank 1100 vs Cutoff 1000
  if (percentage <= 115) {
    return {
      probability: 45,
      label: "MODERATE",
      reason: "Your rank is slightly above the cutoff. Borderline - depends on seat availability.",
      color: "orange"
    }
  }

  // Reach Zone: User rank is 115-130% of cutoff
  // e.g., Rank 1250 vs Cutoff 1000
  if (percentage <= 130) {
    return {
      probability: 25,
      label: "LOW",
      reason: "Your rank is above the cutoff. Possible in spot rounds or if seats remain vacant.",
      color: "red"
    }
  }

  // Unlikely Zone: User rank is 130-150% of cutoff
  // e.g., Rank 1400 vs Cutoff 1000
  if (percentage <= 150) {
    return {
      probability: 15,
      label: "VERY_LOW",
      reason: "Your rank is significantly above the cutoff. Very low chances.",
      color: "red"
    }
  }

  // No Chance: User rank is more than 150% of cutoff
  // e.g., Rank 1600 vs Cutoff 1000
  return {
    probability: 5,
    label: "NO_CHANCE",
    reason: "Your rank is too far above the cutoff. Consider other colleges.",
    color: "gray"
  }
}

/**
 * Analyzes cutoff trends over multiple years
 * Useful for understanding if cutoffs are getting tougher or easier
 *
 * @param {Array} historicalCutoffs - Array of { year, cutoffRank } objects
 * @returns {Object} - Trend analysis
 */
export const analyzeCutoffTrend = (historicalCutoffs) => {
  if (!historicalCutoffs || historicalCutoffs.length < 2) {
    return {
      trend: "INSUFFICIENT_DATA",
      message: "Need at least 2 years of data for trend analysis"
    }
  }

  // Sort by year descending
  const sorted = [...historicalCutoffs].sort((a, b) => b.year - a.year)

  const latestYear = sorted[0]
  const previousYear = sorted[1]

  const change = latestYear.cutoffRank - previousYear.cutoffRank
  const changePercent = ((change / previousYear.cutoffRank) * 100).toFixed(1)

  if (change > 1000) {
    return {
      trend: "GETTING_EASIER",
      change: change,
      changePercent: `+${changePercent}%`,
      message: `Cutoff increased by ${change} ranks (${changePercent}%). Getting easier to get in.`
    }
  }

  if (change < -1000) {
    return {
      trend: "GETTING_TOUGHER",
      change: change,
      changePercent: `${changePercent}%`,
      message: `Cutoff decreased by ${Math.abs(change)} ranks (${changePercent}%). Getting tougher.`
    }
  }

  return {
    trend: "STABLE",
    change: change,
    changePercent: `${changePercent}%`,
    message: "Cutoffs are relatively stable year-over-year."
  }
}
