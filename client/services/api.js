import axios from 'axios'

const getToken = () => {
  if (process.client) return localStorage.getItem('schoolhub_token')
  return null
}

const createApiInstance = () => {
  const config = useRuntimeConfig()

  const instance = axios.create({
    baseURL: config.public.apiBase,
    timeout: 15000,
  })

  instance.interceptors.request.use((config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  instance.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
  )

  return instance
}

export const useApi = () => createApiInstance()
