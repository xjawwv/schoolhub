<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm font-medium cursor-pointer"
          :class="toastClass(toast.type)"
          @click="remove(toast.id)"
        >
          <span class="text-lg leading-none mt-0.5">{{ toastIcon(toast.type) }}</span>
          <span class="flex-1">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
const { toasts, remove } = useToast()

const toastClass = (type) => ({
  'bg-emerald-50 border-emerald-200 text-emerald-800': type === 'success',
  'bg-red-50 border-red-200 text-red-800': type === 'error',
  'bg-yellow-50 border-yellow-200 text-yellow-800': type === 'warning',
  'bg-blue-50 border-blue-200 text-blue-800': type === 'info',
})

const toastIcon = (type) => {
  const icons = { success: '✓', error: '✕', warning: '!', info: 'i' }
  return icons[type] || 'i'
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
