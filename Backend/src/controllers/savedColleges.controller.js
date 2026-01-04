import User from "../models/User.model.js"
import { sendSuccess, sendError } from "../utils/response.js"

/* =========================
   GET SAVED COLLEGES
========================= */
export const getSavedColleges = async (req, res) => {
  try {
    console.log('📚 GET Saved Colleges - User ID:', req.user?.id)

    if (!req.user || !req.user.id) {
      console.error('❌ No user ID in request')
      return sendError(res, "User not authenticated", 401)
    }

    const user = await User.findById(req.user.id).populate('savedColleges')

    if (!user) {
      console.error('❌ User not found:', req.user.id)
      return sendError(res, "User not found", 404)
    }

    // Return populated college data from database
    console.log('✅ Saved colleges retrieved:', user.savedColleges.length)
    return sendSuccess(res, user.savedColleges, "Saved colleges retrieved successfully")
  } catch (error) {
    console.error("❌ Get saved colleges error:", error)
    return sendError(res, error.message, 500)
  }
}

/* =========================
   TOGGLE SAVE COLLEGE
========================= */
export const toggleSaveCollege = async (req, res) => {
  try {
    console.log('🔄 Toggle Save College - User ID:', req.user?.id)
    console.log('🔄 College ID:', req.body?.collegeId)

    if (!req.user || !req.user.id) {
      console.error('❌ No user ID in request')
      return sendError(res, "User not authenticated", 401)
    }

    const { collegeId } = req.body

    if (!collegeId) {
      console.error('❌ No college ID provided')
      return sendError(res, "College ID is required", 400)
    }

    const user = await User.findById(req.user.id)

    if (!user) {
      console.error('❌ User not found:', req.user.id)
      return sendError(res, "User not found", 404)
    }

    // Check if already saved
    const collegeIndex = user.savedColleges.findIndex(
      id => id.toString() === collegeId.toString()
    )

    if (collegeIndex > -1) {
      // Remove from saved
      user.savedColleges.splice(collegeIndex, 1)
      await user.save()
      console.log('✅ College removed from saved:', collegeId)
      return sendSuccess(res, { saved: false, collegeId }, "College removed from saved list")
    } else {
      // Add to saved
      user.savedColleges.push(collegeId)
      await user.save()
      console.log('✅ College added to saved:', collegeId)
      return sendSuccess(res, { saved: true, collegeId }, "College added to saved list")
    }
  } catch (error) {
    console.error("❌ Toggle save college error:", error)
    return sendError(res, error.message, 500)
  }
}

/* =========================
   REMOVE SAVED COLLEGE
========================= */
export const removeSavedCollege = async (req, res) => {
  try {
    console.log('🗑️ Remove Saved College - User ID:', req.user?.id)
    console.log('🗑️ College ID:', req.params?.collegeId)

    if (!req.user || !req.user.id) {
      console.error('❌ No user ID in request')
      return sendError(res, "User not authenticated", 401)
    }

    const { collegeId } = req.params

    if (!collegeId) {
      console.error('❌ No college ID provided')
      return sendError(res, "College ID is required", 400)
    }

    const user = await User.findById(req.user.id)

    if (!user) {
      console.error('❌ User not found:', req.user.id)
      return sendError(res, "User not found", 404)
    }

    // Remove college
    const initialLength = user.savedColleges.length
    user.savedColleges = user.savedColleges.filter(
      id => id.toString() !== collegeId.toString()
    )

    if (user.savedColleges.length === initialLength) {
      console.log('⚠️ College was not in saved list:', collegeId)
    } else {
      console.log('✅ College removed:', collegeId)
    }

    await user.save()

    return sendSuccess(res, { collegeId }, "College removed from saved list")
  } catch (error) {
    console.error("❌ Remove saved college error:", error)
    return sendError(res, error.message, 500)
  }
}

/* =========================
   CLEAR ALL SAVED COLLEGES
========================= */
export const clearAllSavedColleges = async (req, res) => {
  try {
    console.log('🧹 Clear All Saved Colleges - User ID:', req.user?.id)

    if (!req.user || !req.user.id) {
      console.error('❌ No user ID in request')
      return sendError(res, "User not authenticated", 401)
    }

    const user = await User.findById(req.user.id)

    if (!user) {
      console.error('❌ User not found:', req.user.id)
      return sendError(res, "User not found", 404)
    }

    const count = user.savedColleges.length
    user.savedColleges = []
    await user.save()

    console.log('✅ Cleared', count, 'saved colleges')
    return sendSuccess(res, { count }, `Cleared ${count} saved colleges`)
  } catch (error) {
    console.error("❌ Clear saved colleges error:", error)
    return sendError(res, error.message, 500)
  }
}
