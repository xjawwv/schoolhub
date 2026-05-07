<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Dashboard Admin</h1>
      <p class="page-subtitle">Selamat datang kembali, {{ authStore.user?.username }}</p>
    </div>

    <AppLoader v-if="loading" />

    <template v-else-if="stats">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="👨‍🎓" label="Total Siswa" :value="stats.totalStudents" iconBg="bg-blue-50" />
        <StatCard icon="👨‍🏫" label="Total Guru" :value="stats.totalTeachers" iconBg="bg-emerald-50" />
        <StatCard icon="🏫" label="Total Kelas" :value="stats.totalClasses" iconBg="bg-purple-50" />
        <StatCard icon="📚" label="Mata Pelajaran" :value="stats.totalSubjects" iconBg="bg-orange-50" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <h3 class="font-semibold text-gray-900 mb-4">Pengumuman Terbaru</h3>
          <div v-if="stats.recentAnnouncements.length" class="space-y-3">
            <div
              v-for="ann in stats.recentAnnouncements"
              :key="ann.id"
              class="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
            >
              <span class="text-lg">📢</span>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ ann.title }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ formatDate(ann.created_at) }}</p>
              </div>
              <AppBadge :variant="ann.target_role ? 'info' : 'gray'">
                {{ ann.target_role || 'Semua' }}
              </AppBadge>
            </div>
          </div>
          <AppEmpty v-else icon="📢" title="Belum ada pengumuman" description="Buat pengumuman pertama Anda" />
        </div>

        <div class="card">
          <h3 class="font-semibold text-gray-900 mb-4">Absensi Hari Ini</h3>
          <div class="flex items-center justify-center py-8">
            <div class="text-center">
              <p class="text-5xl font-bold text-brand-600">{{ stats.todayAttendance }}</p>
              <p class="text-sm text-gray-500 mt-2">Kelas yang sudah absen</p>
            </div>
          </div>
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
