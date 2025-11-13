import jwt, { SignOptions } from "jsonwebtoken"
import User from "../models/User"
import ApiError from "../utils/ApiError"
import config from "../config/app.config"
import { RegisterData, AuthResponse, TokenPayload } from "../types/auth.types"

const generateToken = (userId: string, email: string, role: "user" | "admin"): string => {
  return jwt.sign(
    { id: userId, email, role } as TokenPayload,
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn } as SignOptions
  )
}

const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn } as SignOptions
  )
}

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const existingUser = await User.findOne({ email: userData.email })
  if (existingUser) {
    throw ApiError.conflict("User with this email already exists")
  }

  const user = await User.create(userData)
  const token = generateToken(String(user._id), user.email, user.role)
  const refreshToken = generateRefreshToken(String(user._id))

  return {
    user: user.getPublicProfile(),
    token,
    refreshToken,
  }
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const user = await User.findOne({ email }).select("+password")

  if (!user) {
    throw ApiError.unauthorized("Invalid email or password")
  }

  if (!user.isActive) {
    throw ApiError.forbidden("Your account has been deactivated")
  }

  const isPasswordValid = await user.comparePassword(password)
  if (!isPasswordValid) {
    throw ApiError.unauthorized("Invalid email or password")
  }

  user.lastLogin = new Date()
  await user.save()

  const token = generateToken(String(user._id), user.email, user.role)
  const refreshToken = generateRefreshToken(String(user._id))

  return {
    user: user.getPublicProfile(),
    token,
    refreshToken,
  }
}

export const refreshAccessToken = async (refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
  try {
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as { id: string }
    const user = await User.findById(decoded.id)

    if (!user || !user.isActive) {
      throw ApiError.unauthorized("Invalid refresh token")
    }

    const token = generateToken(String(user._id), user.email, user.role)
    const newRefreshToken = generateRefreshToken(String(user._id))

    return {
      token,
      refreshToken: newRefreshToken,
    }
  } catch (error) {
    throw ApiError.unauthorized("Invalid or expired refresh token")
  }
}

export const getProfile = async (userId: string): Promise<any> => {
  const user = await User.findById(userId).select("-password")

  if (!user) {
    throw ApiError.notFound("User not found")
  }

  return user
}

