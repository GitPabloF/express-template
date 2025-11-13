/**
 * Server Entry Point
 * Starts the Express server and connects to database
 */

const createApp = require('./app')
const config = require('./config/app.config')
const { connectDB } = require('./config/database')
const logger = require('./utils/logger')

const startServer = async () => {
  try {
    await connectDB()

    const app = createApp()

    const server = app.listen(config.port, () => {
      logger.info(`Server running in ${config.env} mode on port ${config.port}`)
      logger.info(`API available at http://localhost:${config.port}/api/${config.apiVersion}`)
    })

    process.on('unhandledRejection', (err) => {
      logger.error(`Unhandled Rejection: ${err.message}`)
      server.close(() => process.exit(1))
    })

    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server')
      server.close(() => {
        logger.info('HTTP server closed')
      })
    })
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`)
    process.exit(1)
  }
}

startServer()
