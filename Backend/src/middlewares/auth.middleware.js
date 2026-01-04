import jwt from "jsonwebtoken"
import { ENV } from "../config/env.js"

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      })
    }

    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(token, ENV.JWT_SECRET)

    req.user = {
      id: decoded.id,
      email: decoded.email,
    }

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    })
  }
}
