const prisma = require('../../config/database')

const get = async () => {
  const settings = await prisma.school_settings.findFirst({
    orderBy: { id: 'asc' },
  })
  return settings
}

const upsert = async (data, userId) => {
  const existing = await prisma.school_settings.findFirst()

  if (existing) {
    return prisma.school_settings.update({
      where: { id: existing.id },
      data: {
        school_name: data.school_name,
        school_latitude: parseFloat(data.school_latitude),
        school_longitude: parseFloat(data.school_longitude),
        school_radius: parseInt(data.school_radius) || 100,
        updated_by: userId,
      },
    })
  }

  return prisma.school_settings.create({
    data: {
      school_name: data.school_name,
      school_latitude: parseFloat(data.school_latitude),
      school_longitude: parseFloat(data.school_longitude),
      school_radius: parseInt(data.school_radius) || 100,
      updated_by: userId,
    },
  })
}

module.exports = { get, upsert }
