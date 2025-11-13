/**
 * Product Routes
 */

const express = require("express")
const productController = require("../controllers/product.controller")
const { protect } = require("../middleware/auth")
const validate = require("../middleware/validate")
const {
  createProductValidation,
  updateProductValidation,
  productIdValidation,
} = require("../validators/product.validator")

const router = express.Router()

router.get("/", productController.getProducts)
router.get(
  "/:id",
  productIdValidation,
  validate,
  productController.getProductById
)
router.post(
  "/",
  protect,
  createProductValidation,
  validate,
  productController.createProduct
)
router.put(
  "/:id",
  protect,
  productIdValidation,
  updateProductValidation,
  validate,
  productController.updateProduct
)
router.delete(
  "/:id",
  protect,
  productIdValidation,
  validate,
  productController.deleteProduct
)

module.exports = router
