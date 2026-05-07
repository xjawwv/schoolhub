<template>
  <aside
    class="fixed inset-y-0 left-0 z-30 flex flex-col bg-white border-r border-gray-100 shadow-sidebar transition-all duration-300"
    :class="[
      uiStore.sidebarOpen ? 'w-64' : 'w-[68px]',
      uiStore.sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <div class="flex items-center gap-3 px-4 h-16 border-b border-gray-100 flex-shrink-0">
      <div class="w-9 h-9 bg-gradient-to-br from-brand-600 to-brand-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
        <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
        </svg>
      </div>
      <Transition name="fade">
        <span v-if="uiStore.sidebarOpen" class="font-bold text-gray-900 text-lg tracking-tight">SchoolHub</span>
      </Transition>
    </div>

    <nav class="flex-1 overflow-y-auto py-5 px-3 scrollbar-thin">
      <div v-for="group in navGroups" :key="group.label" class="mb-6">
        <Transition name="fade">
          <p
            v-if="uiStore.sidebarOpen"
            class="px-3 mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest"
          >
            {{ group.label }}
          </p>
        </Transition>
        <ul class="space-y-1">
          <li v-for="item in group.items" :key="item.path">
            <NuxtLink
              :to="item.path"
              class="sidebar-link"
              :class="{ active: isActive(item.path) }"
              :title="!uiStore.sidebarOpen ? item.label : ''"
              @click="uiStore.closeMobileSidebar()"
            >
              <span class="w-5 h-5 flex-shrink-0 flex items-center justify-center" v-html="item.icon" />
              <Transition name="fade">
                <span v-if="uiStore.sidebarOpen" class="truncate">{{ item.label }}</span>
              </Transition>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <div class="p-3 border-t border-gray-100 flex-shrink-0">
      <button
        class="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
        :title="!uiStore.sidebarOpen ? 'Logout' : ''"
        @click="handleLogout"
      >
        <span class="w-5 h-5 flex-shrink-0 flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
        </span>
        <Transition name="fade">
          <span v-if="uiStore.sidebarOpen">Logout</span>
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

const iconDashboard = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>'
const iconAnnouncement = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38a.75.75 0 0 1-1.006-.327 19.99 19.99 0 0 1-1.084-3.478m2.225-6.869a17.998 17.998 0 0 0 0 6.869m4.562-9.158a22.162 22.162 0 0 1 0 11.447M16.5 6.087a22.3 22.3 0 0 1 2.608 6.913m-3.913-9.282a24.456 24.456 0 0 1 0 14.564" /></svg>'
const iconStudents = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>'
const iconTeachers = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>'
const iconClasses = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5Z" /></svg>'
const iconSubjects = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>'
const iconSchedule = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>'
const iconAttendance = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>'
const iconGrades = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>'
const iconProfile = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>'

const adminNav = [
  {
    label: 'Utama',
    items: [
      { path: '/admin', icon: iconDashboard, label: 'Dashboard' },
      { path: '/admin/pengumuman', icon: iconAnnouncement, label: 'Pengumuman' },
    ],
  },
  {
    label: 'Manajemen',
    items: [
      { path: '/admin/siswa', icon: iconStudents, label: 'Siswa' },
      { path: '/admin/guru', icon: iconTeachers, label: 'Guru' },
      { path: '/admin/kelas', icon: iconClasses, label: 'Kelas' },
      { path: '/admin/mata-pelajaran', icon: iconSubjects, label: 'Mata Pelajaran' },
      { path: '/admin/jadwal', icon: iconSchedule, label: 'Jadwal' },
    ],
  },
  {
    label: 'Monitoring',
    items: [
      { path: '/admin/absensi', icon: iconAttendance, label: 'Absensi' },
      { path: '/admin/nilai', icon: iconGrades, label: 'Nilai' },
    ],
  },
]

const guruNav = [
  {
    label: 'Utama',
    items: [
      { path: '/guru', icon: iconDashboard, label: 'Dashboard' },
      { path: '/guru/jadwal', icon: iconSchedule, label: 'Jadwal Mengajar' },
      { path: '/guru/pengumuman', icon: iconAnnouncement, label: 'Pengumuman' },
    ],
  },
  {
    label: 'Akademik',
    items: [
      { path: '/guru/absensi', icon: iconAttendance, label: 'Input Absensi' },
      { path: '/guru/nilai', icon: iconGrades, label: 'Input Nilai' },
      { path: '/guru/siswa', icon: iconStudents, label: 'Data Siswa' },
    ],
  },
]

const siswaNav = [
  {
    label: 'Utama',
    items: [
      { path: '/siswa', icon: iconDashboard, label: 'Dashboard' },
      { path: '/siswa/pengumuman', icon: iconAnnouncement, label: 'Pengumuman' },
    ],
  },
  {
    label: 'Akademik',
    items: [
      { path: '/siswa/jadwal', icon: iconSchedule, label: 'Jadwal Pelajaran' },
      { path: '/siswa/absensi', icon: iconAttendance, label: 'Absensi Saya' },
      { path: '/siswa/nilai', icon: iconGrades, label: 'Nilai Saya' },
    ],
  },
  {
    label: 'Profil',
    items: [
      { path: '/siswa/profil', icon: iconProfile, label: 'Profil Saya' },
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
