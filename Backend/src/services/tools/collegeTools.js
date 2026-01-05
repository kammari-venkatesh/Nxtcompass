import College from '../../models/College.model.js'
import Cutoff from '../../models/Cutoff.model.js'
import logger from '../../utils/logger.js'

/**
 * OpenAI Function Calling Tools for College Counselor
 *
 * These tools allow the AI to query the database for real college data
 * instead of hallucinating information.
 */

// Tool Definitions for OpenAI
export const tools = [
  {
    type: "function",
    function: {
      name: "search_colleges_by_rank",
      description: "Finds colleges based on student rank, category, and preferred branch. Use this when a student asks for college recommendations or wants to know their admission chances.",
      parameters: {
        type: "object",
        properties: {
          rank: {
            type: "number",
            description: "The student's exam rank (must be a positive number)."
          },
          category: {
            type: "string",
            enum: ["General", "EWS", "OBC", "SC", "ST", "PwD"],
            description: "The student's reservation category."
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
        required: ["rank", "category"]
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
   * Search colleges based on rank and category
   */
  search_colleges_by_rank: async ({ rank, category, branch, limit = 5 }) => {
    try {
      logger.info(`Tool: search_colleges_by_rank - Rank: ${rank}, Category: ${category}, Branch: ${branch || 'Any'}`)

      // Validate rank
      if (!rank || rank <= 0) {
        return JSON.stringify({
          error: true,
          message: "Please provide a valid positive rank number."
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
        .limit(limit)
        .lean()

      if (cutoffs.length === 0) {
        return JSON.stringify({
          found: false,
          message: `No colleges found for rank ${rank} in ${category} category${branch ? ` for ${branch}` : ''}. Try a different category or branch.`,
          suggestions: ["Try increasing your target rank range", "Consider other branches", "Check different categories if applicable"]
        })
      }

      const results = cutoffs.map(c => ({
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
        studentRank: rank,
        category: category,
        colleges: results
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
        const notFound = collegeNames.filter((name, i) => colleges[i] === null)
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
