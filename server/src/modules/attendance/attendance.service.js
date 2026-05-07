const prisma = require('../../config/database')
const { getPagination, buildMeta } = require('../../utils/pagination')
const { validateLocation, detectSuspiciousLocation } = require('../../utils/geolocation')

const getAll = async (query) => {
  const { page, limit, skip } = getPagination(query)
  const classId = query.class_id ? parseInt(query.class_id) : undefined
  const date = query.date ? new Date(query.date) : undefined

  const where = {
    AND: [
      classId ? { class_id: classId } : {},
      date ? { date } : {},
    ],
  }

  const [total, attendance] = await Promise.all([
    prisma.attendance.count({ where }),
    prisma.attendance.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: 'desc' },
      include: {
        class: { select: { id: true, name: true, grade: true } },
        _count: { select: { details: true } },
      },
    }),
  ])

  return { attendance, meta: buildMeta(total, page, limit) }
}

const getById = async (id) => {
  const attendance = await prisma.attendance.findUnique({
    where: { id: parseInt(id) },
    include: {
      class: { select: { id: true, name: true } },
      details: {
        include: {
          student: { select: { id: true, nis: true, full_name: true, photo: true, gender: true } },
        },
        orderBy: { student: { full_name: 'asc' } },
      },
    },
  })

  if (!attendance) throw { statusCode: 404, message: 'Data absensi tidak ditemukan' }
  return attendance
}

const checkIn = async (userId, data) => {
  const student = await prisma.students.findUnique({ where: { user_id: userId } })
  if (!student) throw { statusCode: 404, message: 'Data siswa tidak ditemukan' }
  if (!student.class_id) throw { statusCode: 400, message: 'Siswa belum terdaftar di kelas manapun' }

  const { latitude, longitude, accuracy } = data

  if (latitude === undefined || latitude === null || longitude === undefined || longitude === null) {
    throw { statusCode: 400, message: 'Data lokasi wajib disertakan untuk absensi' }
  }

  const lat = parseFloat(latitude)
  const lon = parseFloat(longitude)
  const acc = accuracy !== undefined ? parseFloat(accuracy) : null

  const schoolSettings = await prisma.school_settings.findFirst()
  if (!schoolSettings) {
    throw { statusCode: 503, message: 'Konfigurasi lokasi sekolah belum diatur. Hubungi administrator' }
  }

  const locationResult = validateLocation(lat, lon, acc, {
    lat: schoolSettings.school_latitude,
    lon: schoolSettings.school_longitude,
    radius: schoolSettings.school_radius,
  })

  if (!locationResult.valid) {
    throw { statusCode: 403, message: locationResult.reason }
  }

  const suspiciousFlags = detectSuspiciousLocation(lat, lon, acc)
  if (suspiciousFlags.includes('accuracy_zero') || suspiciousFlags.includes('accuracy_too_perfect')) {
    throw { statusCode: 403, message: 'Terdeteksi penggunaan GPS palsu. Absensi ditolak' }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let attendance = await prisma.attendance.findUnique({
    where: { class_id_date: { class_id: student.class_id, date: today } },
  })

  if (!attendance) {
    attendance = await prisma.attendance.create({
      data: { class_id: student.class_id, date: today },
    })
  }

  const existing = await prisma.attendance_details.findUnique({
    where: {
      attendance_id_student_id: {
        attendance_id: attendance.id,
        student_id: student.id,
      },
    },
  })

  if (existing) throw { statusCode: 409, message: 'Anda sudah melakukan absensi hari ini' }

  const detail = await prisma.attendance_details.create({
    data: {
      attendance_id: attendance.id,
      student_id: student.id,
      status: data.status || 'HADIR',
      notes: data.notes || null,
      check_in_time: new Date(),
      latitude: lat,
      longitude: lon,
      accuracy: acc,
      is_location_valid: true,
    },
    include: {
      attendance: {
        include: { class: { select: { id: true, name: true } } },
      },
    },
  })

  return detail
}

const getTodayStatus = async (userId) => {
  const student = await prisma.students.findUnique({ where: { user_id: userId } })
  if (!student) throw { statusCode: 404, message: 'Data siswa tidak ditemukan' }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (!student.class_id) {
    return { hasCheckedIn: false, detail: null }
  }

  const attendance = await prisma.attendance.findUnique({
    where: { class_id_date: { class_id: student.class_id, date: today } },
  })

  if (!attendance) return { hasCheckedIn: false, detail: null }

  const detail = await prisma.attendance_details.findUnique({
    where: {
      attendance_id_student_id: {
        attendance_id: attendance.id,
        student_id: student.id,
      },
    },
    include: {
      attendance: {
        include: { class: { select: { id: true, name: true } } },
      },
    },
  })

  return { hasCheckedIn: !!detail, detail }
}

const getStudentAttendance = async (userId, query) => {
  const student = await prisma.students.findUnique({ where: { user_id: userId } })
  if (!student) throw { statusCode: 404, message: 'Data siswa tidak ditemukan' }

  const { page, limit, skip } = getPagination(query)

  const [total, details] = await Promise.all([
    prisma.attendance_details.count({ where: { student_id: student.id } }),
    prisma.attendance_details.findMany({
      where: { student_id: student.id },
      skip,
      take: limit,
      orderBy: { attendance: { date: 'desc' } },
      include: {
        attendance: {
          include: {
            class: { select: { id: true, name: true } },
          },
        },
      },
    }),
  ])

  return { details, meta: buildMeta(total, page, limit) }
}

const getStudentSummary = async (userId) => {
  const student = await prisma.students.findUnique({ where: { user_id: userId } })
  if (!student) throw { statusCode: 404, message: 'Data siswa tidak ditemukan' }

  const summary = await prisma.attendance_details.groupBy({
    by: ['status'],
    where: { student_id: student.id },
    _count: { status: true },
  })

  const result = { HADIR: 0, SAKIT: 0, IZIN: 0, ALPHA: 0 }
  summary.forEach((s) => { result[s.status] = s._count.status })

  return result
}

const getSummary = async (classId, query) => {
  const where = classId ? { class_id: parseInt(classId) } : {}
  if (query.start_date && query.end_date) {
    where.date = {
      gte: new Date(query.start_date),
      lte: new Date(query.end_date),
    }
  }

  const attendance = await prisma.attendance.findMany({
    where,
    orderBy: { date: 'desc' },
    include: {
      details: true,
      class: { select: { id: true, name: true } },
    },
  })

  return attendance
}

const adminUpdate = async (id, data) => {
  const existing = await prisma.attendance.findUnique({ where: { id: parseInt(id) } })
  if (!existing) throw { statusCode: 404, message: 'Data absensi tidak ditemukan' }

  if (data.details && data.details.length > 0) {
    await prisma.$transaction(
      data.details.map((d) =>
        prisma.attendance_details.upsert({
          where: {
            attendance_id_student_id: {
              attendance_id: parseInt(id),
              student_id: parseInt(d.student_id),
            },
          },
          update: { status: d.status, notes: d.notes || null },
          create: {
            attendance_id: parseInt(id),
            student_id: parseInt(d.student_id),
            status: d.status,
            notes: d.notes || null,
          },
        })
      )
    )
  }

  return prisma.attendance.findUnique({
    where: { id: parseInt(id) },
    include: {
      class: { select: { id: true, name: true } },
      details: {
        include: { student: { select: { id: true, nis: true, full_name: true } } },
        orderBy: { student: { full_name: 'asc' } },
      },
    },
  })
}

module.exports = {
  getAll,
  getById,
  checkIn,
  getTodayStatus,
  getStudentAttendance,
  getStudentSummary,
  getSummary,
  adminUpdate,
}
