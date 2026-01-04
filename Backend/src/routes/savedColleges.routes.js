import express from "express"
import { getSavedColleges, toggleSaveCollege, removeSavedCollege, clearAllSavedColleges } from "../controllers/savedColleges.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router()

/* =========================
   SAVED COLLEGES ROUTES
   All routes require authentication
========================= */

// Get all saved colleges for the current user
router.get("/", authMiddleware, getSavedColleges)

// Toggle save/unsave a college
router.post("/toggle", authMiddleware, toggleSaveCollege)

// Clear all saved colleges
router.delete("/clear-all", authMiddleware, clearAllSavedColleges)

// Remove a saved college
router.delete("/:collegeId", authMiddleware, removeSavedCollege)

export default router
