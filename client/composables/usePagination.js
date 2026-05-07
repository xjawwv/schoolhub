export const usePagination = (fetchFn, initialParams = {}) => {
  const data = ref([])
  const meta = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const params = ref({ page: 1, limit: 10, ...initialParams })

  const fetch = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetchFn(params.value)
      data.value = response.data
      meta.value = response.meta
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal memuat data'
    } finally {
      loading.value = false
    }
  }

  const setPage = (page) => {
    params.value.page = page
    fetch()
  }

  const setSearch = (search) => {
    params.value.search = search
    params.value.page = 1
    fetch()
  }

  const setFilter = (key, value) => {
    params.value[key] = value
    params.value.page = 1
    fetch()
  }

  onMounted(fetch)

  return { data, meta, loading, error, params, fetch, setPage, setSearch, setFilter }
}
