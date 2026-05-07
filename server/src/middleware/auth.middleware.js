const { verifyToken } = require('../config/jwt')
const prisma = require('../config/database')

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token tidak ditemukan' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)

    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, email: true, role: true, is_active: true },
    })

    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, message: 'Akun tidak aktif atau tidak ditemukan' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token tidak valid atau sudah kadaluarsa' })
  }
}

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Akses ditolak' })
    }
    next()
  }
}

module.exports = { authenticate, authorize }
