/**
 * User Routes
 */

const express = require('express')
const userController = require('../controllers/user.controller')
const { protect, authorize } = require('../middleware/auth')
const validate = require('../middleware/validate')
const {
  updateUserValidation,
  userIdValidation,
  updatePasswordValidation,
} = require('../validators/user.validator')

const router = express.Router()

router.use(protect)

router.get('/', authorize('admin'), userController.getUsers)
router.get('/:id', userIdValidation, validate, userController.getUserById)
router.put('/:id', userIdValidation, updateUserValidation, validate, userController.updateUser)
router.delete('/:id', authorize('admin'), userIdValidation, validate, userController.deleteUser)
router.put('/:id/password', userIdValidation, updatePasswordValidation, validate, userController.updatePassword)

module.exports = router
