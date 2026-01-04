import express from "express"
import { predict } from "../controllers/predictor.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router()

/*
  PUBLIC:
  - Anyone can predict colleges

  OPTIONAL AUTH:
  - If token is present → history is saved
*/
router.post(
  "/",
  (req, res, next) => {
    // try auth, but don't block if missing
    const authHeader = req.headers.authorization
    if (authHeader) {
      return authMiddleware(req, res, next)
    }
    next()
  },
  predict
)

export default router
