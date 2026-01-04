import jwt from "jsonwebtoken"
import User from "../models/User.model.js"
import { ENV } from "../config/env.js"

/* =========================
   Helper: JWT Generator
========================= */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    ENV.JWT_SECRET,
    { expiresIn: "7d" }
  )
}

/* =========================
   REGISTER
========================= */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      })
    }

    const user = await User.create({
      name,
      email,
      password,
    })

    const token = generateToken(user)

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    })
  } catch (error) {
    next(error)
  }
}

/* =========================
   LOGIN
========================= */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    const token = generateToken(user)

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    })
  } catch (error) {
    next(error)
  }
}
