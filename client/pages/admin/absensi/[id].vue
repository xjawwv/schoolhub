<template>
  <div>
    <div class="page-header flex items-center gap-4">
      <NuxtLink to="/admin/absensi" class="btn-outline px-3 py-2">← Kembali</NuxtLink>
      <div>
        <h1 class="page-title">Detail Absensi</h1>
        <p v-if="attendance" class="page-subtitle">
          {{ attendance.class?.name }} — {{ formatDate(attendance.date) }}
        </p>
      </div>
    </div>

    <AppLoader v-if="loading" />

    <div v-else-if="attendance" class="card">
      <div class="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
        <div class="flex gap-4 text-sm">
          <span class="text-gray-500">Guru: <span class="font-medium text-gray-900">{{ attendance.teacher?.full_name }}</span></span>
          <span class="text-gray-500">Total: <span class="font-medium text-gray-900">{{ attendance.details?.length }} siswa</span></span>
        </div>
        <div class="ml-auto flex gap-2">
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
              <th>NIS</th>
              <th>Nama Siswa</th>
              <th>Status</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detail, index) in attendance.details" :key="detail.id">
              <td class="text-gray-400">{{ index + 1 }}</td>
              <td class="font-mono text-xs">{{ detail.student?.nis }}</td>
              <td class="font-medium text-gray-900">{{ detail.student?.full_name }}</td>
              <td>
                <AppBadge :variant="statusVariant(detail.status)">{{ detail.status }}</AppBadge>
              </td>
              <td class="text-gray-500 text-xs">{{ detail.notes || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'admin' })

import { attendanceService } from '~/services/attendance.service'

const route = useRoute()
const toast = useToast()

const attendance = ref(null)
const loading = ref(true)

const formatDate = (date) =>
  new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

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
