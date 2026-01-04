/**
 * Standardized API response format
 */
export const sendSuccess = (res, data, message = "Success", statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

export const sendError = (res, message = "Error", statusCode = 500, error = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? error : null,
  })
}

/**
 * Paginated response
 */
export const sendPaginated = (res, data, total, page, limit, message = "Success") => {
  res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  })
}

export default { sendSuccess, sendError, sendPaginated }
