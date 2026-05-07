import { defineStore } from 'pinia'
import { notificationsService } from '~/services/notifications.service'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    meta: null,
    loading: false,
  }),

  actions: {
    async fetchNotifications(params = {}) {
      this.loading = true
      try {
        const response = await notificationsService.getAll(params)
        this.notifications = response.data
        this.meta = response.meta
      } finally {
        this.loading = false
      }
    },

    async fetchUnreadCount() {
      try {
        const response = await notificationsService.getUnreadCount()
        this.unreadCount = response.data.count
      } catch {}
    },

    async markAsRead(id) {
      await notificationsService.markAsRead(id)
      const notification = this.notifications.find((n) => n.id === id)
      if (notification) {
        notification.is_read = true
        this.unreadCount = Math.max(0, this.unreadCount - 1)
      }
    },

    async markAllAsRead() {
      await notificationsService.markAllAsRead()
      this.notifications.forEach((n) => (n.is_read = true))
      this.unreadCount = 0
    },

    addNotification(notification) {
      this.notifications.unshift(notification)
      this.unreadCount += 1
    },
  },
})
