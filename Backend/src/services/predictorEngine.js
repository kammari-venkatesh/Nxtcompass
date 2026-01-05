import { normalizeRankForYear, calculateProbabilityPercentage } from "./cutoffAnalyzer.js"

/**
 * Predictor Engine
 * ----------------
 * Input:
 *  - rank (required, positive number)
 *  - category (required)
 *  - homeState (required for state quota calculations)
 *  - preferredBranches[] (optional)
 *  - cutoffs (required, array from database)
 *
 * Output:
 *  - list of colleges with probability score
 *
 * VALIDATION RULES:
 *  - Rank must be a positive integer
 *  - Negative/zero/decimal ranks are normalized or rejected
 *  - Cutoff data is required
 *
 * MERIT FALLBACK LOGIC:
 *  - Reserved category students (SC/ST/OBC/EWS) can also qualify for General/OPEN seats
 *  - If a student's rank is good enough for General category, include those options
 *  - This prevents "No colleges found" when category-specific data is missing
 */

/**
 * Category priority for merit fallback
 * A student in a reserved category can also compete for higher categories
 */
const CATEGORY_FALLBACK_MAP = {
  'SC': ['SC', 'General', 'OPEN'],
  'ST': ['ST', 'General', 'OPEN'],
  'OBC': ['OBC', 'General', 'OPEN'],
  'EWS': ['EWS', 'General', 'OPEN'],
  'PwD': ['PwD', 'General', 'OPEN'],
  'General': ['General', 'OPEN'],
  'OPEN': ['General', 'OPEN']
}

/**
 * Validates and normalizes the input rank
 * @param {number} rank - The user's rank
 * @returns {number} - Normalized rank (floored positive integer)
 * @throws {Error} - If rank is invalid
 */
const validateRank = (rank) => {
  // Check if rank is provided
  if (rank === undefined || rank === null) {
    throw new Error("Rank is required for prediction")
  }

  // Convert to number if string
  const numericRank = typeof rank === 'string' ? parseFloat(rank) : rank

  // Check if it's a valid number
  if (isNaN(numericRank)) {
    throw new Error("Invalid rank: must be a numeric value")
  }

  // Handle negative ranks
  if (numericRank < 0) {
    throw new Error("Invalid rank: rank cannot be negative")
  }

  // Handle zero rank
  if (numericRank === 0) {
    throw new Error("Invalid rank: rank cannot be zero")
  }

  // Normalize decimal ranks by flooring
  return Math.floor(numericRank)
}

/**
 * Gets eligible categories for a student based on their category
 * Implements MERIT FALLBACK: Reserved category students can also qualify for General seats
 * @param {string} userCategory - The student's category
 * @returns {string[]} - Array of categories to check
 */
const getEligibleCategories = (userCategory) => {
  const normalized = userCategory?.toUpperCase() || 'GENERAL'
  return CATEGORY_FALLBACK_MAP[normalized] || CATEGORY_FALLBACK_MAP[userCategory] || ['General', 'OPEN']
}

/**
 * Checks if a cutoff category matches any of the eligible categories
 * @param {string} cutoffCategory - The category from cutoff data
 * @param {string[]} eligibleCategories - Array of categories the student can apply for
 * @returns {boolean}
 */
const isCategoryEligible = (cutoffCategory, eligibleCategories) => {
  const cutoffCatLower = (cutoffCategory || '').toLowerCase()
  return eligibleCategories.some(cat => {
    const catLower = cat.toLowerCase()
    return cutoffCatLower === catLower ||
           cutoffCatLower.includes(catLower) ||
           catLower.includes(cutoffCatLower)
  })
}

/**
 * Main prediction function with MERIT FALLBACK
 *
 * KEY IMPROVEMENT: Reserved category students (SC/ST/OBC/EWS) can also qualify
 * for General/OPEN seats if their rank is good enough. This prevents "No colleges found"
 * when category-specific cutoff data is missing.
 */
export const predictColleges = ({
  rank,
  category,
  homeState,
  preferredBranches = [],
  cutoffs,
  targetYear = new Date().getFullYear(), // For rank normalization
}) => {
  // Input validation
  const normalizedRank = validateRank(rank)

  if (!cutoffs || !Array.isArray(cutoffs) || cutoffs.length === 0) {
    return []
  }

  if (!category) {
    throw new Error("Category is required for prediction")
  }

  // Get all categories this student is eligible for (MERIT FALLBACK)
  const eligibleCategories = getEligibleCategories(category)

  const results = []
  const seenCollegeBranch = new Set() // Prevent duplicates

  cutoffs.forEach((cutoff) => {
    // Check if cutoff category is in the eligible list (MERIT FALLBACK)
    if (!isCategoryEligible(cutoff.category, eligibleCategories)) return

    // branch preference filter (optional) - case insensitive
    if (preferredBranches.length > 0) {
      const branchLower = cutoff.branch?.toLowerCase() || ''
      const matchesBranch = preferredBranches.some(pref =>
        branchLower.includes(pref.toLowerCase()) ||
        pref.toLowerCase().includes(branchLower)
      )
      if (!matchesBranch) return
    }

    // Use closingRank as the main cutoff rank
    let cutoffRank = cutoff.closingRank || cutoff.openingRank
    if (!cutoffRank) return // Skip if no rank data

    // Normalize cutoff rank if from a previous year
    // Apply inflation factor if cutoff data is from previous year
    const cutoffYear = cutoff.year || new Date().getFullYear() - 1
    if (cutoffYear < targetYear) {
      cutoffRank = normalizeRankForYear(cutoffRank, cutoffYear, targetYear)
    }

    // Use ENHANCED probability calculation (percentage-based)
    const analysis = calculateProbabilityPercentage(normalizedRank, cutoffRank)

    // Skip if probability is too low (< 10%)
    if (analysis.probability < 10) return

    // Create unique key for college+branch to prevent duplicates
    const collegeId = cutoff.college?._id || cutoff.college
    const uniqueKey = `${collegeId}-${cutoff.branch}`

    // If we already have this college+branch, keep only the better probability
    if (seenCollegeBranch.has(uniqueKey)) {
      const existingIndex = results.findIndex(r =>
        (r.collegeId === collegeId || r.collegeId?.toString() === collegeId?.toString()) &&
        r.branch === cutoff.branch
      )
      if (existingIndex >= 0 && results[existingIndex].probability >= analysis.probability) {
        return // Skip if existing entry has better or equal probability
      } else if (existingIndex >= 0) {
        results.splice(existingIndex, 1) // Remove existing to replace with better
      }
    }
    seenCollegeBranch.add(uniqueKey)

    // Home state advantage calculation
    let finalProbability = analysis.probability
    let stateQuotaNote = null

    // Check if college state matches home state (if college data is populated)
    if (homeState && cutoff.college?.state) {
      const collegeState = cutoff.college.state.toLowerCase()
      const studentState = homeState.toLowerCase()

      if (collegeState === studentState) {
        // Home state candidates have better chances in state quota
        finalProbability = Math.min(finalProbability + 5, 95)
        stateQuotaNote = "Home state quota advantage applied"
      }
    }

    // Determine which category was used for this prediction
    const categoryUsed = cutoff.category
    const isMeritSeat = categoryUsed?.toLowerCase() === 'general' ||
                        categoryUsed?.toLowerCase() === 'open'
    const categoryNote = isMeritSeat && category?.toLowerCase() !== 'general'
      ? `Eligible via Merit/General quota (your ${category} rank qualifies)`
      : null

    results.push({
      collegeId: collegeId,
      branch: cutoff.branch,
      cutoffRank: cutoffRank,
      originalCutoffRank: cutoff.closingRank || cutoff.openingRank,
      yourRank: normalizedRank,
      margin: cutoffRank - normalizedRank,
      probability: finalProbability,
      label: analysis.label,
      reason: analysis.reason,
      year: cutoff.year,
      stateQuotaNote,
      categoryUsed,
      categoryNote,
      quotaType: cutoff.quotaType || 'All India'
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

/**
 * Validate if a rank is reasonable for a given exam
 * @param {string} exam - Exam name
 * @param {number} rank - User's rank
 * @returns {Object} - { valid: boolean, message: string }
 */
export const validateRankForExam = (exam, rank) => {
  const normalizedRank = validateRank(rank)
  const examUpper = exam?.toUpperCase() || ''

  // JEE Advanced typically has ~30,000 qualifiers
  if (examUpper.includes('JEE ADVANCED') || examUpper.includes('IIT')) {
    if (normalizedRank > 50000) {
      return {
        valid: false,
        message: `JEE Advanced rank ${normalizedRank} seems unrealistic. JEE Advanced typically has fewer than 50,000 qualifiers.`
      }
    }
  }

  // JEE Main can have ranks up to ~1,000,000
  if (examUpper.includes('JEE MAIN')) {
    if (normalizedRank > 1500000) {
      return {
        valid: false,
        message: `JEE Main rank ${normalizedRank} seems too high. Please verify your rank.`
      }
    }
  }

  // BITSAT scores are typically out of 390
  if (examUpper.includes('BITSAT')) {
    // For BITSAT, "rank" might actually be a score
    if (normalizedRank > 390 && normalizedRank < 10000) {
      return {
        valid: false,
        message: `BITSAT score ${normalizedRank} is out of range. BITSAT is scored out of 390.`
      }
    }
  }

  return { valid: true, message: 'Rank is valid' }
}
