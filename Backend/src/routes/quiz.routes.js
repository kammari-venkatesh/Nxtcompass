import express from "express"
import {
  getQuizQuestions,
  submitQuiz,
} from "../controllers/quiz.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router()

/* =========================
   QUIZ ROUTES
========================= */

// Public – anyone can take quiz
router.get("/questions", getQuizQuestions)

// Optional auth – save result if logged in
router.post(
  "/submit",
  (req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
      return authMiddleware(req, res, next)
    }
    next()
  },
  submitQuiz
)

export default router
