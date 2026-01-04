import mongoose from "mongoose"
import Exam from "../models/Exam.model.js"
import { ENV } from "../config/env.js"
import logger from "../utils/logger.js"

const config = ENV

const EXAMS_DATA = [
  {
    name: "JEE Main",
    examId: "jee-main",
    totalCandidates: 1100000,
    year: 2024,
    minPercentile: 0,
    maxPercentile: 100,
    minRank: 1,
    maxRank: 1100000,
    duration: "3 hours",
    totalQuestions: 90,
    passingPercentile: 40,
  },
  {
    name: "JEE Advanced",
    examId: "jee-adv",
    totalCandidates: 250000,
    year: 2024,
    minPercentile: 0,
    maxPercentile: 100,
    minRank: 1,
    maxRank: 250000,
    duration: "3 hours each paper",
    totalQuestions: 54,
    passingPercentile: 20,
  },
  {
    name: "NEET",
    examId: "neet",
    totalCandidates: 1800000,
    year: 2024,
    minPercentile: 0,
    maxPercentile: 100,
    minRank: 1,
    maxRank: 1800000,
    duration: "3 hours 20 minutes",
    totalQuestions: 180,
    passingPercentile: 50,
  },
  {
    name: "BITSAT",
    examId: "bitsat",
    totalCandidates: 300000,
    year: 2024,
    minPercentile: 0,
    maxPercentile: 100,
    minRank: 1,
    maxRank: 300000,
    duration: "3 hours",
    totalQuestions: 150,
    passingPercentile: 30,
  },
  {
    name: "VITEEE",
    examId: "viteee",
    totalCandidates: 250000,
    year: 2024,
    minPercentile: 0,
    maxPercentile: 100,
    minRank: 1,
    maxRank: 250000,
    duration: "2 hours 30 minutes",
    totalQuestions: 125,
    passingPercentile: 40,
  },
  {
    name: "EAMCET",
    examId: "eamcet",
    totalCandidates: 300000,
    year: 2024,
    minPercentile: 0,
    maxPercentile: 100,
    minRank: 1,
    maxRank: 300000,
    duration: "3 hours",
    totalQuestions: 160,
    passingPercentile: 25,
  },
]

const seedExams = async () => {
  try {
    await mongoose.connect(config.mongoUri)
    logger.info("Connected to MongoDB")

    await Exam.deleteMany({})
    logger.info("Cleared existing exams")

    const result = await Exam.insertMany(EXAMS_DATA)
    logger.info(`Seeded ${result.length} exams`)

    await mongoose.disconnect()
    logger.info("Disconnected from MongoDB")
  } catch (error) {
    logger.error("Seeding error:", error.message)
    process.exit(1)
  }
}

seedExams()
