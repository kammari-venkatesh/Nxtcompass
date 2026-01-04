import mongoose from "mongoose"
import { ENV } from "./env.js"

export const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true)

    await mongoose.connect(ENV.MONGO_URI)

    console.log("✅ MongoDB connected successfully")
  } catch (error) {
    console.error("❌ MongoDB connection failed")
    console.error(error.message)
    process.exit(1)
  }
}
