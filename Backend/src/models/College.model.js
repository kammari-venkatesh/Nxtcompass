import mongoose from "mongoose"

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    acronym: {
      type: String,
      required: true,
      index: true,
    },
    state: {
      type: String,
      required: true,
      index: true,
    },
    city: String,
    type: {
      type: String,
      enum: ["Government", "Private", "Deemed"],
      default: "Government",
    },
    nireRank: Number,
    website: String,
    contactEmail: String,
    contactPhone: String,
    branches: [String],
    fees: {
      general: Number,
      obc: Number,
      sc: Number,
      st: Number,
    },
    totalSeats: Number,
    cutoffs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cutoff",
      },
    ],
    reviews: {
      rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

export default mongoose.models.College || mongoose.model("College", collegeSchema)
