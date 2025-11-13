/**
 * Request Logger Middleware
 */

const morgan = require("morgan")
const logger = require("../utils/logger")

const stream = {
  write: (message) => logger.http(message.trim()),
}

const skip = () => {
  const env = process.env.NODE_ENV || "development"
  return env === "test"
}

const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev"

const requestLogger = morgan(morganFormat, { stream, skip })

module.exports = requestLogger
