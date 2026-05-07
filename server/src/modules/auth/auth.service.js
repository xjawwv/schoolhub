const bcrypt = require('bcryptjs')
const prisma = require('../../config/database')
const { generateToken } = require('../../config/jwt')

const login = async (username, password) => {
  const user = await prisma.users.findFirst({
    where: {
      OR: [{ username }, { email: username }],
      is_active: true,
    },
    include: {
      student: { select: { id: true, full_name: true, photo: true, nis: true } },
      teacher: { select: { id: true, full_name: true, photo: true, nip: true } },
    },
  })

  if (!user) {
    throw { statusCode: 401, message: 'Username atau password salah' }
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw { statusCode: 401, message: 'Username atau password salah' }
  }

  const token = generateToken({ id: user.id, role: user.role })

  const profile = user.role === 'SISWA' ? user.student : user.role === 'GURU' ? user.teacher : null

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile,
    },
  }
}

const getProfile = async (userId) => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      is_active: true,
      created_at: true,
      student: {
        select: {
          id: true,
          nis: true,
          full_name: true,
          gender: true,
          birth_date: true,
          birth_place: true,
          address: true,
          phone: true,
          photo: true,
          class: { select: { id: true, name: true, grade: true } },
        },
      },
      teacher: {
        select: {
          id: true,
          nip: true,
          full_name: true,
          gender: true,
          birth_date: true,
          birth_place: true,
          address: true,
          phone: true,
          photo: true,
        },
      },
    },
  })

  if (!user) {
    throw { statusCode: 404, message: 'User tidak ditemukan' }
  }

  return user
}

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.users.findUnique({ where: { id: userId } })

  const isValid = await bcrypt.compare(currentPassword, user.password)
  if (!isValid) {
    throw { statusCode: 400, message: 'Password lama tidak sesuai' }
  }

  const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12
  const hashed = await bcrypt.hash(newPassword, rounds)

  await prisma.users.update({
    where: { id: userId },
    data: { password: hashed },
  })
}

module.exports = { login, getProfile, changePassword }
