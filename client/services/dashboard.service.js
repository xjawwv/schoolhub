import { useApi } from './api'

export const dashboardService = {
  getStats: () => useApi().get('/dashboard/stats'),
}
