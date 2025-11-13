/**
 * Standardized API Response Helpers
 */

const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

const errorResponse = (res, message, statusCode = 500, error = null) => {
  const response = {
    success: false,
    message,
  }

  if (error && process.env.NODE_ENV === 'development') {
    response.error = error
  }

  return res.status(statusCode).json(response)
}

const paginatedResponse = (res, data, page, limit, total, message = 'Success') => {
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

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
}
