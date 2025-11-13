/**
 * Validation Middleware
 */

const { validationResult } = require("express-validator")
const ApiError = require("../utils/ApiError")

const validate = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }))

    throw ApiError.badRequest("Validation Error", extractedErrors)
  }

  next()
}

module.exports = validate
