<template>
  <div v-if="meta && meta.totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between mt-5 gap-3">
    <p class="text-sm text-gray-500">
      Menampilkan <span class="font-semibold text-gray-700">{{ startItem }}-{{ endItem }}</span> dari <span class="font-semibold text-gray-700">{{ meta.total }}</span> data
    </p>
    <div class="flex items-center gap-1">
      <button
        class="btn-outline btn-sm"
        :disabled="!meta.hasPrevPage"
        @click="$emit('page-change', meta.page - 1)"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        <span class="hidden sm:inline">Sebelumnya</span>
      </button>

      <template v-for="page in visiblePages" :key="page">
        <span v-if="page === '...'" class="px-2 text-gray-400 text-sm">...</span>
        <button
          v-else
          class="w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-200"
          :class="page === meta.page ? 'bg-brand-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'"
          @click="$emit('page-change', page)"
        >
          {{ page }}
        </button>
      </template>

      <button
        class="btn-outline btn-sm"
        :disabled="!meta.hasNextPage"
        @click="$emit('page-change', meta.page + 1)"
      >
        <span class="hidden sm:inline">Berikutnya</span>
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  meta: { type: Object, default: null },
})

defineEmits(['page-change'])

const startItem = computed(() => {
  if (!props.meta) return 0
  return (props.meta.page - 1) * props.meta.limit + 1
})

const endItem = computed(() => {
  if (!props.meta) return 0
  return Math.min(props.meta.page * props.meta.limit, props.meta.total)
})

const visiblePages = computed(() => {
  if (!props.meta) return []
  const { page, totalPages } = props.meta
  const pages = []

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
    return pages
  }

  pages.push(1)
  if (page > 3) pages.push('...')
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
    pages.push(i)
  }
  if (page < totalPages - 2) pages.push('...')
  pages.push(totalPages)

  return pages
})
</script>
