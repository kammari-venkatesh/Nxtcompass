import cors from "cors"
import { ENV } from "./env.js"

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173", // Vite default
  "http://localhost:5174", // Vite alternate
  "http://localhost:5175", // Vite alternate
  "http://localhost:5176", // Vite alternate
]

export const corsConfig = cors({
  origin: (origin, callback) => {
    // allow server-to-server or tools like Postman
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
})
