<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Jadwal Pelajaran</h1>
      <p class="page-subtitle">Jadwal pelajaran kelas Anda</p>
    </div>

    <AppLoader v-if="loading" />

    <template v-else>
      <div v-if="schedulesByDay.length" class="space-y-4">
        <div v-for="group in schedulesByDay" :key="group.day" class="card">
          <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span class="w-2 h-2 bg-emerald-500 rounded-full" />
            {{ group.day }}
          </h3>
          <div class="space-y-2">
            <div
              v-for="schedule in group.schedules"
              :key="schedule.id"
              class="flex items-center gap-4 p-3 rounded-lg bg-gray-50"
            >
              <div class="text-center min-w-[80px]">
                <p class="text-sm font-bold text-emerald-600">{{ schedule.start_time }}</p>
                <p class="text-xs text-gray-400">{{ schedule.end_time }}</p>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ schedule.subject?.name }}</p>
                <p class="text-xs text-gray-500">{{ schedule.teacher?.full_name }} — {{ schedule.room || 'Ruang tidak ditentukan' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AppEmpty v-else icon="📅" title="Belum ada jadwal" description="Jadwal pelajaran Anda belum diatur" />
    </template>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'siswa' })

import { schedulesService } from '~/services/schedules.service'

const toast = useToast()
const schedules = ref([])
const loading = ref(true)

const dayOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

const schedulesByDay = computed(() => {
  const grouped = {}
  schedules.value.forEach((s) => {
    if (!grouped[s.day]) grouped[s.day] = []
    grouped[s.day].push(s)
  })
  return dayOrder
    .filter((day) => grouped[day])
    .map((day) => ({ day, schedules: grouped[day] }))
})

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
