<template>
  <div>
    <div v-if="loading" class="py-12">
      <AppLoader text="Memuat jadwal..." />
    </div>

    <div v-else-if="!hasSchedules" class="py-12">
      <AppEmpty title="Belum ada jadwal" description="Jadwal mingguan belum diatur untuk kelas ini" />
    </div>

    <template v-else>
      <div v-if="className" class="mb-4 pb-4 border-b border-gray-100">
        <p class="text-xs text-gray-400 uppercase tracking-wider font-semibold">Jadwal Mingguan</p>
        <h3 class="text-lg font-bold text-gray-900 mt-0.5">{{ className }}</h3>
      </div>

      <div class="overflow-x-auto scrollbar-thin -mx-1">
        <div class="min-w-[560px] px-1">
          <div class="grid gap-3" :style="`grid-template-columns: 80px repeat(${activeDays.length}, 1fr)`">
            <div class="h-10" />
            <div
              v-for="day in activeDays"
              :key="day"
              class="h-10 flex items-center justify-center rounded-xl text-xs font-bold uppercase tracking-wider"
              :class="isToday(day) ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'"
            >
              {{ dayShort(day) }}
            </div>

            <template v-for="slot in timeSlots" :key="slot">
              <div class="flex items-start justify-end pr-3 pt-2">
                <span class="text-[11px] font-mono text-gray-400 leading-none">{{ slot }}</span>
              </div>

              <template v-for="day in activeDays" :key="`${day}-${slot}`">
                <div
                  v-if="getSchedule(day, slot)"
                  class="rounded-xl p-2.5 border min-h-[72px] flex flex-col justify-between"
                  :class="isToday(day) ? 'bg-brand-50 border-brand-200' : 'bg-white border-gray-100'"
                >
                  <div>
                    <p class="text-xs font-bold text-gray-900 leading-tight line-clamp-2">
                      {{ getSchedule(day, slot).subject?.name }}
                    </p>
                    <p class="text-[11px] text-gray-400 mt-1 leading-tight">
                      {{ getSchedule(day, slot).teacher?.full_name }}
                    </p>
                  </div>
                  <p class="text-[10px] font-mono text-gray-400 mt-1.5">
                    {{ getSchedule(day, slot).start_time }} – {{ getSchedule(day, slot).end_time }}
                  </p>
                </div>
                <div v-else class="rounded-xl min-h-[72px] bg-gray-50/50 border border-dashed border-gray-100" />
              </template>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  schedules: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  className: { type: String, default: '' },
})

const dayOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const dayShortMap = { Senin: 'Sen', Selasa: 'Sel', Rabu: 'Rab', Kamis: 'Kam', Jumat: 'Jum', Sabtu: 'Sab' }

const todayName = computed(() => {
  const names = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  return names[new Date().getDay()]
})

const activeDays = computed(() => {
  const usedDays = new Set(props.schedules.map((s) => s.day))
  return dayOrder.filter((d) => usedDays.has(d))
})

const timeSlots = computed(() => {
  const slots = new Set(props.schedules.map((s) => s.start_time))
  return [...slots].sort()
})

const hasSchedules = computed(() => props.schedules.length > 0)

const getSchedule = (day, startTime) =>
  props.schedules.find((s) => s.day === day && s.start_time === startTime) || null

const isToday = (day) => day === todayName.value

const dayShort = (day) => dayShortMap[day] || day.slice(0, 3)
</script>
