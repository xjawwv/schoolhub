const prisma = require('../../config/database')
const { getPagination, buildMeta } = require('../../utils/pagination')

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
        teacher: { select: { id: true, full_name: true } },
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
      teacher: { select: { id: true, full_name: true } },
      details: {
        include: {
          student: { select: { id: true, nis: true, full_name: true, photo: true } },
        },
      },
    },
  })

  if (!attendance) throw { statusCode: 404, message: 'Data absensi tidak ditemukan' }
  return attendance
}

const create = async (data, userId) => {
  const teacher = await prisma.teachers.findUnique({ where: { user_id: userId } })
  if (!teacher) throw { statusCode: 403, message: 'Hanya guru yang dapat membuat absensi' }

  const existing = await prisma.attendance.findUnique({
    where: { class_id_date: { class_id: parseInt(data.class_id), date: new Date(data.date) } },
  })

  if (existing) throw { statusCode: 409, message: 'Absensi untuk kelas dan tanggal ini sudah ada' }

  const attendance = await prisma.$transaction(async (tx) => {
    const att = await tx.attendance.create({
      data: {
        class_id: parseInt(data.class_id),
        teacher_id: teacher.id,
        date: new Date(data.date),
      },
    })

    if (data.details && data.details.length > 0) {
      await tx.attendance_details.createMany({
        data: data.details.map((d) => ({
          attendance_id: att.id,
          student_id: parseInt(d.student_id),
          status: d.status,
          notes: d.notes || null,
        })),
      })
    }

    return tx.attendance.findUnique({
      where: { id: att.id },
      include: {
        details: {
          include: { student: { select: { id: true, nis: true, full_name: true } } },
        },
      },
    })
  })

  return attendance
}

const update = async (id, data) => {
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
      details: {
        include: { student: { select: { id: true, nis: true, full_name: true } } },
      },
    },
  })
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
    include: {
      details: true,
      class: { select: { id: true, name: true } },
    },
  })

  return attendance
}

module.exports = { getAll, getById, create, update, getStudentAttendance, getSummary }
