<template>
  <div class="stat-card">
    <div class="stat-icon" :class="iconBg">
      <span class="text-xl">{{ icon }}</span>
    </div>
    <div>
      <p class="text-sm text-gray-500 font-medium">{{ label }}</p>
      <p class="text-2xl font-bold text-gray-900 mt-0.5">{{ value }}</p>
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
  iconBg: { type: String, default: 'bg-brand-50' },
})
</script>
