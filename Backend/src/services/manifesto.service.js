import OpenAI from "openai"
import logger from "../utils/logger.js"

// Check if API key is configured
const hasValidApiKey = () => {
  const apiKey = process.env.OPENAI_API_KEY
  return apiKey && apiKey !== "sk-your-api-key-here" && apiKey.startsWith("sk-")
}

let openai = null
if (hasValidApiKey()) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

/**
 * Analyze Career Manifesto using GPT-4
 * Deep psychometric profiling based on 5 Realms responses
 */
export const analyzeCareerManifesto = async (responses) => {
  // If OpenAI not configured, return static analysis
  if (!openai) {
    return getStaticAnalysis(responses)
  }

  try {
    const systemPrompt = `You are an expert Educational Psychologist and Career Counselor specializing in psychometric profiling for Grade 12 students (17-18 years old).

Your task is to analyze student responses across 5 psychological realms and generate a comprehensive career archetype profile.

ANALYSIS FRAMEWORK:
1. **Realm of Curiosity**: Reveals core values (social impact vs. innovation vs. research)
2. **Realm of Flow**: Reveals true passion (what makes them lose track of time)
3. **Realm of Friction**: Reveals anti-career paths (what to avoid)
4. **Realm of Creation**: Reveals systematic/logical thinking patterns
5. **Realm of Leadership**: Reveals team role preference (manager vs. specialist vs. supporter)

IMPORTANT RULES:
- Be specific and actionable
- Reference actual content from their responses
- Avoid generic advice
- Connect observations to real career paths
- Be empathetic but honest
- Identify both strengths and growth areas

OUTPUT FORMAT (JSON):
{
  "archetype": "Short label (e.g., INNOVATOR, EMPATH, ANALYST)",
  "archetypeTitle": "The [Descriptive Title] (e.g., The Logical Creator, The Empathetic Leader)",
  "description": "2-3 sentences explaining their core personality and career fit",
  "suggestedPaths": [
    {
      "icon": "emoji",
      "title": "Career Path Name",
      "description": "Why this fits them specifically",
      "matchPercentage": 85
    }
  ],
  "keyTraits": [
    {
      "icon": "emoji",
      "name": "Trait Name",
      "description": "How this trait manifests"
    }
  ],
  "pros": ["Strength 1", "Strength 2", "Strength 3"],
  "cons": ["Growth area 1", "Growth area 2"]
}`

    const userPrompt = `Analyze these student responses:

**Realm of Curiosity** (Values):
${responses.curiosity}

**Realm of Flow** (Passion):
${responses.flow}

**Realm of Friction** (Anti-patterns):
${responses.friction}

**Realm of Creation** (Logic):
${responses.creation}

**Realm of Leadership** (Team Role):
${responses.leadership}

Provide deep psychometric analysis in JSON format.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    })

    const analysis = JSON.parse(completion.choices[0].message.content)

    logger.info("Manifesto analysis completed successfully")

    return analysis
  } catch (error) {
    logger.error("Manifesto analysis error:", error.message)
    return getStaticAnalysis(responses)
  }
}

/**
 * Static fallback analysis when OpenAI is not configured
 */
const getStaticAnalysis = (responses) => {
  // Simple keyword-based analysis
  const text = Object.values(responses).join(" ").toLowerCase()

  let archetype = "EXPLORER"
  let archetypeTitle = "The Curious Explorer"
  let suggestedPaths = []

  // Detect engineering interest
  if (
    text.includes("code") ||
    text.includes("program") ||
    text.includes("tech") ||
    text.includes("robot") ||
    text.includes("build")
  ) {
    archetype = "INNOVATOR"
    archetypeTitle = "The Tech Innovator"
    suggestedPaths = [
      {
        icon: "💻",
        title: "Software Engineering",
        description: "Your interest in coding and building systems aligns perfectly with software development",
        matchPercentage: 85,
      },
      {
        icon: "🤖",
        title: "Robotics & AI",
        description: "Your systematic thinking and love for automation suggest robotics could be your calling",
        matchPercentage: 75,
      },
    ]
  }
  // Detect medical/bio interest
  else if (
    text.includes("health") ||
    text.includes("medical") ||
    text.includes("biology") ||
    text.includes("help people") ||
    text.includes("doctor")
  ) {
    archetype = "HEALER"
    archetypeTitle = "The Compassionate Healer"
    suggestedPaths = [
      {
        icon: "⚕️",
        title: "Medicine",
        description: "Your empathy and desire to help people makes medicine a natural fit",
        matchPercentage: 88,
      },
      {
        icon: "🧬",
        title: "Biotechnology",
        description: "Combine your scientific curiosity with healthcare impact",
        matchPercentage: 72,
      },
    ]
  }
  // Default: analytical path
  else {
    suggestedPaths = [
      {
        icon: "📊",
        title: "Data Science",
        description: "Your analytical thinking and problem-solving skills align with data-driven careers",
        matchPercentage: 78,
      },
      {
        icon: "🎯",
        title: "Business Analytics",
        description: "Combine analytical skills with strategic business impact",
        matchPercentage: 70,
      },
    ]
  }

  return {
    archetype,
    archetypeTitle,
    description:
      "Based on your responses, you show strong analytical abilities combined with a desire to solve real-world problems. You think systematically and enjoy understanding how things work.",
    suggestedPaths,
    keyTraits: [
      {
        icon: "🧠",
        name: "Analytical Thinker",
        description: "You approach problems methodically and enjoy breaking down complex challenges",
      },
      {
        icon: "🎨",
        name: "Creative Problem Solver",
        description: "You find innovative solutions and think outside conventional boundaries",
      },
      {
        icon: "💪",
        name: "Self-Motivated",
        description: "You show initiative and can work independently on projects",
      },
    ],
    pros: [
      "Strong logical reasoning and problem-solving abilities",
      "Clear passion for your interests with depth of engagement",
      "Self-aware about strengths and areas for growth",
    ],
    cons: [
      "May need to develop stronger communication skills for teamwork",
      "Consider exploring interests outside your comfort zone",
    ],
  }
}

export default {
  analyzeCareerManifesto,
}
