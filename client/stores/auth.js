import { defineStore } from 'pinia'
import { authService } from '~/services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user?.role === 'ADMIN',
    isGuru: (state) => state.user?.role === 'GURU',
    isSiswa: (state) => state.user?.role === 'SISWA',
    userRole: (state) => state.user?.role,
    dashboardPath: (state) => {
      if (!state.user) return '/login'
      const roleMap = { ADMIN: '/admin', GURU: '/guru', SISWA: '/siswa' }
      return roleMap[state.user.role] || '/login'
    },
  },

  actions: {
    async login(username, password) {
      this.loading = true
      this.error = null
      try {
        const response = await authService.login({ username, password })
        this.token = response.data.token
        this.user = response.data.user
        if (process.client) {
          localStorage.setItem('schoolhub_token', this.token)
          localStorage.setItem('schoolhub_user', JSON.stringify(this.user))
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Login gagal'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchProfile() {
      try {
        const response = await authService.getProfile()
        this.user = response.data
        if (process.client) {
          localStorage.setItem('schoolhub_user', JSON.stringify(this.user))
        }
      } catch (error) {
        this.logout()
      }
    },

    async changePassword(currentPassword, newPassword) {
      const response = await authService.changePassword({ currentPassword, newPassword })
      return response
    },

    logout() {
      this.user = null
      this.token = null
      if (process.client) {
        localStorage.removeItem('schoolhub_token')
        localStorage.removeItem('schoolhub_user')
      }
    },

    initFromStorage() {
      if (process.client) {
        const token = localStorage.getItem('schoolhub_token')
        const user = localStorage.getItem('schoolhub_user')
        if (token && user) {
          this.token = token
          this.user = JSON.parse(user)
        }
      }
    },
  },
})
