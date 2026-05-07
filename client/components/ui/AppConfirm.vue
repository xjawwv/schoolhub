<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="confirmState.open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      >
        <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ confirmState.title }}</h3>
          <p class="text-sm text-gray-600 mb-6">{{ confirmState.message }}</p>
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
