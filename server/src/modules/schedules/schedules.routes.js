const express = require('express')
const router = express.Router()
const schedulesController = require('./schedules.controller')
const { authenticate, authorize } = require('../../middleware/auth.middleware')

router.use(authenticate)

router.get('/my', authorize('GURU'), schedulesController.getMySchedule)
router.get('/student', authorize('SISWA'), schedulesController.getStudentSchedule)
router.get('/class/:classId', authorize('ADMIN', 'GURU'), schedulesController.getByClass)
router.get('/', authorize('ADMIN', 'GURU'), schedulesController.getAll)
router.get('/:id', authorize('ADMIN', 'GURU'), schedulesController.getById)
router.post('/', authorize('ADMIN'), schedulesController.create)
router.put('/:id', authorize('ADMIN'), schedulesController.update)
router.delete('/:id', authorize('ADMIN'), schedulesController.remove)

module.exports = router
