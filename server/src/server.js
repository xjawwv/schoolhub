require('dotenv').config()
const http = require('http')
const { Server } = require('socket.io')
const app = require('./app')
const { initSocket } = require('./sockets')
const prisma = require('./config/database')

const PORT = process.env.PORT || 5000

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

app.set('io', io)

initSocket(io)

const start = async () => {
  try {
    await prisma.$connect()
    server.listen(PORT, () => {
      console.log(`SchoolHub server berjalan di port ${PORT}`)
    })
  } catch (error) {
    console.error('Gagal menjalankan server:', error)
    process.exit(1)
  }
}

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  server.close()
})

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  server.close()
})

start()
