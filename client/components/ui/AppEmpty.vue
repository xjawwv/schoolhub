<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-2xl">
      {{ icon }}
    </div>
    <h3 class="text-base font-semibold text-gray-700 mb-1">{{ title }}</h3>
    <p class="text-sm text-gray-400 max-w-xs">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: '📭' },
  title: { type: String, default: 'Tidak ada data' },
  description: { type: String, default: 'Belum ada data yang tersedia.' },
})
</script>
