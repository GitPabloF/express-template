/**
 * User Controller
 */

const userService = require('../services/user.service')
const asyncHandler = require('../utils/asyncHandler')
const { successResponse, paginatedResponse } = require('../utils/response')

const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10

  const result = await userService.getUsers(page, limit)

  paginatedResponse(
    res,
    result.users,
    page,
    limit,
    result.pagination.total,
    'Users retrieved successfully'
  )
})

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id)
  successResponse(res, user, 'User retrieved successfully')
})

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body)
  successResponse(res, user, 'User updated successfully')
})

const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id)
  successResponse(res, null, 'User deleted successfully')
})

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body
  await userService.updatePassword(req.params.id, oldPassword, newPassword)
  successResponse(res, null, 'Password updated successfully')
})

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updatePassword,
}
