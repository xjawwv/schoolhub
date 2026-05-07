import { useApi } from './api'

export const gradesService = {
  getAll: (params) => useApi().get('/grades', { params }),
  getById: (id) => useApi().get(`/grades/${id}`),
  getMy: (params) => useApi().get('/grades/my', { params }),
  create: (data) => useApi().post('/grades', data),
  update: (id, data) => useApi().put(`/grades/${id}`, data),
  remove: (id) => useApi().delete(`/grades/${id}`),
}
