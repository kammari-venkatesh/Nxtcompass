import mongoose from "mongoose"
import Cutoff from "../models/Cutoff.model.js"
import College from "../models/College.model.js"
import Exam from "../models/Exam.model.js"
import { ENV } from "../config/env.js"
import logger from "../utils/logger.js"

const config = ENV

const seedCutoffs = async () => {
  try {
    await mongoose.connect(config.MONGO_URI)
    logger.info("Connected to MongoDB")

    // Fetch existing colleges
    const colleges = await College.find({}).lean()
    if (!colleges.length) {
      logger.error("No colleges found. Please run colleges seed first.")
      process.exit(1)
    }

    // Fetch or create a default exam (JEE Main)
    const currentYear = new Date().getFullYear()
    let jeeMain = await Exam.findOne({ name: "JEE Main", year: currentYear - 1 })
    if (!jeeMain) {
      jeeMain = await Exam.create({
        name: "JEE Main",
        examId: `jee-main-${currentYear - 1}`,
        totalCandidates: 1200000,
        year: currentYear - 1,
        minRank: 1,
        maxRank: 1200000,
        minPercentile: 0,
        maxPercentile: 100,
        duration: "3 hours",
        totalQuestions: 90,
        passingPercentile: 40,
        isActive: true,
      })
      logger.info("Created JEE Main exam")
    }

    // Clear existing cutoffs
    await Cutoff.deleteMany({})
    logger.info("Cleared existing cutoffs")

    // Create cutoff data for each college
    const cutoffData = []
    const categories = ["General", "EWS", "OBC", "SC", "ST"]

    for (const college of colleges) {
      for (const branch of college.branches) {
        for (const category of categories) {
          // Generate realistic cutoff ranks based on college rank and category
          const baseRank = college.nireRank ? college.nireRank * 1000 : 10000
          const categoryMultiplier = {
            General: 1,
            EWS: 1.3,
            OBC: 1.5,
            SC: 2.5,
            ST: 3,
          }

          cutoffData.push({
            college: college._id,
            exam: jeeMain._id,
            branch: branch,
            category: category,
            year: currentYear - 1, // Last year's data
            openingRank: Math.floor(baseRank * categoryMultiplier[category] * 0.8),
            closingRank: Math.floor(baseRank * categoryMultiplier[category]),
            quotaType: "All India",
          })
        }
      }
    }

    const result = await Cutoff.insertMany(cutoffData)
    logger.info(`Seeded ${result.length} cutoff records`)

    await mongoose.disconnect()
    logger.info("Disconnected from MongoDB")
  } catch (error) {
    logger.error("Seeding error:", error.message)
    process.exit(1)
  }
}

seedCutoffs()
