import { Request, Response } from "express"
import * as userService from "../services/user.service"
import asyncHandler from "../utils/asyncHandler"
import { successResponse, paginatedResponse } from "../utils/response"

export const getUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string, 10) || 1
  const limit = parseInt(req.query.limit as string, 10) || 10

  const result = await userService.getUsers(page, limit)

  paginatedResponse(
    res,
    result.users,
    page,
    limit,
    result.pagination.total,
    "Users retrieved successfully"
  )
})

export const getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await userService.getUserById(req.params.id)
  successResponse(res, user, "User retrieved successfully")
})

export const updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await userService.updateUser(req.params.id, req.body)
  successResponse(res, user, "User updated successfully")
})

export const deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  await userService.deleteUser(req.params.id)
  successResponse(res, null, "User deleted successfully")
})

export const updatePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { oldPassword, newPassword } = req.body
  await userService.updatePassword(req.params.id, oldPassword, newPassword)
  successResponse(res, null, "Password updated successfully")
})

