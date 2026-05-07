export const useAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()
  const toast = useToast()

  const login = async (username, password) => {
    try {
      const result = await authStore.login(username, password)
      const { $socket } = useNuxtApp()
      $socket.connect()
      toast.success('Login berhasil')
      await navigateTo(authStore.dashboardPath)
      return result
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login gagal')
      throw error
    }
  }

  const logout = async () => {
    const { $socket } = useNuxtApp()
    $socket.disconnect()
    authStore.logout()
    toast.info('Anda telah logout')
    await navigateTo('/login')
  }

  return { login, logout, authStore }
}
