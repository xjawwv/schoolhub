<template>
  <aside
    class="fixed inset-y-0 left-0 z-30 flex flex-col bg-white border-r border-gray-100 transition-all duration-300"
    :class="[
      uiStore.sidebarOpen ? 'w-64' : 'w-16',
      uiStore.sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <div class="flex items-center gap-3 px-4 py-5 border-b border-gray-100 min-h-[65px]">
      <div class="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <span class="text-white font-bold text-sm">S</span>
      </div>
      <Transition name="fade">
        <span v-if="uiStore.sidebarOpen" class="font-bold text-gray-900 text-lg">SchoolHub</span>
      </Transition>
    </div>

    <nav class="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin">
      <div v-for="group in navGroups" :key="group.label" class="mb-4">
        <Transition name="fade">
          <p
            v-if="uiStore.sidebarOpen"
            class="px-3 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >
            {{ group.label }}
          </p>
        </Transition>
        <ul class="space-y-0.5">
          <li v-for="item in group.items" :key="item.path">
            <NuxtLink
              :to="item.path"
              class="sidebar-link"
              :class="{ active: isActive(item.path) }"
              :title="!uiStore.sidebarOpen ? item.label : ''"
              @click="uiStore.closeMobileSidebar()"
            >
              <span class="text-lg leading-none flex-shrink-0">{{ item.icon }}</span>
              <Transition name="fade">
                <span v-if="uiStore.sidebarOpen" class="truncate">{{ item.label }}</span>
              </Transition>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <div class="p-2 border-t border-gray-100">
      <button
        class="sidebar-link w-full"
        :title="!uiStore.sidebarOpen ? 'Logout' : ''"
        @click="handleLogout"
      >
        <span class="text-lg leading-none flex-shrink-0 text-red-500">⏻</span>
        <Transition name="fade">
          <span v-if="uiStore.sidebarOpen" class="text-red-500">Logout</span>
        </Transition>
      </button>
    </div>
  </aside>
</template>

<script setup>
const authStore = useAuthStore()
const uiStore = useUiStore()
const route = useRoute()
const { logout } = useAuth()

const adminNav = [
  {
    label: 'Utama',
    items: [
      { path: '/admin', icon: '◻', label: 'Dashboard' },
      { path: '/admin/pengumuman', icon: '📢', label: 'Pengumuman' },
    ],
  },
  {
    label: 'Manajemen',
    items: [
      { path: '/admin/siswa', icon: '👨‍🎓', label: 'Siswa' },
      { path: '/admin/guru', icon: '👨‍🏫', label: 'Guru' },
      { path: '/admin/kelas', icon: '🏫', label: 'Kelas' },
      { path: '/admin/mata-pelajaran', icon: '📚', label: 'Mata Pelajaran' },
      { path: '/admin/jadwal', icon: '📅', label: 'Jadwal' },
    ],
  },
  {
    label: 'Monitoring',
    items: [
      { path: '/admin/absensi', icon: '✅', label: 'Absensi' },
      { path: '/admin/nilai', icon: '📊', label: 'Nilai' },
    ],
  },
]

const guruNav = [
  {
    label: 'Utama',
    items: [
      { path: '/guru', icon: '◻', label: 'Dashboard' },
      { path: '/guru/jadwal', icon: '📅', label: 'Jadwal Mengajar' },
      { path: '/guru/pengumuman', icon: '📢', label: 'Pengumuman' },
    ],
  },
  {
    label: 'Akademik',
    items: [
      { path: '/guru/absensi', icon: '✅', label: 'Input Absensi' },
      { path: '/guru/nilai', icon: '📊', label: 'Input Nilai' },
      { path: '/guru/siswa', icon: '👨‍🎓', label: 'Data Siswa' },
    ],
  },
]

const siswaNav = [
  {
    label: 'Utama',
    items: [
      { path: '/siswa', icon: '◻', label: 'Dashboard' },
      { path: '/siswa/pengumuman', icon: '📢', label: 'Pengumuman' },
    ],
  },
  {
    label: 'Akademik',
    items: [
      { path: '/siswa/jadwal', icon: '📅', label: 'Jadwal Pelajaran' },
      { path: '/siswa/absensi', icon: '✅', label: 'Absensi Saya' },
      { path: '/siswa/nilai', icon: '📊', label: 'Nilai Saya' },
    ],
  },
  {
    label: 'Profil',
    items: [
      { path: '/siswa/profil', icon: '👤', label: 'Profil Saya' },
    ],
  },
]

const navGroups = computed(() => {
  if (authStore.isAdmin) return adminNav
  if (authStore.isGuru) return guruNav
  return siswaNav
})

const isActive = (path) => {
  if (path === '/admin' || path === '/guru' || path === '/siswa') {
    return route.path === path
  }
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  await logout()
}
</script>
