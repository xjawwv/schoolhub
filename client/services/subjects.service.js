import { useApi } from './api'

export const subjectsService = {
  getAll: (params) => useApi().get('/subjects', { params }),
  getById: (id) => useApi().get(`/subjects/${id}`),
  create: (data) => useApi().post('/subjects', data),
  update: (id, data) => useApi().put(`/subjects/${id}`, data),
  remove: (id) => useApi().delete(`/subjects/${id}`),
}
