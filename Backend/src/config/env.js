import dotenv from "dotenv"

dotenv.config()

const requiredEnvVars = [
  "MONGO_URI",
  "JWT_SECRET_KEY",
]

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required env variable: ${key}`)
    process.exit(1)
  }
})

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET_KEY,
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",
  NODE_ENV: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  logLevel: process.env.LOG_LEVEL || "info",
  // Aliases for backward compatibility
  jwtSecret: process.env.JWT_SECRET_KEY,
  jwtExpire: process.env.JWT_EXPIRE || "7d",
}
