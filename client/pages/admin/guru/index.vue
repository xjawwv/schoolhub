<template>
  <div>
    <div class="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="page-title">Data Guru</h1>
        <p class="page-subtitle">Kelola data seluruh guru</p>
      </div>
      <button class="btn-primary" @click="openCreate">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        Tambah Guru
      </button>
    </div>

    <div class="card">
      <div class="filter-bar">
        <div class="relative flex-1 max-w-xs">
          <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
          <input v-model="searchQuery" type="text" class="input pl-10" placeholder="Cari nama atau NIP..." @input="debouncedSearch" />
        </div>
      </div>

      <AppLoader v-if="loading" />
      <template v-else>
        <div v-if="teachers.length" class="table-container">
          <table class="table">
            <thead><tr><th>NIP</th><th>Nama Lengkap</th><th>Mata Pelajaran</th><th>Gender</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              <tr v-for="teacher in teachers" :key="teacher.id">
                <td class="font-mono text-xs text-gray-500">{{ teacher.nip }}</td>
                <td>
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0"><span class="text-white text-xs font-bold">{{ teacher.full_name[0] }}</span></div>
                    <span class="font-semibold text-gray-900">{{ teacher.full_name }}</span>
                  </div>
                </td>
                <td><div class="flex flex-wrap gap-1"><AppBadge v-for="s in teacher.subjects.slice(0, 2)" :key="s.id" variant="info">{{ s.name }}</AppBadge><AppBadge v-if="teacher.subjects.length > 2" variant="gray">+{{ teacher.subjects.length - 2 }}</AppBadge></div></td>
                <td class="text-gray-600">{{ teacher.gender }}</td>
                <td><AppBadge :variant="teacher.user?.is_active ? 'success' : 'danger'">{{ teacher.user?.is_active ? 'Aktif' : 'Nonaktif' }}</AppBadge></td>
                <td>
                  <div class="flex items-center gap-3">
                    <button class="action-edit" @click="openEdit(teacher)">Edit</button>
                    <button class="action-delete" @click="handleDelete(teacher)">Hapus</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <AppEmpty v-else icon="teachers" title="Belum ada guru" description="Tambahkan guru pertama Anda" />
        <AppPagination :meta="meta" @page-change="setPage" />
      </template>
    </div>

    <AppModal v-model="modalOpen" :title="editingTeacher ? 'Edit Guru' : 'Tambah Guru'" size="lg">
      <TeacherForm :teacher="editingTeacher" :loading="formLoading" @submit="handleSubmit" @cancel="modalOpen = false" />
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
const fetchTeachers = async () => { loading.value = true; try { const params = { page: currentPage.value, limit: 10 }; if (searchQuery.value) params.search = searchQuery.value; const response = await teachersService.getAll(params); teachers.value = response.data; meta.value = response.meta } catch { toast.error('Gagal memuat data guru') } finally { loading.value = false } }
const debouncedSearch = () => { clearTimeout(searchTimeout); searchTimeout = setTimeout(() => { currentPage.value = 1; fetchTeachers() }, 400) }
const setPage = (page) => { currentPage.value = page; fetchTeachers() }
const openCreate = () => { editingTeacher.value = null; modalOpen.value = true }
const openEdit = (teacher) => { editingTeacher.value = teacher; modalOpen.value = true }
const handleSubmit = async (data) => { formLoading.value = true; try { if (editingTeacher.value) { await teachersService.update(editingTeacher.value.id, data); toast.success('Data guru berhasil diperbarui') } else { await teachersService.create(data); toast.success('Guru berhasil ditambahkan') }; modalOpen.value = false; fetchTeachers() } catch (error) { toast.error(error.response?.data?.message || 'Operasi gagal') } finally { formLoading.value = false } }
const handleDelete = async (teacher) => { const confirmed = await confirm('Hapus Guru', `Apakah Anda yakin ingin menghapus guru ${teacher.full_name}?`); if (!confirmed) return; try { await teachersService.remove(teacher.id); toast.success('Guru berhasil dihapus'); fetchTeachers() } catch (error) { toast.error(error.response?.data?.message || 'Gagal menghapus guru') } }
onMounted(fetchTeachers)
</script>
