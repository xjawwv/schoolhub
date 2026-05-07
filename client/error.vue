<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="text-center max-w-md">
      <div class="text-8xl font-black text-gray-200 mb-4">{{ error?.statusCode || 500 }}</div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">
        {{ error?.statusCode === 404 ? 'Halaman Tidak Ditemukan' : 'Terjadi Kesalahan' }}
      </h1>
      <p class="text-gray-500 mb-8">
        {{ error?.statusCode === 404
          ? 'Halaman yang Anda cari tidak ada atau telah dipindahkan.'
          : 'Terjadi kesalahan pada server. Silakan coba lagi.' }}
      </p>
      <button class="btn-primary" @click="handleError">Kembali ke Beranda</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ error: Object })

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>
