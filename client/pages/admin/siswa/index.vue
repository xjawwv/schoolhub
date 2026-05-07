<template>
  <div>
    <div class="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="page-title">Data Siswa</h1>
        <p class="page-subtitle">Kelola data seluruh siswa</p>
      </div>
      <button class="btn-primary" @click="openCreate">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Tambah Siswa
      </button>
    </div>

    <div class="card">
      <div class="filter-bar">
        <div class="relative flex-1 max-w-xs">
          <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="input pl-10"
            placeholder="Cari nama atau NIS..."
            @input="debouncedSearch"
          />
        </div>
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
                <td class="font-mono text-xs text-gray-500">{{ student.nis }}</td>
                <td>
                  <div class="flex items-center gap-2.5">
                    <UserAvatar :photo="student.photo" :gender="student.gender" :name="student.full_name" size="sm" class="rounded-lg" />
                    <span class="font-semibold text-gray-900">{{ student.full_name }}</span>
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
                  <div class="flex items-center gap-3">
                    <button class="action-edit" @click="openEdit(student)">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                      Edit
                    </button>
                    <button class="action-delete" @click="handleDelete(student)">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <AppEmpty v-else icon="students" title="Belum ada siswa" description="Tambahkan siswa pertama Anda" />

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
