export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const authStore = useAuthStore()
  authStore.initFromStorage()

  if (!authStore.isAuthenticated) return navigateTo('/login')
  if (!authStore.isGuru) return navigateTo(authStore.dashboardPath)
})
