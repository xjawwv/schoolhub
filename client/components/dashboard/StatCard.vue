<template>
  <div class="stat-card group">
    <div class="stat-icon" :class="iconBg">
      <span class="w-6 h-6" v-html="icon" />
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm text-gray-500 font-medium truncate">{{ label }}</p>
      <p class="text-2xl font-bold text-gray-900 mt-0.5 tracking-tight">{{ value }}</p>
      <p v-if="sub" class="text-xs text-gray-400 mt-0.5">{{ sub }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  sub: { type: String, default: '' },
  iconBg: { type: String, default: 'bg-brand-50 text-brand-600' },
})
</script>
