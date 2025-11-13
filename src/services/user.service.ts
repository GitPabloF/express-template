import User, { IUser } from "../models/User"
import ApiError from "../utils/ApiError"

interface GetUsersResult {
  users: IUser[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const getUsers = async (page = 1, limit = 10): Promise<GetUsersResult> => {
  const skip = (page - 1) * limit

  const users = await User.find()
    .select("-password")
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

export const getUserById = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId).select("-password")

  if (!user) {
    throw ApiError.notFound("User not found")
  }

  return user
}

export const updateUser = async (userId: string, updateData: Partial<IUser>): Promise<IUser> => {
  const { password, role, ...safeUpdateData } = updateData as any

  const user = await User.findByIdAndUpdate(userId, safeUpdateData, {
    new: true,
    runValidators: true,
  }).select("-password")

  if (!user) {
    throw ApiError.notFound("User not found")
  }

  return user
}

export const deleteUser = async (userId: string): Promise<void> => {
  const user = await User.findByIdAndDelete(userId)

  if (!user) {
    throw ApiError.notFound("User not found")
  }
}

export const updatePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  const user = await User.findById(userId).select("+password")

  if (!user) {
    throw ApiError.notFound("User not found")
  }

  const isMatch = await user.comparePassword(oldPassword)
  if (!isMatch) {
    throw ApiError.unauthorized("Current password is incorrect")
  }

  user.password = newPassword
  await user.save()
}

