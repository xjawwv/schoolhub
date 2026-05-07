const { verifyToken } = require('../config/jwt')
const prisma = require('../config/database')

const initSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) return next(new Error('Token tidak ditemukan'))

      const decoded = verifyToken(token)
      const user = await prisma.users.findUnique({
        where: { id: decoded.id },
        select: { id: true, username: true, role: true, is_active: true },
      })

      if (!user || !user.is_active) return next(new Error('Akun tidak valid'))

      socket.user = user
      next()
    } catch (error) {
      next(new Error('Token tidak valid'))
    }
  })

  io.on('connection', (socket) => {
    socket.join(`user:${socket.user.id}`)
    socket.join(`role:${socket.user.role}`)

    if (socket.user.role === 'SISWA') {
      prisma.students.findUnique({ where: { user_id: socket.user.id } }).then((student) => {
        if (student) socket.join(`student:${student.id}`)
      })
    }

    socket.on('disconnect', () => {})
  })
}

const sendNotificationToUser = (io, userId, notification) => {
  io.to(`user:${userId}`).emit('notification:new', notification)
}

const broadcastAnnouncement = (io, announcement) => {
  io.emit('announcement:new', announcement)
}

module.exports = { initSocket, sendNotificationToUser, broadcastAnnouncement }
