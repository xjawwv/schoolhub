const schedulesService = require('./schedules.service')
const { sendSuccess, sendPaginated } = require('../../utils/response')

const getAll = async (req, res, next) => {
  try {
    const { schedules, meta } = await schedulesService.getAll(req.query)
    sendPaginated(res, 'Data jadwal berhasil diambil', schedules, meta)
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const schedule = await schedulesService.getById(req.params.id)
    sendSuccess(res, 'Data jadwal berhasil diambil', schedule)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const schedule = await schedulesService.create(req.body)
    sendSuccess(res, 'Jadwal berhasil dibuat', schedule, 201)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const schedule = await schedulesService.update(req.params.id, req.body)
    sendSuccess(res, 'Jadwal berhasil diperbarui', schedule)
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    await schedulesService.remove(req.params.id)
    sendSuccess(res, 'Jadwal berhasil dihapus')
  } catch (error) {
    next(error)
  }
}

const getMySchedule = async (req, res, next) => {
  try {
    const schedules = await schedulesService.getMySchedule(req.user.id)
    sendSuccess(res, 'Jadwal mengajar berhasil diambil', schedules)
  } catch (error) {
    next(error)
  }
}

const getStudentSchedule = async (req, res, next) => {
  try {
    const schedules = await schedulesService.getStudentSchedule(req.user.id)
    sendSuccess(res, 'Jadwal pelajaran berhasil diambil', schedules)
  } catch (error) {
    next(error)
  }
}

const getByClass = async (req, res, next) => {
  try {
    const schedules = await schedulesService.getByClass(req.params.classId)
    sendSuccess(res, 'Jadwal kelas berhasil diambil', schedules)
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, getById, create, update, remove, getMySchedule, getStudentSchedule, getByClass }
