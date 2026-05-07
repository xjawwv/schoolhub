<template>
  <div>
    <div class="bg-gradient-to-r from-brand-600 via-brand-600 to-navy-700 rounded-2xl p-6 lg:p-8 mb-8 text-white relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div class="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
      <div class="relative z-10">
        <p class="text-brand-200 text-sm font-medium mb-1">Admin Panel</p>
        <h1 class="text-2xl lg:text-3xl font-bold">Selamat datang, {{ authStore.user?.username }}</h1>
        <p class="text-white/70 mt-1 text-sm">Kelola seluruh data sekolah dari dashboard ini</p>
      </div>
    </div>

    <AppLoader v-if="loading" />

    <template v-else-if="stats">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        <StatCard
          class="animate-slide-up"
          :icon="svgStudents"
          label="Total Siswa"
          :value="stats.totalStudents"
          iconBg="bg-blue-50 text-blue-600"
        />
        <StatCard
          class="animate-slide-up"
          :icon="svgTeachers"
          label="Total Guru"
          :value="stats.totalTeachers"
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          class="animate-slide-up"
          :icon="svgClasses"
          label="Total Kelas"
          :value="stats.totalClasses"
          iconBg="bg-violet-50 text-violet-600"
        />
        <StatCard
          class="animate-slide-up"
          :icon="svgSubjects"
          label="Mata Pelajaran"
          :value="stats.totalSubjects"
          iconBg="bg-amber-50 text-amber-600"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-bold text-gray-900">Pengumuman Terbaru</h3>
            <NuxtLink to="/admin/pengumuman" class="text-sm text-brand-600 hover:text-brand-700 font-medium">
              Lihat Semua
            </NuxtLink>
          </div>
          <div v-if="stats.recentAnnouncements.length" class="space-y-3">
            <div
              v-for="ann in stats.recentAnnouncements"
              :key="ann.id"
              class="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors"
            >
              <div class="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38a.75.75 0 0 1-1.006-.327 19.99 19.99 0 0 1-1.084-3.478m2.225-6.869a17.998 17.998 0 0 0 0 6.869" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 truncate">{{ ann.title }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ formatDate(ann.created_at) }}</p>
              </div>
              <AppBadge :variant="ann.target_role ? 'info' : 'gray'">
                {{ ann.target_role || 'Semua' }}
              </AppBadge>
            </div>
          </div>
          <AppEmpty v-else icon="announcement" title="Belum ada pengumuman" description="Buat pengumuman pertama Anda" />
        </div>

        <div class="card">
          <h3 class="font-bold text-gray-900 mb-5">Absensi Hari Ini</h3>
          <template v-if="stats.todayAttendance > 0">
            <div class="flex items-center justify-center py-8">
              <div class="text-center">
                <div class="w-24 h-24 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <p class="text-4xl font-black text-brand-600">{{ stats.todayAttendance }}</p>
                </div>
                <p class="text-sm text-gray-500 font-medium">Kelas yang sudah absen</p>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="flex flex-col items-center justify-center py-10 text-center">
              <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <p class="text-sm font-semibold text-gray-700">Belum ada absensi hari ini</p>
              <p class="text-xs text-gray-400 mt-1">Guru belum melakukan input absensi</p>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'admin' })

const authStore = useAuthStore()
const { dashboardService } = await import('~/services/dashboard.service')

const stats = ref(null)
const loading = ref(true)

const svgStudents = '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>'
const svgTeachers = '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>'
const svgClasses = '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5Z" /></svg>'
const svgSubjects = '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>'

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

onMounted(async () => {
  try {
    const response = await dashboardService.getStats()
    stats.value = response.data
  } finally {
    loading.value = false
  }
})
</script>
