<template>
  <div>
    <div class="page-header flex items-center justify-between">
      <div>
        <h1 class="page-title">Jadwal Mengajar</h1>
        <p class="page-subtitle">Jadwal mengajar Anda minggu ini</p>
      </div>
      <button class="btn-outline" @click="timetableOpen = true">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
        Jadwal Mingguan
      </button>
    </div>

    <AppLoader v-if="loading" />

    <template v-else>
      <div v-if="schedulesByDay.length" class="space-y-4">
        <div v-for="group in schedulesByDay" :key="group.day" class="card">
          <div class="flex items-center gap-2 mb-4">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="isToday(group.day) ? 'bg-brand-600' : 'bg-gray-100'"
            >
              <svg
                class="w-4 h-4"
                :class="isToday(group.day) ? 'text-white' : 'text-gray-500'"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </div>
            <h3 class="font-bold text-gray-900">{{ group.day }}</h3>
            <span v-if="isToday(group.day)" class="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">Hari ini</span>
          </div>
          <div class="space-y-2">
            <div
              v-for="schedule in group.schedules"
              :key="schedule.id"
              class="flex items-center gap-4 p-3.5 rounded-xl border"
              :class="isToday(group.day) ? 'bg-brand-50/40 border-brand-100' : 'bg-gray-50/60 border-gray-100'"
            >
              <div class="text-center min-w-[72px]">
                <p class="text-sm font-bold" :class="isToday(group.day) ? 'text-brand-600' : 'text-gray-700'">
                  {{ schedule.start_time }}
                </p>
                <p class="text-xs text-gray-400">{{ schedule.end_time }}</p>
              </div>
              <div class="w-px h-8 bg-gray-200 flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-900 truncate">{{ schedule.subject?.name }}</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ schedule.class?.name }} — {{ schedule.class?.grade }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="card">
        <AppEmpty title="Belum ada jadwal" description="Jadwal mengajar Anda belum diatur" />
      </div>
    </template>

    <AppModal v-model="timetableOpen" title="Jadwal Mengajar Mingguan" size="xl">
      <WeeklyTimetable :schedules="schedules" :loading="loading" />
    </AppModal>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'guru' })

import { schedulesService } from '~/services/schedules.service'

const toast = useToast()
const schedules = ref([])
const loading = ref(true)
const timetableOpen = ref(false)

const dayOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

const todayName = computed(() => {
  const names = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  return names[new Date().getDay()]
})

const isToday = (day) => day === todayName.value

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
    const response = await schedulesService.getMy()
    schedules.value = response.data
  } catch {
    toast.error('Gagal memuat jadwal')
  } finally {
    loading.value = false
  }
})
</script>
