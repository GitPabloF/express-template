/**
 * Express Application Setup
 * Configures Express app with middleware and routes
 */

const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
const config = require("./config/app.config")
const requestLogger = require("./middleware/requestLogger")
const { errorHandler, notFound } = require("./middleware/errorHandler")
const { generalLimiter } = require("./middleware/rateLimiter")
const routes = require("./routes")

const createApp = () => {
  const app = express()

  app.use(helmet())
  app.use(cors(config.cors))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(compression())

  if (config.env !== "test") {
    app.use(requestLogger)
  }

  if (config.env === "production") {
    app.use(generalLimiter)
  }

  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "Express API Template",
      version: config.apiVersion,
      documentation: "/api/" + config.apiVersion,
    })
  })

  app.use(`/api/${config.apiVersion}`, routes)
  app.use(notFound)
  app.use(errorHandler)

  return app
}

module.exports = createApp
