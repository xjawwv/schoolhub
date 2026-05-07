const prisma = require('../../config/database')
const { getPagination, buildMeta } = require('../../utils/pagination')

const getAll = async (query) => {
  const { page, limit, skip } = getPagination(query)
  const classId = query.class_id ? parseInt(query.class_id) : undefined
  const teacherId = query.teacher_id ? parseInt(query.teacher_id) : undefined
  const day = query.day || undefined

  const where = {
    AND: [
      classId ? { class_id: classId } : {},
      teacherId ? { teacher_id: teacherId } : {},
      day ? { day } : {},
    ],
  }

  const [total, schedules] = await Promise.all([
    prisma.schedules.count({ where }),
    prisma.schedules.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ day: 'asc' }, { start_time: 'asc' }],
      include: {
        class: { select: { id: true, name: true, grade: true } },
        subject: { select: { id: true, name: true, code: true } },
        teacher: { select: { id: true, full_name: true } },
      },
    }),
  ])

  return { schedules, meta: buildMeta(total, page, limit) }
}

const getById = async (id) => {
  const schedule = await prisma.schedules.findUnique({
    where: { id: parseInt(id) },
    include: {
      class: true,
      subject: true,
      teacher: true,
    },
  })

  if (!schedule) throw { statusCode: 404, message: 'Jadwal tidak ditemukan' }
  return schedule
}

const create = async (data) => {
  const schedule = await prisma.schedules.create({
    data: {
      class_id: parseInt(data.class_id),
      subject_id: parseInt(data.subject_id),
      teacher_id: parseInt(data.teacher_id),
      day: data.day,
      start_time: data.start_time,
      end_time: data.end_time,
      room: data.room || null,
    },
    include: {
      class: { select: { id: true, name: true } },
      subject: { select: { id: true, name: true } },
      teacher: { select: { id: true, full_name: true } },
    },
  })
  return schedule
}

const update = async (id, data) => {
  const existing = await prisma.schedules.findUnique({ where: { id: parseInt(id) } })
  if (!existing) throw { statusCode: 404, message: 'Jadwal tidak ditemukan' }

  const schedule = await prisma.schedules.update({
    where: { id: parseInt(id) },
    data: {
      class_id: data.class_id ? parseInt(data.class_id) : existing.class_id,
      subject_id: data.subject_id ? parseInt(data.subject_id) : existing.subject_id,
      teacher_id: data.teacher_id ? parseInt(data.teacher_id) : existing.teacher_id,
      day: data.day || existing.day,
      start_time: data.start_time || existing.start_time,
      end_time: data.end_time || existing.end_time,
      room: data.room !== undefined ? data.room : existing.room,
    },
    include: {
      class: { select: { id: true, name: true } },
      subject: { select: { id: true, name: true } },
      teacher: { select: { id: true, full_name: true } },
    },
  })
  return schedule
}

const remove = async (id) => {
  const existing = await prisma.schedules.findUnique({ where: { id: parseInt(id) } })
  if (!existing) throw { statusCode: 404, message: 'Jadwal tidak ditemukan' }
  await prisma.schedules.delete({ where: { id: parseInt(id) } })
}

const getMySchedule = async (userId) => {
  const teacher = await prisma.teachers.findUnique({ where: { user_id: userId } })
  if (!teacher) throw { statusCode: 404, message: 'Profil guru tidak ditemukan' }

  const schedules = await prisma.schedules.findMany({
    where: { teacher_id: teacher.id },
    orderBy: [{ day: 'asc' }, { start_time: 'asc' }],
    include: {
      class: { select: { id: true, name: true, grade: true } },
      subject: { select: { id: true, name: true } },
    },
  })

  return schedules
}

const getStudentSchedule = async (userId) => {
  const student = await prisma.students.findUnique({ where: { user_id: userId } })
  if (!student || !student.class_id) throw { statusCode: 404, message: 'Data kelas siswa tidak ditemukan' }

  const schedules = await prisma.schedules.findMany({
    where: { class_id: student.class_id },
    orderBy: [{ day: 'asc' }, { start_time: 'asc' }],
    include: {
      subject: { select: { id: true, name: true } },
      teacher: { select: { id: true, full_name: true } },
    },
  })

  return schedules
}

const getByClass = async (classId) => {
  const schedules = await prisma.schedules.findMany({
    where: { class_id: parseInt(classId) },
    orderBy: [{ day: 'asc' }, { start_time: 'asc' }],
    include: {
      subject: { select: { id: true, name: true, code: true } },
      teacher: { select: { id: true, full_name: true } },
      class: { select: { id: true, name: true, grade: true } },
    },
  })
  return schedules
}

module.exports = { getAll, getById, create, update, remove, getMySchedule, getStudentSchedule, getByClass }
