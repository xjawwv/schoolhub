<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Absensi Saya</h1>
      <p class="page-subtitle">Catat kehadiran dan lihat riwayat absensi Anda</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div class="lg:col-span-1">
        <div class="card h-full">
          <h3 class="font-bold text-gray-900 mb-4">Absensi Hari Ini</h3>

          <AppLoader v-if="loadingToday" text="Memeriksa status..." />

          <template v-else>
            <div v-if="todayStatus.hasCheckedIn" class="flex flex-col items-center text-center py-4">
              <div class="w-20 h-20 rounded-2xl flex items-center justify-center mb-4" :class="checkedInBg">
                <svg class="w-10 h-10" :class="checkedInIconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <AppBadge :variant="statusVariant(todayStatus.detail?.status)" class="text-sm px-4 py-1.5 mb-3">
                {{ todayStatus.detail?.status }}
              </AppBadge>
              <p class="text-sm font-semibold text-gray-900">Sudah absen hari ini</p>
              <p class="text-xs text-gray-400 mt-1">{{ formatTime(todayStatus.detail?.check_in_time) }}</p>
              <div v-if="todayStatus.detail?.is_location_valid" class="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                Lokasi terverifikasi
              </div>
              <p v-if="todayStatus.detail?.notes" class="text-xs text-gray-500 mt-2 bg-gray-50 rounded-lg px-3 py-2 w-full text-left">
                {{ todayStatus.detail.notes }}
              </p>
            </div>

            <div v-else class="space-y-4">
              <div class="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
                <svg class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <p class="text-sm text-amber-700 font-medium">Anda belum absen hari ini</p>
              </div>

              <div
                class="rounded-xl p-3.5 border text-sm"
                :class="locationStatusClass"
              >
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :class="locationIconBg">
                    <svg v-if="locationState === 'idle'" class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <svg v-else-if="locationState === 'loading'" class="w-4 h-4 text-brand-500 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <svg v-else-if="locationState === 'valid'" class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <svg v-else class="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-sm" :class="locationTextColor">{{ locationStatusText }}</p>
                    <p v-if="locationDetail" class="text-xs mt-0.5 text-gray-500">{{ locationDetail }}</p>
                  </div>
                  <button
                    v-if="locationState !== 'loading'"
                    class="text-xs font-medium text-brand-600 hover:text-brand-800 flex-shrink-0"
                    @click="requestLocation"
                  >
                    {{ locationState === 'idle' ? 'Izinkan' : 'Coba lagi' }}
                  </button>
                </div>

                <div v-if="locationState === 'valid' && currentPosition" class="mt-3 pt-3 border-t border-emerald-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p class="text-gray-400">Jarak ke sekolah</p>
                    <p class="font-semibold text-gray-700">{{ distanceToSchool }} meter</p>
                  </div>
                  <div>
                    <p class="text-gray-400">Akurasi GPS</p>
                    <p class="font-semibold text-gray-700">±{{ Math.round(currentPosition.accuracy) }} meter</p>
                  </div>
                </div>
              </div>

              <div>
                <label class="label">Status Kehadiran</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="opt in statusOptions"
                    :key="opt.value"
                    type="button"
                    class="flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200"
                    :class="checkInForm.status === opt.value
                      ? `${opt.activeBg} ${opt.activeText} ${opt.activeBorder}`
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'"
                    @click="checkInForm.status = opt.value"
                  >
                    <component :is="statusIcon(opt.value)" class="w-4 h-4 flex-shrink-0" />
                    {{ opt.label }}
                  </button>
                </div>
              </div>

              <div v-if="checkInForm.status !== 'HADIR'">
                <label class="label">Keterangan <span class="text-gray-400 font-normal">(opsional)</span></label>
                <textarea
                  v-model="checkInForm.notes"
                  class="input resize-none"
                  rows="2"
                  placeholder="Contoh: Demam sejak kemarin..."
                />
              </div>

              <button
                class="btn-primary w-full py-3"
                :disabled="submitting || locationState !== 'valid'"
                @click="handleCheckIn"
              >
                <span v-if="submitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                </svg>
                {{ locationState !== 'valid' ? 'Izinkan Lokasi Terlebih Dahulu' : 'Catat Absensi' }}
              </button>

              <p class="text-xs text-gray-400 text-center flex items-center justify-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                Absensi hanya bisa dilakukan di lingkungan sekolah
              </p>
            </div>
          </template>
        </div>
      </div>

      <div class="lg:col-span-2">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div v-for="item in summaryItems" :key="item.status" class="card text-center p-4">
            <p class="text-2xl font-black text-gray-900">{{ summary[item.status] ?? 0 }}</p>
            <p class="text-xs text-gray-500 mt-1 font-medium">{{ item.label }}</p>
          </div>
        </div>

        <div class="card">
          <h3 class="font-bold text-gray-900 mb-4">Riwayat Absensi</h3>
          <AppLoader v-if="loading" />
          <template v-else>
            <div v-if="details.length" class="space-y-2">
              <div
                v-for="detail in details"
                :key="detail.id"
                class="flex items-center gap-4 p-3.5 rounded-xl bg-gray-50/80 hover:bg-gray-100/60 transition-colors"
              >
                <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" :class="statusBg(detail.status)">
                  <component :is="statusIconComponent(detail.status)" class="w-5 h-5" :class="statusIconColor(detail.status)" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900">{{ formatDate(detail.attendance?.date) }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">
                    {{ detail.attendance?.class?.name }}
                    <span v-if="detail.check_in_time"> · {{ formatTime(detail.check_in_time) }}</span>
                  </p>
                </div>
                <div class="flex flex-col items-end gap-1">
                  <AppBadge :variant="statusVariant(detail.status)">{{ detail.status }}</AppBadge>
                  <div v-if="detail.is_location_valid" class="flex items-center gap-1 text-[10px] text-emerald-600">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    Terverifikasi
                  </div>
                  <p v-if="detail.notes" class="text-xs text-gray-400 max-w-[120px] truncate">{{ detail.notes }}</p>
                </div>
              </div>
            </div>
            <AppEmpty v-else title="Belum ada riwayat absensi" description="Riwayat absensi Anda akan muncul di sini" />
            <AppPagination :meta="meta" @page-change="setPage" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'siswa' })

import { attendanceService } from '~/services/attendance.service'
import { settingsService } from '~/services/settings.service'

const toast = useToast()
const { getCurrentPosition, checkInRadius } = useGeolocation()

const todayStatus = ref({ hasCheckedIn: false, detail: null })
const details = ref([])
const summary = ref({ HADIR: 0, SAKIT: 0, IZIN: 0, ALPHA: 0 })
const meta = ref(null)
const loading = ref(true)
const loadingToday = ref(true)
const submitting = ref(false)
const currentPage = ref(1)

const currentPosition = ref(null)
const locationState = ref('idle')
const locationError = ref('')
const distanceToSchool = ref(null)
const schoolConfig = ref(null)

const checkInForm = reactive({ status: 'HADIR', notes: '' })

const statusOptions = [
  { value: 'HADIR', label: 'Hadir', activeBg: 'bg-emerald-50', activeText: 'text-emerald-700', activeBorder: 'border-emerald-400' },
  { value: 'SAKIT', label: 'Sakit', activeBg: 'bg-amber-50', activeText: 'text-amber-700', activeBorder: 'border-amber-400' },
  { value: 'IZIN', label: 'Izin', activeBg: 'bg-blue-50', activeText: 'text-blue-700', activeBorder: 'border-blue-400' },
  { value: 'ALPHA', label: 'Alpha', activeBg: 'bg-red-50', activeText: 'text-red-700', activeBorder: 'border-red-400' },
]

const summaryItems = [
  { status: 'HADIR', label: 'Hadir' },
  { status: 'SAKIT', label: 'Sakit' },
  { status: 'IZIN', label: 'Izin' },
  { status: 'ALPHA', label: 'Alpha' },
]

const locationStatusClass = computed(() => ({
  'bg-gray-50 border-gray-200': locationState.value === 'idle',
  'bg-brand-50 border-brand-200': locationState.value === 'loading',
  'bg-emerald-50 border-emerald-200': locationState.value === 'valid',
  'bg-red-50 border-red-200': locationState.value === 'error',
}))

const locationIconBg = computed(() => ({
  'bg-gray-100': locationState.value === 'idle',
  'bg-brand-100': locationState.value === 'loading',
  'bg-emerald-100': locationState.value === 'valid',
  'bg-red-100': locationState.value === 'error',
}))

const locationTextColor = computed(() => ({
  'text-gray-600': locationState.value === 'idle',
  'text-brand-600': locationState.value === 'loading',
  'text-emerald-700': locationState.value === 'valid',
  'text-red-700': locationState.value === 'error',
}))

const locationStatusText = computed(() => {
  const map = {
    idle: 'Izin lokasi diperlukan',
    loading: 'Mendeteksi lokasi...',
    valid: 'Lokasi terverifikasi',
    error: locationError.value || 'Lokasi tidak valid',
  }
  return map[locationState.value]
})

const locationDetail = computed(() => {
  if (locationState.value === 'idle') return 'Klik "Izinkan" untuk mengaktifkan GPS'
  if (locationState.value === 'valid' && distanceToSchool.value !== null) {
    return `${distanceToSchool.value} meter dari sekolah`
  }
  return null
})

const checkedInBg = computed(() => {
  const map = { HADIR: 'bg-emerald-50', SAKIT: 'bg-amber-50', IZIN: 'bg-blue-50', ALPHA: 'bg-red-50' }
  return map[todayStatus.value.detail?.status] || 'bg-emerald-50'
})

const checkedInIconColor = computed(() => {
  const map = { HADIR: 'text-emerald-500', SAKIT: 'text-amber-500', IZIN: 'text-blue-500', ALPHA: 'text-red-500' }
  return map[todayStatus.value.detail?.status] || 'text-emerald-500'
})

const statusVariant = (status) => {
  const map = { HADIR: 'success', SAKIT: 'warning', IZIN: 'info', ALPHA: 'danger' }
  return map[status] || 'gray'
}

const statusBg = (status) => {
  const map = { HADIR: 'bg-emerald-50', SAKIT: 'bg-amber-50', IZIN: 'bg-blue-50', ALPHA: 'bg-red-50' }
  return map[status] || 'bg-gray-50'
}

const statusIconColor = (status) => {
  const map = { HADIR: 'text-emerald-500', SAKIT: 'text-amber-500', IZIN: 'text-blue-500', ALPHA: 'text-red-500' }
  return map[status] || 'text-gray-400'
}

const statusIconComponent = (status) => {
  const icons = {
    HADIR: { template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>` },
    SAKIT: { template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>` },
    IZIN: { template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>` },
    ALPHA: { template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>` },
  }
  return icons[status] || icons.HADIR
}

const statusIcon = (value) => statusIconComponent(value)

const formatDate = (date) =>
  new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const formatTime = (datetime) => {
  if (!datetime) return ''
  return new Date(datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

const requestLocation = async () => {
  locationState.value = 'loading'
  locationError.value = ''

  try {
    const pos = await getCurrentPosition()
    currentPosition.value = pos

    if (schoolConfig.value) {
      const result = checkInRadius(
        pos.latitude,
        pos.longitude,
        schoolConfig.value.latitude,
        schoolConfig.value.longitude,
        schoolConfig.value.radius
      )
      distanceToSchool.value = result.distance

      if (!result.inRadius) {
        locationState.value = 'error'
        locationError.value = `Anda berada ${result.distance}m dari sekolah (maks. ${schoolConfig.value.radius}m)`
        return
      }
    }

    locationState.value = 'valid'
  } catch (err) {
    locationState.value = 'error'
    locationError.value = err.message
  }
}

const fetchToday = async () => {
  loadingToday.value = true
  try {
    const response = await attendanceService.getToday()
    todayStatus.value = response.data
  } catch {
    todayStatus.value = { hasCheckedIn: false, detail: null }
  } finally {
    loadingToday.value = false
  }
}

const fetchHistory = async () => {
  loading.value = true
  try {
    const response = await attendanceService.getMy({ page: currentPage.value, limit: 10 })
    details.value = response.data
    meta.value = response.meta
  } catch {
    toast.error('Gagal memuat riwayat absensi')
  } finally {
    loading.value = false
  }
}

const fetchSummary = async () => {
  try {
    const response = await attendanceService.getMySummary()
    summary.value = response.data
  } catch {}
}

const fetchSchoolConfig = async () => {
  try {
    const response = await settingsService.get()
    if (response.data) {
      schoolConfig.value = {
        latitude: response.data.school_latitude,
        longitude: response.data.school_longitude,
        radius: response.data.school_radius,
      }
    }
  } catch {}
}

const handleCheckIn = async () => {
  if (locationState.value !== 'valid' || !currentPosition.value) {
    toast.error('Izinkan akses lokasi terlebih dahulu')
    return
  }

  submitting.value = true
  try {
    await attendanceService.checkIn({
      status: checkInForm.status,
      notes: checkInForm.notes || null,
      latitude: currentPosition.value.latitude,
      longitude: currentPosition.value.longitude,
      accuracy: currentPosition.value.accuracy,
    })
    toast.success('Absensi berhasil dicatat')
    await Promise.all([fetchToday(), fetchHistory(), fetchSummary()])
  } catch (error) {
    const msg = error.response?.data?.message || 'Gagal mencatat absensi'
    toast.error(msg)
    if (msg.includes('GPS palsu') || msg.includes('lokasi')) {
      locationState.value = 'error'
      locationError.value = msg
    }
  } finally {
    submitting.value = false
  }
}

const setPage = (page) => { currentPage.value = page; fetchHistory() }

onMounted(() => {
  fetchToday()
  fetchHistory()
  fetchSummary()
  fetchSchoolConfig()
})
</script>
