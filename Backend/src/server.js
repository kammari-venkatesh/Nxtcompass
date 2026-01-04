import app from "./app.js"
import { connectDB } from "./config/db.js"
import { ENV } from "./config/env.js"

const startServer = async () => {
  try {
    // Connect to database first
    await connectDB()

    app.listen(ENV.PORT, () => {
      console.log(`🚀 NxtCompass API running on port ${ENV.PORT}`)
    })
  } catch (error) {
    console.error("❌ Failed to start server", error)
    process.exit(1)
  }
}

startServer()
