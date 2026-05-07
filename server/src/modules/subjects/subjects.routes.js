const express = require('express')
const router = express.Router()
const subjectsController = require('./subjects.controller')
const { authenticate, authorize } = require('../../middleware/auth.middleware')

router.use(authenticate)

router.get('/', authorize('ADMIN', 'GURU', 'SISWA'), subjectsController.getAll)
router.get('/:id', authorize('ADMIN', 'GURU', 'SISWA'), subjectsController.getById)
router.post('/', authorize('ADMIN'), subjectsController.create)
router.put('/:id', authorize('ADMIN'), subjectsController.update)
router.delete('/:id', authorize('ADMIN'), subjectsController.remove)

module.exports = router
