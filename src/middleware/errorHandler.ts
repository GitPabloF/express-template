import { Request, Response, NextFunction } from "express"
import logger from "../utils/logger"
import ApiError from "../utils/ApiError"

const errorConverter = (err: any, _req: Request): ApiError => {
  let error = err

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500
    const message = error.message || "Internal Server Error"
    error = new ApiError(statusCode, message, false, err.stack)
  }

  return error
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const error = errorConverter(err, req)

  if (error.statusCode >= 500) {
    logger.error(
      `${error.statusCode} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    )
    logger.error(error.stack || "")
  } else {
    logger.warn(
      `${error.statusCode} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    )
  }

  const response: any = {
    success: false,
    message: error.message,
  }

  if (process.env.NODE_ENV === "development") {
    response.stack = error.stack
  }

  res.status(error.statusCode).json(response)
}

export const notFound = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const error = ApiError.notFound(`Route ${req.originalUrl} not found`)
  next(error)
}

