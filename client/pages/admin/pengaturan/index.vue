<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Pengaturan Sekolah</h1>
      <p class="page-subtitle">Konfigurasi lokasi dan sistem absensi</p>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-5 gap-6">
      <div class="xl:col-span-2 space-y-5">
        <div class="card">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center">
              <svg class="w-4.5 h-4.5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </div>
            <h3 class="font-bold text-gray-900">Lokasi Sekolah</h3>
          </div>

          <AppLoader v-if="loadingSettings" />

          <form v-else @submit.prevent="handleSave" class="space-y-4">
            <div>
              <label class="label">Nama Sekolah</label>
              <input v-model="form.school_name" type="text" class="input" placeholder="Contoh: SMKN 1 Kragilan" required />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="label">Latitude</label>
                <input
                  v-model="form.school_latitude"
                  type="number"
                  step="any"
                  class="input font-mono text-sm"
                  placeholder="-6.200000"
                  required
                  @input="updateMarkerFromForm"
                />
              </div>
              <div>
                <label class="label">Longitude</label>
                <input
                  v-model="form.school_longitude"
                  type="number"
                  step="any"
                  class="input font-mono text-sm"
                  placeholder="106.816666"
                  required
                  @input="updateMarkerFromForm"
                />
              </div>
            </div>

            <div>
              <label class="label">
                Radius Absensi
                <span class="text-gray-400 font-normal ml-1">(meter)</span>
              </label>
              <div class="flex items-center gap-3">
                <input
                  v-model="form.school_radius"
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  class="flex-1 accent-brand-600"
                  @input="updateCircle"
                />
                <div class="w-20 text-center">
                  <span class="text-lg font-bold text-brand-600">{{ form.school_radius }}</span>
                  <span class="text-xs text-gray-400 block">meter</span>
                </div>
              </div>
              <div class="flex justify-between text-xs text-gray-400 mt-1 px-0.5">
                <span>50m</span>
                <span>500m</span>
              </div>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex items-start gap-2.5">
              <svg class="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              <p class="text-xs text-blue-700">
                Klik pada peta untuk memilih lokasi sekolah, atau geser marker ke posisi yang tepat. Lingkaran biru menunjukkan area radius absensi.
              </p>
            </div>

            <div class="flex gap-3 pt-1">
              <button type="button" class="btn-outline flex-1" @click="useMyLocation">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                Lokasi Saya
              </button>
              <button type="submit" class="btn-primary flex-1" :disabled="saving">
                <span v-if="saving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Simpan
              </button>
            </div>
          </form>
        </div>

        <div class="card">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
              <svg class="w-4.5 h-4.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <h3 class="font-bold text-gray-900">Keamanan Aktif</h3>
          </div>
          <div class="space-y-2">
            <div v-for="f in securityFeatures" :key="f.label" class="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div class="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ f.label }}</p>
                <p class="text-xs text-gray-400">{{ f.desc }}</p>
              </div>
              <span class="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Aktif</span>
            </div>
          </div>
        </div>
      </div>

      <div class="xl:col-span-3">
        <div class="card p-0 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 class="font-bold text-gray-900">Peta Lokasi Sekolah</h3>
              <p class="text-xs text-gray-500 mt-0.5">Klik peta atau geser marker untuk memilih lokasi</p>
            </div>
            <div v-if="form.school_latitude && form.school_longitude" class="text-right">
              <p class="text-xs font-mono text-gray-600">{{ Number(form.school_latitude).toFixed(6) }}</p>
              <p class="text-xs font-mono text-gray-600">{{ Number(form.school_longitude).toFixed(6) }}</p>
            </div>
          </div>
          <div ref="mapContainer" class="w-full" style="height: 520px;" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'admin' })

import { settingsService } from '~/services/settings.service'

const toast = useToast()

const mapContainer = ref(null)
const loadingSettings = ref(true)
const saving = ref(false)

const form = reactive({
  school_name: '',
  school_latitude: '',
  school_longitude: '',
  school_radius: 100,
})

let map = null
let marker = null
let circle = null

const securityFeatures = [
  { label: 'Validasi Radius GPS', desc: 'Absensi hanya dalam radius yang ditentukan' },
  { label: 'Deteksi GPS Palsu', desc: 'Cek akurasi, timestamp, dan kecepatan anomali' },
  { label: 'Server-side Verification', desc: 'Koordinat divalidasi ulang di server' },
  { label: 'Satu Absensi Per Hari', desc: 'Constraint unik di level database' },
]

const initMap = async () => {
  if (!process.client || !mapContainer.value) return

  const L = await useLeaflet()
  if (!L) return

  const defaultLat = form.school_latitude ? parseFloat(form.school_latitude) : -6.2
  const defaultLon = form.school_longitude ? parseFloat(form.school_longitude) : 106.816

  if (map) {
    map.remove()
    map = null
  }

  map = L.map(mapContainer.value, { zoomControl: true }).setView([defaultLat, defaultLon], 17)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map)

  if (form.school_latitude && form.school_longitude) {
    placeMarker(L, defaultLat, defaultLon)
  }

  map.on('click', (e) => {
    const { lat, lng } = e.latlng
    form.school_latitude = lat.toFixed(7)
    form.school_longitude = lng.toFixed(7)
    placeMarker(L, lat, lng)
  })
}

const placeMarker = async (L, lat, lng) => {
  const leaflet = L || await useLeaflet()
  if (!leaflet) return

  if (marker) { marker.remove(); marker = null }
  if (circle) { circle.remove(); circle = null }

  marker = leaflet.marker([lat, lng], { draggable: true }).addTo(map)
  marker.bindPopup(`<b>${form.school_name || 'Sekolah'}</b><br>${lat.toFixed(6)}, ${lng.toFixed(6)}`).openPopup()

  marker.on('dragend', (e) => {
    const pos = e.target.getLatLng()
    form.school_latitude = pos.lat.toFixed(7)
    form.school_longitude = pos.lng.toFixed(7)
    updateCircle()
    marker.setPopupContent(`<b>${form.school_name || 'Sekolah'}</b><br>${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`)
  })

  circle = leaflet.circle([lat, lng], {
    radius: parseInt(form.school_radius) || 100,
    color: '#4f46e5',
    fillColor: '#4f46e5',
    fillOpacity: 0.08,
    weight: 2,
  }).addTo(map)
}

const updateCircle = () => {
  if (!circle) return
  circle.setRadius(parseInt(form.school_radius) || 100)
}

const updateMarkerFromForm = async () => {
  const lat = parseFloat(form.school_latitude)
  const lng = parseFloat(form.school_longitude)
  if (isNaN(lat) || isNaN(lng) || !map) return
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return

  const L = await useLeaflet()
  if (!L) return
  placeMarker(L, lat, lng)
  map.setView([lat, lng], map.getZoom())
}

const useMyLocation = () => {
  if (!navigator.geolocation) {
    toast.error('Browser tidak mendukung GPS')
    return
  }
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      form.school_latitude = lat.toFixed(7)
      form.school_longitude = lng.toFixed(7)
      const L = await useLeaflet()
      if (!L) return
      placeMarker(L, lat, lng)
      map.setView([lat, lng], 17)
      toast.success('Lokasi berhasil dideteksi')
    },
    () => toast.error('Gagal mendapatkan lokasi')
  )
}

const handleSave = async () => {
  saving.value = true
  try {
    await settingsService.update({
      school_name: form.school_name,
      school_latitude: parseFloat(form.school_latitude),
      school_longitude: parseFloat(form.school_longitude),
      school_radius: parseInt(form.school_radius),
    })
    toast.success('Pengaturan berhasil disimpan')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal menyimpan pengaturan')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    const response = await settingsService.get()
    if (response.data) {
      form.school_name = response.data.school_name || ''
      form.school_latitude = response.data.school_latitude || ''
      form.school_longitude = response.data.school_longitude || ''
      form.school_radius = response.data.school_radius || 100
    }
  } catch {
    // settings belum ada, form tetap kosong
  } finally {
    loadingSettings.value = false
  }

  await nextTick()
  await initMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>
