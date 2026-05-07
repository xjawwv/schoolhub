const subjectsService = require('./subjects.service')
const { sendSuccess, sendPaginated } = require('../../utils/response')

const getAll = async (req, res, next) => {
  try {
    const { subjects, meta } = await subjectsService.getAll(req.query)
    sendPaginated(res, 'Data mata pelajaran berhasil diambil', subjects, meta)
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const subject = await subjectsService.getById(req.params.id)
    sendSuccess(res, 'Data mata pelajaran berhasil diambil', subject)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const subject = await subjectsService.create(req.body)
    sendSuccess(res, 'Mata pelajaran berhasil dibuat', subject, 201)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const subject = await subjectsService.update(req.params.id, req.body)
    sendSuccess(res, 'Mata pelajaran berhasil diperbarui', subject)
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    await subjectsService.remove(req.params.id)
    sendSuccess(res, 'Mata pelajaran berhasil dihapus')
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, getById, create, update, remove }
