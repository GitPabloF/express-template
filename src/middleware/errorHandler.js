/**
 * Global Error Handler Middleware
 */

const logger = require("../utils/logger")
const ApiError = require("../utils/ApiError")

const errorConverter = (err, req) => {
  let error = err

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500
    const message = error.message || "Internal Server Error"
    error = new ApiError(statusCode, message, false, err.stack)
  }

  return error
}

const errorHandler = (err, req, res, next) => {
  let error = errorConverter(err, req)

  if (error.statusCode >= 500) {
    logger.error(
      `${error.statusCode} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    )
    logger.error(error.stack)
  } else {
    logger.warn(
      `${error.statusCode} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    )
  }

  const response = {
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  }

  res.status(error.statusCode).json(response)
}

const notFound = (req, res, next) => {
  const error = ApiError.notFound(`Route ${req.originalUrl} not found`)
  next(error)
}

module.exports = { errorHandler, notFound }
