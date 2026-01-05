import cors from "cors"
import { ENV } from "./env.js"

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173", // Vite default
  "http://localhost:5174", // Vite alternate
  "http://localhost:5175", // Vite alternate
  "http://localhost:5176", // Vite alternate
  // Production frontend URLs
  process.env.FRONTEND_URL, // Set this in Render environment variables
].filter(Boolean)

export const corsConfig = cors({
  origin: (origin, callback) => {
    // allow server-to-server or tools like Postman
    if (!origin) return callback(null, true)

    // In production, allow the configured frontend URL
    // Also allow any origin ending with common deployment platforms
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.netlify.app') ||
      origin.endsWith('.onrender.com') ||
      origin.endsWith('.pages.dev')
    ) {
      callback(null, true)
    } else {
      console.log('CORS blocked origin:', origin)
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
})
