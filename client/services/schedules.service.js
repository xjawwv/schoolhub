import { useApi } from './api'

export const schedulesService = {
  getAll: (params) => useApi().get('/schedules', { params }),
  getById: (id) => useApi().get(`/schedules/${id}`),
  getMy: () => useApi().get('/schedules/my'),
  getStudent: () => useApi().get('/schedules/student'),
  getByClass: (classId) => useApi().get(`/schedules/class/${classId}`),
  create: (data) => useApi().post('/schedules', data),
  update: (id, data) => useApi().put(`/schedules/${id}`, data),
  remove: (id) => useApi().delete(`/schedules/${id}`),
}
