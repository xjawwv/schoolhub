const bcrypt = require('bcryptjs')
const prisma = require('../../config/database')
const { getPagination, buildMeta } = require('../../utils/pagination')

const getAll = async (query) => {
  const { page, limit, skip } = getPagination(query)
  const search = query.search || ''
  const classId = query.class_id ? parseInt(query.class_id) : undefined

  const where = {
    AND: [
      classId ? { class_id: classId } : {},
      search
        ? {
            OR: [
              { full_name: { contains: search } },
              { nis: { contains: search } },
            ],
          }
        : {},
    ],
  }

  const [total, students] = await Promise.all([
    prisma.students.count({ where }),
    prisma.students.findMany({
      where,
      skip,
      take: limit,
      orderBy: { full_name: 'asc' },
      include: {
        class: { select: { id: true, name: true, grade: true } },
        user: { select: { id: true, username: true, email: true, is_active: true } },
      },
    }),
  ])

  return { students, meta: buildMeta(total, page, limit) }
}

const getById = async (id) => {
  const student = await prisma.students.findUnique({
    where: { id: parseInt(id) },
    include: {
      class: true,
      user: { select: { id: true, username: true, email: true, role: true, is_active: true } },
    },
  })

  if (!student) throw { statusCode: 404, message: 'Siswa tidak ditemukan' }
  return student
}

const create = async (data) => {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12
  const hashedPassword = await bcrypt.hash(data.password, rounds)

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.users.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: 'SISWA',
      },
    })

    const student = await tx.students.create({
      data: {
        user_id: user.id,
        nis: data.nis,
        full_name: data.full_name,
        gender: data.gender,
        birth_date: new Date(data.birth_date),
        birth_place: data.birth_place,
        address: data.address,
        phone: data.phone ? String(data.phone) : null,
        class_id: data.class_id ? parseInt(data.class_id) : null,
      },
      include: {
        class: { select: { id: true, name: true } },
        user: { select: { id: true, username: true, email: true } },
      },
    })

    return student
  })

  return result
}

const update = async (id, data, photo) => {
  const existing = await prisma.students.findUnique({ where: { id: parseInt(id) } })
  if (!existing) throw { statusCode: 404, message: 'Siswa tidak ditemukan' }

  const updateData = {}
  const allowedFields = ['full_name', 'gender', 'birth_date', 'birth_place', 'address', 'phone', 'class_id']
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      if (field === 'birth_date') updateData[field] = new Date(data[field])
      else if (field === 'class_id') updateData[field] = parseInt(data[field])
      else if (field === 'phone') updateData[field] = data[field] ? String(data[field]) : null
      else updateData[field] = data[field]
    }
  })

  if (photo) updateData.photo = photo

  const student = await prisma.students.update({
    where: { id: parseInt(id) },
    data: updateData,
    include: {
      class: { select: { id: true, name: true } },
      user: { select: { id: true, username: true, email: true } },
    },
  })

  return student
}

const remove = async (id) => {
  const existing = await prisma.students.findUnique({ where: { id: parseInt(id) } })
  if (!existing) throw { statusCode: 404, message: 'Siswa tidak ditemukan' }
  await prisma.users.delete({ where: { id: existing.user_id } })
}

const getMyProfile = async (userId) => {
  const student = await prisma.students.findUnique({
    where: { user_id: userId },
    include: {
      class: true,
      user: { select: { id: true, username: true, email: true } },
    },
  })

  if (!student) throw { statusCode: 404, message: 'Profil siswa tidak ditemukan' }
  return student
}

module.exports = { getAll, getById, create, update, remove, getMyProfile }
