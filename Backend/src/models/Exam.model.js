import mongoose from "mongoose"

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["JEE Main", "JEE Advanced", "NEET", "BITSAT", "VITEEE", "EAMCET"],
      index: true,
    },
    examId: {
      type: String,
      unique: true,
      lowercase: true,
    },
    totalCandidates: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    minPercentile: {
      type: Number,
      default: 0,
    },
    maxPercentile: {
      type: Number,
      default: 100,
    },
    minRank: {
      type: Number,
      required: true,
    },
    maxRank: {
      type: Number,
      required: true,
    },
    duration: String,
    totalQuestions: Number,
    passingPercentile: Number,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Exam || mongoose.model("Exam", examSchema)
