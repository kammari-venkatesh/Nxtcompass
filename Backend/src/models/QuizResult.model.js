import mongoose from "mongoose"

const quizResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scores: {
      logic: { type: Number, default: 0 },
      problemSolving: { type: Number, default: 0 },
      techInterest: { type: Number, default: 0 },
      handsOn: { type: Number, default: 0 },
      creativity: { type: Number, default: 0 },
      math: { type: Number, default: 0 },
      analysis: { type: Number, default: 0 },
    },
    topMatch: {
      branch: String,
      percentage: Number,
    },
    alternatives: [
      {
        branch: String,
        percentage: Number,
      },
    ],
    contributingTraits: [String],
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

export default mongoose.models.QuizResult || mongoose.model("QuizResult", quizResultSchema)
