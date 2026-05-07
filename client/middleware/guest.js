export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  authStore.initFromStorage()

  if (authStore.isAuthenticated) {
    return navigateTo(authStore.dashboardPath)
  }
})
