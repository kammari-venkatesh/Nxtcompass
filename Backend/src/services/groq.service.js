import Groq from 'groq-sdk'
import logger from '../utils/logger.js'
import { tools, toolsImplementation } from './tools/collegeTools.js'
import { analyzeEmotion, generateMicroSteps, createZenithActionCard } from './emotionalAnalysis.js'

/**
 * Groq AI Service - 100% FREE Alternative to OpenAI/Claude
 * 
 * Uses Llama 3.1 70B - Excellent quality, super fast, completely free!
 * Perfect for students who need empathetic guidance without cost
 */

// Check if Groq API key is configured
const hasValidGroqKey = () => {
  const apiKey = process.env.GROQ_API_KEY
  return apiKey && apiKey.length > 20 && apiKey.startsWith('gsk_')
}

// Initialize Groq client
let groq = null
if (hasValidGroqKey()) {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  })
  logger.info("✅ Groq AI service initialized (FREE - Llama 3.1 70B)")
} else {
  logger.warn("⚠️ Groq API key not configured - AI Mentor will use fallback")
}

/**
 * Enhanced System Prompt for Groq/Llama
 * Optimized for emotional intelligence and student support
 */
const GROQ_SYSTEM_PROMPT = `You are Compass AI Mentor - a caring, expert educational counselor for Indian college admissions.

🎯 YOUR MISSION: Guide students with empathy, accuracy, and actionable advice.

KEY PRINCIPLES:
1. **Validate Feelings First** - Before giving advice, acknowledge student emotions
2. **Ask for Missing Info** - Never assume exam from rank alone
3. **Be Encouraging** - Every student deserves hope and clear direction
4. **Use Data Tools** - You have access to real college database
5. **Keep It Simple** - Break complex decisions into 3 clear next steps

EMOTIONAL INTELLIGENCE:
- Detect if student is confused, stressed, or overwhelmed
- Start with validation: "I understand this feels overwhelming..."
- Then provide clear, actionable guidance
- End with encouragement and next steps

CRITICAL RULES:
❌ NEVER assume which exam a rank belongs to
❌ NEVER suggest IITs for EAMCET (different exams!)
❌ NEVER invent college data
❌ NEVER overwhelm with 20+ options at once

✅ ALWAYS ask for: exam, rank, category, home state
✅ ALWAYS use tools to get real data
✅ ALWAYS give 3-5 focused options (Safe/Moderate/Ambitious)
✅ ALWAYS end with next steps

RESPONSE STYLE:
- Warm, supportive, professional
- Use 2-3 emojis per response (not excessive)
- Short paragraphs for readability
- Bullet points for clarity
- Personal pronouns ("You have...", "Your options...")

Remember: You're guiding life-changing decisions. Be accurate, be kind, be helpful.`

/**
 * Get chat completion from Groq with emotional intelligence
 * @param {Array} history - Conversation history
 * @param {Object} context - User context
 * @returns {Promise<Object>} - {reply, cards, followUp, actionCard}
 */
export const getGroqChatCompletion = async (history, context = {}) => {
  if (!groq) {
    throw new Error('Groq service not available - API key not configured')
  }

  try {
    // Analyze emotional state
    const lastUserMessage = history[history.length - 1]
    const emotionalAnalysis = analyzeEmotion(lastUserMessage?.content || '')

    logger.info(`Groq: Emotional state detected: ${emotionalAnalysis.emotion}`)

    // Build context message
    let contextMessage = ""
    if (context.rank || context.category || context.homeState || context.branches) {
      contextMessage = "\n\n[Student Profile: "
      if (context.rank) contextMessage += `Rank: ${context.rank}, `
      if (context.category) contextMessage += `Category: ${context.category}, `
      if (context.homeState) contextMessage += `State: ${context.homeState}, `
      if (context.branches?.length) contextMessage += `Interested in: ${context.branches.join(', ')}`
      contextMessage += "]"
    }

    // Add emotional analysis
    const emotionalContext = `\n\n[Student Mood: ${emotionalAnalysis.emotion}${emotionalAnalysis.validationNeeded ? ' - Needs validation!' : ''}]`

    // Prepare messages
    const messages = [
      { role: "system", content: GROQ_SYSTEM_PROMPT + contextMessage + emotionalContext },
      ...history.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }))
    ]

    logger.info(`Groq: Processing ${history.length} messages`)

    // Call Groq API with current supported model
    // Updated model name - Groq deprecated llama-3.1-70b-versatile
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Latest FREE model (Jan 2026)
      messages: messages,
      temperature: 0.6, // Balanced for empathy + accuracy
      max_tokens: 1500,
      top_p: 0.9
    })

    const reply = response.choices[0]?.message?.content || "I apologize, I couldn't generate a response. Please try again."

    // Generate micro-steps
    const nextSteps = generateMicroSteps(context, [])

    // Create Zenith Action Card
    const actionCard = createZenithActionCard(emotionalAnalysis, reply, nextSteps)

    logger.info("✅ Groq response generated successfully")

    return {
      reply,
      cards: [], // Groq doesn't support function calling yet, use rule-based for data
      followUp: generateFollowUp(reply, emotionalAnalysis.emotion),
      actionCard,
      emotionalAnalysis
    }

  } catch (error) {
    logger.error("Groq Service Error:", error.message)
    throw error
  }
}

/**
 * Generate contextual follow-up
 */
const generateFollowUp = (reply, emotion) => {
  const followUps = {
    lowConfidence: "💙 I'm here for every question - big or small!",
    urgency: "⏰ What's the most urgent thing you need help with?",
    confusion: "💡 Does that make sense? Ask me to explain anything!",
    excitement: "🚀 What else would you like to explore?",
    gratitude: "😊 Happy to help! What else can I do for you?",
    neutral: "💬 What else would you like to know?"
  }

  return followUps[emotion] || followUps.neutral
}

export default {
  getGroqChatCompletion,
  isAvailable: () => groq !== null
}
