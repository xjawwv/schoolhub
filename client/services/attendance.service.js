import { useApi } from './api'

export const attendanceService = {
  getAll: (params) => useApi().get('/attendance', { params }),
  getById: (id) => useApi().get(`/attendance/${id}`),
  getMy: (params) => useApi().get('/attendance/my', { params }),
  getMySummary: () => useApi().get('/attendance/my-summary'),
  getToday: () => useApi().get('/attendance/today'),
  checkIn: (data) => useApi().post('/attendance/check-in', data),
  getSummary: (params) => useApi().get('/attendance/summary', { params }),
  adminUpdate: (id, data) => useApi().put(`/attendance/${id}`, data),
}
