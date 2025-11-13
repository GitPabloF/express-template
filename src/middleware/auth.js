/**
 * Authentication Middleware
 */

const jwt = require("jsonwebtoken")
const config = require("../config/app.config")
const ApiError = require("../utils/ApiError")
const asyncHandler = require("../utils/asyncHandler")

const protect = asyncHandler(async (req, res, next) => {
  let token

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
    const decoded = jwt.verify(token, config.jwt.secret)

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    }

    next()
  } catch (error) {
    throw ApiError.unauthorized("Invalid or expired token")
  }
})

const authorize = (...roles) => {
  return (req, res, next) => {
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

module.exports = { protect, authorize }
