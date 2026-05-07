const bcrypt = require('bcryptjs')
const prisma = require('../../config/database')
const { getPagination, buildMeta } = require('../../utils/pagination')

const getAll = async (query) => {
  const { page, limit, skip } = getPagination(query)
  const search = query.search || ''

  const where = search
    ? {
        OR: [
          { full_name: { contains: search } },
          { nip: { contains: search } },
        ],
      }
    : {}

  const [total, teachers] = await Promise.all([
    prisma.teachers.count({ where }),
    prisma.teachers.findMany({
      where,
      skip,
      take: limit,
      orderBy: { full_name: 'asc' },
      include: {
        user: { select: { id: true, username: true, email: true, is_active: true } },
        subjects: { select: { id: true, name: true, code: true } },
      },
    }),
  ])

  return { teachers, meta: buildMeta(total, page, limit) }
}

const getById = async (id) => {
  const teacher = await prisma.teachers.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: { select: { id: true, username: true, email: true, role: true, is_active: true } },
      subjects: true,
      schedules: {
        include: {
          class: { select: { id: true, name: true } },
          subject: { select: { id: true, name: true } },
        },
      },
    },
  })

  if (!teacher) throw { statusCode: 404, message: 'Guru tidak ditemukan' }
  return teacher
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
        role: 'GURU',
      },
    })

    const teacher = await tx.teachers.create({
      data: {
        user_id: user.id,
        nip: data.nip,
        full_name: data.full_name,
        gender: data.gender,
        birth_date: new Date(data.birth_date),
        birth_place: data.birth_place,
        address: data.address,
        phone: data.phone ? String(data.phone) : null,
      },
      include: {
        user: { select: { id: true, username: true, email: true } },
      },
    })

    return teacher
  })

  return result
}

const update = async (id, data, photo) => {
  const existing = await prisma.teachers.findUnique({ where: { id: parseInt(id) } })
  if (!existing) throw { statusCode: 404, message: 'Guru tidak ditemukan' }

  const updateData = {}
  const allowedFields = ['full_name', 'gender', 'birth_date', 'birth_place', 'address', 'phone']
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      if (field === 'birth_date') updateData[field] = new Date(data[field])
      else if (field === 'phone') updateData[field] = data[field] ? String(data[field]) : null
      else updateData[field] = data[field]
    }
  })

  if (photo) updateData.photo = photo

  const teacher = await prisma.teachers.update({
    where: { id: parseInt(id) },
    data: updateData,
    include: {
      user: { select: { id: true, username: true, email: true } },
    },
  })

  return teacher
}

const remove = async (id) => {
  const existing = await prisma.teachers.findUnique({ where: { id: parseInt(id) } })
  if (!existing) throw { statusCode: 404, message: 'Guru tidak ditemukan' }
  await prisma.users.delete({ where: { id: existing.user_id } })
}

const getMyProfile = async (userId) => {
  const teacher = await prisma.teachers.findUnique({
    where: { user_id: userId },
    include: {
      user: { select: { id: true, username: true, email: true } },
      subjects: true,
    },
  })

  if (!teacher) throw { statusCode: 404, message: 'Profil guru tidak ditemukan' }
  return teacher
}

module.exports = { getAll, getById, create, update, remove, getMyProfile }
