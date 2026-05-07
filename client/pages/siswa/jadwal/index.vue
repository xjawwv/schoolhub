<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Jadwal Pelajaran</h1>
      <p class="page-subtitle">Jadwal pelajaran kelas Anda</p>
    </div>

    <AppLoader v-if="loading" />

    <div v-else class="card p-0 overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <h3 class="font-bold text-gray-900">Jadwal Mingguan</h3>
        <p class="text-xs text-gray-400 mt-0.5">Baris = hari, kolom = slot jam pelajaran</p>
      </div>
      <div class="p-4">
        <WeeklyTimetable :schedules="schedules" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'siswa' })

import { schedulesService } from '~/services/schedules.service'

const toast = useToast()
const schedules = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await schedulesService.getStudent()
    schedules.value = response.data
  } catch {
    toast.error('Gagal memuat jadwal')
  } finally {
    loading.value = false
  }
})
</script>
