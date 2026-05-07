<template>
  <div v-if="meta && meta.totalPages > 1" class="flex items-center justify-between mt-4">
    <p class="text-sm text-gray-500">
      Menampilkan {{ startItem }}-{{ endItem }} dari {{ meta.total }} data
    </p>
    <div class="flex items-center gap-1">
      <button
        class="btn-outline px-3 py-1.5 text-xs"
        :disabled="!meta.hasPrevPage"
        @click="$emit('page-change', meta.page - 1)"
      >
        Sebelumnya
      </button>

      <template v-for="page in visiblePages" :key="page">
        <span v-if="page === '...'" class="px-2 text-gray-400">...</span>
        <button
          v-else
          class="w-8 h-8 rounded-lg text-xs font-medium transition-colors"
          :class="page === meta.page ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
          @click="$emit('page-change', page)"
        >
          {{ page }}
        </button>
      </template>

      <button
        class="btn-outline px-3 py-1.5 text-xs"
        :disabled="!meta.hasNextPage"
        @click="$emit('page-change', meta.page + 1)"
      >
        Berikutnya
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
