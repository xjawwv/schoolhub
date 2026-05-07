const settingsService = require('./settings.service')
const { sendSuccess } = require('../../utils/response')

const get = async (req, res, next) => {
  try {
    const settings = await settingsService.get()
    sendSuccess(res, 'Pengaturan berhasil diambil', settings)
  } catch (error) {
    next(error)
  }
}

const upsert = async (req, res, next) => {
  try {
    const settings = await settingsService.upsert(req.body, req.user.id)
    sendSuccess(res, 'Pengaturan berhasil disimpan', settings)
  } catch (error) {
    next(error)
  }
}

module.exports = { get, upsert }
