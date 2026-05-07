import { useApi } from './api'

export const announcementsService = {
  getAll: (params) => useApi().get('/announcements', { params }),
  getById: (id) => useApi().get(`/announcements/${id}`),
  create: (data) => useApi().post('/announcements', data),
  update: (id, data) => useApi().put(`/announcements/${id}`, data),
  remove: (id) => useApi().delete(`/announcements/${id}`),
}
