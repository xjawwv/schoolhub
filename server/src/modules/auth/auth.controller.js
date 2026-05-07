const authService = require('./auth.service')
const { sendSuccess, sendError } = require('../../utils/response')

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const result = await authService.login(username, password)
    sendSuccess(res, 'Login berhasil', result)
  } catch (error) {
    next(error)
  }
}

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id)
    sendSuccess(res, 'Profil berhasil diambil', user)
  } catch (error) {
    next(error)
  }
}

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    await authService.changePassword(req.user.id, currentPassword, newPassword)
    sendSuccess(res, 'Password berhasil diubah')
  } catch (error) {
    next(error)
  }
}

const logout = (req, res) => {
  sendSuccess(res, 'Logout berhasil')
}

module.exports = { login, getProfile, changePassword, logout }
