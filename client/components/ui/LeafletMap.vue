<template>
  <div class="relative w-full" :style="`height: ${height}px`">
    <div v-if="mapLoading" class="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-xl z-10">
      <div class="flex flex-col items-center gap-3">
        <div class="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        <p class="text-sm text-gray-500">Memuat peta...</p>
      </div>
    </div>
    <div ref="mapEl" class="w-full h-full rounded-xl" />
  </div>
</template>

<script setup>
const props = defineProps({
  latitude: { type: [Number, String], default: -6.2 },
  longitude: { type: [Number, String], default: 106.816 },
  radius: { type: [Number, String], default: 100 },
  height: { type: Number, default: 480 },
  schoolName: { type: String, default: 'Sekolah' },
})

const emit = defineEmits(['update:latitude', 'update:longitude'])

const mapEl = ref(null)
const mapLoading = ref(true)

let mapInstance = null
let markerInstance = null
let circleInstance = null

const loadLeafletScript = () => {
  return new Promise((resolve, reject) => {
    if (window.L) { resolve(window.L); return }

    const existingLink = document.getElementById('leaflet-css')
    if (!existingLink) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    const existingScript = document.getElementById('leaflet-js')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.L))
      return
    }

    const script = document.createElement('script')
    script.id = 'leaflet-js'
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => resolve(window.L)
    script.onerror = () => reject(new Error('Gagal memuat Leaflet'))
    document.head.appendChild(script)
  })
}

const initMap = async () => {
  if (!mapEl.value) return

  try {
    const L = await loadLeafletScript()
    mapLoading.value = false

    const lat = parseFloat(props.latitude) || -6.2
    const lng = parseFloat(props.longitude) || 106.816

    mapInstance = L.map(mapEl.value, { zoomControl: true }).setView([lat, lng], 17)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapInstance)

    placeMarker(L, lat, lng)

    mapInstance.on('click', (e) => {
      placeMarker(L, e.latlng.lat, e.latlng.lng)
      emit('update:latitude', e.latlng.lat.toFixed(7))
      emit('update:longitude', e.latlng.lng.toFixed(7))
    })
  } catch (err) {
    mapLoading.value = false
    console.error('Map error:', err)
  }
}

const placeMarker = (L, lat, lng) => {
  if (markerInstance) { markerInstance.remove(); markerInstance = null }
  if (circleInstance) { circleInstance.remove(); circleInstance = null }

  markerInstance = L.marker([lat, lng], { draggable: true }).addTo(mapInstance)
  markerInstance.bindPopup(
    `<div style="font-family:sans-serif;min-width:140px">
      <b style="font-size:13px">${props.schoolName || 'Sekolah'}</b>
      <br><span style="font-size:11px;color:#666">${parseFloat(lat).toFixed(6)}, ${parseFloat(lng).toFixed(6)}</span>
    </div>`
  ).openPopup()

  markerInstance.on('dragend', (e) => {
    const pos = e.target.getLatLng()
    emit('update:latitude', pos.lat.toFixed(7))
    emit('update:longitude', pos.lng.toFixed(7))
    updateCircle(L, pos.lat, pos.lng)
    markerInstance.setPopupContent(
      `<div style="font-family:sans-serif;min-width:140px">
        <b style="font-size:13px">${props.schoolName || 'Sekolah'}</b>
        <br><span style="font-size:11px;color:#666">${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}</span>
      </div>`
    )
  })

  circleInstance = L.circle([lat, lng], {
    radius: parseInt(props.radius) || 100,
    color: '#4f46e5',
    fillColor: '#4f46e5',
    fillOpacity: 0.1,
    weight: 2,
    dashArray: '6 4',
  }).addTo(mapInstance)
}

const updateCircle = (L, lat, lng) => {
  if (!circleInstance || !mapInstance) return
  circleInstance.setLatLng([lat, lng])
  circleInstance.setRadius(parseInt(props.radius) || 100)
}

const flyTo = (lat, lng) => {
  if (!mapInstance) return
  mapInstance.flyTo([lat, lng], 17, { duration: 1.2 })
}

watch(() => props.radius, () => {
  if (circleInstance) {
    circleInstance.setRadius(parseInt(props.radius) || 100)
  }
})

watch([() => props.latitude, () => props.longitude], async ([lat, lng]) => {
  const parsedLat = parseFloat(lat)
  const parsedLng = parseFloat(lng)
  if (isNaN(parsedLat) || isNaN(parsedLng) || !mapInstance) return
  if (parsedLat < -90 || parsedLat > 90) return

  const L = window.L
  if (!L) return
  placeMarker(L, parsedLat, parsedLng)
  mapInstance.setView([parsedLat, parsedLng], mapInstance.getZoom())
})

defineExpose({ flyTo })

onMounted(() => {
  nextTick(() => initMap())
})

onUnmounted(() => {
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})
</script>
