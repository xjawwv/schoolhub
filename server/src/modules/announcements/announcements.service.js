const prisma = require('../../config/database')
const { getPagination, buildMeta } = require('../../utils/pagination')

const getAll = async (query, userRole) => {
  const { page, limit, skip } = getPagination(query)
  const search = query.search || ''

  const where = {
    is_active: true,
    AND: [
      userRole !== 'ADMIN' ? { OR: [{ target_role: userRole }, { target_role: null }] } : {},
      search ? { OR: [{ title: { contains: search } }, { content: { contains: search } }] } : {},
    ],
  }

  const [total, announcements] = await Promise.all([
    prisma.announcements.count({ where }),
    prisma.announcements.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
    }),
  ])

  return { announcements, meta: buildMeta(total, page, limit) }
}

const getById = async (id) => {
  const announcement = await prisma.announcements.findUnique({
    where: { id: parseInt(id) },
  })

  if (!announcement) throw { statusCode: 404, message: 'Pengumuman tidak ditemukan' }
  return announcement
}

const create = async (data, userId) => {
  const announcement = await prisma.announcements.create({
    data: {
      title: data.title,
      content: data.content,
      target_role: data.target_role || null,
      is_active: true,
      created_by: userId,
    },
  })
  return announcement
}

const update = async (id, data) => {
  const existing = await prisma.announcements.findUnique({ where: { id: parseInt(id) } })
  if (!existing) throw { statusCode: 404, message: 'Pengumuman tidak ditemukan' }

  const announcement = await prisma.announcements.update({
    where: { id: parseInt(id) },
    data: {
      title: data.title || existing.title,
      content: data.content || existing.content,
      target_role: data.target_role !== undefined ? data.target_role : existing.target_role,
      is_active: data.is_active !== undefined ? data.is_active : existing.is_active,
    },
  })
  return announcement
}

const remove = async (id) => {
  const existing = await prisma.announcements.findUnique({ where: { id: parseInt(id) } })
  if (!existing) throw { statusCode: 404, message: 'Pengumuman tidak ditemukan' }
  await prisma.announcements.delete({ where: { id: parseInt(id) } })
}

module.exports = { getAll, getById, create, update, remove }
