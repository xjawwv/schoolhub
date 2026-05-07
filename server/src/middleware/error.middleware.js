const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Terjadi kesalahan pada server'

  if (err.name === 'ValidationError') {
    statusCode = 400
    message = err.message
  }

  if (err.code === 'P2002') {
    statusCode = 409
    message = 'Data sudah ada, gunakan nilai yang unik'
  }

  if (err.code === 'P2025') {
    statusCode = 404
    message = 'Data tidak ditemukan'
  }

  if (err.name === 'MulterError') {
    statusCode = 400
    message = err.message
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
