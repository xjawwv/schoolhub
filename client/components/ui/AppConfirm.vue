<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="confirmState.open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-sm"
      >
        <div class="modal-panel bg-white rounded-2xl shadow-apple-lg max-w-md w-full p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900">{{ confirmState.title }}</h3>
          </div>
          <p class="text-sm text-gray-600 mb-6 pl-[52px]">{{ confirmState.message }}</p>
          <div class="flex gap-3 justify-end">
            <button class="btn-outline" @click="cancel()">Batal</button>
            <button class="btn-danger" @click="accept()">Konfirmasi</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const { confirmState, accept, cancel } = useConfirm()
</script>
