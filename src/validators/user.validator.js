/**
 * User Validators
 */

const { body, param } = require('express-validator')

const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
]

const userIdValidation = [
  param('id').isMongoId().withMessage('Invalid user ID format'),
]

const updatePasswordValidation = [
  body('oldPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
]

module.exports = {
  updateUserValidation,
  userIdValidation,
  updatePasswordValidation,
}
