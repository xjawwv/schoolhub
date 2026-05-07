import { useApi } from './api'

export const studentsService = {
  getAll: (params) => useApi().get('/students', { params }),
  getById: (id) => useApi().get(`/students/${id}`),
  getMe: () => useApi().get('/students/me'),
  create: (data) => useApi().post('/students', data),
  update: (id, data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value)
    })
    return useApi().put(`/students/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  remove: (id) => useApi().delete(`/students/${id}`),
}
