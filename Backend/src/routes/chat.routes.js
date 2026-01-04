import express from "express"
import { chatWithAI } from "../controllers/chat.controller.js"

const router = express.Router()

/*
  POST /api/chat
  Public route (no auth needed)
*/
router.post("/", chatWithAI)

export default router
