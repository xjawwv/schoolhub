const prisma = require('../../config/database')
const { getPagination, buildMeta } = require('../../utils/pagination')

const getAll = async (query) => {
  const { page, limit, skip } = getPagination(query)
  const search = query.search || ''

  const where = search
    ? { OR: [{ name: { contains: search } }, { code: { contains: search } }] }
    : {}

  const [total, subjects] = await Promise.all([
    prisma.subjects.count({ where }),
    prisma.subjects.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        teacher: { select: { id: true, full_name: true, nip: true } },
      },
    }),
  ])

  return { subjects, meta: buildMeta(total, page, limit) }
}

const getById = async (id) => {
  const subject = await prisma.subjects.findUnique({
    where: { id: parseInt(id) },
    include: {
      teacher: { select: { id: true, full_name: true, nip: true } },
    },
  })

  if (!subject) throw { statusCode: 404, message: 'Mata pelajaran tidak ditemukan' }
  return subject
}

const create = async (data) => {
  const subject = await prisma.subjects.create({
    data: {
      code: data.code,
      name: data.name,
      description: data.description || null,
      teacher_id: data.teacher_id ? parseInt(data.teacher_id) : null,
    },
    include: {
      teacher: { select: { id: true, full_name: true } },
    },
  })
  return subject
}

const update = async (id, data) => {
  const existing = await prisma.subjects.findUnique({ where: { id: parseInt(id) } })
  if (!existing) throw { statusCode: 404, message: 'Mata pelajaran tidak ditemukan' }

  const subject = await prisma.subjects.update({
    where: { id: parseInt(id) },
    data: {
      name: data.name || existing.name,
      description: data.description !== undefined ? data.description : existing.description,
      teacher_id: data.teacher_id !== undefined ? (data.teacher_id ? parseInt(data.teacher_id) : null) : existing.teacher_id,
    },
    include: {
      teacher: { select: { id: true, full_name: true } },
    },
  })
  return subject
}

const remove = async (id) => {
  const existing = await prisma.subjects.findUnique({ where: { id: parseInt(id) } })
  if (!existing) throw { statusCode: 404, message: 'Mata pelajaran tidak ditemukan' }
  await prisma.subjects.delete({ where: { id: parseInt(id) } })
}

module.exports = { getAll, getById, create, update, remove }
