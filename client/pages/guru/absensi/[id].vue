<template>
  <div>
    <div class="page-header flex items-center gap-4">
      <NuxtLink to="/guru/absensi" class="btn-outline px-3 py-2">← Kembali</NuxtLink>
      <div>
        <h1 class="page-title">Detail Absensi</h1>
        <p v-if="attendance" class="page-subtitle">{{ attendance.class?.name }} — {{ formatDate(attendance.date) }}</p>
      </div>
    </div>

    <AppLoader v-if="loading" />

    <div v-else-if="attendance" class="card">
      <div class="flex flex-wrap gap-3 mb-6 pb-4 border-b border-gray-100">
        <AppBadge variant="success">Hadir: {{ countStatus('HADIR') }}</AppBadge>
        <AppBadge variant="warning">Sakit: {{ countStatus('SAKIT') }}</AppBadge>
        <AppBadge variant="info">Izin: {{ countStatus('IZIN') }}</AppBadge>
        <AppBadge variant="danger">Alpha: {{ countStatus('ALPHA') }}</AppBadge>
        <div class="ml-auto">
          <button class="btn-primary" :disabled="saving" @click="saveChanges">
            <span v-if="saving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Simpan Perubahan
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <div
          v-for="detail in editableDetails"
          :key="detail.id"
          class="flex items-center gap-3 p-3 rounded-lg border border-gray-100"
        >
          <div class="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-brand-700 text-xs font-semibold">{{ detail.student?.full_name[0] }}</span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">{{ detail.student?.full_name }}</p>
            <p class="text-xs text-gray-400">{{ detail.student?.nis }}</p>
          </div>
          <select v-model="detail.status" class="input w-28 text-xs py-1.5">
            <option value="HADIR">Hadir</option>
            <option value="SAKIT">Sakit</option>
            <option value="IZIN">Izin</option>
            <option value="ALPHA">Alpha</option>
          </select>
          <input v-model="detail.notes" type="text" class="input w-40 text-xs py-1.5" placeholder="Keterangan" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'guru' })

import { attendanceService } from '~/services/attendance.service'

const route = useRoute()
const toast = useToast()

const attendance = ref(null)
const editableDetails = ref([])
const loading = ref(true)
const saving = ref(false)

const formatDate = (date) =>
  new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const countStatus = (status) => editableDetails.value.filter((d) => d.status === status).length

const saveChanges = async () => {
  saving.value = true
  try {
    await attendanceService.update(route.params.id, { details: editableDetails.value.map((d) => ({ student_id: d.student_id, status: d.status, notes: d.notes })) })
    toast.success('Absensi berhasil diperbarui')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal menyimpan')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    const response = await attendanceService.getById(route.params.id)
    attendance.value = response.data
    editableDetails.value = response.data.details.map((d) => ({ ...d }))
  } catch {
    toast.error('Gagal memuat detail absensi')
  } finally {
    loading.value = false
  }
})
</script>
