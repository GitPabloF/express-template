import morgan from "morgan"
import logger from "../utils/logger"

const stream = {
  write: (message: string) => logger.http(message.trim()),
}

const skip = (): boolean => {
  const env = process.env.NODE_ENV || "development"
  return env === "test"
}

const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev"

const requestLogger = morgan(morganFormat, { stream, skip })

export default requestLogger

