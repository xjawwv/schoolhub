<template>
  <div>
    <div class="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="page-title">Jadwal Pelajaran</h1>
        <p class="page-subtitle">Kelola jadwal pelajaran per kelas</p>
      </div>
      <div class="flex gap-2">
        <button class="btn-outline" @click="openTimetable">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
          Jadwal Mingguan
        </button>
        <button class="btn-primary" @click="openCreate">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Tambah Jadwal
        </button>
      </div>
    </div>

    <div class="card">
      <div class="filter-bar">
        <select v-model="filterClass" class="input max-w-xs" @change="applyFilter">
          <option value="">Semua Kelas</option>
          <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
        </select>
        <select v-model="filterDay" class="input max-w-xs" @change="applyFilter">
          <option value="">Semua Hari</option>
          <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
        </select>
      </div>

      <AppLoader v-if="loading" />
      <template v-else>
        <div v-if="schedules.length" class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Kelas</th>
                <th>Hari</th>
                <th>Jam</th>
                <th>Mata Pelajaran</th>
                <th>Guru</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="schedule in schedules" :key="schedule.id">
                <td class="font-semibold text-gray-900">{{ schedule.class?.name }}</td>
                <td><AppBadge variant="brand">{{ schedule.day }}</AppBadge></td>
                <td class="font-mono text-xs text-gray-600 whitespace-nowrap">{{ schedule.start_time }} – {{ schedule.end_time }}</td>
                <td>
                  <p class="font-medium text-gray-900">{{ schedule.subject?.name }}</p>
                  <p class="text-xs text-gray-400 font-mono">{{ schedule.subject?.code }}</p>
                </td>
                <td class="text-gray-600">{{ schedule.teacher?.full_name }}</td>
                <td>
                  <div class="flex items-center gap-3">
                    <button class="action-edit" @click="openEdit(schedule)">Edit</button>
                    <button class="action-delete" @click="handleDelete(schedule)">Hapus</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <AppEmpty v-else title="Belum ada jadwal" description="Tambahkan jadwal pelajaran">
          <template #default>
            <div class="mt-4">
              <svg class="w-12 h-12 text-gray-200 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </div>
          </template>
        </AppEmpty>
        <AppPagination :meta="meta" @page-change="setPage" />
      </template>
    </div>

    <AppModal v-model="modalOpen" :title="editing ? 'Edit Jadwal' : 'Tambah Jadwal'" size="md">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="label">Kelas</label>
            <select v-model="form.class_id" class="input" required>
              <option value="">Pilih kelas</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
            </select>
          </div>
          <div>
            <label class="label">Mata Pelajaran</label>
            <select v-model="form.subject_id" class="input" required>
              <option value="">Pilih mata pelajaran</option>
              <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div>
            <label class="label">Guru</label>
            <select v-model="form.teacher_id" class="input" required>
              <option value="">Pilih guru</option>
              <option v-for="t in teachers" :key="t.id" :value="t.id">{{ t.full_name }}</option>
            </select>
          </div>
          <div>
            <label class="label">Hari</label>
            <select v-model="form.day" class="input" required>
              <option value="">Pilih hari</option>
              <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Jam Mulai</label>
              <input v-model="form.start_time" type="time" class="input" required />
            </div>
            <div>
              <label class="label">Jam Selesai</label>
              <input v-model="form.end_time" type="time" class="input" required />
            </div>
          </div>
        </div>
        <div class="flex gap-3 justify-end mt-6">
          <button type="button" class="btn-outline" @click="modalOpen = false">Batal</button>
          <button type="submit" class="btn-primary" :disabled="formLoading">
            <span v-if="formLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {{ editing ? 'Simpan' : 'Tambah' }}
          </button>
        </div>
      </form>
    </AppModal>

    <AppModal v-model="timetableOpen" title="Jadwal Mingguan" size="xl">
      <div class="mb-4">
        <label class="label">Pilih Kelas</label>
        <select v-model="timetableClassId" class="input max-w-xs" @change="loadTimetable">
          <option value="">Pilih kelas</option>
          <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
        </select>
      </div>
      <WeeklyTimetable
        :schedules="timetableSchedules"
        :loading="timetableLoading"
        :class-name="timetableClassName"
      />
    </AppModal>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'admin' })

import { schedulesService } from '~/services/schedules.service'
import { classesService } from '~/services/classes.service'
import { subjectsService } from '~/services/subjects.service'
import { teachersService } from '~/services/teachers.service'

const toast = useToast()
const { confirm } = useConfirm()

const schedules = ref([])
const classes = ref([])
const subjects = ref([])
const teachers = ref([])
const meta = ref(null)
const loading = ref(true)
const formLoading = ref(false)
const modalOpen = ref(false)
const editing = ref(null)
const filterClass = ref('')
const filterDay = ref('')
const currentPage = ref(1)

const timetableOpen = ref(false)
const timetableClassId = ref('')
const timetableSchedules = ref([])
const timetableLoading = ref(false)
const timetableClassName = ref('')

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

const form = reactive({
  class_id: '', subject_id: '', teacher_id: '',
  day: '', start_time: '', end_time: '',
})

const fetchSchedules = async () => {
  loading.value = true
  try {
    const params = { page: currentPage.value, limit: 15 }
    if (filterClass.value) params.class_id = filterClass.value
    if (filterDay.value) params.day = filterDay.value
    const response = await schedulesService.getAll(params)
    schedules.value = response.data
    meta.value = response.meta
  } catch {
    toast.error('Gagal memuat jadwal')
  } finally {
    loading.value = false
  }
}

const fetchOptions = async () => {
  const [c, s, t] = await Promise.all([
    classesService.getAll({ limit: 100 }),
    subjectsService.getAll({ limit: 100 }),
    teachersService.getAll({ limit: 100 }),
  ])
  classes.value = c.data
  subjects.value = s.data
  teachers.value = t.data
}

const applyFilter = () => { currentPage.value = 1; fetchSchedules() }
const setPage = (page) => { currentPage.value = page; fetchSchedules() }

const openCreate = () => {
  editing.value = null
  Object.assign(form, { class_id: '', subject_id: '', teacher_id: '', day: '', start_time: '', end_time: '' })
  modalOpen.value = true
}

const openEdit = (schedule) => {
  editing.value = schedule
  Object.assign(form, {
    class_id: schedule.class_id,
    subject_id: schedule.subject_id,
    teacher_id: schedule.teacher_id,
    day: schedule.day,
    start_time: schedule.start_time,
    end_time: schedule.end_time,
  })
  modalOpen.value = true
}

const openTimetable = () => {
  timetableClassId.value = filterClass.value || ''
  timetableSchedules.value = []
  timetableClassName.value = ''
  timetableOpen.value = true
  if (timetableClassId.value) loadTimetable()
}

const loadTimetable = async () => {
  if (!timetableClassId.value) {
    timetableSchedules.value = []
    timetableClassName.value = ''
    return
  }
  timetableLoading.value = true
  try {
    const response = await schedulesService.getByClass(timetableClassId.value)
    timetableSchedules.value = response.data
    const cls = classes.value.find((c) => c.id === parseInt(timetableClassId.value))
    timetableClassName.value = cls?.name || ''
  } catch {
    toast.error('Gagal memuat jadwal mingguan')
  } finally {
    timetableLoading.value = false
  }
}

const handleSubmit = async () => {
  formLoading.value = true
  try {
    if (editing.value) {
      await schedulesService.update(editing.value.id, form)
      toast.success('Jadwal berhasil diperbarui')
    } else {
      await schedulesService.create(form)
      toast.success('Jadwal berhasil ditambahkan')
    }
    modalOpen.value = false
    fetchSchedules()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Operasi gagal')
  } finally {
    formLoading.value = false
  }
}

const handleDelete = async (schedule) => {
  const confirmed = await confirm('Hapus Jadwal', `Hapus jadwal ${schedule.subject?.name} - ${schedule.day}?`)
  if (!confirmed) return
  try {
    await schedulesService.remove(schedule.id)
    toast.success('Jadwal berhasil dihapus')
    fetchSchedules()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal menghapus jadwal')
  }
}

onMounted(() => { fetchSchedules(); fetchOptions() })
</script>
