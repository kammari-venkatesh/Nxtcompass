import College from '../../models/College.model.js'
import Cutoff from '../../models/Cutoff.model.js'
import logger from '../../utils/logger.js'
import { predictColleges } from '../predictorEngine.js'
import {
  getExamConfig,
  validateCollegeForExam,
  EXAM_CONFIG
} from '../../config/examRules.js'

/**
 * OpenAI Function Calling Tools for College Counselor
 *
 * These tools allow the AI to query the database for real college data
 * instead of hallucinating information.
 *
 * ARCHITECTURE: Deterministic Tool-User Approach
 * The LLM acts as an Orchestrator that:
 * 1. Extracts & validates user intent against strict rules
 * 2. Calls these tools to get facts
 * 3. Synthesizes the tool output into the required format
 *
 * CRITICAL: Exam-based gating is enforced at this layer.
 * If a college does not accept an exam, it CANNOT appear in results.
 */

// Tool Definitions for OpenAI
export const tools = [
  {
    type: "function",
    function: {
      name: "predict_admission",
      description: "Calculates comprehensive admission probability based on rank, category, and home state using historical cutoff data. Returns categorized results (safe/moderate/ambitious). Use this as the PRIMARY tool for college predictions.",
      parameters: {
        type: "object",
        properties: {
          exam: {
            type: "string",
            enum: ["JEE Main", "JEE Advanced", "BITSAT", "TS EAMCET", "AP EAMCET", "NEET", "KCET", "MHT CET", "WBJEE"],
            description: "The entrance exam taken by the student."
          },
          rank: {
            type: "number",
            description: "The student's exam rank (must be a positive integer)."
          },
          category: {
            type: "string",
            enum: ["General", "EWS", "OBC", "SC", "ST", "PwD"],
            description: "The student's reservation category."
          },
          homeState: {
            type: "string",
            description: "The student's home state (e.g., 'Telangana', 'Maharashtra', 'Karnataka'). Important for state quota eligibility."
          },
          gender: {
            type: "string",
            enum: ["Male", "Female"],
            description: "Student's gender for supernumerary seat eligibility. Optional."
          },
          preferredBranches: {
            type: "array",
            items: { type: "string" },
            description: "List of preferred branches (e.g., ['Computer Science', 'Electronics']). Optional."
          },
          targetCity: {
            type: "string",
            description: "Target city for college search (e.g., 'Hyderabad', 'Bangalore'). Optional but recommended for location-specific queries."
          }
        },
        required: ["exam", "rank", "category", "homeState"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "check_college_eligibility",
      description: "Verifies if a specific college accepts a specific exam. Use this BEFORE predictions when a user asks about a specific college to validate exam compatibility. E.g., BITS requires BITSAT, IITs require JEE Advanced.",
      parameters: {
        type: "object",
        properties: {
          collegeName: {
            type: "string",
            description: "The college name to check (e.g., 'BITS Pilani', 'IIT Bombay', 'NIT Warangal')."
          },
          examName: {
            type: "string",
            description: "The exam the student has taken (e.g., 'JEE Main', 'JEE Advanced', 'BITSAT')."
          }
        },
        required: ["collegeName", "examName"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "search_colleges_by_rank",
      description: "DEPRECATED - Use 'predict_admission' instead. This tool requires exam context. Finds colleges based on student rank, category, exam, and preferred branch.",
      parameters: {
        type: "object",
        properties: {
          exam: {
            type: "string",
            enum: ["JEE Main", "JEE Advanced", "BITSAT", "TS EAMCET", "AP EAMCET", "NEET", "KCET", "MHT CET", "WBJEE"],
            description: "REQUIRED: The entrance exam taken by the student. A rank has no meaning without exam context."
          },
          rank: {
            type: "number",
            description: "The student's exam rank (must be a positive number)."
          },
          category: {
            type: "string",
            enum: ["General", "EWS", "OBC", "SC", "ST", "PwD"],
            description: "The student's reservation category."
          },
          homeState: {
            type: "string",
            description: "The student's home state. Required for accurate predictions."
          },
          branch: {
            type: "string",
            description: "Preferred branch (e.g., 'Computer Science', 'Electronics', 'Mechanical'). Optional."
          },
          limit: {
            type: "number",
            description: "Maximum number of results to return. Default is 5."
          }
        },
        required: ["exam", "rank", "category", "homeState"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_college_details",
      description: "Retrieves detailed information about a specific college including fees, branches, location, and NIRF ranking.",
      parameters: {
        type: "object",
        properties: {
          collegeName: {
            type: "string",
            description: "The name or acronym of the college (e.g., 'IIT Bombay', 'NIT Warangal', 'BITS')."
          }
        },
        required: ["collegeName"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "compare_colleges",
      description: "Compares two or more colleges based on fees, ranking, and available branches.",
      parameters: {
        type: "object",
        properties: {
          collegeNames: {
            type: "array",
            items: { type: "string" },
            description: "Array of college names to compare (e.g., ['IIT Delhi', 'NIT Trichy'])."
          }
        },
        required: ["collegeNames"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_cutoff_data",
      description: "Gets cutoff rank data for a specific college and branch combination.",
      parameters: {
        type: "object",
        properties: {
          collegeName: {
            type: "string",
            description: "The college name or acronym."
          },
          branch: {
            type: "string",
            description: "The branch to get cutoff for. Optional - returns all branches if not specified."
          },
          category: {
            type: "string",
            enum: ["General", "EWS", "OBC", "SC", "ST", "PwD"],
            description: "The category to get cutoff for. Optional."
          }
        },
        required: ["collegeName"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_affordable_colleges",
      description: "Finds colleges with fees below a certain threshold.",
      parameters: {
        type: "object",
        properties: {
          maxFees: {
            type: "number",
            description: "Maximum annual fees in rupees (e.g., 200000 for 2 lakhs)."
          },
          category: {
            type: "string",
            enum: ["general", "obc", "sc", "st"],
            description: "Fee category to check. Default is 'general'."
          },
          limit: {
            type: "number",
            description: "Maximum number of results. Default is 5."
          }
        },
        required: []
      }
    }
  }
]

// Tool Implementations
export const toolsImplementation = {
  /**
   * PRIMARY PREDICTION TOOL
   * Calculates comprehensive admission probability using predictor engine
   *
   * CRITICAL: This function enforces EXAM-BASED GATING.
   * Colleges that don't accept the specified exam are NEVER returned.
   */
  predict_admission: async ({ exam, rank, category, homeState, gender, preferredBranches = [], targetCity = null }) => {
    try {
      logger.info(`Tool: predict_admission - Exam: ${exam}, Rank: ${rank}, Category: ${category}, HomeState: ${homeState}, City: ${targetCity || 'Any'}`)

      // ============================================
      // STEP 1: VALIDATE EXAM (HARD GATE)
      // ============================================
      const examConfig = getExamConfig(exam)
      if (!examConfig) {
        return JSON.stringify({
          error: true,
          message: `Unknown exam: "${exam}". Supported exams: ${Object.keys(EXAM_CONFIG).join(', ')}`,
          suggestion: "Please specify a valid exam name."
        })
      }

      logger.info(`Exam Config: ${exam} - Level: ${examConfig.level}, Domain: ${examConfig.domain}`)

      // ============================================
      // STEP 2: INPUT VALIDATION
      // ============================================
      if (!rank || typeof rank !== 'number') {
        return JSON.stringify({
          error: true,
          message: "Invalid rank: Please provide a numeric rank value."
        })
      }

      const normalizedRank = Math.floor(rank)
      if (normalizedRank <= 0) {
        return JSON.stringify({
          error: true,
          message: "Invalid rank: Rank must be a positive number greater than zero."
        })
      }

      // Exam-specific rank validation
      if (exam === "JEE Advanced" && normalizedRank > 50000) {
        return JSON.stringify({
          error: true,
          message: `JEE Advanced rank ${normalizedRank} seems unrealistic. JEE Advanced typically has fewer than 50,000 qualifiers.`
        })
      }

      // ============================================
      // STEP 3: STATE VALIDATION FOR STATE-LEVEL EXAMS
      // ============================================
      if (examConfig.level === "State" && examConfig.allowedStates) {
        // For state exams, if targetCity is specified, log it
        if (targetCity) {
          logger.info(`City filter applied: ${targetCity} for ${exam}`)
        }
      }

      // ============================================
      // STEP 4: FETCH CUTOFFS FROM DATABASE
      // MERIT FALLBACK: Fetch cutoffs for ALL eligible categories
      // Reserved category students (SC/ST/OBC) can also qualify for General seats
      // ============================================
      const CATEGORY_FALLBACK_MAP = {
        'SC': ['SC', 'General', 'OPEN'],
        'ST': ['ST', 'General', 'OPEN'],
        'OBC': ['OBC', 'General', 'OPEN'],
        'EWS': ['EWS', 'General', 'OPEN'],
        'PwD': ['PwD', 'General', 'OPEN'],
        'General': ['General', 'OPEN'],
        'OPEN': ['General', 'OPEN']
      }

      // Get all categories this student is eligible for
      const eligibleCategories = CATEGORY_FALLBACK_MAP[category] || [category, 'General', 'OPEN']

      // Fetch cutoffs for ALL eligible categories (enables Merit Fallback)
      const cutoffs = await Cutoff.find({
        category: { $in: eligibleCategories.map(c => new RegExp(`^${c}$`, 'i')) }
      })
        .populate('college', 'name acronym city state type nireRank fees branches')
        .lean()

      logger.info(`Merit Fallback: Fetched ${cutoffs.length} cutoffs for categories: ${eligibleCategories.join(', ')}`)

      if (cutoffs.length === 0) {
        return JSON.stringify({
          found: false,
          message: `No cutoff data available for ${category} category or General/OPEN categories.`,
          inputSummary: { exam, rank: normalizedRank, category, homeState },
          examInfo: {
            exam: exam,
            level: examConfig.level,
            domain: examConfig.domain,
            notes: examConfig.notes
          },
          suggestion: "This could mean we don't have data for these colleges yet. Try specifying a different exam or check back later."
        })
      }

      // ============================================
      // STEP 5: APPLY EXAM-BASED FILTERING (CRITICAL)
      // This is the HARD GATE that prevents invalid colleges
      // ============================================
      const examFilteredCutoffs = cutoffs.filter(cutoff => {
        if (!cutoff.college) return false

        const collegeName = cutoff.college.name || ''
        const collegeType = cutoff.college.type || ''
        const collegeState = cutoff.college.state || ''
        const collegeCity = cutoff.college.city || ''

        // Validate against exam rules
        const validation = validateCollegeForExam(collegeName, collegeType, collegeState, exam)
        if (!validation.eligible) {
          logger.debug(`Filtered out: ${collegeName} - ${validation.reason}`)
          return false
        }

        // Apply city filter if specified
        if (targetCity) {
          const upperTargetCity = targetCity.toUpperCase()
          const upperCollegeCity = collegeCity.toUpperCase()
          if (!upperCollegeCity.includes(upperTargetCity) && !upperTargetCity.includes(upperCollegeCity)) {
            logger.debug(`Filtered out: ${collegeName} - City mismatch (${collegeCity} != ${targetCity})`)
            return false
          }
        }

        // For state-level exams, enforce state restriction
        if (examConfig.level === "State" && examConfig.allowedStates) {
          const isCollegeInAllowedState = examConfig.allowedStates.some(
            state => collegeState.toUpperCase().includes(state.toUpperCase())
          )
          if (!isCollegeInAllowedState) {
            logger.debug(`Filtered out: ${collegeName} - State restriction (${collegeState} not in ${examConfig.allowedStates.join(', ')})`)
            return false
          }
        }

        return true
      })

      logger.info(`Exam filter: ${cutoffs.length} cutoffs -> ${examFilteredCutoffs.length} eligible for ${exam}`)

      if (examFilteredCutoffs.length === 0) {
        // Provide helpful message about why no results
        let noResultsMessage = `No colleges found that accept ${exam}`
        if (targetCity) {
          noResultsMessage += ` in ${targetCity}`
        }
        noResultsMessage += `. ${examConfig.notes}`

        return JSON.stringify({
          found: false,
          message: noResultsMessage,
          inputSummary: { exam, rank: normalizedRank, category, homeState, targetCity },
          examInfo: {
            exam: exam,
            level: examConfig.level,
            domain: examConfig.domain,
            counselling: examConfig.counselling,
            allowedCollegeTypes: examConfig.allowedCollegeTypes,
            disallowedCollegeTypes: examConfig.disallowedCollegeTypes,
            notes: examConfig.notes
          },
          suggestions: [
            examConfig.level === "State"
              ? `${exam} only covers colleges in ${examConfig.allowedStates?.join(' / ')}`
              : null,
            examConfig.disallowedCollegeTypes
              ? `${examConfig.disallowedCollegeTypes.join(', ')} colleges do NOT accept ${exam}`
              : null,
            "Please verify you're searching for colleges that accept this exam"
          ].filter(Boolean)
        })
      }

      // ============================================
      // STEP 6: USE PREDICTOR ENGINE WITH EXAM-FILTERED DATA
      // ============================================
      const predictions = predictColleges({
        rank: normalizedRank,
        category,
        homeState,
        preferredBranches,
        cutoffs: examFilteredCutoffs  // USE FILTERED CUTOFFS, NOT ALL CUTOFFS
      })

      if (predictions.length === 0) {
        return JSON.stringify({
          found: false,
          message: `No eligible colleges found for rank ${normalizedRank} in ${category} category. Your rank may be below the available cutoffs.`,
          inputSummary: { exam, rank: normalizedRank, category, homeState },
          suggestions: [
            "Consider looking at private colleges",
            "Check spot round or special counselling options",
            "Consider other state-level exams if applicable"
          ]
        })
      }

      // Categorize results
      const safe = predictions.filter(p => p.probability >= 80).slice(0, 5)
      const moderate = predictions.filter(p => p.probability >= 50 && p.probability < 80).slice(0, 5)
      const ambitious = predictions.filter(p => p.probability < 50 && p.probability >= 20).slice(0, 5)

      // Enrich results with college details (including Merit Fallback info)
      const enrichResult = async (pred) => {
        const college = await College.findById(pred.collegeId).lean()
        return {
          collegeName: college?.name || 'Unknown',
          acronym: college?.acronym || '',
          branch: pred.branch,
          cutoffRank: pred.cutoffRank,
          yourRank: pred.yourRank,
          margin: pred.margin,
          probability: pred.probability,
          chanceLabel: pred.label,
          reason: pred.reason,
          location: college ? `${college.city}, ${college.state}` : 'N/A',
          collegeType: college?.type || 'N/A',
          year: pred.year,
          // Merit Fallback info
          categoryUsed: pred.categoryUsed || category,
          categoryNote: pred.categoryNote || null,
          stateQuotaNote: pred.stateQuotaNote || null
        }
      }

      const [safeResults, moderateResults, ambitiousResults] = await Promise.all([
        Promise.all(safe.map(enrichResult)),
        Promise.all(moderate.map(enrichResult)),
        Promise.all(ambitious.map(enrichResult))
      ])

      // Count how many results came via Merit Fallback (General/OPEN seats)
      const meritFallbackCount = predictions.filter(p =>
        p.categoryUsed?.toLowerCase() === 'general' ||
        p.categoryUsed?.toLowerCase() === 'open'
      ).length

      return JSON.stringify({
        found: true,
        inputSummary: {
          exam,
          rank: normalizedRank,
          category,
          homeState,
          targetCity: targetCity || 'Any',
          gender: gender || 'Not specified',
          preferredBranches: preferredBranches.length > 0 ? preferredBranches : 'Any'
        },
        examInfo: {
          exam: exam,
          level: examConfig.level,
          domain: examConfig.domain,
          counselling: examConfig.counselling,
          notes: examConfig.notes
        },
        results: {
          safe: safeResults,
          moderate: moderateResults,
          ambitious: ambitiousResults
        },
        totalFound: predictions.length,
        displayedCount: safeResults.length + moderateResults.length + ambitiousResults.length,
        meritFallbackInfo: meritFallbackCount > 0 ? {
          enabled: true,
          generalSeatsIncluded: meritFallbackCount,
          note: `${meritFallbackCount} options include General/OPEN seats where your ${category} rank qualifies on merit`
        } : null,
        filterApplied: {
          totalCutoffsInDB: cutoffs.length,
          afterExamFilter: examFilteredCutoffs.length,
          categoriesSearched: eligibleCategories,
          note: `Only showing colleges that accept ${exam}`
        }
      })
    } catch (error) {
      logger.error('Tool error - predict_admission:', error)
      return JSON.stringify({
        error: true,
        message: "Error calculating predictions. " + error.message
      })
    }
  },

  /**
   * ELIGIBILITY CHECKER
   * Verifies if a college accepts a specific exam
   * Uses the centralized exam rules from examRules.js
   */
  check_college_eligibility: async ({ collegeName, examName }) => {
    try {
      logger.info(`Tool: check_college_eligibility - College: ${collegeName}, Exam: ${examName}`)

      const upperCollegeName = collegeName.toUpperCase()

      // First, check the exam config to see what college types this exam covers
      const examConfig = getExamConfig(examName)

      // Check for state-level exam + national college mismatch
      if (examConfig && examConfig.level === "State") {
        // State exams cannot be used for national institutes
        const nationalKeywords = ["IIT", "NIT", "IIIT", "BITS", "AIIMS", "JIPMER"]

        for (const keyword of nationalKeywords) {
          if (upperCollegeName.includes(keyword)) {
            return JSON.stringify({
              eligible: false,
              collegeName: collegeName,
              examProvided: examName,
              requiredExam: keyword === "IIT" ? "JEE Advanced" :
                           keyword === "BITS" ? "BITSAT" :
                           keyword === "AIIMS" || keyword === "JIPMER" ? "NEET" : "JEE Main",
              message: `${collegeName} is a national institute and does NOT accept ${examName}. ${examConfig.notes}`,
              examInfo: {
                exam: examName,
                level: examConfig.level,
                allowedCollegeTypes: examConfig.allowedCollegeTypes,
                disallowedCollegeTypes: examConfig.disallowedCollegeTypes
              },
              suggestion: `${examName} only covers colleges in ${examConfig.allowedStates?.join(' / ')}. For ${collegeName}, you need a different exam.`
            })
          }
        }
      }

      // Use the validateCollegeForExam from examRules
      // First try to find the college in DB to get its type and state
      const college = await College.findOne({
        $or: [
          { name: new RegExp(collegeName, 'i') },
          { acronym: new RegExp(collegeName, 'i') }
        ]
      }).lean()

      if (college) {
        const validation = validateCollegeForExam(
          college.name,
          college.type || '',
          college.state || '',
          examName
        )

        if (!validation.eligible) {
          return JSON.stringify({
            eligible: false,
            collegeName: college.name,
            collegeLocation: `${college.city}, ${college.state}`,
            examProvided: examName,
            message: validation.reason,
            examInfo: examConfig ? {
              exam: examName,
              level: examConfig.level,
              allowedCollegeTypes: examConfig.allowedCollegeTypes
            } : null
          })
        }

        return JSON.stringify({
          eligible: true,
          collegeName: college.name,
          collegeLocation: `${college.city}, ${college.state}`,
          collegeType: college.type,
          examProvided: examName,
          message: validation.reason,
          examInfo: examConfig ? {
            exam: examName,
            level: examConfig.level,
            counselling: examConfig.counselling
          } : null
        })
      }

      // College not in DB - use keyword-based rules
      const eligibilityRules = {
        "BITS": {
          acceptedExams: ["BITSAT"],
          message: "BITS campuses (Pilani, Goa, Hyderabad) only accept BITSAT scores for admission."
        },
        "IIT": {
          acceptedExams: ["JEE Advanced"],
          message: "IITs only accept JEE Advanced rank for admission. JEE Main is only a qualifying exam for JEE Advanced."
        },
        "NIT": {
          acceptedExams: ["JEE Main"],
          message: "NITs accept JEE Main rank for admission through JoSAA counselling. They do NOT accept state exams like EAMCET."
        },
        "IIIT": {
          acceptedExams: ["JEE Main"],
          message: "IIITs accept JEE Main rank for admission through JoSAA counselling. They do NOT accept state exams."
        },
        "AIIMS": {
          acceptedExams: ["NEET"],
          message: "AIIMS accepts NEET scores for medical admissions only."
        }
      }

      for (const [key, rule] of Object.entries(eligibilityRules)) {
        if (upperCollegeName.includes(key)) {
          const upperExamName = examName.toUpperCase()
          const isAllowed = rule.acceptedExams.some(exam =>
            upperExamName.includes(exam.toUpperCase())
          )

          if (!isAllowed) {
            return JSON.stringify({
              eligible: false,
              collegeName: collegeName,
              examProvided: examName,
              requiredExam: rule.acceptedExams.join(" or "),
              message: rule.message,
              suggestion: `To be eligible for ${collegeName}, you need to appear for ${rule.acceptedExams.join(" or ")}, not ${examName}.`
            })
          }

          return JSON.stringify({
            eligible: true,
            collegeName: collegeName,
            examProvided: examName,
            message: `${collegeName} accepts ${examName} for admission.`,
            note: rule.message
          })
        }
      }

      return JSON.stringify({
        eligible: null,
        collegeName: collegeName,
        examProvided: examName,
        message: `College "${collegeName}" not found in our database. Cannot verify eligibility.`,
        suggestion: "Please check the spelling or try using the official college name/acronym."
      })
    } catch (error) {
      logger.error('Tool error - check_college_eligibility:', error)
      return JSON.stringify({
        error: true,
        message: "Error checking eligibility. " + error.message
      })
    }
  },

  /**
   * Search colleges based on rank and category
   * UPDATED: Now requires exam parameter and enforces exam-based filtering
   */
  search_colleges_by_rank: async ({ exam, rank, category, homeState, branch, limit = 5 }) => {
    try {
      logger.info(`Tool: search_colleges_by_rank - Exam: ${exam}, Rank: ${rank}, Category: ${category}, HomeState: ${homeState}, Branch: ${branch || 'Any'}`)

      // ============================================
      // CRITICAL: EXAM VALIDATION (BLOCKING GATE)
      // ============================================
      if (!exam) {
        return JSON.stringify({
          error: true,
          message: "EXAM IS REQUIRED. A rank has no meaning without knowing which exam it belongs to.",
          requiredAction: "Please specify the exam (JEE Main, JEE Advanced, TS EAMCET, AP EAMCET, BITSAT, etc.)",
          hint: "Use 'predict_admission' tool instead - it provides better results with exam-based filtering."
        })
      }

      const examConfig = getExamConfig(exam)
      if (!examConfig) {
        return JSON.stringify({
          error: true,
          message: `Unknown exam: "${exam}". Supported exams: ${Object.keys(EXAM_CONFIG).join(', ')}`,
          suggestion: "Please specify a valid exam name."
        })
      }

      // Validate rank
      if (!rank || rank <= 0) {
        return JSON.stringify({
          error: true,
          message: "Please provide a valid positive rank number."
        })
      }

      // Validate homeState
      if (!homeState) {
        return JSON.stringify({
          error: true,
          message: "Home state is required for accurate predictions (needed for state quota eligibility)."
        })
      }

      // Build query - find cutoffs where closing rank is greater than or equal to student rank
      const query = {
        category: category,
        closingRank: { $gte: rank }
      }

      if (branch) {
        query.branch = new RegExp(branch, 'i')
      }

      const cutoffs = await Cutoff.find(query)
        .populate('college', 'name acronym city state type nireRank fees branches')
        .sort({ closingRank: 1 })
        .lean()

      // ============================================
      // APPLY EXAM-BASED FILTERING (CRITICAL)
      // ============================================
      const examFilteredCutoffs = cutoffs.filter(cutoff => {
        if (!cutoff.college) return false

        const collegeName = cutoff.college.name || ''
        const collegeType = cutoff.college.type || ''
        const collegeState = cutoff.college.state || ''

        // Validate against exam rules
        const validation = validateCollegeForExam(collegeName, collegeType, collegeState, exam)
        if (!validation.eligible) {
          logger.debug(`Filtered out: ${collegeName} - ${validation.reason}`)
          return false
        }

        // For state-level exams, enforce state restriction
        if (examConfig.level === "State" && examConfig.allowedStates) {
          const isCollegeInAllowedState = examConfig.allowedStates.some(
            state => collegeState.toUpperCase().includes(state.toUpperCase())
          )
          if (!isCollegeInAllowedState) {
            return false
          }
        }

        return true
      })

      logger.info(`Exam filter: ${cutoffs.length} cutoffs -> ${examFilteredCutoffs.length} eligible for ${exam}`)

      if (examFilteredCutoffs.length === 0) {
        return JSON.stringify({
          found: false,
          message: `No colleges found for ${exam} rank ${rank} in ${category} category${branch ? ` for ${branch}` : ''}.`,
          examInfo: {
            exam: exam,
            level: examConfig.level,
            notes: examConfig.notes
          },
          suggestions: [
            `${exam} covers: ${examConfig.allowedCollegeTypes?.join(', ') || 'specific colleges'}`,
            examConfig.level === "State" ? `Only colleges in ${examConfig.allowedStates?.join(' / ')} are eligible` : null,
            "Try a different branch or check if your rank is within cutoff range"
          ].filter(Boolean)
        })
      }

      const results = examFilteredCutoffs.slice(0, limit).map(c => ({
        collegeName: c.college?.name || 'Unknown',
        acronym: c.college?.acronym || '',
        branch: c.branch,
        cutoffRank: c.closingRank,
        openingRank: c.openingRank || 'N/A',
        location: `${c.college?.city || ''}, ${c.college?.state || ''}`,
        collegeType: c.college?.type || 'N/A',
        nirfRank: c.college?.nireRank || 'N/A',
        marginFromCutoff: c.closingRank - rank,
        admissionChance: c.closingRank - rank > 5000 ? 'High' : c.closingRank - rank > 2000 ? 'Moderate' : 'Low'
      }))

      return JSON.stringify({
        found: true,
        count: results.length,
        exam: exam,
        studentRank: rank,
        category: category,
        homeState: homeState,
        examInfo: {
          level: examConfig.level,
          domain: examConfig.domain,
          notes: examConfig.notes
        },
        colleges: results,
        filterApplied: {
          totalInDB: cutoffs.length,
          afterExamFilter: examFilteredCutoffs.length,
          note: `Only showing colleges that accept ${exam}`
        }
      })
    } catch (error) {
      logger.error('Tool error - search_colleges_by_rank:', error)
      return JSON.stringify({ error: true, message: "Error searching colleges. Please try again." })
    }
  },

  /**
   * Get detailed info about a specific college
   */
  get_college_details: async ({ collegeName }) => {
    try {
      logger.info(`Tool: get_college_details - College: ${collegeName}`)

      // Search by name or acronym (case-insensitive)
      const college = await College.findOne({
        $or: [
          { name: new RegExp(collegeName, 'i') },
          { acronym: new RegExp(collegeName, 'i') }
        ]
      }).lean()

      if (!college) {
        // Try partial match
        const partialMatch = await College.findOne({
          name: new RegExp(collegeName.split(' ')[0], 'i')
        }).lean()

        if (partialMatch) {
          return JSON.stringify({
            found: false,
            message: `"${collegeName}" not found exactly. Did you mean "${partialMatch.name}"?`,
            suggestion: partialMatch.name
          })
        }

        return JSON.stringify({
          found: false,
          message: `College "${collegeName}" not found in our database. Please check the spelling or try the acronym.`
        })
      }

      return JSON.stringify({
        found: true,
        college: {
          name: college.name,
          acronym: college.acronym,
          type: college.type,
          location: `${college.city}, ${college.state}`,
          nirfRank: college.nireRank || 'Not Ranked',
          website: college.website || 'N/A',
          totalSeats: college.totalSeats || 'N/A',
          branches: college.branches || [],
          fees: {
            general: college.fees?.general ? `₹${college.fees.general.toLocaleString()}` : 'N/A',
            obc: college.fees?.obc ? `₹${college.fees.obc.toLocaleString()}` : 'N/A',
            sc: college.fees?.sc ? `₹${college.fees.sc.toLocaleString()}` : 'N/A',
            st: college.fees?.st ? `₹${college.fees.st.toLocaleString()}` : 'N/A'
          }
        }
      })
    } catch (error) {
      logger.error('Tool error - get_college_details:', error)
      return JSON.stringify({ error: true, message: "Error fetching college details." })
    }
  },

  /**
   * Compare multiple colleges
   */
  compare_colleges: async ({ collegeNames }) => {
    try {
      logger.info(`Tool: compare_colleges - Colleges: ${collegeNames.join(', ')}`)

      if (collegeNames.length < 2) {
        return JSON.stringify({
          error: true,
          message: "Please provide at least 2 colleges to compare."
        })
      }

      const colleges = await Promise.all(
        collegeNames.map(async (name) => {
          return await College.findOne({
            $or: [
              { name: new RegExp(name, 'i') },
              { acronym: new RegExp(name, 'i') }
            ]
          }).lean()
        })
      )

      const foundColleges = colleges.filter(c => c !== null)

      if (foundColleges.length < 2) {
        const notFound = collegeNames.filter((_, i) => colleges[i] === null)
        return JSON.stringify({
          error: true,
          message: `Could not find: ${notFound.join(', ')}. Need at least 2 valid colleges to compare.`
        })
      }

      const comparison = foundColleges.map(c => ({
        name: c.name,
        acronym: c.acronym,
        type: c.type,
        location: `${c.city}, ${c.state}`,
        nirfRank: c.nireRank || 'Not Ranked',
        generalFees: c.fees?.general ? `₹${c.fees.general.toLocaleString()}` : 'N/A',
        totalSeats: c.totalSeats || 'N/A',
        branchCount: c.branches?.length || 0
      }))

      return JSON.stringify({
        found: true,
        comparison: comparison,
        summary: `Comparing ${comparison.length} colleges: ${comparison.map(c => c.name).join(' vs ')}`
      })
    } catch (error) {
      logger.error('Tool error - compare_colleges:', error)
      return JSON.stringify({ error: true, message: "Error comparing colleges." })
    }
  },

  /**
   * Get cutoff data for a college
   */
  get_cutoff_data: async ({ collegeName, branch, category }) => {
    try {
      logger.info(`Tool: get_cutoff_data - College: ${collegeName}, Branch: ${branch || 'All'}, Category: ${category || 'All'}`)

      // First find the college
      const college = await College.findOne({
        $or: [
          { name: new RegExp(collegeName, 'i') },
          { acronym: new RegExp(collegeName, 'i') }
        ]
      }).lean()

      if (!college) {
        return JSON.stringify({
          found: false,
          message: `College "${collegeName}" not found. Please check the spelling.`
        })
      }

      // Build cutoff query
      const query = { college: college._id }
      if (branch) query.branch = new RegExp(branch, 'i')
      if (category) query.category = category

      const cutoffs = await Cutoff.find(query)
        .sort({ year: -1, branch: 1 })
        .limit(10)
        .lean()

      if (cutoffs.length === 0) {
        return JSON.stringify({
          found: false,
          message: `No cutoff data available for ${college.name}${branch ? ` - ${branch}` : ''}.`
        })
      }

      const cutoffData = cutoffs.map(c => ({
        branch: c.branch,
        category: c.category,
        closingRank: c.closingRank,
        openingRank: c.openingRank || 'N/A',
        year: c.year
      }))

      return JSON.stringify({
        found: true,
        collegeName: college.name,
        cutoffs: cutoffData
      })
    } catch (error) {
      logger.error('Tool error - get_cutoff_data:', error)
      return JSON.stringify({ error: true, message: "Error fetching cutoff data." })
    }
  },

  /**
   * Find affordable colleges
   */
  get_affordable_colleges: async ({ maxFees = 500000, category = 'general', limit = 5 }) => {
    try {
      logger.info(`Tool: get_affordable_colleges - MaxFees: ${maxFees}, Category: ${category}`)

      const feeField = `fees.${category}`

      const colleges = await College.find({
        [feeField]: { $lte: maxFees, $gt: 0 }
      })
        .sort({ [feeField]: 1 })
        .limit(limit)
        .lean()

      if (colleges.length === 0) {
        return JSON.stringify({
          found: false,
          message: `No colleges found with ${category} fees under ₹${maxFees.toLocaleString()}.`
        })
      }

      const results = colleges.map(c => ({
        name: c.name,
        location: `${c.city}, ${c.state}`,
        type: c.type,
        fees: c.fees?.[category] ? `₹${c.fees[category].toLocaleString()}` : 'N/A',
        nirfRank: c.nireRank || 'N/A'
      }))

      return JSON.stringify({
        found: true,
        maxFeesLimit: `₹${maxFees.toLocaleString()}`,
        feeCategory: category,
        colleges: results
      })
    } catch (error) {
      logger.error('Tool error - get_affordable_colleges:', error)
      return JSON.stringify({ error: true, message: "Error searching affordable colleges." })
    }
  }
}

export default { tools, toolsImplementation }
