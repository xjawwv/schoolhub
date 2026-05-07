const bcrypt = require('bcryptjs')
const prisma = require('../../config/database')
const { getPagination, buildMeta } = require('../../utils/pagination')

const getAll = async (query) => {
  const { page, limit, skip } = getPagination(query)
  const search = query.search || ''
  const role = query.role || undefined

  const where = {
    AND: [
      role ? { role } : {},
      search
        ? {
            OR: [
              { username: { contains: search } },
              { email: { contains: search } },
            ],
          }
        : {},
    ],
  }

  const [total, users] = await Promise.all([
    prisma.users.count({ where }),
    prisma.users.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
      },
    }),
  ])

  return { users, meta: buildMeta(total, page, limit) }
}

const getById = async (id) => {
  const user = await prisma.users.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      is_active: true,
      created_at: true,
      student: true,
      teacher: true,
    },
  })

  if (!user) throw { statusCode: 404, message: 'User tidak ditemukan' }
  return user
}

const create = async (data) => {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12
  const hashedPassword = await bcrypt.hash(data.password, rounds)

  const user = await prisma.users.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
    select: { id: true, username: true, email: true, role: true, created_at: true },
  })

  return user
}

const update = async (id, data) => {
  const existing = await prisma.users.findUnique({ where: { id: parseInt(id) } })
  if (!existing) throw { statusCode: 404, message: 'User tidak ditemukan' }

  const updateData = {}
  if (data.email) updateData.email = data.email
  if (data.is_active !== undefined) updateData.is_active = data.is_active

  if (data.password) {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12
    updateData.password = await bcrypt.hash(data.password, rounds)
  }

  const user = await prisma.users.update({
    where: { id: parseInt(id) },
    data: updateData,
    select: { id: true, username: true, email: true, role: true, is_active: true },
  })

  return user
}

const remove = async (id) => {
  const existing = await prisma.users.findUnique({ where: { id: parseInt(id) } })
  if (!existing) throw { statusCode: 404, message: 'User tidak ditemukan' }
  await prisma.users.delete({ where: { id: parseInt(id) } })
}

module.exports = { getAll, getById, create, update, remove }
