<template>
  <div>
    <div class="page-header flex items-center justify-between">
      <div>
        <h1 class="page-title">Data Guru</h1>
        <p class="page-subtitle">Kelola data seluruh guru</p>
      </div>
      <button class="btn-primary" @click="openCreate">+ Tambah Guru</button>
    </div>

    <div class="card">
      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          class="input max-w-xs"
          placeholder="Cari nama atau NIP..."
          @input="debouncedSearch"
        />
      </div>

      <AppLoader v-if="loading" />

      <template v-else>
        <div v-if="teachers.length" class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>NIP</th>
                <th>Nama Lengkap</th>
                <th>Mata Pelajaran</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="teacher in teachers" :key="teacher.id">
                <td class="font-mono text-xs">{{ teacher.nip }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span class="text-emerald-700 text-xs font-semibold">{{ teacher.full_name[0] }}</span>
                    </div>
                    <span class="font-medium text-gray-900">{{ teacher.full_name }}</span>
                  </div>
                </td>
                <td>
                  <div class="flex flex-wrap gap-1">
                    <AppBadge v-for="s in teacher.subjects.slice(0, 2)" :key="s.id" variant="info">{{ s.name }}</AppBadge>
                    <AppBadge v-if="teacher.subjects.length > 2" variant="gray">+{{ teacher.subjects.length - 2 }}</AppBadge>
                  </div>
                </td>
                <td class="text-gray-600">{{ teacher.gender }}</td>
                <td>
                  <AppBadge :variant="teacher.user?.is_active ? 'success' : 'danger'">
                    {{ teacher.user?.is_active ? 'Aktif' : 'Nonaktif' }}
                  </AppBadge>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <button class="text-brand-600 hover:text-brand-800 text-sm font-medium" @click="openEdit(teacher)">Edit</button>
                    <button class="text-red-500 hover:text-red-700 text-sm font-medium" @click="handleDelete(teacher)">Hapus</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <AppEmpty v-else icon="👨‍🏫" title="Belum ada guru" description="Tambahkan guru pertama Anda" />
        <AppPagination :meta="meta" @page-change="setPage" />
      </template>
    </div>

    <AppModal v-model="modalOpen" :title="editingTeacher ? 'Edit Guru' : 'Tambah Guru'" size="lg">
      <TeacherForm
        :teacher="editingTeacher"
        :loading="formLoading"
        @submit="handleSubmit"
        @cancel="modalOpen = false"
      />
    </AppModal>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'admin' })

import { teachersService } from '~/services/teachers.service'

const toast = useToast()
const { confirm } = useConfirm()

const teachers = ref([])
const meta = ref(null)
const loading = ref(true)
const formLoading = ref(false)
const modalOpen = ref(false)
const editingTeacher = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)

let searchTimeout = null

const fetchTeachers = async () => {
  loading.value = true
  try {
    const params = { page: currentPage.value, limit: 10 }
    if (searchQuery.value) params.search = searchQuery.value
    const response = await teachersService.getAll(params)
    teachers.value = response.data
    meta.value = response.meta
  } catch {
    toast.error('Gagal memuat data guru')
  } finally {
    loading.value = false
  }
}

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { currentPage.value = 1; fetchTeachers() }, 400)
}

const setPage = (page) => { currentPage.value = page; fetchTeachers() }
const openCreate = () => { editingTeacher.value = null; modalOpen.value = true }
const openEdit = (teacher) => { editingTeacher.value = teacher; modalOpen.value = true }

const handleSubmit = async (data) => {
  formLoading.value = true
  try {
    if (editingTeacher.value) {
      await teachersService.update(editingTeacher.value.id, data)
      toast.success('Data guru berhasil diperbarui')
    } else {
      await teachersService.create(data)
      toast.success('Guru berhasil ditambahkan')
    }
    modalOpen.value = false
    fetchTeachers()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Operasi gagal')
  } finally {
    formLoading.value = false
  }
}

const handleDelete = async (teacher) => {
  const confirmed = await confirm('Hapus Guru', `Apakah Anda yakin ingin menghapus guru ${teacher.full_name}?`)
  if (!confirmed) return
  try {
    await teachersService.remove(teacher.id)
    toast.success('Guru berhasil dihapus')
    fetchTeachers()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal menghapus guru')
  }
}

onMounted(fetchTeachers)
</script>
