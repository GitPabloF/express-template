import express, { Application } from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import config from "./config/app.config"
import requestLogger from "./middleware/requestLogger"
import { errorHandler, notFound } from "./middleware/errorHandler"
import { generalLimiter } from "./middleware/rateLimiter"
import routes from "./routes"

const createApp = (): Application => {
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

  app.get("/", (_req, res) => {
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

export default createApp

