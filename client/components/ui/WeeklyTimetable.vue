<template>
  <div>
    <div v-if="loading" class="py-12">
      <AppLoader text="Memuat jadwal..." />
    </div>
    <div v-else-if="!hasSchedules" class="py-12">
      <AppEmpty title="Belum ada jadwal" description="Jadwal mingguan belum diatur untuk kelas ini" />
    </div>
    <template v-else>
      <div class="flex items-center justify-between mb-4" v-if="className">
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-wider font-semibold">Jadwal Mingguan</p>
          <h3 class="text-lg font-bold text-gray-900 mt-0.5">{{ className }}</h3>
        </div>
        <button class="btn-outline btn-sm" @click="downloadSchedule">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Unduh
        </button>
      </div>

      <div class="overflow-x-auto scrollbar-thin">
        <table class="w-full border-collapse text-xs" style="min-width:700px">
          <thead>
            <tr>
              <th class="border border-gray-300 bg-gray-100 px-3 py-2 text-center font-bold text-gray-600 w-12">
                Hari
              </th>
              <th
                v-for="(col, i) in columns"
                :key="i"
                class="border border-gray-300 bg-gray-100 px-2 py-1.5 text-center font-semibold text-gray-600"
                style="min-width:80px"
              >
                <div class="font-bold text-gray-800">{{ i + 1 }}</div>
                <div class="text-[10px] font-mono text-gray-400 mt-0.5">{{ col.start }}–{{ col.end }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="day in activeDays" :key="day">
              <td
                class="border border-gray-300 px-2 py-3 text-center font-bold text-sm"
                :class="isToday(day) ? 'bg-brand-600 text-white' : 'bg-gray-50 text-gray-700'"
              >
                {{ dayShort(day) }}
              </td>
              <template v-for="cell in getRowCells(day)" :key="cell.key">
                <td
                  v-if="cell.type === 'subject'"
                  :colspan="cell.colspan"
                  class="border border-gray-300 px-2 py-2 text-center align-middle"
                  :class="isToday(day) ? 'bg-brand-50/30' : 'bg-white'"
                >
                  <p class="font-bold text-gray-900 leading-snug text-xs">{{ cell.subject }}</p>
                  <p class="text-[10px] text-gray-500 mt-0.5 italic">{{ cell.teacher }}</p>
                </td>
                <td
                  v-else-if="cell.type === 'empty'"
                  :colspan="cell.colspan"
                  class="border border-gray-300"
                  :class="isToday(day) ? 'bg-brand-50/10' : 'bg-gray-50/30'"
                />
              </template>
            </tr>
          </tbody>
        </table>
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

const isToday = (day) => day === todayName.value
const dayShort = (day) => dayShortMap[day] || day.slice(0, 3)

const toMinutes = (time) => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

const DEFAULT_COLUMNS = [
  { start: '07:30', end: '08:15' },
  { start: '08:15', end: '09:00' },
  { start: '09:00', end: '09:45' },
  { start: '09:45', end: '10:30' },
  { start: '10:30', end: '11:15' },
  { start: '11:15', end: '12:00' },
  { start: '12:00', end: '12:45' },
  { start: '13:00', end: '13:45' },
  { start: '13:45', end: '14:30' },
]

const columns = computed(() => {
  const fromData = new Set()
  props.schedules.forEach((s) => {
    fromData.add(s.start_time)
    fromData.add(s.end_time)
  })

  const allTimes = new Set([
    ...DEFAULT_COLUMNS.map((c) => c.start),
    ...DEFAULT_COLUMNS.map((c) => c.end),
    ...fromData,
  ])

  const sorted = [...allTimes].sort()
  const cols = []
  for (let i = 0; i < sorted.length - 1; i++) {
    cols.push({ start: sorted[i], end: sorted[i + 1] })
  }
  return cols
})

const activeDays = computed(() => {
  return ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']
})

const hasSchedules = computed(() => props.schedules.length > 0)

const getRowCells = (day) => {
  const daySchedules = props.schedules
    .filter((s) => s.day === day)
    .sort((a, b) => toMinutes(a.start_time) - toMinutes(b.start_time))

  const cells = []
  let colIndex = 0

  while (colIndex < columns.value.length) {
    const col = columns.value[colIndex]
    const match = daySchedules.find(
      (s) => s.start_time === col.start
    )

    if (match) {
      const endMin = toMinutes(match.end_time)
      let span = 0
      for (let i = colIndex; i < columns.value.length; i++) {
        if (toMinutes(columns.value[i].end) <= endMin) span++
        else break
      }
      cells.push({
        key: `${day}-${colIndex}`,
        type: 'subject',
        colspan: span || 1,
        subject: match.subject?.name,
        teacher: match.teacher?.full_name,
      })
      colIndex += span || 1
    } else {
      cells.push({ key: `${day}-empty-${colIndex}`, type: 'empty', colspan: 1 })
      colIndex++
    }
  }

  return cells
}

const downloadSchedule = () => {
  const win = window.open('', '_blank', 'width=1000,height=700')
  if (!win) return

  const headerCols = columns.value.map((c, i) =>
    `<th style="border:1px solid #999;padding:6px 8px;background:#f0f0f0;text-align:center;font-size:11px">
      <div style="font-weight:700">${i + 1}</div>
      <div style="font-size:9px;color:#666;font-family:monospace">${c.start}–${c.end}</div>
    </th>`
  ).join('')

  const bodyRows = activeDays.value.map((day) => {
    const cells = getRowCells(day).map((cell) => {
      if (cell.type === 'subject') {
        return `<td colspan="${cell.colspan}" style="border:1px solid #999;padding:8px;text-align:center;vertical-align:middle;background:#fff">
          <div style="font-weight:700;font-size:12px">${cell.subject}</div>
          <div style="font-size:10px;color:#666;font-style:italic;margin-top:2px">${cell.teacher}</div>
        </td>`
      }
      return `<td colspan="${cell.colspan}" style="border:1px solid #999;background:#fafafa"></td>`
    }).join('')
    const bg = isToday(day) ? '#4f46e5' : '#f0f0f0'
    const color = isToday(day) ? '#fff' : '#333'
    return `<tr>
      <td style="border:1px solid #999;padding:8px;text-align:center;font-weight:700;font-size:13px;background:${bg};color:${color}">${dayShort(day)}</td>
      ${cells}
    </tr>`
  }).join('')

  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>Jadwal${props.className ? ' — ' + props.className : ''}</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:20px}
    @media print{@page{size:A4 landscape;margin:10mm}}</style></head>
    <body>
    <h2 style="text-align:center;margin-bottom:4px;font-size:16px">Jadwal Pelajaran Mingguan</h2>
    ${props.className ? `<p style="text-align:center;margin-bottom:16px;font-size:13px;color:#555">${props.className}</p>` : '<div style="margin-bottom:16px"></div>'}
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <thead><tr>
        <th style="border:1px solid #999;padding:8px;background:#f0f0f0;text-align:center;width:50px">Hari</th>
        ${headerCols}
      </tr></thead>
      <tbody>${bodyRows}</tbody>
    </table></body></html>`)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print(); win.close() }, 400)
}
</script>
