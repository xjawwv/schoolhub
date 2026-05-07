<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Data Siswa</h1>
      <p class="page-subtitle">Lihat data siswa berdasarkan kelas</p>
    </div>

    <div class="card">
      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <input v-model="searchQuery" type="text" class="input max-w-xs" placeholder="Cari nama atau NIS..." @input="debouncedSearch" />
        <select v-model="filterClass" class="input max-w-xs" @change="applyFilter">
          <option value="">Semua Kelas</option>
          <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
        </select>
      </div>

      <AppLoader v-if="loading" />
      <template v-else>
        <div v-if="students.length" class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>NIS</th>
                <th>Nama Lengkap</th>
                <th>Kelas</th>
                <th>Gender</th>
                <th>No. Telepon</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in students" :key="student.id">
                <td class="font-mono text-xs">{{ student.nis }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <UserAvatar :photo="student.photo" :gender="student.gender" :name="student.full_name" size="xs" />
                    <span class="font-medium text-gray-900">{{ student.full_name }}</span>
                  </div>
                </td>
                <td><AppBadge variant="info">{{ student.class?.name || '-' }}</AppBadge></td>
                <td class="text-gray-600">{{ student.gender }}</td>
                <td class="text-gray-500">{{ student.phone || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <AppEmpty v-else icon="👨‍🎓" title="Tidak ada siswa ditemukan" description="Coba ubah filter pencarian" />
        <AppPagination :meta="meta" @page-change="setPage" />
      </template>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'guru' })

import { studentsService } from '~/services/students.service'
import { classesService } from '~/services/classes.service'

const toast = useToast()

const students = ref([])
const classes = ref([])
const meta = ref(null)
const loading = ref(true)
const searchQuery = ref('')
const filterClass = ref('')
const currentPage = ref(1)

let searchTimeout = null

const fetchStudents = async () => {
  loading.value = true
  try {
    const params = { page: currentPage.value, limit: 10 }
    if (searchQuery.value) params.search = searchQuery.value
    if (filterClass.value) params.class_id = filterClass.value
    const response = await studentsService.getAll(params)
    students.value = response.data
    meta.value = response.meta
  } catch {
    toast.error('Gagal memuat data siswa')
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

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { currentPage.value = 1; fetchStudents() }, 400)
}

const applyFilter = () => { currentPage.value = 1; fetchStudents() }
const setPage = (page) => { currentPage.value = page; fetchStudents() }

onMounted(() => { fetchStudents(); fetchClasses() })
</script>
