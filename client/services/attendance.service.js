import { useApi } from './api'

export const attendanceService = {
  getAll: (params) => useApi().get('/attendance', { params }),
  getById: (id) => useApi().get(`/attendance/${id}`),
  getMy: (params) => useApi().get('/attendance/my', { params }),
  getSummary: (params) => useApi().get('/attendance/summary', { params }),
  create: (data) => useApi().post('/attendance', data),
  update: (id, data) => useApi().put(`/attendance/${id}`, data),
}
