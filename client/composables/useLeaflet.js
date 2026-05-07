let leafletInstance = null

export const useLeaflet = async () => {
  if (!process.client) return null

  if (leafletInstance) return leafletInstance

  const mod = await import('leaflet')

  const L = mod.default && typeof mod.default.map === 'function'
    ? mod.default
    : mod

  if (!L || typeof L.map !== 'function') {
    throw new Error('Leaflet gagal dimuat')
  }

  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  leafletInstance = L
  return L
}
