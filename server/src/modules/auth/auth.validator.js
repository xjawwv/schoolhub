const { body } = require('express-validator')

const loginValidator = [
  body('username').trim().notEmpty().withMessage('Username wajib diisi'),
  body('password').notEmpty().withMessage('Password wajib diisi'),
]

const registerValidator = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username wajib diisi')
    .isLength({ min: 3, max: 50 }).withMessage('Username harus 3-50 karakter')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username hanya boleh huruf, angka, dan underscore'),
  body('email').trim().isEmail().withMessage('Format email tidak valid').normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('role').isIn(['ADMIN', 'GURU', 'SISWA']).withMessage('Role tidak valid'),
]

const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Password lama wajib diisi'),
  body('newPassword')
    .isLength({ min: 6 }).withMessage('Password baru minimal 6 karakter'),
]

module.exports = { loginValidator, registerValidator, changePasswordValidator }
