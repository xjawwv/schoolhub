<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div class="text-center max-w-md animate-fade-in">
      <div class="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <svg v-if="error?.statusCode === 404" class="w-10 h-10 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <svg v-else class="w-10 h-10 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      </div>
      <div class="text-7xl font-black text-gray-200 mb-4">{{ error?.statusCode || 500 }}</div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">
        {{ error?.statusCode === 404 ? 'Halaman Tidak Ditemukan' : 'Terjadi Kesalahan' }}
      </h1>
      <p class="text-gray-500 mb-8 leading-relaxed">
        {{ error?.statusCode === 404
          ? 'Halaman yang Anda cari tidak ada atau telah dipindahkan.'
          : 'Terjadi kesalahan pada server. Silakan coba lagi.' }}
      </p>
      <button class="btn-primary" @click="handleError">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        Kembali ke Beranda
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ error: Object })

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>
