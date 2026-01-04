import { sendError } from "../utils/response.js"

/**
 * Simple validation middleware factory
 * TODO: Replace with Joi after joi package is installed
 */
export const validate = (schema) => {
  return (req, res, next) => {
    // For now, just pass through - proper validation will be added with Joi
    req.validated = req.body
    next()
  }
}

/**
 * Common validation schemas (placeholder)
 * TODO: Implement with Joi validation schemas
 */
export const schemas = {
  signup: {},
  login: {},
  createQuizResult: {},
  createPredictorResult: {},
}
