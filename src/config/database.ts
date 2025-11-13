import mongoose from "mongoose"
import logger from "../utils/logger"
import config from "./app.config"

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.database.uri)

    logger.info(`MongoDB Connected: ${conn.connection.host}`)

    mongoose.connection.on("error", (err: Error) => {
      logger.error(`MongoDB connection error: ${err}`)
    })

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected")
    })

    process.on("SIGINT", async () => {
      await mongoose.connection.close()
      logger.info("MongoDB connection closed")
      process.exit(0)
    })
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${(error as Error).message}`)
    process.exit(1)
  }
}

