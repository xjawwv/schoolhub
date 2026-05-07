<template>
  <header class="bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center gap-4 sticky top-0 z-10">
    <button
      class="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
      @click="uiStore.toggleSidebar()"
    >
      ☰
    </button>

    <button
      class="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors lg:hidden"
      @click="uiStore.toggleMobileSidebar()"
    >
      ☰
    </button>

    <div class="flex-1" />

    <div class="flex items-center gap-2">
      <div class="relative">
        <button
          class="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors relative"
          @click="notifOpen = !notifOpen"
        >
          🔔
          <span
            v-if="notificationsStore.unreadCount > 0"
            class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
          >
            {{ notificationsStore.unreadCount > 9 ? '9+' : notificationsStore.unreadCount }}
          </span>
        </button>

        <div
          v-if="notifOpen"
          v-click-outside="() => (notifOpen = false)"
          class="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
        >
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span class="font-semibold text-sm text-gray-900">Notifikasi</span>
            <button
              v-if="notificationsStore.unreadCount > 0"
              class="text-xs text-brand-600 hover:underline"
              @click="notificationsStore.markAllAsRead()"
            >
              Tandai semua dibaca
            </button>
          </div>
          <div class="max-h-72 overflow-y-auto scrollbar-thin">
            <div
              v-for="notif in notificationsStore.notifications.slice(0, 10)"
              :key="notif.id"
              class="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
              :class="{ 'bg-blue-50/50': !notif.is_read }"
              @click="notificationsStore.markAsRead(notif.id)"
            >
              <p class="text-sm font-medium text-gray-900">{{ notif.title }}</p>
              <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">{{ notif.message }}</p>
            </div>
            <div v-if="notificationsStore.notifications.length === 0" class="px-4 py-8 text-center text-sm text-gray-400">
              Tidak ada notifikasi
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 pl-2 border-l border-gray-100">
        <div class="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
          <span class="text-brand-700 font-semibold text-xs">
            {{ userInitials }}
          </span>
        </div>
        <div class="hidden sm:block">
          <p class="text-sm font-medium text-gray-900 leading-none">{{ authStore.user?.username }}</p>
          <p class="text-xs text-gray-400 mt-0.5">{{ roleLabel }}</p>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const authStore = useAuthStore()
const uiStore = useUiStore()
const notificationsStore = useNotificationsStore()
const notifOpen = ref(false)

const userInitials = computed(() => {
  const name = authStore.user?.username || ''
  return name.slice(0, 2).toUpperCase()
})

const roleLabel = computed(() => {
  const labels = { ADMIN: 'Administrator', GURU: 'Guru', SISWA: 'Siswa' }
  return labels[authStore.user?.role] || ''
})

onMounted(() => {
  notificationsStore.fetchUnreadCount()
  notificationsStore.fetchNotifications()
})

const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!el.contains(event.target)) binding.value(event)
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  },
}
</script>
