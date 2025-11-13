/**
 * Route Index
 */

const express = require("express")
const authRoutes = require("./auth.routes")
const userRoutes = require("./user.routes")
const productRoutes = require("./product.routes")

const router = express.Router()

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/products", productRoutes)

module.exports = router
