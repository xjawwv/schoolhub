<template>
  <header class="bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 lg:px-8 h-16 flex items-center gap-3 sticky top-0 z-10 shadow-navbar">
    <button
      class="btn-icon hidden lg:flex"
      @click="uiStore.toggleSidebar()"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </button>

    <button
      class="btn-icon lg:hidden"
      @click="uiStore.toggleMobileSidebar()"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </button>

    <div class="hidden sm:flex items-center gap-1.5 text-sm text-gray-400">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
      <span>/</span>
      <span class="text-gray-700 font-medium capitalize">{{ currentSection }}</span>
    </div>

    <div class="flex-1" />

    <div class="flex items-center gap-1.5">
      <div class="relative">
        <button
          class="btn-icon relative"
          @click="notifOpen = !notifOpen"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <span
            v-if="notificationsStore.unreadCount > 0"
            class="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold ring-2 ring-white"
          >
            {{ notificationsStore.unreadCount > 9 ? '9+' : notificationsStore.unreadCount }}
          </span>
        </button>

        <Transition name="dropdown">
          <div
            v-if="notifOpen"
            v-click-outside="() => (notifOpen = false)"
            class="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-apple-lg border border-gray-100 overflow-hidden z-50"
          >
            <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <span class="font-semibold text-sm text-gray-900">Notifikasi</span>
              <button
                v-if="notificationsStore.unreadCount > 0"
                class="text-xs text-brand-600 hover:text-brand-700 font-medium"
                @click="notificationsStore.markAllAsRead()"
              >
                Tandai semua dibaca
              </button>
            </div>
            <div class="max-h-72 overflow-y-auto scrollbar-thin divide-y divide-gray-50">
              <div
                v-for="notif in notificationsStore.notifications.slice(0, 10)"
                :key="notif.id"
                class="px-4 py-3 hover:bg-gray-50/80 cursor-pointer transition-colors"
                :class="{ 'bg-brand-50/30 border-l-2 border-l-brand-500': !notif.is_read }"
                @click="notificationsStore.markAsRead(notif.id)"
              >
                <p class="text-sm font-medium text-gray-900">{{ notif.title }}</p>
                <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">{{ notif.message }}</p>
              </div>
              <div v-if="notificationsStore.notifications.length === 0" class="px-4 py-10 text-center">
                <svg class="w-10 h-10 text-gray-200 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                <p class="text-sm text-gray-400">Tidak ada notifikasi</p>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <div class="w-px h-6 bg-gray-200 mx-1" />

      <div class="flex items-center gap-2.5 pl-1">
        <UserAvatar
          :photo="navbarPhoto"
          :gender="navbarGender"
          :name="authStore.user?.username || ''"
          size="sm"
          class="rounded-xl shadow-sm"
        />
        <div class="hidden sm:block">
          <p class="text-sm font-semibold text-gray-900 leading-tight">{{ authStore.user?.username }}</p>
          <p class="text-[11px] text-gray-400 font-medium">{{ roleLabel }}</p>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const authStore = useAuthStore()
const uiStore = useUiStore()
const notificationsStore = useNotificationsStore()
const route = useRoute()
const notifOpen = ref(false)

const roleLabel = computed(() => {
  const labels = { ADMIN: 'Administrator', GURU: 'Guru', SISWA: 'Siswa' }
  return labels[authStore.user?.role] || ''
})

const navbarPhoto = computed(() => {
  const profile = authStore.user?.profile
  return profile?.photo || null
})

const navbarGender = computed(() => {
  const profile = authStore.user?.profile
  return profile?.gender || ''
})

const currentSection = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  if (segments.length > 1) return segments.slice(1).join(' / ').replace(/-/g, ' ')
  return segments[0] || 'dashboard'
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
