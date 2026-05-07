<template>
  <div>
    <div class="page-header flex items-center justify-between">
      <div>
        <h1 class="page-title">Pengumuman</h1>
        <p class="page-subtitle">Kelola pengumuman untuk seluruh warga sekolah</p>
      </div>
      <button class="btn-primary" @click="openCreate">+ Buat Pengumuman</button>
    </div>

    <div class="card">
      <AppLoader v-if="loading" />
      <template v-else>
        <div v-if="announcements.length" class="space-y-3">
          <div
            v-for="ann in announcements"
            :key="ann.id"
            class="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
          >
            <div class="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">📢</div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-semibold text-gray-900 truncate">{{ ann.title }}</h3>
                <AppBadge :variant="ann.target_role ? 'info' : 'gray'">
                  {{ ann.target_role || 'Semua' }}
                </AppBadge>
                <AppBadge :variant="ann.is_active ? 'success' : 'danger'">
                  {{ ann.is_active ? 'Aktif' : 'Nonaktif' }}
                </AppBadge>
              </div>
              <p class="text-sm text-gray-600 line-clamp-2">{{ ann.content }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ formatDate(ann.created_at) }}</p>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <button class="text-brand-600 hover:text-brand-800 text-sm font-medium" @click="openEdit(ann)">Edit</button>
              <button class="text-red-500 hover:text-red-700 text-sm font-medium" @click="handleDelete(ann)">Hapus</button>
            </div>
          </div>
        </div>
        <AppEmpty v-else icon="📢" title="Belum ada pengumuman" description="Buat pengumuman pertama Anda" />
        <AppPagination :meta="meta" @page-change="setPage" />
      </template>
    </div>

    <AppModal v-model="modalOpen" :title="editing ? 'Edit Pengumuman' : 'Buat Pengumuman'" size="lg">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="label">Judul</label>
            <input v-model="form.title" type="text" class="input" placeholder="Judul pengumuman" required />
          </div>
          <div>
            <label class="label">Target Penerima</label>
            <select v-model="form.target_role" class="input">
              <option value="">Semua (Admin, Guru, Siswa)</option>
              <option value="GURU">Guru</option>
              <option value="SISWA">Siswa</option>
            </select>
          </div>
          <div>
            <label class="label">Isi Pengumuman</label>
            <textarea v-model="form.content" class="input resize-none" rows="5" placeholder="Tulis isi pengumuman di sini..." required />
          </div>
          <div v-if="editing" class="flex items-center gap-2">
            <input id="is_active" v-model="form.is_active" type="checkbox" class="rounded" />
            <label for="is_active" class="text-sm text-gray-700">Aktif</label>
          </div>
        </div>
        <div class="flex gap-3 justify-end mt-6">
          <button type="button" class="btn-outline" @click="modalOpen = false">Batal</button>
          <button type="submit" class="btn-primary" :disabled="formLoading">
            <span v-if="formLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {{ editing ? 'Simpan' : 'Publikasikan' }}
          </button>
        </div>
      </form>
    </AppModal>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'admin' })

import { announcementsService } from '~/services/announcements.service'

const toast = useToast()
const { confirm } = useConfirm()

const announcements = ref([])
const meta = ref(null)
const loading = ref(true)
const formLoading = ref(false)
const modalOpen = ref(false)
const editing = ref(null)
const currentPage = ref(1)

const form = reactive({ title: '', content: '', target_role: '', is_active: true })

const formatDate = (date) =>
  new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const fetchAnnouncements = async () => {
  loading.value = true
  try {
    const response = await announcementsService.getAll({ page: currentPage.value, limit: 10 })
    announcements.value = response.data
    meta.value = response.meta
  } catch {
    toast.error('Gagal memuat pengumuman')
  } finally {
    loading.value = false
  }
}

const setPage = (page) => { currentPage.value = page; fetchAnnouncements() }

const openCreate = () => {
  editing.value = null
  Object.assign(form, { title: '', content: '', target_role: '', is_active: true })
  modalOpen.value = true
}

const openEdit = (ann) => {
  editing.value = ann
  Object.assign(form, { title: ann.title, content: ann.content, target_role: ann.target_role || '', is_active: ann.is_active })
  modalOpen.value = true
}

const handleSubmit = async () => {
  formLoading.value = true
  try {
    const data = { ...form }
    if (!data.target_role) data.target_role = null
    if (editing.value) {
      await announcementsService.update(editing.value.id, data)
      toast.success('Pengumuman berhasil diperbarui')
    } else {
      await announcementsService.create(data)
      toast.success('Pengumuman berhasil dipublikasikan')
    }
    modalOpen.value = false
    fetchAnnouncements()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Operasi gagal')
  } finally {
    formLoading.value = false
  }
}

const handleDelete = async (ann) => {
  const confirmed = await confirm('Hapus Pengumuman', `Hapus pengumuman "${ann.title}"?`)
  if (!confirmed) return
  try {
    await announcementsService.remove(ann.id)
    toast.success('Pengumuman berhasil dihapus')
    fetchAnnouncements()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal menghapus')
  }
}

onMounted(fetchAnnouncements)
</script>
