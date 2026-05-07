const express = require('express')
const router = express.Router()
const classesController = require('./classes.controller')
const { authenticate, authorize } = require('../../middleware/auth.middleware')

router.use(authenticate)

router.get('/', authorize('ADMIN', 'GURU', 'SISWA'), classesController.getAll)
router.get('/:id', authorize('ADMIN', 'GURU', 'SISWA'), classesController.getById)
router.post('/', authorize('ADMIN'), classesController.create)
router.put('/:id', authorize('ADMIN'), classesController.update)
router.delete('/:id', authorize('ADMIN'), classesController.remove)

module.exports = router
