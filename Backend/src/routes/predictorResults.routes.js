import express from "express"
import { getPredictorResults, savePredictorResult, deletePredictorResult } from "../controllers/predictorResults.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.get("/", authMiddleware, getPredictorResults)
router.post("/", authMiddleware, savePredictorResult)
router.delete("/:resultId", authMiddleware, deletePredictorResult)

export default router
