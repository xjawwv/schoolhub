<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Dashboard Guru</h1>
      <p class="page-subtitle">Selamat datang, {{ stats?.teacherName || authStore.user?.username }}</p>
    </div>

    <AppLoader v-if="loading" />

    <template v-else-if="stats">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon="📅" label="Jadwal Mengajar" :value="stats.totalSchedules" iconBg="bg-brand-50" />
        <StatCard icon="📚" label="Mata Pelajaran" :value="stats.totalSubjects" iconBg="bg-emerald-50" />
        <StatCard icon="✅" label="Absensi Dibuat" :value="stats.recentAttendance.length" sub="5 terbaru" iconBg="bg-purple-50" />
      </div>

      <div class="card">
        <h3 class="font-semibold text-gray-900 mb-4">Absensi Terbaru</h3>
        <div v-if="stats.recentAttendance.length" class="space-y-2">
          <div
            v-for="att in stats.recentAttendance"
            :key="att.id"
            class="flex items-center justify-between p-3 rounded-lg bg-gray-50"
          >
            <div>
              <p class="text-sm font-medium text-gray-900">{{ att.class?.name }}</p>
              <p class="text-xs text-gray-400">{{ formatDate(att.date) }}</p>
            </div>
            <AppBadge variant="info">{{ att._count?.details }} siswa</AppBadge>
          </div>
        </div>
        <AppEmpty v-else icon="✅" title="Belum ada absensi" description="Mulai input absensi hari ini" />
      </div>
    </template>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'guru' })

import { dashboardService } from '~/services/dashboard.service'

const authStore = useAuthStore()
const stats = ref(null)
const loading = ref(true)

const formatDate = (date) =>
  new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

onMounted(async () => {
  try {
    const response = await dashboardService.getStats()
    stats.value = response.data
  } finally {
    loading.value = false
  }
})
</script>
