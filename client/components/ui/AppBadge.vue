<template>
  <span class="badge" :class="variantClass">
    <slot />
  </span>
</template>

<script setup>
const props = defineProps({
  variant: { type: String, default: 'gray' },
})

const variantClass = computed(() => ({
  'badge-success': props.variant === 'success',
  'badge-warning': props.variant === 'warning',
  'badge-danger': props.variant === 'danger',
  'badge-info': props.variant === 'info',
  'badge-gray': props.variant === 'gray',
}))
</script>
