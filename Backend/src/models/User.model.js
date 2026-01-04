import mongoose from "mongoose"
import bcryptjs from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    quizResults: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuizResult",
      },
    ],
    predictorResults: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PredictorResult",
      },
    ],
    savedColleges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "College",
      },
    ],
    preferences: {
      branches: [String],
      budget: Number,
      locations: [String],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

/* =========================
   Password Hashing Middleware
========================= */
userSchema.pre("save", async function () {
  // Only hash if password is modified
  if (!this.isModified("password")) {
    return
  }

  // Hash password with bcrypt
  const salt = await bcryptjs.genSalt(10)
  this.password = await bcryptjs.hash(this.password, salt)
})

/* =========================
   Password Comparison Method
========================= */
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcryptjs.compare(plainPassword, this.password)
}

export default mongoose.models.UserNxt || mongoose.model("UserNxt", userSchema)
