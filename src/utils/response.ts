import { Response } from "express"

interface SuccessResponse<T> {
  success: boolean
  message: string
  data: T
}

interface ErrorResponse {
  success: boolean
  message: string
  error?: any
}

interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export const successResponse = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200
): Response<SuccessResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

export const errorResponse = (
  res: Response,
  message: string,
  statusCode = 500,
  error: any = null
): Response<ErrorResponse> => {
  const response: ErrorResponse = {
    success: false,
    message,
  }

  if (error && process.env.NODE_ENV === "development") {
    response.error = error
  }

  return res.status(statusCode).json(response)
}

export const paginatedResponse = <T>(
  res: Response,
  data: T,
  page: number,
  limit: number,
  total: number,
  message = "Success"
): Response<PaginatedResponse<T>> => {
  const totalPages = Math.ceil(total / limit)

  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  })
}

