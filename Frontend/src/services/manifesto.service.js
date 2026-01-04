import api from "./api"

/**
 * Analyze Career Manifesto responses using AI
 * @param {Object} responses - User responses to all 5 realms
 * @returns {Object} - Career archetype, suggested paths, traits, pros/cons
 */
export const analyzeManifesto = async (responses) => {
  try {
    const response = await api.post("/manifesto/analyze", { responses })
    return response.data
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to analyze manifesto"
    throw new Error(errorMessage)
  }
}

export const manifestoService = {
  analyzeManifesto,
}

export default manifestoService
