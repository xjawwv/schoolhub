const gradesService = require('./grades.service')
const { sendSuccess, sendPaginated } = require('../../utils/response')

const getAll = async (req, res, next) => {
  try {
    const { grades, meta } = await gradesService.getAll(req.query)
    sendPaginated(res, 'Data nilai berhasil diambil', grades, meta)
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const grade = await gradesService.getById(req.params.id)
    sendSuccess(res, 'Data nilai berhasil diambil', grade)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const grade = await gradesService.create(req.body)
    const io = req.app.get('io')
    if (io) {
      io.to(`student:${req.body.student_id}`).emit('grades:update', { studentId: req.body.student_id })
    }
    sendSuccess(res, 'Nilai berhasil ditambahkan', grade, 201)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const grade = await gradesService.update(req.params.id, req.body)
    const io = req.app.get('io')
    if (io) {
      io.emit('grades:update', { gradeId: req.params.id })
    }
    sendSuccess(res, 'Nilai berhasil diperbarui', grade)
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    await gradesService.remove(req.params.id)
    sendSuccess(res, 'Nilai berhasil dihapus')
  } catch (error) {
    next(error)
  }
}

const getMyGrades = async (req, res, next) => {
  try {
    const grades = await gradesService.getMyGrades(req.user.id, req.query)
    sendSuccess(res, 'Nilai berhasil diambil', grades)
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, getById, create, update, remove, getMyGrades }
