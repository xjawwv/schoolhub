import { defineStore } from 'pinia'
import { authService } from '~/services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: () => {
    const tokenCookie = useCookie('schoolhub_token', { maxAge: 60 * 60 * 24 * 7 })
    const userCookie = useCookie('schoolhub_user', { maxAge: 60 * 60 * 24 * 7 })

    let user = null
    if (userCookie.value) {
      try {
        user = typeof userCookie.value === 'string'
          ? JSON.parse(userCookie.value)
          : userCookie.value
      } catch {
        user = null
      }
    }

    return {
      user,
      token: tokenCookie.value || null,
      loading: false,
      error: null,
    }
  },

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
        this._persist()
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
        this._persist()
      } catch {
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
      const tokenCookie = useCookie('schoolhub_token')
      const userCookie = useCookie('schoolhub_user')
      tokenCookie.value = null
      userCookie.value = null
    },

    _persist() {
      const tokenCookie = useCookie('schoolhub_token', { maxAge: 60 * 60 * 24 * 7 })
      const userCookie = useCookie('schoolhub_user', { maxAge: 60 * 60 * 24 * 7 })
      tokenCookie.value = this.token
      userCookie.value = JSON.stringify(this.user)
    },

    initFromStorage() {},
  },
})
