import QuizQuestion from "../models/QuizQuestion.model.js"
import QuizResult from "../models/QuizResult.model.js"
import { evaluateQuiz } from "../services/quizEngine.js"

/* =========================
   GET QUIZ QUESTIONS
========================= */
export const getQuizQuestions = async (req, res, next) => {
  try {
    const questions = await QuizQuestion.find()
      .sort({ order: 1 })
      .lean()

    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    })
  } catch (error) {
    next(error)
  }
}

/* =========================
   SUBMIT QUIZ
========================= */
export const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Quiz answers are required",
      })
    }

    // Evaluate quiz
    const result = evaluateQuiz(answers)

    // Save quiz result if user is logged in
    if (req.user) {
      await QuizResult.create({
        userId: req.user.id,
        answers,
        result,
      })
    }

    res.status(200).json({
      success: true,
      result,
    })
  } catch (error) {
    next(error)
  }
}
