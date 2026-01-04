import express from "express"
import {
  getAllColleges,
  getCollegeById,
  searchColleges,
  getStates,
  compareColleges,
} from "../controllers/college.controller.js"

const router = express.Router()

// Public routes
router.get("/", getAllColleges)
router.get("/search", searchColleges)
router.get("/states", getStates)
router.post("/compare", compareColleges)
router.get("/:collegeId", getCollegeById)

export default router
