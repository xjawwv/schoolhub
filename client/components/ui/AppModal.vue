<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50"
        @click.self="$emit('update:modelValue', false)"
      >
        <div
          class="bg-white rounded-2xl shadow-xl w-full animate-fade-in overflow-hidden"
          :class="sizeClass"
        >
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
            <button
              class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              @click="$emit('update:modelValue', false)"
            >
              ✕
            </button>
          </div>
          <div class="px-6 py-4 max-h-[70vh] overflow-y-auto scrollbar-thin">
            <slot />
          </div>
          <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  size: { type: String, default: 'md' },
})

defineEmits(['update:modelValue'])

const sizeClass = computed(() => ({
  'max-w-md': props.size === 'sm',
  'max-w-lg': props.size === 'md',
  'max-w-2xl': props.size === 'lg',
  'max-w-4xl': props.size === 'xl',
}))
</script>
