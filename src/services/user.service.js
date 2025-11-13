/**
 * User Service
 */

const User = require('../models/User')
const ApiError = require('../utils/ApiError')

const getUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit

  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await User.countDocuments()

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}

const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password')

  if (!user) {
    throw ApiError.notFound('User not found')
  }

  return user
}

const updateUser = async (userId, updateData) => {
  delete updateData.password
  delete updateData.role

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select('-password')

  if (!user) {
    throw ApiError.notFound('User not found')
  }

  return user
}

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId)

  if (!user) {
    throw ApiError.notFound('User not found')
  }
}

const updatePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId).select('+password')

  if (!user) {
    throw ApiError.notFound('User not found')
  }

  const isMatch = await user.comparePassword(oldPassword)
  if (!isMatch) {
    throw ApiError.unauthorized('Current password is incorrect')
  }

  user.password = newPassword
  await user.save()
}

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updatePassword,
}
