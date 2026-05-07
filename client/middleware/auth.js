export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const authStore = useAuthStore()
  authStore.initFromStorage()

  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
