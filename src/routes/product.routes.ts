import { Router } from "express"
import * as productController from "../controllers/product.controller"
import { protect } from "../middleware/auth"
import validate from "../middleware/validate"
import {
  createProductValidation,
  updateProductValidation,
  productIdValidation,
} from "../validators/product.validator"

const router = Router()

router.get("/", productController.getProducts)
router.get("/:id", productIdValidation, validate, productController.getProductById)
router.post("/", protect, createProductValidation, validate, productController.createProduct)
router.put("/:id", protect, productIdValidation, updateProductValidation, validate, productController.updateProduct)
router.delete("/:id", protect, productIdValidation, validate, productController.deleteProduct)

export default router

