const dashboardService = require('./dashboard.service')
const { sendSuccess } = require('../../utils/response')

const getStats = async (req, res, next) => {
  try {
    let stats
    if (req.user.role === 'ADMIN') {
      stats = await dashboardService.getAdminStats()
    } else if (req.user.role === 'GURU') {
      stats = await dashboardService.getGuruStats(req.user.id)
    } else {
      stats = await dashboardService.getSiswaStats(req.user.id)
    }
    sendSuccess(res, 'Data dashboard berhasil diambil', stats)
  } catch (error) {
    next(error)
  }
}

module.exports = { getStats }
