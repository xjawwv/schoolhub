<template>
  <div>
    <div class="page-header flex items-center justify-between">
      <div>
        <h1 class="page-title">Jadwal Pelajaran</h1>
        <p class="page-subtitle">Kelola jadwal pelajaran per kelas</p>
      </div>
      <button class="btn-primary" @click="openCreate">+ Tambah Jadwal</button>
    </div>

    <div class="card">
      <div class="flex flex-col sm:flex-row gap-3 mb-4">
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
                <th>Hari</th>
                <th>Waktu</th>
                <th>Kelas</th>
                <th>Mata Pelajaran</th>
                <th>Guru</th>
                <th>Ruang</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="schedule in schedules" :key="schedule.id">
                <td><AppBadge variant="info">{{ schedule.day }}</AppBadge></td>
                <td class="font-mono text-xs text-gray-600">{{ schedule.start_time }} - {{ schedule.end_time }}</td>
                <td class="font-medium">{{ schedule.class?.name }}</td>
                <td class="text-gray-700">{{ schedule.subject?.name }}</td>
                <td class="text-gray-600">{{ schedule.teacher?.full_name }}</td>
                <td class="text-gray-500">{{ schedule.room || '-' }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <button class="text-brand-600 hover:text-brand-800 text-sm font-medium" @click="openEdit(schedule)">Edit</button>
                    <button class="text-red-500 hover:text-red-700 text-sm font-medium" @click="handleDelete(schedule)">Hapus</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <AppEmpty v-else icon="📅" title="Belum ada jadwal" description="Tambahkan jadwal pelajaran" />
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
          <div>
            <label class="label">Ruang (opsional)</label>
            <input v-model="form.room" type="text" class="input" placeholder="Contoh: Lab Komputer 1" />
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

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

const form = reactive({
  class_id: '', subject_id: '', teacher_id: '',
  day: '', start_time: '', end_time: '', room: '',
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
  Object.assign(form, { class_id: '', subject_id: '', teacher_id: '', day: '', start_time: '', end_time: '', room: '' })
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
    room: schedule.room || '',
  })
  modalOpen.value = true
}

const handleSubmit = async () => {
  formLoading.value = true
  try {
    const data = { ...form }
    if (!data.room) delete data.room
    if (editing.value) {
      await schedulesService.update(editing.value.id, data)
      toast.success('Jadwal berhasil diperbarui')
    } else {
      await schedulesService.create(data)
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
