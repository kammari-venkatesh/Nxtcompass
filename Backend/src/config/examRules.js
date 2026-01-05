/**
 * Exam Rules Configuration
 * ========================
 *
 * This file defines HARD RULES for exam-to-college mapping.
 * These rules are NON-NEGOTIABLE and must be enforced BEFORE any prediction logic.
 *
 * CRITICAL: If a college does not accept an exam, it MUST be impossible
 * for the system to output it as a recommendation.
 */

/**
 * Exam definitions with their scope and constraints
 */
export const EXAM_CONFIG = {
  // National Level Engineering Exams
  "JEE Main": {
    level: "National",
    domain: "Engineering",
    counselling: "JoSAA / CSAB",
    allowedCollegeTypes: ["NIT", "IIIT", "GFTI", "State Government (via CSAB)"],
    disallowedCollegeTypes: ["IIT", "BITS", "Private Medical", "AIIMS"],
    allowedStates: null, // All India
    notes: "JEE Main is for NITs, IIITs, and GFTIs. NOT for IITs (requires JEE Advanced) or BITS (requires BITSAT)."
  },

  "JEE Advanced": {
    level: "National",
    domain: "Engineering",
    counselling: "JoSAA",
    allowedCollegeTypes: ["IIT"],
    disallowedCollegeTypes: ["NIT", "IIIT", "BITS", "Private", "State Government", "Medical"],
    allowedStates: null, // All India
    notes: "JEE Advanced is ONLY for IITs. Other colleges do not accept this exam."
  },

  "BITSAT": {
    level: "National",
    domain: "Engineering",
    counselling: "BITS Admission",
    allowedCollegeTypes: ["BITS"],
    disallowedCollegeTypes: ["IIT", "NIT", "IIIT", "State Government", "Medical"],
    allowedStates: null, // All India
    notes: "BITSAT is ONLY for BITS campuses (Pilani, Goa, Hyderabad). No other college accepts BITSAT."
  },

  // State Level Engineering Exams - Telangana
  "TS EAMCET": {
    level: "State",
    domain: "Engineering",
    counselling: "TS EAMCET Counselling",
    allowedCollegeTypes: ["State Government", "Private", "University"],
    disallowedCollegeTypes: ["IIT", "NIT", "IIIT", "BITS", "AIIMS", "Central Government"],
    allowedStates: ["Telangana"],
    disallowedKeywords: ["IIT", "NIT", "IIIT", "BITS", "AIIMS", "JIPMER", "National Institute"],
    notes: "TS EAMCET is ONLY for Telangana state colleges. National institutes (IIT/NIT/IIIT) do NOT accept EAMCET."
  },

  // State Level Engineering Exams - Andhra Pradesh
  "AP EAMCET": {
    level: "State",
    domain: "Engineering",
    counselling: "AP EAMCET Counselling",
    allowedCollegeTypes: ["State Government", "Private", "University"],
    disallowedCollegeTypes: ["IIT", "NIT", "IIIT", "BITS", "AIIMS", "Central Government"],
    allowedStates: ["Andhra Pradesh"],
    disallowedKeywords: ["IIT", "NIT", "IIIT", "BITS", "AIIMS", "JIPMER", "National Institute"],
    notes: "AP EAMCET is ONLY for Andhra Pradesh state colleges. National institutes do NOT accept EAMCET."
  },

  // Alias for generic EAMCET (defaults to TS EAMCET)
  "EAMCET": {
    level: "State",
    domain: "Engineering",
    counselling: "TS EAMCET / AP EAMCET Counselling",
    allowedCollegeTypes: ["State Government", "Private", "University"],
    disallowedCollegeTypes: ["IIT", "NIT", "IIIT", "BITS", "AIIMS", "Central Government"],
    allowedStates: ["Telangana", "Andhra Pradesh"],
    disallowedKeywords: ["IIT", "NIT", "IIIT", "BITS", "AIIMS", "JIPMER", "National Institute"],
    notes: "EAMCET is a state-level exam for TS/AP colleges only. Please specify TS EAMCET or AP EAMCET for accurate results."
  },

  // Karnataka State Exam
  "KCET": {
    level: "State",
    domain: "Engineering",
    counselling: "KEA Counselling",
    allowedCollegeTypes: ["State Government", "Private", "University"],
    disallowedCollegeTypes: ["IIT", "NIT", "IIIT", "BITS", "AIIMS", "Central Government"],
    allowedStates: ["Karnataka"],
    disallowedKeywords: ["IIT", "NIT", "IIIT", "BITS", "AIIMS"],
    notes: "KCET is ONLY for Karnataka state colleges."
  },

  // Maharashtra State Exam
  "MHT CET": {
    level: "State",
    domain: "Engineering",
    counselling: "Maharashtra CET Cell",
    allowedCollegeTypes: ["State Government", "Private", "University"],
    disallowedCollegeTypes: ["IIT", "NIT", "IIIT", "BITS", "AIIMS", "Central Government"],
    allowedStates: ["Maharashtra"],
    disallowedKeywords: ["IIT", "NIT", "IIIT", "BITS", "AIIMS"],
    notes: "MHT CET is ONLY for Maharashtra state colleges."
  },

  // West Bengal State Exam
  "WBJEE": {
    level: "State",
    domain: "Engineering",
    counselling: "WBJEE Board",
    allowedCollegeTypes: ["State Government", "Private", "University"],
    disallowedCollegeTypes: ["IIT", "NIT", "IIIT", "BITS", "AIIMS", "Central Government"],
    allowedStates: ["West Bengal"],
    disallowedKeywords: ["IIT", "NIT", "IIIT", "BITS", "AIIMS"],
    notes: "WBJEE is ONLY for West Bengal state colleges."
  },

  // Medical Exam
  "NEET": {
    level: "National",
    domain: "Medical",
    counselling: "MCC / State Medical Counselling",
    allowedCollegeTypes: ["Medical College", "Government Medical", "Private Medical", "AIIMS", "JIPMER"],
    disallowedCollegeTypes: ["IIT", "NIT", "IIIT", "BITS", "Engineering"],
    allowedStates: null, // All India
    disallowedKeywords: ["IIT", "NIT", "IIIT", "BITS", "Engineering"],
    notes: "NEET is for medical colleges only. Engineering colleges do NOT accept NEET."
  }
}

/**
 * College type keywords for identification
 */
export const COLLEGE_TYPE_KEYWORDS = {
  "IIT": ["IIT", "Indian Institute of Technology"],
  "NIT": ["NIT", "National Institute of Technology"],
  "IIIT": ["IIIT", "Indian Institute of Information Technology"],
  "BITS": ["BITS", "Birla Institute of Technology and Science"],
  "AIIMS": ["AIIMS", "All India Institute of Medical Sciences"],
  "JIPMER": ["JIPMER"],
  "Central Government": ["Central", "National"],
  "State Government": ["State", "Government", "Autonomous"],
  "Private": ["Private", "Deemed"]
}

/**
 * Validates if a college is eligible for a given exam
 * @param {string} collegeName - The college name
 * @param {string} collegeType - The college type
 * @param {string} collegeState - The college state
 * @param {string} examName - The exam name
 * @returns {Object} - { eligible: boolean, reason: string }
 */
export const validateCollegeForExam = (collegeName, collegeType, collegeState, examName) => {
  const examConfig = EXAM_CONFIG[examName]

  if (!examConfig) {
    return {
      eligible: false,
      reason: `Unknown exam: ${examName}. Please specify a valid exam.`
    }
  }

  const upperCollegeName = (collegeName || '').toUpperCase()
  const upperCollegeType = (collegeType || '').toUpperCase()

  // Check against disallowed keywords in college name
  if (examConfig.disallowedKeywords) {
    for (const keyword of examConfig.disallowedKeywords) {
      if (upperCollegeName.includes(keyword.toUpperCase())) {
        return {
          eligible: false,
          reason: `${collegeName} does not accept ${examName}. ${examConfig.notes}`
        }
      }
    }
  }

  // Check against disallowed college types
  if (examConfig.disallowedCollegeTypes) {
    for (const disallowedType of examConfig.disallowedCollegeTypes) {
      if (upperCollegeType.includes(disallowedType.toUpperCase()) ||
          upperCollegeName.includes(disallowedType.toUpperCase())) {
        return {
          eligible: false,
          reason: `${disallowedType} colleges do not accept ${examName}. ${examConfig.notes}`
        }
      }
    }
  }

  // Check state restriction for state-level exams
  if (examConfig.allowedStates && collegeState) {
    const upperCollegeState = collegeState.toUpperCase()
    const isStateAllowed = examConfig.allowedStates.some(
      state => upperCollegeState.includes(state.toUpperCase())
    )

    if (!isStateAllowed) {
      return {
        eligible: false,
        reason: `${collegeName} is in ${collegeState}, but ${examName} is only for colleges in ${examConfig.allowedStates.join(' / ')}.`
      }
    }
  }

  return {
    eligible: true,
    reason: `${collegeName} accepts ${examName} for admission.`
  }
}

/**
 * Gets the exam configuration
 * @param {string} examName - The exam name
 * @returns {Object|null} - Exam config or null
 */
export const getExamConfig = (examName) => {
  // Try exact match first
  if (EXAM_CONFIG[examName]) {
    return EXAM_CONFIG[examName]
  }

  // Try case-insensitive match
  const upperExam = examName.toUpperCase()
  for (const [key, config] of Object.entries(EXAM_CONFIG)) {
    if (key.toUpperCase() === upperExam) {
      return config
    }
  }

  // Try partial match for common variations
  if (upperExam.includes('EAMCET')) {
    if (upperExam.includes('TS') || upperExam.includes('TELANGANA')) {
      return EXAM_CONFIG['TS EAMCET']
    }
    if (upperExam.includes('AP') || upperExam.includes('ANDHRA')) {
      return EXAM_CONFIG['AP EAMCET']
    }
    return EXAM_CONFIG['EAMCET']
  }

  return null
}

/**
 * Filters colleges based on exam rules
 * @param {Array} colleges - Array of college objects
 * @param {string} examName - The exam name
 * @param {string} targetCity - Optional city filter
 * @param {string} targetState - Optional state filter
 * @returns {Object} - { eligible: [], rejected: [] }
 */
export const filterCollegesByExam = (colleges, examName, targetCity = null, targetState = null) => {
  const examConfig = getExamConfig(examName)

  if (!examConfig) {
    return {
      eligible: [],
      rejected: colleges.map(c => ({
        ...c,
        rejectionReason: `Unknown exam: ${examName}`
      })),
      error: `Unknown exam: ${examName}. Supported exams: ${Object.keys(EXAM_CONFIG).join(', ')}`
    }
  }

  const eligible = []
  const rejected = []

  for (const college of colleges) {
    const collegeName = college.name || college.collegeName || ''
    const collegeType = college.type || college.collegeType || ''
    const collegeState = college.state || ''
    const collegeCity = college.city || ''

    // Validate against exam rules
    const validation = validateCollegeForExam(collegeName, collegeType, collegeState, examName)

    if (!validation.eligible) {
      rejected.push({
        ...college,
        rejectionReason: validation.reason
      })
      continue
    }

    // Apply city filter if specified
    if (targetCity) {
      const upperTargetCity = targetCity.toUpperCase()
      const upperCollegeCity = collegeCity.toUpperCase()

      if (!upperCollegeCity.includes(upperTargetCity) && !upperTargetCity.includes(upperCollegeCity)) {
        rejected.push({
          ...college,
          rejectionReason: `College is in ${collegeCity}, not in ${targetCity}.`
        })
        continue
      }
    }

    // Apply state filter if specified (for state-level exams)
    if (targetState) {
      const upperTargetState = targetState.toUpperCase()
      const upperCollegeState = collegeState.toUpperCase()

      if (!upperCollegeState.includes(upperTargetState) && !upperTargetState.includes(upperCollegeState)) {
        rejected.push({
          ...college,
          rejectionReason: `College is in ${collegeState}, not in ${targetState}.`
        })
        continue
      }
    }

    eligible.push(college)
  }

  return {
    eligible,
    rejected,
    examInfo: {
      exam: examName,
      level: examConfig.level,
      domain: examConfig.domain,
      counselling: examConfig.counselling,
      notes: examConfig.notes
    }
  }
}

export default {
  EXAM_CONFIG,
  COLLEGE_TYPE_KEYWORDS,
  validateCollegeForExam,
  getExamConfig,
  filterCollegesByExam
}
