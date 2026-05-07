const express = require('express')
const router = express.Router()
const studentsController = require('./students.controller')
const { authenticate, authorize } = require('../../middleware/auth.middleware')
const upload = require('../../config/multer')

router.use(authenticate)

router.get('/me', authorize('SISWA'), studentsController.getMyProfile)
router.get('/', authorize('ADMIN', 'GURU'), studentsController.getAll)
router.get('/:id', authorize('ADMIN', 'GURU'), studentsController.getById)
router.post('/', authorize('ADMIN'), studentsController.create)
router.put('/:id', authorize('ADMIN', 'SISWA'), upload.single('photo'), studentsController.update)
router.delete('/:id', authorize('ADMIN'), studentsController.remove)

module.exports = router
