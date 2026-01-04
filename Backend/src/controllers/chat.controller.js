import { runAICounselor } from "../services/ai.service.js"

/*
  POST /api/chat
  Body:
  {
    message: String,
    context: {
      rank?: Number,
      category?: String,
      homeState?: String,
      branches?: [String]
    }
  }
*/
export const chatWithAI = async (req, res, next) => {
  try {
    const { message, context } = req.body

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      })
    }

    const response = await runAICounselor({
      message,
      context,
    })

    res.status(200).json({
      success: true,
      ...response,
    })
  } catch (error) {
    next(error)
  }
}
