import mongoose from "mongoose"

const predictorResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserNxt",
      required: true,
    },
    exam: {
      type: String,
      required: true,
    },
    input: {
      rank: Number,
      percentile: Number,
      score: Number,
      category: String,
      homeState: String,
      gender: String,
      quotaType: String,
      localRegion: String,
      preferredBranches: [String],
    },
    resultsCount: {
      type: Number,
      default: 0,
    },
    topMatch: {
      collegeName: String,
      branch: String,
      probability: Number,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

export default mongoose.models.PredictorResult || mongoose.model("PredictorResult", predictorResultSchema)
