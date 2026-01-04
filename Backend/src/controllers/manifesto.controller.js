import { analyzeCareerManifesto } from "../services/manifesto.service.js"

/**
 * POST /api/manifesto/analyze
 * Analyze Career Manifesto responses
 */
export const analyzeManifesto = async (req, res, next) => {
  try {
    const { responses } = req.body

    if (!responses || Object.keys(responses).length !== 5) {
      return res.status(400).json({
        success: false,
        message: "All 5 realm responses are required",
      })
    }

    // Validate that each realm has content
    const requiredRealms = ["curiosity", "flow", "friction", "creation", "leadership"]
    for (const realm of requiredRealms) {
      if (!responses[realm] || responses[realm].trim().length < 20) {
        return res.status(400).json({
          success: false,
          message: `Response for ${realm} realm is too short or missing`,
        })
      }
    }

    const analysis = await analyzeCareerManifesto(responses)

    res.status(200).json({
      success: true,
      ...analysis,
    })
  } catch (error) {
    next(error)
  }
}
