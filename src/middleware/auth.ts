import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import config from "../config/app.config"
import ApiError from "../utils/ApiError"
import asyncHandler from "../utils/asyncHandler"
import { TokenPayload } from "../types/auth.types"

export const protect = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
      throw ApiError.unauthorized("Not authorized to access this route")
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload

      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      }

      next()
    } catch (error) {
      throw ApiError.unauthorized("Invalid or expired token")
    }
  }
)

export const authorize = (...roles: Array<"user" | "admin">) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw ApiError.unauthorized("Not authorized")
    }

    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `User role '${req.user.role}' is not authorized to access this route`
      )
    }

    next()
  }
}
