<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Dashboard Siswa</h1>
      <p class="page-subtitle">Selamat datang, {{ stats?.studentName || authStore.user?.username }}</p>
    </div>

    <AppLoader v-if="loading" />

    <template v-else-if="stats">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          :icon="svgClass"
          label="Kelas"
          :value="stats.class?.name || '-'"
          iconBg="bg-brand-50 text-brand-600"
        />
        <StatCard
          :icon="svgGrades"
          label="Total Nilai"
          :value="stats.totalGrades"
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          :icon="svgPresent"
          label="Hadir"
          :value="getAttendanceCount('HADIR')"
          iconBg="bg-blue-50 text-blue-600"
        />
        <StatCard
          :icon="svgAbsent"
          label="Alpha"
          :value="getAttendanceCount('ALPHA')"
          iconBg="bg-red-50 text-red-600"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <h3 class="font-bold text-gray-900 mb-5">Rekap Kehadiran</h3>
          <div class="space-y-4">
            <div v-for="item in attendanceItems" :key="item.status" class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full flex-shrink-0" :class="item.color" />
              <span class="text-sm text-gray-600 flex-1">{{ item.label }}</span>
              <span class="font-bold text-gray-900 text-sm w-8 text-right">{{ getAttendanceCount(item.status) }}</span>
              <div class="w-28 bg-gray-100 rounded-full h-2.5">
                <div
                  class="h-2.5 rounded-full transition-all duration-500"
                  :class="item.barColor"
                  :style="{ width: `${getAttendancePercent(item.status)}%` }"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-bold text-gray-900">Pengumuman Terbaru</h3>
            <NuxtLink to="/siswa/pengumuman" class="text-sm text-brand-600 hover:text-brand-700 font-medium">
              Lihat Semua
            </NuxtLink>
          </div>
          <div v-if="stats.recentAnnouncements.length" class="space-y-3">
            <div
              v-for="ann in stats.recentAnnouncements"
              :key="ann.id"
              class="p-3.5 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors"
            >
              <p class="text-sm font-semibold text-gray-900">{{ ann.title }}</p>
              <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">{{ ann.content }}</p>
              <p class="text-xs text-gray-400 mt-1.5">{{ formatDate(ann.created_at) }}</p>
            </div>
          </div>
          <AppEmpty v-else icon="announcement" title="Belum ada pengumuman" description="" />
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

const svgClass = '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5Z" /></svg>'
const svgGrades = '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>'
const svgPresent = '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>'
const svgAbsent = '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>'

const attendanceItems = [
  { status: 'HADIR', label: 'Hadir', color: 'bg-emerald-500', barColor: 'bg-emerald-500' },
  { status: 'SAKIT', label: 'Sakit', color: 'bg-amber-500', barColor: 'bg-amber-500' },
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
