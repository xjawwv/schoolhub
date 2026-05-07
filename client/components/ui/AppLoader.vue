<template>
  <div class="flex items-center justify-center py-12">
    <div class="flex flex-col items-center gap-3">
      <div class="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      <p class="text-sm text-gray-500">{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  text: { type: String, default: 'Memuat data...' },
})
</script>
