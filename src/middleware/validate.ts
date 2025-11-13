import { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"
import ApiError from "../utils/ApiError"

const validate = (req: Request, _res: Response, next: NextFunction): void => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    errors.array().map((err: any) => ({
      field: err.path,
      message: err.msg,
    }))

    throw ApiError.badRequest("Validation Error")
  }

  next()
}

export default validate

