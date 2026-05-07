<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-40 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-sm"
        @click.self="$emit('update:modelValue', false)"
      >
        <div
          class="modal-panel bg-white rounded-2xl shadow-apple-lg w-full"
          :class="sizeClass"
        >
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
            <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
            <button
              class="btn-icon !w-8 !h-8"
              @click="$emit('update:modelValue', false)"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="px-6 py-5 max-h-[70vh] overflow-y-auto scrollbar-thin">
            <slot />
          </div>
          <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-100 bg-gray-50/30 rounded-b-2xl flex gap-3 justify-end">
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
