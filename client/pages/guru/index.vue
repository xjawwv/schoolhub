<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Dashboard Guru</h1>
      <p class="page-subtitle">Selamat datang, {{ stats?.teacherName || authStore.user?.username }}</p>
    </div>

    <AppLoader v-if="loading" />

    <template v-else-if="stats">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <StatCard
          :icon="svgSchedule"
          label="Jadwal Mengajar"
          :value="stats.totalSchedules"
          iconBg="bg-brand-50 text-brand-600"
        />
        <StatCard
          :icon="svgSubjects"
          label="Mata Pelajaran"
          :value="stats.totalSubjects"
          iconBg="bg-emerald-50 text-emerald-600"
        />
      </div>

      <div class="card">
        <h3 class="font-bold text-gray-900 mb-5">Absensi Terbaru Kelas</h3>
        <div v-if="stats.recentAttendance.length" class="space-y-2">
          <div
            v-for="att in stats.recentAttendance"
            :key="att.id"
            class="flex items-center justify-between p-3.5 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors"
          >
            <div>
              <p class="text-sm font-semibold text-gray-900">{{ att.class?.name }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ formatDate(att.date) }}</p>
            </div>
            <AppBadge variant="info">{{ att._count?.details }} siswa check-in</AppBadge>
          </div>
        </div>
        <AppEmpty v-else icon="attendance" title="Belum ada data absensi" description="Data absensi akan muncul setelah siswa melakukan check-in" />
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

const svgSchedule = '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>'
const svgSubjects = '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>'
const svgAttendance = '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>'

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
