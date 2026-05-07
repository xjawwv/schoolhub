const prisma = require('../../config/database')
const { getPagination, buildMeta } = require('../../utils/pagination')

const getAll = async (query) => {
  const { page, limit, skip } = getPagination(query)
  const search = query.search || ''

  const where = search
    ? { OR: [{ name: { contains: search } }, { grade: { contains: search } }] }
    : {}

  const [total, classes] = await Promise.all([
    prisma.classes.count({ where }),
    prisma.classes.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ grade: 'asc' }, { name: 'asc' }],
      include: {
        _count: { select: { students: true, schedules: true } },
      },
    }),
  ])

  return { classes, meta: buildMeta(total, page, limit) }
}

const getById = async (id) => {
  const cls = await prisma.classes.findUnique({
    where: { id: parseInt(id) },
    include: {
      students: {
        select: { id: true, nis: true, full_name: true, gender: true, photo: true },
      },
      schedules: {
        include: {
          subject: { select: { id: true, name: true } },
          teacher: { select: { id: true, full_name: true } },
        },
      },
    },
  })

  if (!cls) throw { statusCode: 404, message: 'Kelas tidak ditemukan' }
  return cls
}

const create = async (data) => {
  const cls = await prisma.classes.create({
    data: {
      name: data.name,
      grade: data.grade,
      academic_year: data.academic_year,
    },
  })
  return cls
}

const update = async (id, data) => {
  const existing = await prisma.classes.findUnique({ where: { id: parseInt(id) } })
  if (!existing) throw { statusCode: 404, message: 'Kelas tidak ditemukan' }

  const cls = await prisma.classes.update({
    where: { id: parseInt(id) },
    data: {
      name: data.name || existing.name,
      grade: data.grade || existing.grade,
      academic_year: data.academic_year || existing.academic_year,
    },
  })
  return cls
}

const remove = async (id) => {
  const existing = await prisma.classes.findUnique({ where: { id: parseInt(id) } })
  if (!existing) throw { statusCode: 404, message: 'Kelas tidak ditemukan' }
  await prisma.classes.delete({ where: { id: parseInt(id) } })
}

module.exports = { getAll, getById, create, update, remove }
