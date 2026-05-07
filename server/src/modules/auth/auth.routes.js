const express = require('express')
const router = express.Router()
const authController = require('./auth.controller')
const { authenticate } = require('../../middleware/auth.middleware')
const validate = require('../../middleware/validate.middleware')
const { loginValidator, changePasswordValidator } = require('./auth.validator')
const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Terlalu banyak percobaan login, coba lagi dalam 15 menit' },
  standardHeaders: true,
  legacyHeaders: false,
})

router.post('/login', loginLimiter, loginValidator, validate, authController.login)
router.get('/profile', authenticate, authController.getProfile)
router.put('/change-password', authenticate, changePasswordValidator, validate, authController.changePassword)
router.post('/logout', authenticate, authController.logout)

module.exports = router
