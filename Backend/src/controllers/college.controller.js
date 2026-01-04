import mongoose from "mongoose"
import College from "../models/College.model.js"
import { sendSuccess, sendError, sendPaginated } from "../utils/response.js"
import { getCache, setCache } from "../utils/cache.js"
import logger from "../utils/logger.js"

/**
 * Get all colleges with pagination and filters
 */
export const getAllColleges = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, state, type, search } = req.query

    // Check cache
    const cacheKey = `colleges:${page}:${limit}:${state}:${type}:${search}`
    const cached = getCache(cacheKey)
    if (cached) {
      return sendSuccess(res, cached, "Colleges retrieved from cache")
    }

    const filter = { isActive: true }
    if (state) filter.state = state
    if (type) filter.type = type
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { acronym: { $regex: search, $options: "i" } },
      ]
    }

    const skip = (page - 1) * limit
    const total = await College.countDocuments(filter)
    const colleges = await College.find(filter).skip(skip).limit(parseInt(limit))

    const result = { colleges, total, page, limit, pages: Math.ceil(total / limit) }
    setCache(cacheKey, result)

    sendPaginated(res, colleges, total, page, limit)
  } catch (error) {
    logger.error("Get colleges error:", error.message)
    next(error)
  }
}

/**
 * Get college by ID
 */
export const getCollegeById = async (req, res, next) => {
  try {
    const { collegeId } = req.params

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(collegeId)) {
      return sendError(res, "Invalid college ID format", 400)
    }

    const college = await College.findById(collegeId).populate("cutoffs")

    if (!college) {
      return sendError(res, "College not found", 404)
    }

    sendSuccess(res, college)
  } catch (error) {
    logger.error("Get college error:", error.message)
    next(error)
  }
}

/**
 * Search colleges
 */
export const searchColleges = async (req, res, next) => {
  try {
    const { q, state, branch } = req.query

    const filter = { isActive: true }

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { acronym: { $regex: q, $options: "i" } },
      ]
    }

    if (state) filter.state = state
    if (branch) filter.branches = branch

    const colleges = await College.find(filter).limit(10)

    sendSuccess(res, colleges)
  } catch (error) {
    logger.error("Search colleges error:", error.message)
    next(error)
  }
}

/**
 * Get states (unique)
 */
export const getStates = async (req, res, next) => {
  try {
    const states = await College.distinct("state")
    sendSuccess(res, states)
  } catch (error) {
    logger.error("Get states error:", error.message)
    next(error)
  }
}

/**
 * Compare colleges
 */
export const compareColleges = async (req, res, next) => {
  try {
    const { ids } = req.body

    if (!Array.isArray(ids) || ids.length < 2) {
      return sendError(res, "At least two college IDs are required for comparison", 400)
    }

    const colleges = await College.find({
      _id: { $in: ids },
    }).lean()

    sendSuccess(res, colleges, "Colleges retrieved for comparison")
  } catch (error) {
    logger.error("Compare colleges error:", error.message)
    next(error)
  }
}

export default { getAllColleges, getCollegeById, searchColleges, getStates, compareColleges }
