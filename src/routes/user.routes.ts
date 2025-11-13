import { Router } from "express"
import * as userController from "../controllers/user.controller"
import { protect, authorize } from "../middleware/auth"
import validate from "../middleware/validate"
import {
  updateUserValidation,
  userIdValidation,
  updatePasswordValidation,
} from "../validators/user.validator"

const router = Router()

router.use(protect)

router.get("/", authorize("admin"), userController.getUsers)
router.get("/:id", userIdValidation, validate, userController.getUserById)
router.put("/:id", userIdValidation, updateUserValidation, validate, userController.updateUser)
router.delete("/:id", authorize("admin"), userIdValidation, validate, userController.deleteUser)
router.put("/:id/password", userIdValidation, updatePasswordValidation, validate, userController.updatePassword)

export default router

