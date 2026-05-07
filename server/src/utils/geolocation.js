const EARTH_RADIUS_METERS = 6371000

const toRad = (deg) => (deg * Math.PI) / 180

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_METERS * c
}

const validateLocation = (latitude, longitude, accuracy, school) => {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return { valid: false, reason: 'Koordinat tidak valid' }
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return { valid: false, reason: 'Koordinat di luar batas yang diizinkan' }
  }

  if (accuracy !== undefined && accuracy !== null) {
    if (accuracy > 150) {
      return { valid: false, reason: 'Akurasi GPS terlalu rendah, coba di tempat terbuka' }
    }
  }

  const distance = haversineDistance(latitude, longitude, school.lat, school.lon)

  if (distance > school.radius) {
    return {
      valid: false,
      reason: `Anda berada ${Math.round(distance)} meter dari sekolah. Absensi hanya bisa dilakukan dalam radius ${school.radius} meter`,
      distance: Math.round(distance),
    }
  }

  return { valid: true, distance: Math.round(distance) }
}

const detectSuspiciousLocation = (latitude, longitude, accuracy) => {
  const flags = []

  if (accuracy !== undefined && accuracy !== null) {
    if (accuracy === 0) flags.push('accuracy_zero')
    if (accuracy < 1 && accuracy > 0) flags.push('accuracy_too_perfect')
  }

  const latDecimals = latitude.toString().split('.')[1]?.length || 0
  const lonDecimals = longitude.toString().split('.')[1]?.length || 0
  if (latDecimals < 4 || lonDecimals < 4) {
    flags.push('low_precision_coordinates')
  }

  return flags
}

module.exports = { haversineDistance, validateLocation, detectSuspiciousLocation }
