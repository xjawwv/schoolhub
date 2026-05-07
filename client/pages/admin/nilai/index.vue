<template>
  <div>
    <div class="page-header"><h1 class="page-title">Monitoring Nilai</h1><p class="page-subtitle">Pantau data nilai seluruh siswa</p></div>
    <div class="card">
      <div class="filter-bar">
        <select v-model="filterSubject" class="input max-w-xs" @change="applyFilter"><option value="">Semua Mata Pelajaran</option><option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option></select>
        <select v-model="filterSemester" class="input max-w-xs" @change="applyFilter"><option value="">Semua Semester</option><option value="1">Semester 1</option><option value="2">Semester 2</option></select>
      </div>
      <AppLoader v-if="loading" />
      <template v-else>
        <div v-if="grades.length" class="table-container">
          <table class="table">
            <thead><tr><th>Siswa</th><th>Mata Pelajaran</th><th>Semester</th><th>Jenis Nilai</th><th>Nilai</th><th>Predikat</th></tr></thead>
            <tbody>
              <tr v-for="grade in grades" :key="grade.id">
                <td><div><p class="font-semibold text-gray-900">{{ grade.student?.full_name }}</p><p class="text-xs text-gray-400">{{ grade.student?.nis }}</p></div></td>
                <td class="text-gray-700">{{ grade.subject?.name }}</td>
                <td><AppBadge variant="gray">Sem {{ grade.semester }}</AppBadge></td>
                <td class="text-gray-600 text-xs">{{ grade.grade_type }}</td>
                <td><span class="text-lg font-bold" :class="scoreColor(grade.score)">{{ grade.score }}</span></td>
                <td><AppBadge :variant="gradeVariant(grade.score)">{{ gradeLetter(grade.score) }}</AppBadge></td>
              </tr>
            </tbody>
          </table>
        </div>
        <AppEmpty v-else icon="grades" title="Belum ada data nilai" description="Data nilai akan muncul setelah guru melakukan input" />
        <AppPagination :meta="meta" @page-change="setPage" />
      </template>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'admin' })
import { gradesService } from '~/services/grades.service'
import { subjectsService } from '~/services/subjects.service'
const toast = useToast()
const grades = ref([])
const subjects = ref([])
const meta = ref(null)
const loading = ref(true)
const filterSubject = ref('')
const filterSemester = ref('')
const currentPage = ref(1)
const scoreColor = (score) => { if (score >= 85) return 'text-emerald-600'; if (score >= 70) return 'text-blue-600'; if (score >= 60) return 'text-amber-600'; return 'text-red-600' }
const gradeLetter = (score) => { if (score >= 90) return 'A'; if (score >= 80) return 'B'; if (score >= 70) return 'C'; if (score >= 60) return 'D'; return 'E' }
const gradeVariant = (score) => { if (score >= 80) return 'success'; if (score >= 70) return 'info'; if (score >= 60) return 'warning'; return 'danger' }
const fetchGrades = async () => { loading.value = true; try { const params = { page: currentPage.value, limit: 15 }; if (filterSubject.value) params.subject_id = filterSubject.value; if (filterSemester.value) params.semester = filterSemester.value; const response = await gradesService.getAll(params); grades.value = response.data; meta.value = response.meta } catch { toast.error('Gagal memuat data nilai') } finally { loading.value = false } }
const fetchSubjects = async () => { try { const response = await subjectsService.getAll({ limit: 100 }); subjects.value = response.data } catch {} }
const applyFilter = () => { currentPage.value = 1; fetchGrades() }
const setPage = (page) => { currentPage.value = page; fetchGrades() }
onMounted(() => { fetchGrades(); fetchSubjects() })
</script>
