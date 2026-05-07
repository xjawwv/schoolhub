import { io } from 'socket.io-client'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const notificationsStore = useNotificationsStore()

  let socket = null

  const connect = () => {
    if (!authStore.token) return

    socket = io(config.public.socketUrl, {
      auth: { token: authStore.token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socket.on('connect', () => {})

    socket.on('notification:new', (notification) => {
      notificationsStore.addNotification(notification)
    })

    socket.on('announcement:new', (announcement) => {
      notificationsStore.addNotification({
        title: announcement.title,
        message: announcement.content,
        type: 'announcement',
        is_read: false,
        created_at: announcement.created_at,
      })
    })

    socket.on('disconnect', () => {})
  }

  const disconnect = () => {
    if (socket) {
      socket.disconnect()
      socket = null
    }
  }

  nuxtApp.provide('socket', { connect, disconnect, instance: () => socket })
})
