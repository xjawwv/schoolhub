const announcementsService = require('./announcements.service')
const { sendSuccess, sendPaginated } = require('../../utils/response')

const getAll = async (req, res, next) => {
  try {
    const { announcements, meta } = await announcementsService.getAll(req.query, req.user.role)
    sendPaginated(res, 'Data pengumuman berhasil diambil', announcements, meta)
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const announcement = await announcementsService.getById(req.params.id)
    sendSuccess(res, 'Data pengumuman berhasil diambil', announcement)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const announcement = await announcementsService.create(req.body, req.user.id)
    const io = req.app.get('io')
    if (io) {
      io.emit('announcement:new', announcement)
    }
    sendSuccess(res, 'Pengumuman berhasil dibuat', announcement, 201)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const announcement = await announcementsService.update(req.params.id, req.body)
    sendSuccess(res, 'Pengumuman berhasil diperbarui', announcement)
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    await announcementsService.remove(req.params.id)
    sendSuccess(res, 'Pengumuman berhasil dihapus')
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, getById, create, update, remove }
