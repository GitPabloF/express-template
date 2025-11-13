import Product, { IProduct } from "../models/Product"
import ApiError from "../utils/ApiError"

interface ProductFilters {
  category?: string
  minPrice?: string
  maxPrice?: string
  search?: string
}

interface GetProductsResult {
  products: IProduct[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const createProduct = async (
  productData: Partial<IProduct>,
  userId: string
): Promise<IProduct> => {
  const product = await Product.create({
    ...productData,
    createdBy: userId,
  })

  return product
}

export const getProducts = async (
  page = 1,
  limit = 10,
  filters: ProductFilters = {}
): Promise<GetProductsResult> => {
  const skip = (page - 1) * limit
  const query: any = { isActive: true }

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
    .populate("createdBy", "name email")
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

export const getProductById = async (productId: string): Promise<IProduct> => {
  const product = await Product.findById(productId).populate(
    "createdBy",
    "name email"
  )

  if (!product) {
    throw ApiError.notFound("Product not found")
  }

  return product
}

export const updateProduct = async (
  productId: string,
  updateData: Partial<IProduct>
): Promise<IProduct> => {
  const product = await Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true,
  })

  if (!product) {
    throw ApiError.notFound("Product not found")
  }

  return product
}

export const deleteProduct = async (productId: string): Promise<void> => {
  const product = await Product.findByIdAndDelete(productId)

  if (!product) {
    throw ApiError.notFound("Product not found")
  }
}

