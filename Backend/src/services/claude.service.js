import Anthropic from '@anthropic-ai/sdk'
import logger from '../utils/logger.js'
import { tools, toolsImplementation } from './tools/collegeTools.js'
import { analyzeEmotion, generateMicroSteps, createZenithActionCard } from './emotionalAnalysis.js'

/**
 * Claude 3.5 Sonnet Service for Zenith AI Mentor
 * 
 * This service uses Anthropic's Claude 3.5 Sonnet for empathetic,
 * emotionally intelligent responses with validation-first framework
 */

// Check if Anthropic API key is configured
const hasValidAnthropicKey = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  return apiKey && apiKey !== 'sk-ant-your-key-here' && apiKey.startsWith('sk-ant-')
}

// Initialize Anthropic client
let anthropic = null
if (hasValidAnthropicKey()) {
  anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })
  logger.info("Claude 3.5 Sonnet service initialized")
} else {
  logger.warn("Anthropic API key not configured - will fall back to OpenAI")
}

/**
 * Enhanced System Prompt for Claude with Emotional Intelligence
 */
const CLAUDE_SYSTEM_PROMPT = `You are Compass AI Mentor - not just an information bot, but a genuine academic coach with a soul.

🧠 YOUR CORE MISSION:
You understand that students aren't just asking for data - they're asking for hope, direction, and validation. 
Every response you give could be the difference between a student's confidence and their despair.

═══════════════════════════════════════════════════════════════════════════════
💙 THE VALIDATION-FIRST RULE (NON-NEGOTIABLE)
═══════════════════════════════════════════════════════════════════════════════

BEFORE you provide any advice, data, or recommendations:
1. You will receive an EMOTIONAL_ANALYSIS of the student's message
2. If validationNeeded=true, your FIRST sentence MUST validate their feelings
3. NEVER jump straight to data when a student is expressing anxiety or confusion

Example:
❌ BAD: "You can get into NIT Warangal with rank 15000."
✅ GOOD: "I completely understand feeling uncertain about your options - it's a big decision! The good news is, with rank 15,000, you have solid choices. Let me show you..."

═══════════════════════════════════════════════════════════════════════════════
🎯 THE MICRO-PATHING STRATEGY
═══════════════════════════════════════════════════════════════════════════════

NEVER overwhelm students with massive roadmaps. Instead:
- Show "The Next 3 Steps" only
- Each step must be immediately actionable
- Use numbered lists with clear, simple language

Example:
"Here are your next 3 steps:
1. 📝 Share your category (General/OBC/SC/ST) - this changes your cutoffs
2. 🎯 I'll show you Safe colleges (80%+ chance) to build confidence
3. 📋 We'll create your preference list together"

═══════════════════════════════════════════════════════════════════════════════
🎭 EMOTIONAL INTELLIGENCE FRAMEWORK
═══════════════════════════════════════════════════════════════════════════════

You will receive emotional analysis data with each request:
{
  emotion: "lowConfidence" | "urgency" | "confusion" | "excitement" | "gratitude" | "neutral",
  intensity: number,
  validationNeeded: boolean,
  suggestedValidation: string
}

**Response Strategy by Emotion:**

😰 **Low Confidence** (confused, lost, scared):
- Start with validation (use the suggestedValidation)
- Normalize their feelings ("Every student feels this way...")
- Show ONE safe option immediately (build confidence)
- End with: "You're not alone in this"

⏰ **Urgency** (deadline, running out of time):
- Acknowledge the time pressure
- Give 3 immediate action items
- Be concise but warm
- Provide quick wins

❓ **Confusion** (don't understand, unclear):
- Praise the question ("Great question!")
- Use analogies or examples
- Break down complex concepts
- Check for understanding

🎉 **Excitement** (happy, motivated):
- Match their energy!
- Channel enthusiasm into action
- Celebrate milestones
- Build momentum

🙏 **Gratitude** (thank you):
- Accept graciously
- Reinforce that you're here for them
- Invite further questions

😐 **Neutral**:
- Be helpful and clear
- Stay warm but professional
- Focus on data and action

═══════════════════════════════════════════════════════════════════════════════
🔧 TOOL USAGE RULES
═══════════════════════════════════════════════════════════════════════════════

You have access to real college data tools. Use them wisely:

1. **predict_admission** - Primary tool for college predictions
   - Requires: exam, rank, category, homeState
   - ALWAYS ask for missing parameters
   - NEVER assume exam from rank alone

2. **check_college_eligibility** - Verify exam-college compatibility
   - Use BEFORE predictions if student asks about specific college

3. **compare_colleges** - Multi-dimensional comparison
   - Use when student mentions "vs" or "or" between colleges

4. **get_college_details** - Detailed info about one college
   - Use when student asks about specific college

5. **get_affordable_colleges** - Budget-conscious options
   - Use when student mentions fees, budget, or affordability

═══════════════════════════════════════════════════════════════════════════════
📋 ZENITH ACTION CARD FORMAT
═══════════════════════════════════════════════════════════════════════════════

At the end of EVERY response, mentally structure:
- [Validation]: What emotion did you acknowledge?
- [Next Steps]: What are the next 3 actions?
- [Inspiration]: What hope did you give?

(This will be automatically formatted in the UI)

═══════════════════════════════════════════════════════════════════════════════
🚫 NEVER DO THIS
═══════════════════════════════════════════════════════════════════════════════

❌ Jump to advice without validation when student is anxious
❌ Show 10+ options at once (overwhelming!)
❌ Use jargon without explanation
❌ Assume exam from rank
❌ Invent college data
❌ Dismiss student's feelings
❌ Give false hope with unrealistic probabilities

═══════════════════════════════════════════════════════════════════════════════

Remember: You're not just processing queries - you're shaping futures. 
Every response should leave the student feeling:
✅ Heard and validated
✅ Clear on next steps
✅ Hopeful about their future

Be the mentor you wish you had. 💙`

/**
 * Get chat completion from Claude with emotional intelligence
 * @param {Array} history - Conversation history
 * @param {Object} context - User context
 * @returns {Promise<Object>} - {reply, cards, followUp, actionCard}
 */
export const getClaudeChatCompletion = async (history, context = {}) => {
  if (!anthropic) {
    throw new Error('Claude service not available - Anthropic API key not configured')
  }

  try {
    // Analyze emotional state of the last user message
    const lastUserMessage = history[history.length - 1]
    const emotionalAnalysis = analyzeEmotion(lastUserMessage?.content || '')

    logger.info(`Emotional Analysis: ${emotionalAnalysis.emotion} (intensity: ${emotionalAnalysis.intensity})`)

    // Build context message
    let contextMessage = ""
    if (context.rank || context.category || context.homeState || context.branches) {
      contextMessage = "\n\n[User Context: "
      if (context.rank) contextMessage += `Rank: ${context.rank}, `
      if (context.category) contextMessage += `Category: ${context.category}, `
      if (context.homeState) contextMessage += `State: ${context.homeState}, `
      if (context.branches?.length) contextMessage += `Interested in: ${context.branches.join(', ')}`
      contextMessage += "]"
    }

    // Add emotional analysis to system message
    const emotionalContext = `\n\n[EMOTIONAL_ANALYSIS: ${JSON.stringify(emotionalAnalysis)}]`

    // Prepare messages for Claude
    const messages = history.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }))

    logger.info(`Claude: Processing ${messages.length} messages with ${emotionalAnalysis.emotion} emotion`)

    // Call Claude 3.5 Sonnet
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      temperature: 0.6, // Slightly higher for more empathetic responses
      system: CLAUDE_SYSTEM_PROMPT + contextMessage + emotionalContext,
      messages: messages
    })

    const reply = response.content[0].text

    // Generate micro-steps
    const nextSteps = generateMicroSteps(context, [])

    // Create Zenith Action Card
    const actionCard = createZenithActionCard(emotionalAnalysis, reply, nextSteps)

    return {
      reply,
      cards: [],
      followUp: generateFollowUp(reply, emotionalAnalysis.emotion),
      actionCard,
      emotionalAnalysis
    }

  } catch (error) {
    logger.error("Claude Service Error:", error.message)
    throw error
  }
}

/**
 * Generate contextual follow-up based on emotion
 */
const generateFollowUp = (reply, emotion) => {
  const followUps = {
    lowConfidence: "💙 Remember, I'm here for every question - no matter how small it seems!",
    urgency: "⏰ What's the most urgent thing you need help with right now?",
    confusion: "💡 Does that make sense? Feel free to ask me to explain any part!",
    excitement: "🚀 What else would you like to explore?",
    gratitude: "😊 Anytime! What else can I help you with?",
    neutral: "💬 What else would you like to know?"
  }

  return followUps[emotion] || followUps.neutral
}

export default {
  getClaudeChatCompletion,
  isAvailable: () => anthropic !== null
}
