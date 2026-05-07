<template>
  <div>
    <div v-if="loading" class="py-12">
      <AppLoader text="Memuat jadwal..." />
    </div>

    <div v-else-if="!hasSchedules" class="py-12">
      <AppEmpty title="Belum ada jadwal" description="Jadwal mingguan belum diatur untuk kelas ini" />
    </div>

    <template v-else>
      <div class="flex items-center justify-between mb-5">
        <div v-if="className">
          <p class="text-xs text-gray-400 uppercase tracking-wider font-semibold">Jadwal Mingguan</p>
          <h3 class="text-lg font-bold text-gray-900 mt-0.5">{{ className }}</h3>
        </div>
        <div v-else />
        <button class="btn-outline btn-sm" @click="downloadSchedule">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Unduh Jadwal
        </button>
      </div>

      <div ref="timetableRef" class="overflow-x-auto scrollbar-thin">
        <table class="w-full border-collapse text-sm" style="min-width: 520px">
          <thead>
            <tr>
              <th
                class="border border-gray-200 bg-gray-50 px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-24"
              >
                Jam
              </th>
              <th
                v-for="day in activeDays"
                :key="day"
                class="border border-gray-200 px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wider"
                :class="isToday(day) ? 'bg-brand-600 text-white' : 'bg-gray-50 text-gray-600'"
              >
                {{ day }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="slot in timeSlots" :key="slot">
              <td class="border border-gray-200 bg-gray-50/60 px-3 py-2 text-center">
                <span class="text-xs font-mono font-semibold text-gray-600 block">{{ slot }}</span>
                <span class="text-[10px] font-mono text-gray-400">{{ getEndTime(slot) }}</span>
              </td>
              <td
                v-for="day in activeDays"
                :key="`${day}-${slot}`"
                class="border border-gray-200 px-2 py-2 align-top"
                :class="isToday(day) ? 'bg-brand-50/30' : 'bg-white'"
              >
                <template v-if="getSchedule(day, slot)">
                  <p class="text-xs font-bold text-gray-900 leading-snug">
                    {{ getSchedule(day, slot).subject?.name }}
                  </p>
                  <p class="text-[11px] text-gray-500 mt-0.5 leading-snug">
                    {{ getSchedule(day, slot).teacher?.full_name }}
                  </p>
                </template>
                <span v-else class="text-gray-200 text-xs select-none">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <div id="timetable-print-area" class="hidden">
      <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 900px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #1a1a1a; padding-bottom: 12px;">
          <h2 style="margin: 0; font-size: 18px; font-weight: 700; color: #1a1a1a;">Jadwal Pelajaran Mingguan</h2>
          <p v-if="className" style="margin: 4px 0 0; font-size: 14px; color: #555;">{{ className }}</p>
          <p style="margin: 4px 0 0; font-size: 11px; color: #888;">Dicetak: {{ printDate }}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr>
              <th style="border: 1px solid #ccc; background: #f5f5f5; padding: 8px 10px; text-align: left; font-size: 11px; font-weight: 700; color: #555; text-transform: uppercase; width: 80px;">
                Jam
              </th>
              <th
                v-for="day in activeDays"
                :key="day"
                style="border: 1px solid #ccc; background: #f5f5f5; padding: 8px 10px; text-align: center; font-size: 11px; font-weight: 700; color: #333; text-transform: uppercase;"
              >
                {{ day }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="slot in timeSlots" :key="slot">
              <td style="border: 1px solid #ccc; background: #fafafa; padding: 8px 10px; text-align: center; vertical-align: middle;">
                <span style="font-family: monospace; font-size: 11px; font-weight: 600; color: #444; display: block;">{{ slot }}</span>
                <span style="font-family: monospace; font-size: 10px; color: #888;">{{ getEndTime(slot) }}</span>
              </td>
              <td
                v-for="day in activeDays"
                :key="`${day}-${slot}`"
                style="border: 1px solid #ccc; padding: 8px 10px; vertical-align: top; background: #fff;"
              >
                <template v-if="getSchedule(day, slot)">
                  <p style="margin: 0; font-size: 12px; font-weight: 700; color: #1a1a1a; line-height: 1.3;">
                    {{ getSchedule(day, slot).subject?.name }}
                  </p>
                  <p style="margin: 3px 0 0; font-size: 10px; color: #666; line-height: 1.3;">
                    {{ getSchedule(day, slot).teacher?.full_name }}
                  </p>
                </template>
                <span v-else style="color: #ddd; font-size: 11px;">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  schedules: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  className: { type: String, default: '' },
})

const timetableRef = ref(null)

const dayOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

const todayName = computed(() => {
  const names = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  return names[new Date().getDay()]
})

const printDate = computed(() =>
  new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
)

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

const getEndTime = (startTime) => {
  const schedule = props.schedules.find((s) => s.start_time === startTime)
  return schedule?.end_time || ''
}

const isToday = (day) => day === todayName.value

const downloadSchedule = () => {
  const printContent = document.getElementById('timetable-print-area')
  if (!printContent) return

  const printWindow = window.open('', '_blank', 'width=900,height=700')
  if (!printWindow) return

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <title>Jadwal Pelajaran${props.className ? ' — ' + props.className : ''}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #fff; color: #1a1a1a; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 15mm; size: A4 landscape; }
        }
      </style>
    </head>
    <body>
      ${printContent.innerHTML}
    </body>
    </html>
  `)

  printWindow.document.close()
  printWindow.focus()

  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 400)
}
</script>
