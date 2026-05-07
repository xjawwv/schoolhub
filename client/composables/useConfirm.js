const confirmState = ref({
  open: false,
  title: '',
  message: '',
  resolve: null,
})

export const useConfirm = () => {
  const confirm = (title, message) => {
    return new Promise((resolve) => {
      confirmState.value = { open: true, title, message, resolve }
    })
  }

  const accept = () => {
    confirmState.value.resolve(true)
    confirmState.value.open = false
  }

  const cancel = () => {
    confirmState.value.resolve(false)
    confirmState.value.open = false
  }

  return { confirmState, confirm, accept, cancel }
}
