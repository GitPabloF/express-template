import createApp from "./app"
import config from "./config/app.config"
import { connectDB } from "./config/database"
import logger from "./utils/logger"

const startServer = async (): Promise<void> => {
  try {
    await connectDB()

    const app = createApp()

    const server = app.listen(config.port, () => {
      logger.info(`Server running in ${config.env} mode on port ${config.port}`)
      logger.info(`API available at http://localhost:${config.port}/api/${config.apiVersion}`)
    })

    process.on("unhandledRejection", (err: Error) => {
      logger.error(`Unhandled Rejection: ${err.message}`)
      server.close(() => process.exit(1))
    })

    process.on("SIGTERM", () => {
      logger.info("SIGTERM signal received: closing HTTP server")
      server.close(() => {
        logger.info("HTTP server closed")
      })
    })
  } catch (error) {
    logger.error(`Failed to start server: ${(error as Error).message}`)
    process.exit(1)
  }
}

startServer()

