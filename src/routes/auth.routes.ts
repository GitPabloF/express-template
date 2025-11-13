import { Router } from "express"
import * as authController from "../controllers/auth.controller"
import { protect } from "../middleware/auth"
import { authLimiter } from "../middleware/rateLimiter"
import validate from "../middleware/validate"
import {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
} from "../validators/auth.validator"

const router = Router()

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

export default router

