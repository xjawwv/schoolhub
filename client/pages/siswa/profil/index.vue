<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Profil Saya</h1>
      <p class="page-subtitle">Informasi data diri Anda</p>
    </div>

    <AppLoader v-if="loading" />

    <div v-else-if="profile" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="card flex flex-col items-center text-center">
        <UserAvatar :photo="profile.photo" :gender="profile.gender" :name="profile.full_name" size="xl" class="mb-4" />
        <h2 class="text-xl font-bold text-gray-900">{{ profile.full_name }}</h2>
        <p class="text-gray-500 text-sm mt-1">{{ profile.nis }}</p>
        <AppBadge variant="info" class="mt-2">{{ profile.class?.name || 'Belum ada kelas' }}</AppBadge>

        <div class="w-full mt-6 pt-4 border-t border-gray-100 space-y-2 text-left">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Username</span>
            <span class="font-medium text-gray-900">{{ profile.user?.username }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Email</span>
            <span class="font-medium text-gray-900 truncate ml-2">{{ profile.user?.email }}</span>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-4">
        <div class="card">
          <h3 class="font-semibold text-gray-900 mb-4">Data Pribadi</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-gray-400 mb-1">Nama Lengkap</p>
              <p class="text-sm font-medium text-gray-900">{{ profile.full_name }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 mb-1">NIS</p>
              <p class="text-sm font-medium text-gray-900 font-mono">{{ profile.nis }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 mb-1">Jenis Kelamin</p>
              <p class="text-sm font-medium text-gray-900">{{ profile.gender }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 mb-1">Tempat, Tanggal Lahir</p>
              <p class="text-sm font-medium text-gray-900">{{ profile.birth_place }}, {{ formatDate(profile.birth_date) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 mb-1">No. Telepon</p>
              <p class="text-sm font-medium text-gray-900">{{ profile.phone || '-' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 mb-1">Kelas</p>
              <p class="text-sm font-medium text-gray-900">{{ profile.class?.name || '-' }}</p>
            </div>
            <div class="sm:col-span-2">
              <p class="text-xs text-gray-400 mb-1">Alamat</p>
              <p class="text-sm font-medium text-gray-900">{{ profile.address }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="font-semibold text-gray-900 mb-4">Ubah Password</h3>
          <form @submit.prevent="handleChangePassword" class="space-y-3">
            <div>
              <label class="label">Password Lama</label>
              <input v-model="passwordForm.currentPassword" type="password" class="input" placeholder="Password saat ini" />
            </div>
            <div>
              <label class="label">Password Baru</label>
              <input v-model="passwordForm.newPassword" type="password" class="input" placeholder="Minimal 6 karakter" />
            </div>
            <div class="flex justify-end">
              <button type="submit" class="btn-primary" :disabled="changingPassword">
                <span v-if="changingPassword" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Ubah Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'siswa' })

import { studentsService } from '~/services/students.service'

const authStore = useAuthStore()
const toast = useToast()

const profile = ref(null)
const loading = ref(true)
const changingPassword = ref(false)

const passwordForm = reactive({ currentPassword: '', newPassword: '' })

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'

const handleChangePassword = async () => {
  if (!passwordForm.currentPassword || !passwordForm.newPassword) {
    toast.error('Semua field wajib diisi')
    return
  }
  if (passwordForm.newPassword.length < 6) {
    toast.error('Password baru minimal 6 karakter')
    return
  }
  changingPassword.value = true
  try {
    await authStore.changePassword(passwordForm.currentPassword, passwordForm.newPassword)
    toast.success('Password berhasil diubah')
    Object.assign(passwordForm, { currentPassword: '', newPassword: '' })
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal mengubah password')
  } finally {
    changingPassword.value = false
  }
}

onMounted(async () => {
  try {
    const response = await studentsService.getMe()
    profile.value = response.data
  } catch {
    toast.error('Gagal memuat profil')
  } finally {
    loading.value = false
  }
})
</script>
