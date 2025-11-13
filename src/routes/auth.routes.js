/**
 * Authentication Routes
 */

const express = require("express")
const authController = require("../controllers/auth.controller")
const { protect } = require("../middleware/auth")
const { authLimiter } = require("../middleware/rateLimiter")
const validate = require("../middleware/validate")
const {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
} = require("../validators/auth.validator")

const router = express.Router()

router.post(
  "/register",
  authLimiter,
  registerValidation,
  validate,
  authController.register
)
router.post(
  "/login",
  authLimiter,
  loginValidation,
  validate,
  authController.login
)
router.post(
  "/refresh",
  refreshTokenValidation,
  validate,
  authController.refreshToken
)
router.get("/profile", protect, authController.getProfile)
router.post("/logout", protect, authController.logout)

module.exports = router
