import express from "express"
import { chatWithAI, chatWithAIStream } from "../controllers/chat.controller.js"

const router = express.Router()

/*
  POST /api/chat
  Public route (no auth needed)
  Standard chat endpoint - returns complete response
*/
router.post("/", chatWithAI)

/*
  POST /api/chat/stream
  Public route (no auth needed)
  Streaming chat endpoint - returns progressive response via SSE
*/
router.post("/stream", chatWithAIStream)

export default router
