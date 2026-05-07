export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) return navigateTo('/login')
  if (!authStore.isGuru) return navigateTo(authStore.dashboardPath)
})
