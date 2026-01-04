import Cutoff from "../models/Cutoff.model.js"
import College from "../models/College.model.js"
import Prediction from "../models/QuizResult.model.js"
import { predictColleges } from "../services/predictorEngine.js"

/* =========================
   PREDICT COLLEGES
========================= */
export const predict = async (req, res, next) => {
  try {
    console.log('📥 Predictor API called')
    console.log('Request headers:', req.headers)
    console.log('Request body:', req.body)
    console.log('Body type:', typeof req.body)

    // Safety check for undefined body
    if (!req.body || typeof req.body !== 'object') {
      console.error('❌ req.body is invalid:', req.body)
      return res.status(400).json({
        success: false,
        message: "Request body is missing or invalid. Please send JSON data.",
      })
    }

    const {
      rank,
      category,
      homeState,
      preferredBranches = [],
    } = req.body

    console.log('Parsed values:', { rank, category, homeState, preferredBranches })

    if (!rank || !category) {
      return res.status(400).json({
        success: false,
        message: "Rank and category are required",
      })
    }

    // Normalize category to match database format
    // Database has: "General", "OBC", "SC", "ST", "EWS"
    const categoryMap = {
      'general': 'General',
      'obc': 'OBC',
      'sc': 'SC',
      'st': 'ST',
      'ews': 'EWS',
      'pwd': 'PwD'
    };

    const normalizedCategory = categoryMap[category.toLowerCase()] || category;

    // Fetch cutoff data (latest years only)
    const cutoffs = await Cutoff.find({
      category: normalizedCategory,
    }).lean()

    if (!cutoffs.length) {
      return res.status(404).json({
        success: false,
        message: "No cutoff data found",
      })
    }

    // Run predictor engine
    const predictions = predictColleges({
      rank,
      category: normalizedCategory,
      homeState,
      preferredBranches,
      cutoffs,
    })

    // Populate college details
    const collegeIds = [...new Set(predictions.map((p) => p.collegeId))]
    const colleges = await College.find({
      _id: { $in: collegeIds },
    }).lean()

    const collegeMap = {}
    colleges.forEach((c) => {
      collegeMap[c._id.toString()] = c
    })

    const results = predictions.map((pred) => ({
      ...pred,
      college: collegeMap[pred.collegeId.toString()],
    }))

    // Save prediction history if user is logged in
    if (req.user) {
      await Prediction.create({
        userId: req.user.id,
        input: { rank, category, homeState, preferredBranches },
        results,
      })
    }

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    })
  } catch (error) {
    next(error)
  }
}
