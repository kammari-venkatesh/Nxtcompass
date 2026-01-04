import express from "express"
import { analyzeManifesto } from "../controllers/manifesto.controller.js"

const router = express.Router()

/**
 * POST /api/manifesto/analyze
 * Public route - Analyze Career Manifesto responses
 */
router.post("/analyze", analyzeManifesto)

export default router
