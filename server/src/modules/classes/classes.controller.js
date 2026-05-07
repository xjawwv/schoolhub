const classesService = require('./classes.service')
const { sendSuccess, sendPaginated } = require('../../utils/response')

const getAll = async (req, res, next) => {
  try {
    const { classes, meta } = await classesService.getAll(req.query)
    sendPaginated(res, 'Data kelas berhasil diambil', classes, meta)
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const cls = await classesService.getById(req.params.id)
    sendSuccess(res, 'Data kelas berhasil diambil', cls)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const cls = await classesService.create(req.body)
    sendSuccess(res, 'Kelas berhasil dibuat', cls, 201)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const cls = await classesService.update(req.params.id, req.body)
    sendSuccess(res, 'Kelas berhasil diperbarui', cls)
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    await classesService.remove(req.params.id)
    sendSuccess(res, 'Kelas berhasil dihapus')
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, getById, create, update, remove }
