import { useApi } from './api'

export const notificationsService = {
  getAll: (params) => useApi().get('/notifications', { params }),
  getUnreadCount: () => useApi().get('/notifications/unread-count'),
  markAsRead: (id) => useApi().put(`/notifications/${id}/read`),
  markAllAsRead: () => useApi().put('/notifications/read-all'),
}
