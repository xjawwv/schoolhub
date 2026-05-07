import { useApi } from './api'

export const authService = {
  login: (data) => useApi().post('/auth/login', data),
  getProfile: () => useApi().get('/auth/profile'),
  changePassword: (data) => useApi().put('/auth/change-password', data),
  logout: () => useApi().post('/auth/logout'),
}
