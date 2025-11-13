import { Request, Response } from "express"
import * as productService from "../services/product.service"
import asyncHandler from "../utils/asyncHandler"
import { successResponse, paginatedResponse } from "../utils/response"

export const createProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const product = await productService.createProduct(req.body, req.user!.id)
  successResponse(res, product, "Product created successfully", 201)
})

export const getProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string, 10) || 1
  const limit = parseInt(req.query.limit as string, 10) || 10

  const filters = {
    category: req.query.category as string,
    minPrice: req.query.minPrice as string,
    maxPrice: req.query.maxPrice as string,
    search: req.query.search as string,
  }

  const result = await productService.getProducts(page, limit, filters)

  paginatedResponse(
    res,
    result.products,
    page,
    limit,
    result.pagination.total,
    "Products retrieved successfully"
  )
})

export const getProductById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const product = await productService.getProductById(req.params.id)
  successResponse(res, product, "Product retrieved successfully")
})

export const updateProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const product = await productService.updateProduct(req.params.id, req.body)
  successResponse(res, product, "Product updated successfully")
})

export const deleteProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  await productService.deleteProduct(req.params.id)
  successResponse(res, null, "Product deleted successfully")
})

