/**
 * Authentication Controller
 */

const authService = require('../services/auth.service')
const asyncHandler = require('../utils/asyncHandler')
const { successResponse } = require('../utils/response')

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body
  const result = await authService.register({ name, email, password, role })
  successResponse(res, result, 'User registered successfully', 201)
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const result = await authService.login(email, password)
  successResponse(res, result, 'Login successful')
})

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body
  const result = await authService.refreshAccessToken(refreshToken)
  successResponse(res, result, 'Token refreshed successfully')
})

const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id)
  successResponse(res, user, 'Profile retrieved successfully')
})

const logout = asyncHandler(async (req, res) => {
  successResponse(res, null, 'Logout successful')
})

module.exports = {
  register,
  login,
  refreshToken,
  getProfile,
  logout,
}
