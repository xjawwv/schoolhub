<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Dashboard Siswa</h1>
      <p class="page-subtitle">Selamat datang, {{ stats?.studentName || authStore.user?.username }}</p>
    </div>

    <AppLoader v-if="loading" />

    <template v-else-if="stats">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="🏫" label="Kelas" :value="stats.class?.name || '-'" iconBg="bg-brand-50" />
        <StatCard icon="📊" label="Total Nilai" :value="stats.totalGrades" iconBg="bg-emerald-50" />
        <StatCard icon="✅" label="Hadir" :value="getAttendanceCount('HADIR')" iconBg="bg-blue-50" />
        <StatCard icon="❌" label="Alpha" :value="getAttendanceCount('ALPHA')" iconBg="bg-red-50" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <h3 class="font-semibold text-gray-900 mb-4">Rekap Kehadiran</h3>
          <div class="space-y-3">
            <div v-for="item in attendanceItems" :key="item.status" class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full flex-shrink-0" :class="item.color" />
              <span class="text-sm text-gray-600 flex-1">{{ item.label }}</span>
              <span class="font-semibold text-gray-900">{{ getAttendanceCount(item.status) }}</span>
              <div class="w-24 bg-gray-100 rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all"
                  :class="item.barColor"
                  :style="{ width: `${getAttendancePercent(item.status)}%` }"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="font-semibold text-gray-900 mb-4">Pengumuman Terbaru</h3>
          <div v-if="stats.recentAnnouncements.length" class="space-y-3">
            <div
              v-for="ann in stats.recentAnnouncements"
              :key="ann.id"
              class="p-3 rounded-lg bg-gray-50"
            >
              <p class="text-sm font-medium text-gray-900">{{ ann.title }}</p>
              <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">{{ ann.content }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ formatDate(ann.created_at) }}</p>
            </div>
          </div>
          <AppEmpty v-else icon="📢" title="Belum ada pengumuman" description="" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'siswa' })

import { dashboardService } from '~/services/dashboard.service'

const authStore = useAuthStore()
const stats = ref(null)
const loading = ref(true)

const attendanceItems = [
  { status: 'HADIR', label: 'Hadir', color: 'bg-emerald-500', barColor: 'bg-emerald-500' },
  { status: 'SAKIT', label: 'Sakit', color: 'bg-yellow-500', barColor: 'bg-yellow-500' },
  { status: 'IZIN', label: 'Izin', color: 'bg-blue-500', barColor: 'bg-blue-500' },
  { status: 'ALPHA', label: 'Alpha', color: 'bg-red-500', barColor: 'bg-red-500' },
]

const totalAttendance = computed(() =>
  stats.value?.attendanceSummary?.reduce((sum, s) => sum + s._count.status, 0) || 0
)

const getAttendanceCount = (status) => {
  const item = stats.value?.attendanceSummary?.find((s) => s.status === status)
  return item?._count?.status || 0
}

const getAttendancePercent = (status) => {
  if (!totalAttendance.value) return 0
  return Math.round((getAttendanceCount(status) / totalAttendance.value) * 100)
}

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
