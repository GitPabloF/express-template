/**
 * Winston Logger Configuration
 */

const winston = require("winston")
const config = require("../config/app.config")

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
)

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`
  })
)

const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: config.env === "development" ? consoleFormat : logFormat,
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
  exitOnError: false,
})

if (config.env !== "test") {
  logger.exceptions.handle(
    new winston.transports.File({ filename: "logs/exceptions.log" })
  )

  logger.rejections.handle(
    new winston.transports.File({ filename: "logs/rejections.log" })
  )
}

module.exports = logger
