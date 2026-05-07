<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Nilai Saya</h1>
      <p class="page-subtitle">Rekap nilai akademik Anda</p>
    </div>

    <div class="mb-4">
      <select v-model="filterSemester" class="input max-w-xs" @change="fetchGrades">
        <option value="">Semua Semester</option>
        <option value="1">Semester 1</option>
        <option value="2">Semester 2</option>
      </select>
    </div>

    <AppLoader v-if="loading" />

    <template v-else>
      <div v-if="grades.length" class="space-y-4">
        <div v-for="group in gradesBySubject" :key="group.subject" class="card">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-gray-900">{{ group.subject }}</h3>
            <span class="text-sm font-bold" :class="scoreColor(group.average)">
              Rata-rata: {{ group.average.toFixed(1) }}
            </span>
          </div>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Jenis Nilai</th>
                  <th>Semester</th>
                  <th>Nilai</th>
                  <th>Predikat</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="grade in group.grades" :key="grade.id">
                  <td class="text-gray-700">{{ grade.grade_type }}</td>
                  <td><AppBadge variant="gray">Sem {{ grade.semester }}</AppBadge></td>
                  <td>
                    <span class="text-lg font-bold" :class="scoreColor(grade.score)">{{ grade.score }}</span>
                  </td>
                  <td>
                    <AppBadge :variant="gradeVariant(grade.score)">{{ gradeLetter(grade.score) }}</AppBadge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AppEmpty v-else icon="📊" title="Belum ada nilai" description="Nilai Anda akan muncul di sini setelah guru melakukan input" />
    </template>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'siswa' })

import { gradesService } from '~/services/grades.service'

const toast = useToast()
const grades = ref([])
const loading = ref(true)
const filterSemester = ref('')

const scoreColor = (score) => {
  if (score >= 85) return 'text-emerald-600'
  if (score >= 70) return 'text-blue-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const gradeLetter = (score) => {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'E'
}

const gradeVariant = (score) => {
  if (score >= 80) return 'success'
  if (score >= 70) return 'info'
  if (score >= 60) return 'warning'
  return 'danger'
}

const gradesBySubject = computed(() => {
  const grouped = {}
  grades.value.forEach((g) => {
    const key = g.subject?.name || 'Lainnya'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(g)
  })
  return Object.entries(grouped).map(([subject, gradeList]) => ({
    subject,
    grades: gradeList,
    average: gradeList.reduce((sum, g) => sum + g.score, 0) / gradeList.length,
  }))
})

const fetchGrades = async () => {
  loading.value = true
  try {
    const params = {}
    if (filterSemester.value) params.semester = filterSemester.value
    const response = await gradesService.getMy(params)
    grades.value = response.data
  } catch {
    toast.error('Gagal memuat data nilai')
  } finally {
    loading.value = false
  }
}

onMounted(fetchGrades)
</script>
