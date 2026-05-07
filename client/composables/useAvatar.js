export const useAvatar = () => {
  const getDefaultPhoto = (gender) => {
    if (!gender) return '/profile/man.png'
    const g = gender.toLowerCase()
    if (g === 'perempuan' || g === 'female' || g === 'p' || g === 'f') {
      return '/profile/woman.png'
    }
    return '/profile/man.png'
  }

  const getPhotoUrl = (photo, gender) => {
    if (photo) {
      if (photo.startsWith('http')) return photo
      return `${useRuntimeConfig().public.apiBase.replace('/api', '')}/${photo}`
    }
    return getDefaultPhoto(gender)
  }

  return { getDefaultPhoto, getPhotoUrl }
}
