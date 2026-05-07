const prisma = require('../../config/database')
const { getPagination, buildMeta } = require('../../utils/pagination')

const getAll = async (query) => {
  const { page, limit, skip } = getPagination(query)
  const studentId = query.student_id ? parseInt(query.student_id) : undefined
  const subjectId = query.subject_id ? parseInt(query.subject_id) : undefined
  const semester = query.semester ? parseInt(query.semester) : undefined

  const where = {
    AND: [
      studentId ? { student_id: studentId } : {},
      subjectId ? { subject_id: subjectId } : {},
      semester ? { semester } : {},
    ],
  }

  const [total, grades] = await Promise.all([
    prisma.grades.count({ where }),
    prisma.grades.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        student: { select: { id: true, nis: true, full_name: true } },
        subject: { select: { id: true, name: true, code: true } },
      },
    }),
  ])

  return { grades, meta: buildMeta(total, page, limit) }
}

const getById = async (id) => {
  const grade = await prisma.grades.findUnique({
    where: { id: parseInt(id) },
    include: {
      student: { select: { id: true, nis: true, full_name: true } },
      subject: { select: { id: true, name: true, code: true } },
    },
  })

  if (!grade) throw { statusCode: 404, message: 'Data nilai tidak ditemukan' }
  return grade
}

const create = async (data) => {
  const grade = await prisma.grades.create({
    data: {
      student_id: parseInt(data.student_id),
      subject_id: parseInt(data.subject_id),
      semester: parseInt(data.semester),
      score: parseFloat(data.score),
      grade_type: data.grade_type,
      notes: data.notes || null,
    },
    include: {
      student: { select: { id: true, nis: true, full_name: true } },
      subject: { select: { id: true, name: true } },
    },
  })
  return grade
}

const update = async (id, data) => {
  const existing = await prisma.grades.findUnique({ where: { id: parseInt(id) } })
  if (!existing) throw { statusCode: 404, message: 'Data nilai tidak ditemukan' }

  const grade = await prisma.grades.update({
    where: { id: parseInt(id) },
    data: {
      score: data.score !== undefined ? parseFloat(data.score) : existing.score,
      grade_type: data.grade_type || existing.grade_type,
      notes: data.notes !== undefined ? data.notes : existing.notes,
    },
    include: {
      student: { select: { id: true, nis: true, full_name: true } },
      subject: { select: { id: true, name: true } },
    },
  })
  return grade
}

const remove = async (id) => {
  const existing = await prisma.grades.findUnique({ where: { id: parseInt(id) } })
  if (!existing) throw { statusCode: 404, message: 'Data nilai tidak ditemukan' }
  await prisma.grades.delete({ where: { id: parseInt(id) } })
}

const getMyGrades = async (userId, query) => {
  const student = await prisma.students.findUnique({ where: { user_id: userId } })
  if (!student) throw { statusCode: 404, message: 'Data siswa tidak ditemukan' }

  const semester = query.semester ? parseInt(query.semester) : undefined
  const where = {
    student_id: student.id,
    ...(semester ? { semester } : {}),
  }

  const grades = await prisma.grades.findMany({
    where,
    orderBy: [{ semester: 'asc' }, { subject: { name: 'asc' } }],
    include: {
      subject: { select: { id: true, name: true, code: true } },
    },
  })

  return grades
}

module.exports = { getAll, getById, create, update, remove, getMyGrades }
