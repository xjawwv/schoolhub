const usersService = require('./users.service')
const { sendSuccess, sendError, sendPaginated } = require('../../utils/response')

const getAll = async (req, res, next) => {
  try {
    const { users, meta } = await usersService.getAll(req.query)
    sendPaginated(res, 'Data user berhasil diambil', users, meta)
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const user = await usersService.getById(req.params.id)
    sendSuccess(res, 'Data user berhasil diambil', user)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const user = await usersService.create(req.body)
    sendSuccess(res, 'User berhasil dibuat', user, 201)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const user = await usersService.update(req.params.id, req.body)
    sendSuccess(res, 'User berhasil diperbarui', user)
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    await usersService.remove(req.params.id)
    sendSuccess(res, 'User berhasil dihapus')
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, getById, create, update, remove }
