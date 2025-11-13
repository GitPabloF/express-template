import mongoose, { Document, Schema, Types } from "mongoose"

export interface IProduct extends Document {
  name: string
  description: string
  price: number
  category: "electronics" | "clothing" | "food" | "books" | "sports" | "other"
  stock: number
  image?: string
  isActive: boolean
  createdBy: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  inStock: boolean
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      trim: true,
      maxlength: [100, "Product name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a product description"],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a product price"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Please provide a product category"],
      enum: {
        values: ["electronics", "clothing", "food", "books", "sports", "other"],
        message: "{VALUE} is not a valid category",
      },
    },
    stock: {
      type: Number,
      required: [true, "Please provide stock quantity"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    image: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

productSchema.index({ name: "text", description: "text" })
productSchema.index({ category: 1 })
productSchema.index({ price: 1 })

productSchema.virtual("inStock").get(function (this: IProduct) {
  return this.stock > 0
})

const Product = mongoose.model<IProduct>("Product", productSchema)

export default Product

