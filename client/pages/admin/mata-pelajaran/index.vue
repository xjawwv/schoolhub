<template>
  <div>
    <div class="page-header flex items-center justify-between">
      <div>
        <h1 class="page-title">Mata Pelajaran</h1>
        <p class="page-subtitle">Kelola data mata pelajaran</p>
      </div>
      <button class="btn-primary" @click="openCreate">+ Tambah Mapel</button>
    </div>

    <div class="card">
      <div class="mb-4">
        <input v-model="searchQuery" type="text" class="input max-w-xs" placeholder="Cari nama atau kode..." @input="debouncedSearch" />
      </div>

      <AppLoader v-if="loading" />
      <template v-else>
        <div v-if="subjects.length" class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Mata Pelajaran</th>
                <th>Guru Pengampu</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="subject in subjects" :key="subject.id">
                <td><AppBadge variant="gray">{{ subject.code }}</AppBadge></td>
                <td class="font-medium text-gray-900">{{ subject.name }}</td>
                <td class="text-gray-600">{{ subject.teacher?.full_name || '-' }}</td>
                <td class="text-gray-500 text-xs max-w-xs truncate">{{ subject.description || '-' }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <button class="text-brand-600 hover:text-brand-800 text-sm font-medium" @click="openEdit(subject)">Edit</button>
                    <button class="text-red-500 hover:text-red-700 text-sm font-medium" @click="handleDelete(subject)">Hapus</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <AppEmpty v-else icon="📚" title="Belum ada mata pelajaran" description="Tambahkan mata pelajaran pertama" />
        <AppPagination :meta="meta" @page-change="setPage" />
      </template>
    </div>

    <AppModal v-model="modalOpen" :title="editing ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'" size="md">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="label">Kode Mapel</label>
            <input v-model="form.code" type="text" class="input" placeholder="Contoh: PPLG-01" :disabled="!!editing" required />
          </div>
          <div>
            <label class="label">Nama Mata Pelajaran</label>
            <input v-model="form.name" type="text" class="input" placeholder="Nama mata pelajaran" required />
          </div>
          <div>
            <label class="label">Guru Pengampu</label>
            <select v-model="form.teacher_id" class="input">
              <option value="">Pilih guru (opsional)</option>
              <option v-for="t in teachers" :key="t.id" :value="t.id">{{ t.full_name }}</option>
            </select>
          </div>
          <div>
            <label class="label">Deskripsi</label>
            <textarea v-model="form.description" class="input resize-none" rows="2" placeholder="Deskripsi singkat" />
          </div>
        </div>
        <div class="flex gap-3 justify-end mt-6">
          <button type="button" class="btn-outline" @click="modalOpen = false">Batal</button>
          <button type="submit" class="btn-primary" :disabled="formLoading">
            <span v-if="formLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {{ editing ? 'Simpan' : 'Tambah' }}
          </button>
        </div>
      </form>
    </AppModal>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'admin' })

import { subjectsService } from '~/services/subjects.service'
import { teachersService } from '~/services/teachers.service'

const toast = useToast()
const { confirm } = useConfirm()

const subjects = ref([])
const teachers = ref([])
const meta = ref(null)
const loading = ref(true)
const formLoading = ref(false)
const modalOpen = ref(false)
const editing = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)

const form = reactive({ code: '', name: '', teacher_id: '', description: '' })

let searchTimeout = null

const fetchSubjects = async () => {
  loading.value = true
  try {
    const params = { page: currentPage.value, limit: 10 }
    if (searchQuery.value) params.search = searchQuery.value
    const response = await subjectsService.getAll(params)
    subjects.value = response.data
    meta.value = response.meta
  } catch {
    toast.error('Gagal memuat data mata pelajaran')
  } finally {
    loading.value = false
  }
}

const fetchTeachers = async () => {
  try {
    const response = await teachersService.getAll({ limit: 100 })
    teachers.value = response.data
  } catch {}
}

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { currentPage.value = 1; fetchSubjects() }, 400)
}

const setPage = (page) => { currentPage.value = page; fetchSubjects() }

const openCreate = () => {
  editing.value = null
  Object.assign(form, { code: '', name: '', teacher_id: '', description: '' })
  modalOpen.value = true
}

const openEdit = (subject) => {
  editing.value = subject
  Object.assign(form, {
    code: subject.code,
    name: subject.name,
    teacher_id: subject.teacher_id || '',
    description: subject.description || '',
  })
  modalOpen.value = true
}

const handleSubmit = async () => {
  formLoading.value = true
  try {
    const data = { ...form }
    if (!data.teacher_id) delete data.teacher_id
    if (editing.value) {
      await subjectsService.update(editing.value.id, data)
      toast.success('Mata pelajaran berhasil diperbarui')
    } else {
      await subjectsService.create(data)
      toast.success('Mata pelajaran berhasil ditambahkan')
    }
    modalOpen.value = false
    fetchSubjects()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Operasi gagal')
  } finally {
    formLoading.value = false
  }
}

const handleDelete = async (subject) => {
  const confirmed = await confirm('Hapus Mata Pelajaran', `Hapus mata pelajaran ${subject.name}?`)
  if (!confirmed) return
  try {
    await subjectsService.remove(subject.id)
    toast.success('Mata pelajaran berhasil dihapus')
    fetchSubjects()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal menghapus')
  }
}

onMounted(() => { fetchSubjects(); fetchTeachers() })
</script>
