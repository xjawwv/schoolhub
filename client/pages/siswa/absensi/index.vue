<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Absensi Saya</h1>
      <p class="page-subtitle">Riwayat kehadiran Anda</p>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div v-for="item in summaryItems" :key="item.status" class="card text-center">
        <p class="text-2xl font-bold" :class="item.color">{{ getCount(item.status) }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ item.label }}</p>
      </div>
    </div>

    <div class="card">
      <AppLoader v-if="loading" />
      <template v-else>
        <div v-if="details.length" class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Kelas</th>
                <th>Status</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="detail in details" :key="detail.id">
                <td class="font-medium">{{ formatDate(detail.attendance?.date) }}</td>
                <td><AppBadge variant="info">{{ detail.attendance?.class?.name }}</AppBadge></td>
                <td>
                  <AppBadge :variant="statusVariant(detail.status)">{{ detail.status }}</AppBadge>
                </td>
                <td class="text-gray-500 text-xs">{{ detail.notes || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <AppEmpty v-else icon="✅" title="Belum ada data absensi" description="Data absensi Anda akan muncul di sini" />
        <AppPagination :meta="meta" @page-change="setPage" />
      </template>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'siswa' })

import { attendanceService } from '~/services/attendance.service'

const toast = useToast()
const details = ref([])
const meta = ref(null)
const loading = ref(true)
const currentPage = ref(1)

const summaryItems = [
  { status: 'HADIR', label: 'Hadir', color: 'text-emerald-600' },
  { status: 'SAKIT', label: 'Sakit', color: 'text-yellow-600' },
  { status: 'IZIN', label: 'Izin', color: 'text-blue-600' },
  { status: 'ALPHA', label: 'Alpha', color: 'text-red-600' },
]

const getCount = (status) => details.value.filter((d) => d.status === status).length

const formatDate = (date) =>
  new Date(date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

const statusVariant = (status) => {
  const map = { HADIR: 'success', SAKIT: 'warning', IZIN: 'info', ALPHA: 'danger' }
  return map[status] || 'gray'
}

const fetchAttendance = async () => {
  loading.value = true
  try {
    const response = await attendanceService.getMy({ page: currentPage.value, limit: 15 })
    details.value = response.data
    meta.value = response.meta
  } catch {
    toast.error('Gagal memuat data absensi')
  } finally {
    loading.value = false
  }
}

const setPage = (page) => { currentPage.value = page; fetchAttendance() }

onMounted(fetchAttendance)
</script>
