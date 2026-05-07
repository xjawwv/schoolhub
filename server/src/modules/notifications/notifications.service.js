const prisma = require('../../config/database')
const { getPagination, buildMeta } = require('../../utils/pagination')

const getMyNotifications = async (userId, query) => {
  const { page, limit, skip } = getPagination(query)
  const isRead = query.is_read !== undefined ? query.is_read === 'true' : undefined

  const where = {
    user_id: userId,
    ...(isRead !== undefined ? { is_read: isRead } : {}),
  }

  const [total, notifications] = await Promise.all([
    prisma.notifications.count({ where }),
    prisma.notifications.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
    }),
  ])

  return { notifications, meta: buildMeta(total, page, limit) }
}

const markAsRead = async (id, userId) => {
  const notification = await prisma.notifications.findFirst({
    where: { id: parseInt(id), user_id: userId },
  })

  if (!notification) throw { statusCode: 404, message: 'Notifikasi tidak ditemukan' }

  return prisma.notifications.update({
    where: { id: parseInt(id) },
    data: { is_read: true },
  })
}

const markAllAsRead = async (userId) => {
  await prisma.notifications.updateMany({
    where: { user_id: userId, is_read: false },
    data: { is_read: true },
  })
}

const create = async (data) => {
  const notification = await prisma.notifications.create({
    data: {
      user_id: parseInt(data.user_id),
      title: data.title,
      message: data.message,
      type: data.type,
    },
  })
  return notification
}

const getUnreadCount = async (userId) => {
  const count = await prisma.notifications.count({
    where: { user_id: userId, is_read: false },
  })
  return count
}

module.exports = { getMyNotifications, markAsRead, markAllAsRead, create, getUnreadCount }
