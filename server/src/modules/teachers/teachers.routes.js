const express = require('express')
const router = express.Router()
const teachersController = require('./teachers.controller')
const { authenticate, authorize } = require('../../middleware/auth.middleware')
const upload = require('../../config/multer')

router.use(authenticate)

router.get('/me', authorize('GURU'), teachersController.getMyProfile)
router.get('/', authorize('ADMIN'), teachersController.getAll)
router.get('/:id', authorize('ADMIN'), teachersController.getById)
router.post('/', authorize('ADMIN'), teachersController.create)
router.put('/:id', authorize('ADMIN', 'GURU'), upload.single('photo'), teachersController.update)
router.delete('/:id', authorize('ADMIN'), teachersController.remove)

module.exports = router
