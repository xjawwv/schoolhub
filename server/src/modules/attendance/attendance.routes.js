const express = require('express')
const router = express.Router()
const attendanceController = require('./attendance.controller')
const { authenticate, authorize } = require('../../middleware/auth.middleware')

router.use(authenticate)

router.post('/check-in', authorize('SISWA'), attendanceController.checkIn)
router.get('/today', authorize('SISWA'), attendanceController.getTodayStatus)
router.get('/my', authorize('SISWA'), attendanceController.getMyAttendance)
router.get('/my-summary', authorize('SISWA'), attendanceController.getMySummary)
router.get('/summary', authorize('ADMIN', 'GURU'), attendanceController.getSummary)
router.get('/', authorize('ADMIN', 'GURU'), attendanceController.getAll)
router.get('/:id', authorize('ADMIN', 'GURU'), attendanceController.getById)
router.put('/:id', authorize('ADMIN'), attendanceController.adminUpdate)

module.exports = router
