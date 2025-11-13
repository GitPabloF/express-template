/**
 * Product Controller
 */

const productService = require('../services/product.service')
const asyncHandler = require('../utils/asyncHandler')
const { successResponse, paginatedResponse } = require('../utils/response')

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body, req.user.id)
  successResponse(res, product, 'Product created successfully', 201)
})

const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10

  const filters = {
    category: req.query.category,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    search: req.query.search,
  }

  const result = await productService.getProducts(page, limit, filters)

  paginatedResponse(
    res,
    result.products,
    page,
    limit,
    result.pagination.total,
    'Products retrieved successfully'
  )
})

const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id)
  successResponse(res, product, 'Product retrieved successfully')
})

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body, req.user.id)
  successResponse(res, product, 'Product updated successfully')
})

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id)
  successResponse(res, null, 'Product deleted successfully')
})

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
}
