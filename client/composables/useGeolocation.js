export const useGeolocation = () => {
  const position = ref(null)
  const error = ref(null)
  const loading = ref(false)
  const isSupported = ref(typeof navigator !== 'undefined' && 'geolocation' in navigator)

  const FAKE_GPS_REASONS = {
    ACCURACY_ZERO: 'GPS palsu terdeteksi: akurasi sempurna tidak mungkin terjadi secara alami',
    ACCURACY_TOO_PERFECT: 'GPS palsu terdeteksi: akurasi terlalu sempurna',
    SPEED_ANOMALY: 'GPS palsu terdeteksi: kecepatan perpindahan tidak wajar',
    TIMESTAMP_STALE: 'Data lokasi sudah kadaluarsa, coba lagi',
    LOW_PRECISION: 'Koordinat mencurigakan: presisi terlalu rendah',
  }

  const detectFakeGPS = (pos) => {
    const { accuracy, latitude, longitude, speed, altitude } = pos.coords
    const timestamp = pos.timestamp

    if (accuracy === 0) {
      return { fake: true, reason: FAKE_GPS_REASONS.ACCURACY_ZERO }
    }

    if (accuracy < 1 && accuracy > 0) {
      return { fake: true, reason: FAKE_GPS_REASONS.ACCURACY_TOO_PERFECT }
    }

    const ageMs = Date.now() - timestamp
    if (ageMs > 30000) {
      return { fake: true, reason: FAKE_GPS_REASONS.TIMESTAMP_STALE }
    }

    if (speed !== null && speed !== undefined && speed > 50) {
      return { fake: true, reason: FAKE_GPS_REASONS.SPEED_ANOMALY }
    }

    const latStr = latitude.toString()
    const lonStr = longitude.toString()
    const latDecimals = latStr.includes('.') ? latStr.split('.')[1].length : 0
    const lonDecimals = lonStr.includes('.') ? lonStr.split('.')[1].length : 0

    if (latDecimals < 4 || lonDecimals < 4) {
      return { fake: true, reason: FAKE_GPS_REASONS.LOW_PRECISION }
    }

    return { fake: false }
  }

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000
    const toRad = (d) => (d * Math.PI) / 180
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!isSupported.value) {
        reject(new Error('Browser Anda tidak mendukung GPS'))
        return
      }

      loading.value = true
      error.value = null

      const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          loading.value = false

          const fakeCheck = detectFakeGPS(pos)
          if (fakeCheck.fake) {
            error.value = fakeCheck.reason
            reject(new Error(fakeCheck.reason))
            return
          }

          position.value = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
          }

          resolve(position.value)
        },
        (err) => {
          loading.value = false
          const messages = {
            1: 'Izin lokasi ditolak. Aktifkan izin lokasi di pengaturan browser Anda',
            2: 'Posisi tidak tersedia. Pastikan GPS aktif',
            3: 'Waktu habis saat mengambil lokasi. Coba lagi',
          }
          error.value = messages[err.code] || 'Gagal mendapatkan lokasi'
          reject(new Error(error.value))
        },
        options
      )
    })
  }

  const checkInRadius = (userLat, userLon, schoolLat, schoolLon, radiusMeters) => {
    const distance = haversineDistance(userLat, userLon, schoolLat, schoolLon)
    return {
      inRadius: distance <= radiusMeters,
      distance: Math.round(distance),
    }
  }

  return {
    position,
    error,
    loading,
    isSupported,
    getCurrentPosition,
    checkInRadius,
    haversineDistance,
  }
}
