const studentsService = require('./students.service')
const { sendSuccess, sendPaginated } = require('../../utils/response')

const getAll = async (req, res, next) => {
  try {
    const { students, meta } = await studentsService.getAll(req.query)
    sendPaginated(res, 'Data siswa berhasil diambil', students, meta)
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const student = await studentsService.getById(req.params.id)
    sendSuccess(res, 'Data siswa berhasil diambil', student)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const student = await studentsService.create(req.body)
    sendSuccess(res, 'Siswa berhasil ditambahkan', student, 201)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const photo = req.file ? req.file.path : undefined
    const student = await studentsService.update(req.params.id, req.body, photo)
    sendSuccess(res, 'Data siswa berhasil diperbarui', student)
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    await studentsService.remove(req.params.id)
    sendSuccess(res, 'Siswa berhasil dihapus')
  } catch (error) {
    next(error)
  }
}

const getMyProfile = async (req, res, next) => {
  try {
    const student = await studentsService.getMyProfile(req.user.id)
    sendSuccess(res, 'Profil berhasil diambil', student)
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, getById, create, update, remove, getMyProfile }
