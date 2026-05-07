import { useApi } from './api'

export const classesService = {
  getAll: (params) => useApi().get('/classes', { params }),
  getById: (id) => useApi().get(`/classes/${id}`),
  create: (data) => useApi().post('/classes', data),
  update: (id, data) => useApi().put(`/classes/${id}`, data),
  remove: (id) => useApi().delete(`/classes/${id}`),
}
