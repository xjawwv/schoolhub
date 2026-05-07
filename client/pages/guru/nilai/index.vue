<template>
  <div>
    <div class="page-header flex items-center justify-between">
      <div>
        <h1 class="page-title">Input Nilai</h1>
        <p class="page-subtitle">Kelola nilai siswa</p>
      </div>
      <button class="btn-primary" @click="openCreate">+ Input Nilai</button>
    </div>

    <div class="card">
      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <select v-model="filterSubject" class="input max-w-xs" @change="applyFilter">
          <option value="">Semua Mata Pelajaran</option>
          <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
        <select v-model="filterSemester" class="input max-w-xs" @change="applyFilter">
          <option value="">Semua Semester</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
        </select>
      </div>

      <AppLoader v-if="loading" />
      <template v-else>
        <div v-if="grades.length" class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Siswa</th>
                <th>Mata Pelajaran</th>
                <th>Semester</th>
                <th>Jenis</th>
                <th>Nilai</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="grade in grades" :key="grade.id">
                <td>
                  <p class="font-medium text-gray-900">{{ grade.student?.full_name }}</p>
                  <p class="text-xs text-gray-400">{{ grade.student?.nis }}</p>
                </td>
                <td class="text-gray-700">{{ grade.subject?.name }}</td>
                <td><AppBadge variant="gray">Sem {{ grade.semester }}</AppBadge></td>
                <td class="text-xs text-gray-600">{{ grade.grade_type }}</td>
                <td>
                  <span class="font-bold text-lg" :class="scoreColor(grade.score)">{{ grade.score }}</span>
                </td>
                <td>
                  <div class="flex gap-2">
                    <button class="text-brand-600 hover:text-brand-800 text-sm font-medium" @click="openEdit(grade)">Edit</button>
                    <button class="text-red-500 hover:text-red-700 text-sm font-medium" @click="handleDelete(grade)">Hapus</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <AppEmpty v-else icon="📊" title="Belum ada nilai" description="Mulai input nilai siswa" />
        <AppPagination :meta="meta" @page-change="setPage" />
      </template>
    </div>

    <AppModal v-model="modalOpen" :title="editing ? 'Edit Nilai' : 'Input Nilai'" size="md">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div v-if="!editing">
            <label class="label">Siswa</label>
            <select v-model="form.student_id" class="input" required>
              <option value="">Pilih siswa</option>
              <option v-for="s in students" :key="s.id" :value="s.id">{{ s.full_name }} ({{ s.nis }})</option>
            </select>
          </div>
          <div v-if="!editing">
            <label class="label">Mata Pelajaran</label>
            <select v-model="form.subject_id" class="input" required>
              <option value="">Pilih mata pelajaran</option>
              <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Semester</label>
              <select v-model="form.semester" class="input" required>
                <option value="">Pilih semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>
            <div>
              <label class="label">Nilai (0-100)</label>
              <input v-model="form.score" type="number" min="0" max="100" step="0.5" class="input" required />
            </div>
          </div>
          <div>
            <label class="label">Jenis Nilai</label>
            <select v-model="form.grade_type" class="input" required>
              <option value="">Pilih jenis nilai</option>
              <option value="Ulangan Harian">Ulangan Harian</option>
              <option value="UTS">UTS</option>
              <option value="UAS">UAS</option>
              <option value="Tugas">Tugas</option>
              <option value="Praktik">Praktik</option>
            </select>
          </div>
          <div>
            <label class="label">Catatan (opsional)</label>
            <input v-model="form.notes" type="text" class="input" placeholder="Catatan tambahan" />
          </div>
        </div>
        <div class="flex gap-3 justify-end mt-6">
          <button type="button" class="btn-outline" @click="modalOpen = false">Batal</button>
          <button type="submit" class="btn-primary" :disabled="formLoading">
            <span v-if="formLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {{ editing ? 'Simpan' : 'Input Nilai' }}
          </button>
        </div>
      </form>
    </AppModal>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'guru' })

import { gradesService } from '~/services/grades.service'
import { subjectsService } from '~/services/subjects.service'
import { studentsService } from '~/services/students.service'

const toast = useToast()
const { confirm } = useConfirm()

const grades = ref([])
const subjects = ref([])
const students = ref([])
const meta = ref(null)
const loading = ref(true)
const formLoading = ref(false)
const modalOpen = ref(false)
const editing = ref(null)
const filterSubject = ref('')
const filterSemester = ref('')
const currentPage = ref(1)

const form = reactive({ student_id: '', subject_id: '', semester: '', score: '', grade_type: '', notes: '' })

const scoreColor = (score) => {
  if (score >= 85) return 'text-emerald-600'
  if (score >= 70) return 'text-blue-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const fetchGrades = async () => {
  loading.value = true
  try {
    const params = { page: currentPage.value, limit: 15 }
    if (filterSubject.value) params.subject_id = filterSubject.value
    if (filterSemester.value) params.semester = filterSemester.value
    const response = await gradesService.getAll(params)
    grades.value = response.data
    meta.value = response.meta
  } catch {
    toast.error('Gagal memuat data nilai')
  } finally {
    loading.value = false
  }
}

const fetchOptions = async () => {
  const [s, st] = await Promise.all([
    subjectsService.getAll({ limit: 100 }),
    studentsService.getAll({ limit: 200 }),
  ])
  subjects.value = s.data
  students.value = st.data
}

const applyFilter = () => { currentPage.value = 1; fetchGrades() }
const setPage = (page) => { currentPage.value = page; fetchGrades() }

const openCreate = () => {
  editing.value = null
  Object.assign(form, { student_id: '', subject_id: '', semester: '', score: '', grade_type: '', notes: '' })
  modalOpen.value = true
}

const openEdit = (grade) => {
  editing.value = grade
  Object.assign(form, { semester: grade.semester, score: grade.score, grade_type: grade.grade_type, notes: grade.notes || '' })
  modalOpen.value = true
}

const handleSubmit = async () => {
  formLoading.value = true
  try {
    if (editing.value) {
      await gradesService.update(editing.value.id, { score: form.score, grade_type: form.grade_type, notes: form.notes })
      toast.success('Nilai berhasil diperbarui')
    } else {
      await gradesService.create(form)
      toast.success('Nilai berhasil diinput')
    }
    modalOpen.value = false
    fetchGrades()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Operasi gagal')
  } finally {
    formLoading.value = false
  }
}

const handleDelete = async (grade) => {
  const confirmed = await confirm('Hapus Nilai', `Hapus nilai ${grade.student?.full_name} - ${grade.subject?.name}?`)
  if (!confirmed) return
  try {
    await gradesService.remove(grade.id)
    toast.success('Nilai berhasil dihapus')
    fetchGrades()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal menghapus')
  }
}

onMounted(() => { fetchGrades(); fetchOptions() })
</script>
