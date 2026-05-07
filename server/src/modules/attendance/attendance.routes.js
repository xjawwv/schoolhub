const express = require('express')
const router = express.Router()
const attendanceController = require('./attendance.controller')
const { authenticate, authorize } = require('../../middleware/auth.middleware')

router.use(authenticate)

router.get('/my', authorize('SISWA'), attendanceController.getMyAttendance)
router.get('/summary', authorize('ADMIN', 'GURU'), attendanceController.getSummary)
router.get('/', authorize('ADMIN', 'GURU'), attendanceController.getAll)
router.get('/:id', authorize('ADMIN', 'GURU'), attendanceController.getById)
router.post('/', authorize('GURU'), attendanceController.create)
router.put('/:id', authorize('GURU', 'ADMIN'), attendanceController.update)

module.exports = router
