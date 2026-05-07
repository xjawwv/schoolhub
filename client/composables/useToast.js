const toasts = ref([])

export const useToast = () => {
  const add = (message, type = 'info', duration = 4000) => {
    const id = Date.now()
    toasts.value.push({ id, message, type })
    setTimeout(() => remove(id), duration)
  }

  const remove = (id) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) toasts.value.splice(index, 1)
  }

  const success = (message) => add(message, 'success')
  const error = (message) => add(message, 'error')
  const warning = (message) => add(message, 'warning')
  const info = (message) => add(message, 'info')

  return { toasts, add, remove, success, error, warning, info }
}
