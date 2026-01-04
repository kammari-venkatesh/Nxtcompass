import mongoose from "mongoose"

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },

  // trait impact of this option
  traits: {
    analytical: { type: Number, default: 0 },
    creative: { type: Number, default: 0 },
    people: { type: Number, default: 0 },
    handsOn: { type: Number, default: 0 },
    leadership: { type: Number, default: 0 },
  },
})

const quizQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },

    category: {
      type: String,
      enum: ["interest", "skill", "value", "scenario"],
      required: true,
    },

    options: [optionSchema],

    order: { type: Number, required: true },
  },
  { timestamps: true }
)

export default mongoose.models.QuizQuestion || mongoose.model("QuizQuestion", quizQuestionSchema)
