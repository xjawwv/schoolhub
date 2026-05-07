<template>
  <div>
    <div class="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div><h1 class="page-title">Data Kelas</h1><p class="page-subtitle">Kelola data kelas dan rombongan belajar</p></div>
      <button class="btn-primary" @click="openCreate"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> Tambah Kelas</button>
    </div>
    <div class="card">
      <AppLoader v-if="loading" />
      <template v-else>
        <div v-if="classes.length" class="table-container">
          <table class="table">
            <thead><tr><th>Nama Kelas</th><th>Tingkat</th><th>Tahun Ajaran</th><th>Jumlah Siswa</th><th>Jadwal</th><th>Aksi</th></tr></thead>
            <tbody>
              <tr v-for="cls in classes" :key="cls.id">
                <td class="font-semibold text-gray-900">{{ cls.name }}</td>
                <td><AppBadge variant="info">{{ cls.grade }}</AppBadge></td>
                <td class="text-gray-600">{{ cls.academic_year }}</td>
                <td>{{ cls._count?.students || 0 }} siswa</td>
                <td>{{ cls._count?.schedules || 0 }} jadwal</td>
                <td><div class="flex items-center gap-3"><button class="action-edit" @click="openEdit(cls)">Edit</button><button class="action-delete" @click="handleDelete(cls)">Hapus</button></div></td>
              </tr>
            </tbody>
          </table>
        </div>
        <AppEmpty v-else icon="classes" title="Belum ada kelas" description="Tambahkan kelas pertama" />
        <AppPagination :meta="meta" @page-change="setPage" />
      </template>
    </div>
    <AppModal v-model="modalOpen" :title="editing ? 'Edit Kelas' : 'Tambah Kelas'" size="sm">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div><label class="label">Nama Kelas</label><input v-model="form.name" type="text" class="input" placeholder="Contoh: X PPLG 1" required /></div>
          <div><label class="label">Tingkat</label><select v-model="form.grade" class="input" required><option value="">Pilih tingkat</option><option value="X">X</option><option value="XI">XI</option><option value="XII">XII</option></select></div>
          <div><label class="label">Tahun Ajaran</label><input v-model="form.academic_year" type="text" class="input" placeholder="2024/2025" required /></div>
        </div>
        <div class="flex gap-3 justify-end mt-6">
          <button type="button" class="btn-outline" @click="modalOpen = false">Batal</button>
          <button type="submit" class="btn-primary" :disabled="formLoading"><span v-if="formLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {{ editing ? 'Simpan' : 'Tambah' }}</button>
        </div>
      </form>
    </AppModal>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'admin' })
import { classesService } from '~/services/classes.service'
const toast = useToast()
const { confirm } = useConfirm()
const classes = ref([])
const meta = ref(null)
const loading = ref(true)
const formLoading = ref(false)
const modalOpen = ref(false)
const editing = ref(null)
const currentPage = ref(1)
const form = reactive({ name: '', grade: '', academic_year: '' })
const fetchClasses = async () => { loading.value = true; try { const response = await classesService.getAll({ page: currentPage.value, limit: 10 }); classes.value = response.data; meta.value = response.meta } catch { toast.error('Gagal memuat data kelas') } finally { loading.value = false } }
const setPage = (page) => { currentPage.value = page; fetchClasses() }
const openCreate = () => { editing.value = null; Object.assign(form, { name: '', grade: '', academic_year: '' }); modalOpen.value = true }
const openEdit = (cls) => { editing.value = cls; Object.assign(form, { name: cls.name, grade: cls.grade, academic_year: cls.academic_year }); modalOpen.value = true }
const handleSubmit = async () => { formLoading.value = true; try { if (editing.value) { await classesService.update(editing.value.id, form); toast.success('Kelas berhasil diperbarui') } else { await classesService.create(form); toast.success('Kelas berhasil ditambahkan') }; modalOpen.value = false; fetchClasses() } catch (error) { toast.error(error.response?.data?.message || 'Operasi gagal') } finally { formLoading.value = false } }
const handleDelete = async (cls) => { const confirmed = await confirm('Hapus Kelas', `Hapus kelas ${cls.name}? Pastikan tidak ada siswa di kelas ini.`); if (!confirmed) return; try { await classesService.remove(cls.id); toast.success('Kelas berhasil dihapus'); fetchClasses() } catch (error) { toast.error(error.response?.data?.message || 'Gagal menghapus kelas') } }
onMounted(fetchClasses)
</script>
