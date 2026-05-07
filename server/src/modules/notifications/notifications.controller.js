const notificationsService = require('./notifications.service')
const { sendSuccess, sendPaginated } = require('../../utils/response')

const getMyNotifications = async (req, res, next) => {
  try {
    const { notifications, meta } = await notificationsService.getMyNotifications(req.user.id, req.query)
    sendPaginated(res, 'Notifikasi berhasil diambil', notifications, meta)
  } catch (error) {
    next(error)
  }
}

const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationsService.markAsRead(req.params.id, req.user.id)
    sendSuccess(res, 'Notifikasi ditandai sudah dibaca', notification)
  } catch (error) {
    next(error)
  }
}

const markAllAsRead = async (req, res, next) => {
  try {
    await notificationsService.markAllAsRead(req.user.id)
    sendSuccess(res, 'Semua notifikasi ditandai sudah dibaca')
  } catch (error) {
    next(error)
  }
}

const getUnreadCount = async (req, res, next) => {
  try {
    const count = await notificationsService.getUnreadCount(req.user.id)
    sendSuccess(res, 'Jumlah notifikasi belum dibaca', { count })
  } catch (error) {
    next(error)
  }
}

module.exports = { getMyNotifications, markAsRead, markAllAsRead, getUnreadCount }
