import { useApi } from './api'

export const settingsService = {
  get: () => useApi().get('/settings'),
  update: (data) => useApi().put('/settings', data),
}
