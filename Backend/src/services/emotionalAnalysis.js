/**
 * Emotional Analysis Service for Zenith AI Mentor
 * 
 * Analyzes student messages for emotional state before generating responses
 * Implements the "Validation-First" framework
 */

/**
 * Emotional keywords categorized by sentiment
 */
const EMOTIONAL_MARKERS = {
  lowConfidence: [
    'confused', 'lost', 'don\'t know', 'unsure', 'worried', 'scared',
    'overwhelmed', 'stressed', 'anxious', 'nervous', 'helpless',
    'stuck', 'frustrated', 'afraid', 'hopeless', 'nothing', 'failure',
    'can\'t', 'unable', 'impossible', 'too hard', 'give up'
  ],
  
  urgency: [
    'urgent', 'asap', 'quickly', 'emergency', 'deadline', 'last chance',
    'running out', 'running out of time', 'too late', 'missed'
  ],
  
  confusion: [
    'confused', 'don\'t understand', 'unclear', 'what does', 'how does',
    'why', 'explain', 'not sure', 'confusing', 'complicated'
  ],
  
  excitement: [
    'excited', 'happy', 'great', 'awesome', 'amazing', 'fantastic',
    'wonderful', 'excellent', 'perfect', 'love', 'thrilled'
  ],
  
  gratitude: [
    'thank', 'thanks', 'appreciate', 'grateful', 'helpful', 'helped me'
  ],
  
  determination: [
    'will', 'going to', 'determined', 'committed', 'motivated',
    'ready', 'let\'s do this', 'i can'
  ]
}

/**
 * Validation responses based on emotional state
 */
const VALIDATION_TEMPLATES = {
  lowConfidence: [
    "I completely understand feeling this way - choosing a college is one of the biggest decisions you'll make, and it's totally normal to feel overwhelmed.",
    "Hey, take a breath. What you're feeling right now? Completely valid. Every student I've helped has been exactly where you are.",
    "First, let me say this: feeling lost or confused doesn't mean you're behind. It means you're taking this seriously, which is actually a good sign.",
    "I hear you, and I want you to know something important: uncertainty at this stage is not weakness - it's wisdom. You're being thoughtful about your future."
  ],
  
  urgency: [
    "I can feel the time pressure, and I'm here to help you navigate this quickly but smartly.",
    "Okay, let's focus. When things feel urgent, having a clear next step is everything. I've got you.",
    "I understand you're working against the clock. Let's break this down into immediate action items."
  ],
  
  confusion: [
    "Great question! The fact that you're asking means you're thinking critically, which is exactly what you should be doing.",
    "I love that you're asking this - clarity beats confusion every time. Let me break this down for you.",
    "This is actually a very common point of confusion, and I'm glad you brought it up. Let's clear it up together."
  ],
  
  excitement: [
    "I love your energy! Let's channel that enthusiasm into finding the perfect college for you! 🎉",
    "Your excitement is contagious! This is exactly the attitude that will help you make the best choice.",
    "That's the spirit! When you're this motivated, great things happen. Let's find your ideal match!"
  ],
  
  gratitude: [
    "You're so welcome! Helping students like you find their path is exactly why I'm here. 😊",
    "I'm really happy I could help! Your success is what matters most to me.",
    "Thank you for trusting me with this decision. I'm here whenever you need guidance!"
  ],
  
  neutral: [
    "Absolutely, I can help with that!",
    "Great question - let me guide you through this.",
    "I'm here to help you figure this out. Let's dive in!"
  ]
}

/**
 * Analyze emotional state from message
 * @param {string} message - Student's message
 * @returns {Object} - {emotion, intensity, validationNeeded, suggestedValidation}
 */
export const analyzeEmotion = (message) => {
  if (!message || typeof message !== 'string') {
    return {
      emotion: 'neutral',
      intensity: 0,
      validationNeeded: false,
      suggestedValidation: null
    }
  }

  const lowerMessage = message.toLowerCase()
  const analysis = {
    lowConfidence: 0,
    urgency: 0,
    confusion: 0,
    excitement: 0,
    gratitude: 0,
    determination: 0
  }

  // Count emotional markers
  for (const [emotion, keywords] of Object.entries(EMOTIONAL_MARKERS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        analysis[emotion]++
      }
    }
  }

  // Check for question marks (indicates need for clarity)
  const questionMarks = (message.match(/\?/g) || []).length
  if (questionMarks > 1) {
    analysis.confusion += questionMarks
  }

  // Check for excessive punctuation (indicates strong emotion)
  const exclamations = (message.match(/!/g) || []).length
  if (exclamations > 2) {
    analysis.excitement += exclamations
  }

  // Check message length (very long messages often indicate anxiety)
  if (message.length > 200) {
    analysis.lowConfidence += 1
  }

  // Determine primary emotion
  const emotionScores = Object.entries(analysis)
    .filter(([_, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])

  if (emotionScores.length === 0) {
    return {
      emotion: 'neutral',
      intensity: 0,
      validationNeeded: false,
      suggestedValidation: getRandomValidation('neutral')
    }
  }

  const [primaryEmotion, intensity] = emotionScores[0]

  // Determine if validation is needed
  const validationNeeded = [
    'lowConfidence', 'urgency', 'confusion'
  ].includes(primaryEmotion)

  return {
    emotion: primaryEmotion,
    intensity,
    validationNeeded,
    suggestedValidation: validationNeeded ? getRandomValidation(primaryEmotion) : null,
    allEmotions: emotionScores.map(([e, s]) => ({ emotion: e, score: s }))
  }
}

/**
 * Get a random validation message for the emotion
 */
const getRandomValidation = (emotion) => {
  const templates = VALIDATION_TEMPLATES[emotion] || VALIDATION_TEMPLATES.neutral
  return templates[Math.floor(Math.random() * templates.length)]
}

/**
 * Generate "Next 3 Steps" micro-pathing
 * @param {string} context - Current context (rank, category, etc.)
 * @param {Array} recommendations - College recommendations
 * @returns {Array} - Array of 3 actionable steps
 */
export const generateMicroSteps = (context, recommendations) => {
  const steps = []

  // Step 1: Immediate clarity
  if (!context.rank || !context.category || !context.exam) {
    steps.push({
      number: 1,
      action: "Share your complete details",
      detail: "I need your exam name, rank, category, and home state to give you accurate predictions.",
      emoji: "📝"
    })
  } else {
    steps.push({
      number: 1,
      action: "Review your matches",
      detail: `I found ${recommendations?.length || 0} colleges that match your profile. Look at the Safe options first.`,
      emoji: "✅"
    })
  }

  // Step 2: Research
  if (recommendations && recommendations.length > 0) {
    steps.push({
      number: 2,
      action: "Deep-dive on top 3",
      detail: "Pick 3 colleges from your Safe/Moderate list. Ask me to compare them or check their fees and placements.",
      emoji: "🔍"
    })
  } else {
    steps.push({
      number: 2,
      action: "Get personalized recommendations",
      detail: "Once I have your details, I'll show you Safe, Moderate, and Ambitious options with probabilities.",
      emoji: "🎯"
    })
  }

  // Step 3: Action
  steps.push({
    number: 3,
    action: "Create your preference list",
    detail: "Start filling your counseling preferences with Safe options first, then Moderate, then Ambitious.",
    emoji: "📋"
  })

  return steps
}

/**
 * Create a Zenith Action Card
 * @param {Object} analysis - Emotional analysis
 * @param {string} responseText - AI's response
 * @param {Array} nextSteps - Next 3 steps
 * @returns {Object} - Structured action card
 */
export const createZenithActionCard = (analysis, responseText, nextSteps) => {
  return {
    type: 'zenith_action_card',
    validation: analysis.validationNeeded ? analysis.suggestedValidation : null,
    nextSteps: nextSteps.slice(0, 3),
    inspiration: getInspirationalQuote(analysis.emotion),
    mood: analysis.emotion,
    timestamp: new Date()
  }
}

/**
 * Get inspirational quote based on emotion
 */
const getInspirationalQuote = (emotion) => {
  const quotes = {
    lowConfidence: "Every expert was once a beginner. You're not behind - you're exactly where you need to be.",
    urgency: "Pressure creates diamonds. You've got this!",
    confusion: "Confusion is the beginning of understanding. Keep asking questions!",
    excitement: "Your enthusiasm will open doors that qualification alone can't.",
    gratitude: "Gratitude is the foundation of growth. You're on the right path!",
    determination: "With determination like yours, success is inevitable.",
    neutral: "One step at a time, one choice at a time. You'll find your way."
  }

  return quotes[emotion] || quotes.neutral
}

export default {
  analyzeEmotion,
  generateMicroSteps,
  createZenithActionCard
}
