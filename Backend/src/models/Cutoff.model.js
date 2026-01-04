import mongoose from "mongoose"

const cutoffSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["General", "EWS", "OBC", "SC", "ST", "PwD"],
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    closingRank: Number,
    openingRank: Number,
    closingPercentile: Number,
    openingPercentile: Number,
    totalVacancies: Number,
    filledSeats: Number,
    quotaType: {
      type: String,
      enum: ["All India", "State", "Institutional"],
      default: "All India",
    },
  },
  { timestamps: true }
)

export default mongoose.models.Cutoff || mongoose.model("Cutoff", cutoffSchema)
