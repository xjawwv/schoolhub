<template>
  <div>
    <div class="page-header flex items-center justify-between">
      <div>
        <h1 class="page-title">Data Siswa</h1>
        <p class="page-subtitle">Kelola data seluruh siswa</p>
      </div>
      <button class="btn-primary" @click="openCreate">
        + Tambah Siswa
      </button>
    </div>

    <div class="card">
      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          v-model="searchQuery"
          type="text"
          class="input max-w-xs"
          placeholder="Cari nama atau NIS..."
          @input="debouncedSearch"
        />
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
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in students" :key="student.id">
                <td class="font-mono text-xs">{{ student.nis }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span class="text-brand-700 text-xs font-semibold">{{ student.full_name[0] }}</span>
                    </div>
                    <span class="font-medium text-gray-900">{{ student.full_name }}</span>
                  </div>
                </td>
                <td>
                  <AppBadge variant="info">{{ student.class?.name || '-' }}</AppBadge>
                </td>
                <td class="text-gray-600">{{ student.gender }}</td>
                <td>
                  <AppBadge :variant="student.user?.is_active ? 'success' : 'danger'">
                    {{ student.user?.is_active ? 'Aktif' : 'Nonaktif' }}
                  </AppBadge>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <button class="text-brand-600 hover:text-brand-800 text-sm font-medium" @click="openEdit(student)">
                      Edit
                    </button>
                    <button class="text-red-500 hover:text-red-700 text-sm font-medium" @click="handleDelete(student)">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <AppEmpty v-else icon="👨‍🎓" title="Belum ada siswa" description="Tambahkan siswa pertama Anda" />

        <AppPagination :meta="meta" @page-change="setPage" />
      </template>
    </div>

    <AppModal v-model="modalOpen" :title="editingStudent ? 'Edit Siswa' : 'Tambah Siswa'" size="lg">
      <StudentForm
        :student="editingStudent"
        :classes="classes"
        :loading="formLoading"
        @submit="handleSubmit"
        @cancel="modalOpen = false"
      />
    </AppModal>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'admin' })

import { studentsService } from '~/services/students.service'
import { classesService } from '~/services/classes.service'

const toast = useToast()
const { confirm } = useConfirm()

const students = ref([])
const classes = ref([])
const meta = ref(null)
const loading = ref(true)
const formLoading = ref(false)
const modalOpen = ref(false)
const editingStudent = ref(null)
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
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchStudents()
  }, 400)
}

const applyFilter = () => {
  currentPage.value = 1
  fetchStudents()
}

const setPage = (page) => {
  currentPage.value = page
  fetchStudents()
}

const openCreate = () => {
  editingStudent.value = null
  modalOpen.value = true
}

const openEdit = (student) => {
  editingStudent.value = student
  modalOpen.value = true
}

const handleSubmit = async (data) => {
  formLoading.value = true
  try {
    if (editingStudent.value) {
      await studentsService.update(editingStudent.value.id, data)
      toast.success('Data siswa berhasil diperbarui')
    } else {
      await studentsService.create(data)
      toast.success('Siswa berhasil ditambahkan')
    }
    modalOpen.value = false
    fetchStudents()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Operasi gagal')
  } finally {
    formLoading.value = false
  }
}

const handleDelete = async (student) => {
  const confirmed = await confirm('Hapus Siswa', `Apakah Anda yakin ingin menghapus siswa ${student.full_name}? Tindakan ini tidak dapat dibatalkan.`)
  if (!confirmed) return
  try {
    await studentsService.remove(student.id)
    toast.success('Siswa berhasil dihapus')
    fetchStudents()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal menghapus siswa')
  }
}

onMounted(() => {
  fetchStudents()
  fetchClasses()
})
</script>
