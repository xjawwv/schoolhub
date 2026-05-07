import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    sidebarOpen: true,
    sidebarMobileOpen: false,
    darkMode: false,
  }),

  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    toggleMobileSidebar() {
      this.sidebarMobileOpen = !this.sidebarMobileOpen
    },

    closeMobileSidebar() {
      this.sidebarMobileOpen = false
    },

    toggleDarkMode() {
      this.darkMode = !this.darkMode
      if (process.client) {
        document.documentElement.classList.toggle('dark', this.darkMode)
        localStorage.setItem('schoolhub_dark', this.darkMode ? '1' : '0')
      }
    },

    initDarkMode() {
      if (process.client) {
        const saved = localStorage.getItem('schoolhub_dark')
        this.darkMode = saved === '1'
        document.documentElement.classList.toggle('dark', this.darkMode)
      }
    },
  },
})
