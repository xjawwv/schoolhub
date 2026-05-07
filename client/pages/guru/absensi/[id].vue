<template>
  <div>
    <div class="page-header flex items-center gap-4">
      <NuxtLink to="/guru/absensi" class="btn-outline px-3 py-2">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Kembali
      </NuxtLink>
      <div>
        <h1 class="page-title">Detail Absensi</h1>
        <p v-if="attendance" class="page-subtitle">
          {{ attendance.class?.name }} — {{ formatDate(attendance.date) }}
        </p>
      </div>
    </div>

    <AppLoader v-if="loading" />

    <div v-else-if="attendance" class="card">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-5 border-b border-gray-100">
        <div class="text-sm text-gray-500">
          Total check-in: <span class="font-semibold text-gray-900">{{ attendance.details?.length }} siswa</span>
        </div>
        <div class="sm:ml-auto flex flex-wrap gap-2">
          <AppBadge variant="success">Hadir: {{ countStatus('HADIR') }}</AppBadge>
          <AppBadge variant="warning">Sakit: {{ countStatus('SAKIT') }}</AppBadge>
          <AppBadge variant="info">Izin: {{ countStatus('IZIN') }}</AppBadge>
          <AppBadge variant="danger">Alpha: {{ countStatus('ALPHA') }}</AppBadge>
        </div>
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Siswa</th>
              <th>Status</th>
              <th>Waktu Check-in</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detail, index) in attendance.details" :key="detail.id">
              <td class="text-gray-400">{{ index + 1 }}</td>
              <td>
                <div class="flex items-center gap-2">
                  <UserAvatar :photo="detail.student?.photo" :gender="detail.student?.gender" :name="detail.student?.full_name || ''" size="xs" />
                  <div>
                    <p class="font-semibold text-gray-900 text-sm">{{ detail.student?.full_name }}</p>
                    <p class="text-xs text-gray-400 font-mono">{{ detail.student?.nis }}</p>
                  </div>
                </div>
              </td>
              <td><AppBadge :variant="statusVariant(detail.status)">{{ detail.status }}</AppBadge></td>
              <td class="text-gray-500 text-xs font-mono">{{ formatTime(detail.check_in_time) }}</td>
              <td class="text-gray-500 text-xs">{{ detail.notes || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!attendance.details?.length" class="py-8">
        <AppEmpty icon="attendance" title="Belum ada siswa yang check-in" description="Siswa belum melakukan absensi untuk sesi ini" />
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'guru' })

import { attendanceService } from '~/services/attendance.service'

const route = useRoute()
const toast = useToast()

const attendance = ref(null)
const loading = ref(true)

const formatDate = (date) =>
  new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const formatTime = (datetime) => {
  if (!datetime) return '-'
  return new Date(datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

const countStatus = (status) =>
  attendance.value?.details?.filter((d) => d.status === status).length || 0

const statusVariant = (status) => {
  const map = { HADIR: 'success', SAKIT: 'warning', IZIN: 'info', ALPHA: 'danger' }
  return map[status] || 'gray'
}

onMounted(async () => {
  try {
    const response = await attendanceService.getById(route.params.id)
    attendance.value = response.data
  } catch {
    toast.error('Gagal memuat detail absensi')
  } finally {
    loading.value = false
  }
})
</script>
