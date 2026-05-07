const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Terjadi kesalahan pada server'

  if (err.name === 'ValidationError') {
    statusCode = 400
    message = err.message
  }

  if (err.code === 'P2002') {
    statusCode = 409
    const field = err.meta?.target?.[0] || 'data'
    const fieldMap = {
      username: 'Username sudah digunakan',
      email: 'Email sudah digunakan',
      nis: 'NIS sudah terdaftar',
      nip: 'NIP sudah terdaftar',
    }
    message = fieldMap[field] || 'Data sudah ada, gunakan nilai yang unik'
  }

  if (err.code === 'P2025') {
    statusCode = 404
    message = 'Data tidak ditemukan'
  }

  if (err.code === 'P2003') {
    statusCode = 400
    message = 'Data referensi tidak ditemukan'
  }

  if (err.name === 'PrismaClientValidationError') {
    statusCode = 400
    message = 'Data yang dikirim tidak valid, periksa kembali isian form'
  }

  if (err.name === 'PrismaClientKnownRequestError' && !err.code) {
    statusCode = 400
    message = 'Permintaan tidak valid'
  }

  if (err.name === 'MulterError') {
    statusCode = 400
    message = err.message
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token tidak valid atau sudah kadaluarsa'
  }

  res.status(statusCode).json({
    success: false,
    message,
  })
}

const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} tidak ditemukan`,
  })
}

module.exports = { errorHandler, notFound }
