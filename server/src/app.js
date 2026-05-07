const express = require('express')
const cors = require('cors')
const path = require('path')

const authRoutes = require('./modules/auth/auth.routes')
const usersRoutes = require('./modules/users/users.routes')
const studentsRoutes = require('./modules/students/students.routes')
const teachersRoutes = require('./modules/teachers/teachers.routes')
const classesRoutes = require('./modules/classes/classes.routes')
const subjectsRoutes = require('./modules/subjects/subjects.routes')
const schedulesRoutes = require('./modules/schedules/schedules.routes')
const attendanceRoutes = require('./modules/attendance/attendance.routes')
const gradesRoutes = require('./modules/grades/grades.routes')
const announcementsRoutes = require('./modules/announcements/announcements.routes')
const notificationsRoutes = require('./modules/notifications/notifications.routes')
const dashboardRoutes = require('./modules/dashboard/dashboard.routes')

const { errorHandler, notFound } = require('./middleware/error.middleware')

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'SchoolHub API berjalan', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/students', studentsRoutes)
app.use('/api/teachers', teachersRoutes)
app.use('/api/classes', classesRoutes)
app.use('/api/subjects', subjectsRoutes)
app.use('/api/schedules', schedulesRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/grades', gradesRoutes)
app.use('/api/announcements', announcementsRoutes)
app.use('/api/notifications', notificationsRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app
