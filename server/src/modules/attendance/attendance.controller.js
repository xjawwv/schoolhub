const attendanceService = require('./attendance.service')
const { sendSuccess, sendPaginated } = require('../../utils/response')

const getAll = async (req, res, next) => {
  try {
    const { attendance, meta } = await attendanceService.getAll(req.query)
    sendPaginated(res, 'Data absensi berhasil diambil', attendance, meta)
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const attendance = await attendanceService.getById(req.params.id)
    sendSuccess(res, 'Data absensi berhasil diambil', attendance)
  } catch (error) {
    next(error)
  }
}

const checkIn = async (req, res, next) => {
  try {
    const detail = await attendanceService.checkIn(req.user.id, req.body)
    const io = req.app.get('io')
    if (io) {
      io.emit('attendance:update', { studentId: req.user.id })
    }
    sendSuccess(res, 'Absensi berhasil dicatat', detail, 201)
  } catch (error) {
    next(error)
  }
}

const getTodayStatus = async (req, res, next) => {
  try {
    const status = await attendanceService.getTodayStatus(req.user.id)
    sendSuccess(res, 'Status absensi hari ini berhasil diambil', status)
  } catch (error) {
    next(error)
  }
}

const getMyAttendance = async (req, res, next) => {
  try {
    const { details, meta } = await attendanceService.getStudentAttendance(req.user.id, req.query)
    sendPaginated(res, 'Data absensi berhasil diambil', details, meta)
  } catch (error) {
    next(error)
  }
}

const getMySummary = async (req, res, next) => {
  try {
    const summary = await attendanceService.getStudentSummary(req.user.id)
    sendSuccess(res, 'Ringkasan absensi berhasil diambil', summary)
  } catch (error) {
    next(error)
  }
}

const getSummary = async (req, res, next) => {
  try {
    const data = await attendanceService.getSummary(req.query.class_id, req.query)
    sendSuccess(res, 'Ringkasan absensi berhasil diambil', data)
  } catch (error) {
    next(error)
  }
}

const adminUpdate = async (req, res, next) => {
  try {
    const attendance = await attendanceService.adminUpdate(req.params.id, req.body)
    sendSuccess(res, 'Absensi berhasil diperbarui', attendance)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAll,
  getById,
  checkIn,
  getTodayStatus,
  getMyAttendance,
  getMySummary,
  getSummary,
  adminUpdate,
}
