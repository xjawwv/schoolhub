const teachersService = require('./teachers.service')
const { sendSuccess, sendPaginated } = require('../../utils/response')

const getAll = async (req, res, next) => {
  try {
    const { teachers, meta } = await teachersService.getAll(req.query)
    sendPaginated(res, 'Data guru berhasil diambil', teachers, meta)
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const teacher = await teachersService.getById(req.params.id)
    sendSuccess(res, 'Data guru berhasil diambil', teacher)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const teacher = await teachersService.create(req.body)
    sendSuccess(res, 'Guru berhasil ditambahkan', teacher, 201)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const photo = req.file ? req.file.path : undefined
    const teacher = await teachersService.update(req.params.id, req.body, photo)
    sendSuccess(res, 'Data guru berhasil diperbarui', teacher)
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    await teachersService.remove(req.params.id)
    sendSuccess(res, 'Guru berhasil dihapus')
  } catch (error) {
    next(error)
  }
}

const getMyProfile = async (req, res, next) => {
  try {
    const teacher = await teachersService.getMyProfile(req.user.id)
    sendSuccess(res, 'Profil berhasil diambil', teacher)
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, getById, create, update, remove, getMyProfile }
