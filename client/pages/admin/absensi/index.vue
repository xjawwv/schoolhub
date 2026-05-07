<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Monitoring Absensi</h1>
      <p class="page-subtitle">Pantau data absensi seluruh kelas</p>
    </div>

    <div class="card">
      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <select v-model="filterClass" class="input max-w-xs" @change="applyFilter">
          <option value="">Semua Kelas</option>
          <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
        </select>
        <input v-model="filterDate" type="date" class="input max-w-xs" @change="applyFilter" />
      </div>

      <AppLoader v-if="loading" />
      <template v-else>
        <div v-if="attendance.length" class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Kelas</th>
                <th>Guru</th>
                <th>Jumlah Siswa</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="att in attendance" :key="att.id">
                <td class="font-medium">{{ formatDate(att.date) }}</td>
                <td><AppBadge variant="info">{{ att.class?.name }}</AppBadge></td>
                <td class="text-gray-600">{{ att.teacher?.full_name }}</td>
                <td>{{ att._count?.details || 0 }} siswa</td>
                <td>
                  <NuxtLink :to="`/admin/absensi/${att.id}`" class="text-brand-600 hover:text-brand-800 text-sm font-medium">
                    Lihat Detail
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <AppEmpty v-else icon="✅" title="Belum ada data absensi" description="Data absensi akan muncul setelah guru melakukan input" />
        <AppPagination :meta="meta" @page-change="setPage" />
      </template>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'admin' })

import { attendanceService } from '~/services/attendance.service'
import { classesService } from '~/services/classes.service'

const toast = useToast()

const attendance = ref([])
const classes = ref([])
const meta = ref(null)
const loading = ref(true)
const filterClass = ref('')
const filterDate = ref('')
const currentPage = ref(1)

const formatDate = (date) =>
  new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const fetchAttendance = async () => {
  loading.value = true
  try {
    const params = { page: currentPage.value, limit: 10 }
    if (filterClass.value) params.class_id = filterClass.value
    if (filterDate.value) params.date = filterDate.value
    const response = await attendanceService.getAll(params)
    attendance.value = response.data
    meta.value = response.meta
  } catch {
    toast.error('Gagal memuat data absensi')
  } finally {
    loading.value = false
  }
}

const fetchClasses = async () => {
  try {
    const response = await classesService.getAll({ limit: 100 })
    classes.value = response.data
  } catch {}
}

const applyFilter = () => { currentPage.value = 1; fetchAttendance() }
const setPage = (page) => { currentPage.value = page; fetchAttendance() }

onMounted(() => { fetchAttendance(); fetchClasses() })
</script>
