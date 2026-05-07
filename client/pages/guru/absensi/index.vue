<template>
  <div>
    <div class="page-header flex items-center justify-between">
      <div>
        <h1 class="page-title">Input Absensi</h1>
        <p class="page-subtitle">Catat kehadiran siswa</p>
      </div>
      <button class="btn-primary" @click="openCreate">+ Input Absensi</button>
    </div>

    <div class="card">
      <AppLoader v-if="loading" />
      <template v-else>
        <div v-if="attendance.length" class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Kelas</th>
                <th>Jumlah Siswa</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="att in attendance" :key="att.id">
                <td class="font-medium">{{ formatDate(att.date) }}</td>
                <td><AppBadge variant="info">{{ att.class?.name }}</AppBadge></td>
                <td>{{ att._count?.details || 0 }} siswa</td>
                <td>
                  <NuxtLink :to="`/guru/absensi/${att.id}`" class="text-brand-600 hover:text-brand-800 text-sm font-medium">
                    Lihat / Edit
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <AppEmpty v-else icon="✅" title="Belum ada absensi" description="Mulai input absensi hari ini" />
        <AppPagination :meta="meta" @page-change="setPage" />
      </template>
    </div>

    <AppModal v-model="modalOpen" title="Input Absensi Baru" size="xl">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Kelas</label>
            <select v-model="form.class_id" class="input" @change="loadStudents">
              <option value="">Pilih kelas</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
            </select>
          </div>
          <div>
            <label class="label">Tanggal</label>
            <input v-model="form.date" type="date" class="input" />
          </div>
        </div>

        <div v-if="students.length" class="mt-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-medium text-gray-900">Daftar Siswa ({{ students.length }})</h4>
            <div class="flex gap-2">
              <button type="button" class="text-xs text-emerald-600 hover:underline" @click="setAllStatus('HADIR')">Semua Hadir</button>
            </div>
          </div>
          <div class="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
            <div
              v-for="student in students"
              :key="student.id"
              class="flex items-center gap-3 p-3 rounded-lg border border-gray-100"
            >
              <div class="w-7 h-7 flex-shrink-0">
                <UserAvatar :photo="student.photo" :gender="student.gender" :name="student.full_name" size="xs" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ student.full_name }}</p>
                <p class="text-xs text-gray-400">{{ student.nis }}</p>
              </div>
              <select
                v-model="form.details.find(d => d.student_id === student.id).status"
                class="input w-28 text-xs py-1.5"
              >
                <option value="HADIR">Hadir</option>
                <option value="SAKIT">Sakit</option>
                <option value="IZIN">Izin</option>
                <option value="ALPHA">Alpha</option>
              </select>
            </div>
          </div>
        </div>

        <div v-else-if="form.class_id" class="py-6 text-center text-sm text-gray-400">
          Memuat data siswa...
        </div>
      </div>

      <template #footer>
        <button class="btn-outline" @click="modalOpen = false">Batal</button>
        <button class="btn-primary" :disabled="formLoading || !form.class_id || !form.date" @click="handleSubmit">
          <span v-if="formLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Simpan Absensi
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'guru' })

import { attendanceService } from '~/services/attendance.service'
import { classesService } from '~/services/classes.service'
import { studentsService } from '~/services/students.service'

const toast = useToast()

const attendance = ref([])
const classes = ref([])
const students = ref([])
const meta = ref(null)
const loading = ref(true)
const formLoading = ref(false)
const modalOpen = ref(false)
const currentPage = ref(1)

const form = reactive({ class_id: '', date: new Date().toISOString().split('T')[0], details: [] })

const formatDate = (date) =>
  new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const fetchAttendance = async () => {
  loading.value = true
  try {
    const response = await attendanceService.getAll({ page: currentPage.value, limit: 10 })
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

const loadStudents = async () => {
  if (!form.class_id) return
  try {
    const response = await studentsService.getAll({ class_id: form.class_id, limit: 100 })
    students.value = response.data
    form.details = response.data.map((s) => ({ student_id: s.id, status: 'HADIR', notes: '' }))
  } catch {
    toast.error('Gagal memuat data siswa')
  }
}

const setAllStatus = (status) => {
  form.details.forEach((d) => (d.status = status))
}

const setPage = (page) => { currentPage.value = page; fetchAttendance() }

const openCreate = () => {
  students.value = []
  Object.assign(form, { class_id: '', date: new Date().toISOString().split('T')[0], details: [] })
  modalOpen.value = true
}

const handleSubmit = async () => {
  formLoading.value = true
  try {
    await attendanceService.create(form)
    toast.success('Absensi berhasil disimpan')
    modalOpen.value = false
    fetchAttendance()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal menyimpan absensi')
  } finally {
    formLoading.value = false
  }
}

onMounted(() => { fetchAttendance(); fetchClasses() })
</script>
