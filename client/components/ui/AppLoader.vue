<template>
  <div class="flex items-center justify-center py-12">
    <div class="flex flex-col items-center gap-3">
      <div class="w-10 h-10 border-[3px] border-brand-600 border-t-transparent rounded-full animate-spin" />
      <p class="text-sm text-gray-500 font-medium">{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  text: { type: String, default: 'Memuat data...' },
})
</script>
