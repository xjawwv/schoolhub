<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Pengumuman</h1>
      <p class="page-subtitle">Informasi dan pengumuman terbaru</p>
    </div>

    <AppLoader v-if="loading" />

    <template v-else>
      <div v-if="announcements.length" class="space-y-3">
        <div
          v-for="ann in announcements"
          :key="ann.id"
          class="card hover:shadow-md transition-shadow"
        >
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">📢</div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-semibold text-gray-900">{{ ann.title }}</h3>
                <AppBadge :variant="ann.target_role ? 'info' : 'gray'">{{ ann.target_role || 'Semua' }}</AppBadge>
              </div>
              <p class="text-sm text-gray-600">{{ ann.content }}</p>
              <p class="text-xs text-gray-400 mt-2">{{ formatDate(ann.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
      <AppEmpty v-else icon="📢" title="Belum ada pengumuman" description="Belum ada pengumuman untuk Anda" />
      <AppPagination :meta="meta" @page-change="setPage" />
    </template>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'siswa' })

import { announcementsService } from '~/services/announcements.service'

const toast = useToast()
const announcements = ref([])
const meta = ref(null)
const loading = ref(true)
const currentPage = ref(1)

const formatDate = (date) =>
  new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

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

onMounted(fetchAnnouncements)
</script>
