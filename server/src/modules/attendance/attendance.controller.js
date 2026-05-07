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

const create = async (req, res, next) => {
  try {
    const attendance = await attendanceService.create(req.body, req.user.id)
    const io = req.app.get('io')
    if (io) {
      io.emit('attendance:update', { classId: req.body.class_id, date: req.body.date })
    }
    sendSuccess(res, 'Absensi berhasil dibuat', attendance, 201)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const attendance = await attendanceService.update(req.params.id, req.body)
    const io = req.app.get('io')
    if (io) {
      io.emit('attendance:update', { attendanceId: req.params.id })
    }
    sendSuccess(res, 'Absensi berhasil diperbarui', attendance)
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

const getSummary = async (req, res, next) => {
  try {
    const data = await attendanceService.getSummary(req.query.class_id, req.query)
    sendSuccess(res, 'Ringkasan absensi berhasil diambil', data)
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, getById, create, update, getMyAttendance, getSummary }
