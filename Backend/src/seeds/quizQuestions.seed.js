import { connectDB } from "../config/db.js"
import QuizQuestion from "../models/QuizQuestion.model.js"

const quizQuestions = [
  {
    order: 1,
    category: "interest",
    question: "Do you enjoy solving logic puzzles or coding challenges?",
    options: [
      {
        text: "Yes, I love it",
        traits: { analytical: 3, creative: 1 },
      },
      {
        text: "Sometimes",
        traits: { analytical: 2 },
      },
      {
        text: "Not really",
        traits: { creative: 1, people: 1 },
      },
    ],
  },
  {
    order: 2,
    category: "skill",
    question: "Which activity sounds most appealing to you?",
    options: [
      {
        text: "Building a software or app",
        traits: { analytical: 2, handsOn: 2 },
      },
      {
        text: "Designing or creating something new",
        traits: { creative: 3 },
      },
      {
        text: "Leading a team to complete a task",
        traits: { leadership: 3, people: 2 },
      },
    ],
  },
  {
    order: 3,
    category: "scenario",
    question: "In a group project, what role do you usually take?",
    options: [
      {
        text: "Problem solver / technical contributor",
        traits: { analytical: 2, handsOn: 2 },
      },
      {
        text: "Idea generator",
        traits: { creative: 3 },
      },
      {
        text: "Coordinator or leader",
        traits: { leadership: 3, people: 2 },
      },
    ],
  },
  {
    order: 4,
    category: "value",
    question: "What matters most to you in a future career?",
    options: [
      {
        text: "High problem-solving and innovation",
        traits: { analytical: 2, creative: 2 },
      },
      {
        text: "Working with people and making impact",
        traits: { people: 3, leadership: 2 },
      },
      {
        text: "Hands-on practical work",
        traits: { handsOn: 3 },
      },
    ],
  },
  {
    order: 5,
    category: "interest",
    question: "How do you feel about learning new technologies?",
    options: [
      {
        text: "Excited, I enjoy learning continuously",
        traits: { analytical: 2, creative: 1 },
      },
      {
        text: "Neutral, if required",
        traits: { analytical: 1 },
      },
      {
        text: "I prefer stable, non-technical work",
        traits: { people: 2 },
      },
    ],
  },
]

const seedQuizQuestions = async () => {
  try {
    await connectDB()

    await QuizQuestion.deleteMany()
    await QuizQuestion.insertMany(quizQuestions)

    console.log("✅ Quiz questions seeded successfully")
    process.exit()
  } catch (error) {
    console.error("❌ Quiz question seeding failed")
    console.error(error.message)
    process.exit(1)
  }
}

seedQuizQuestions()
