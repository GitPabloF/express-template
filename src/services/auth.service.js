/**
 * Authentication Service
 */

const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ApiError = require('../utils/ApiError')
const config = require('../config/app.config')

const generateToken = (userId, email, role) => {
  return jwt.sign({ id: userId, email, role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  })
}

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  })
}

const register = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email })
  if (existingUser) {
    throw ApiError.conflict('User with this email already exists')
  }

  const user = await User.create(userData)
  const token = generateToken(user._id, user.email, user.role)
  const refreshToken = generateRefreshToken(user._id)

  return {
    user: user.getPublicProfile(),
    token,
    refreshToken,
  }
}

const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password')
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated')
  }

  const isPasswordValid = await user.comparePassword(password)
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password')
  }

  user.lastLogin = new Date()
  await user.save()

  const token = generateToken(user._id, user.email, user.role)
  const refreshToken = generateRefreshToken(user._id)

  return {
    user: user.getPublicProfile(),
    token,
    refreshToken,
  }
}

const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret)
    const user = await User.findById(decoded.id)
    
    if (!user || !user.isActive) {
      throw ApiError.unauthorized('Invalid refresh token')
    }

    const token = generateToken(user._id, user.email, user.role)
    const newRefreshToken = generateRefreshToken(user._id)

    return {
      token,
      refreshToken: newRefreshToken,
    }
  } catch (error) {
    throw ApiError.unauthorized('Invalid or expired refresh token')
  }
}

const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password')

  if (!user) {
    throw ApiError.notFound('User not found')
  }

  return user
}

module.exports = {
  register,
  login,
  refreshAccessToken,
  getProfile,
}
