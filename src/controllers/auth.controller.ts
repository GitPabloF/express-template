import { Request, Response } from "express"
import * as authService from "../services/auth.service"
import asyncHandler from "../utils/asyncHandler"
import { successResponse } from "../utils/response"

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body
  const result = await authService.register({ name, email, password, role })
  successResponse(res, result, "User registered successfully", 201)
})

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body
  const result = await authService.login(email, password)
  successResponse(res, result, "Login successful")
})

export const refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body
  const result = await authService.refreshAccessToken(refreshToken)
  successResponse(res, result, "Token refreshed successfully")
})

export const getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await authService.getProfile(req.user!.id)
  successResponse(res, user, "Profile retrieved successfully")
})

export const logout = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  successResponse(res, null, "Logout successful")
})

