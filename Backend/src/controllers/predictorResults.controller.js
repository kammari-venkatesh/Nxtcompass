import PredictorResult from "../models/PredictorResult.model.js"
import { sendSuccess, sendError } from "../utils/response.js"

/* =========================
   GET PREDICTOR RESULTS HISTORY
========================= */
export const getPredictorResults = async (req, res) => {
  try {
    console.log('📚 GET Predictor Results - User ID:', req.user?.id)

    if (!req.user || !req.user.id) {
      console.error('❌ No user ID in request')
      return sendError(res, "User not authenticated", 401)
    }

    const results = await PredictorResult.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    console.log('✅ Predictor results retrieved:', results.length)
    return sendSuccess(res, results, "Predictor results retrieved successfully")
  } catch (error) {
    console.error("❌ Get predictor results error:", error)
    return sendError(res, error.message, 500)
  }
}

/* =========================
   SAVE PREDICTOR RESULT
========================= */
export const savePredictorResult = async (req, res) => {
  try {
    console.log('💾 Save Predictor Result - User ID:', req.user?.id)

    if (!req.user || !req.user.id) {
      console.error('❌ No user ID in request')
      return sendError(res, "User not authenticated", 401)
    }

    const { exam, input, resultsCount, topMatch } = req.body

    if (!exam || !input) {
      console.error('❌ Missing required fields')
      return sendError(res, "Exam and input data are required", 400)
    }

    const predictorResult = await PredictorResult.create({
      user: req.user.id,
      exam,
      input,
      resultsCount: resultsCount || 0,
      topMatch,
      completedAt: new Date()
    })

    console.log('✅ Predictor result saved:', predictorResult._id)
    return sendSuccess(res, predictorResult, "Predictor result saved successfully")
  } catch (error) {
    console.error("❌ Save predictor result error:", error)
    return sendError(res, error.message, 500)
  }
}

/* =========================
   DELETE PREDICTOR RESULT
========================= */
export const deletePredictorResult = async (req, res) => {
  try {
    console.log('🗑️ Delete Predictor Result - User ID:', req.user?.id)
    console.log('🗑️ Result ID:', req.params?.resultId)

    if (!req.user || !req.user.id) {
      console.error('❌ No user ID in request')
      return sendError(res, "User not authenticated", 401)
    }

    const { resultId } = req.params

    if (!resultId) {
      console.error('❌ No result ID provided')
      return sendError(res, "Result ID is required", 400)
    }

    const result = await PredictorResult.findOneAndDelete({
      _id: resultId,
      user: req.user.id
    })

    if (!result) {
      console.error('❌ Result not found or unauthorized:', resultId)
      return sendError(res, "Result not found or unauthorized", 404)
    }

    console.log('✅ Predictor result deleted:', resultId)
    return sendSuccess(res, { resultId }, "Predictor result deleted successfully")
  } catch (error) {
    console.error("❌ Delete predictor result error:", error)
    return sendError(res, error.message, 500)
  }
}
