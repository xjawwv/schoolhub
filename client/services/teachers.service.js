import { useApi } from './api'

export const teachersService = {
  getAll: (params) => useApi().get('/teachers', { params }),
  getById: (id) => useApi().get(`/teachers/${id}`),
  getMe: () => useApi().get('/teachers/me'),
  create: (data) => useApi().post('/teachers', data),
  update: (id, data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value)
    })
    return useApi().put(`/teachers/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  remove: (id) => useApi().delete(`/teachers/${id}`),
}
