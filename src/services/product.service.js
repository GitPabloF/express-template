/**
 * Product Service
 */

const Product = require('../models/Product')
const ApiError = require('../utils/ApiError')

const createProduct = async (productData, userId) => {
  const product = await Product.create({
    ...productData,
    createdBy: userId,
  })

  return product
}

const getProducts = async (page = 1, limit = 10, filters = {}) => {
  const skip = (page - 1) * limit
  const query = { isActive: true }

  if (filters.category) {
    query.category = filters.category
  }

  if (filters.minPrice || filters.maxPrice) {
    query.price = {}
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice)
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice)
  }

  if (filters.search) {
    query.$text = { $search: filters.search }
  }

  const products = await Product.find(query)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Product.countDocuments(query)

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}

const getProductById = async (productId) => {
  const product = await Product.findById(productId).populate('createdBy', 'name email')

  if (!product) {
    throw ApiError.notFound('Product not found')
  }

  return product
}

const updateProduct = async (productId, updateData) => {
  const product = await Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true,
  })

  if (!product) {
    throw ApiError.notFound('Product not found')
  }

  return product
}

const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndDelete(productId)

  if (!product) {
    throw ApiError.notFound('Product not found')
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
}
