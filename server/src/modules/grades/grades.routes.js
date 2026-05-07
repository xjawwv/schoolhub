const express = require('express')
const router = express.Router()
const gradesController = require('./grades.controller')
const { authenticate, authorize } = require('../../middleware/auth.middleware')

router.use(authenticate)

router.get('/my', authorize('SISWA'), gradesController.getMyGrades)
router.get('/', authorize('ADMIN', 'GURU'), gradesController.getAll)
router.get('/:id', authorize('ADMIN', 'GURU'), gradesController.getById)
router.post('/', authorize('GURU', 'ADMIN'), gradesController.create)
router.put('/:id', authorize('GURU', 'ADMIN'), gradesController.update)
router.delete('/:id', authorize('ADMIN'), gradesController.remove)

module.exports = router
