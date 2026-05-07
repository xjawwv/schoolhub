<template>
  <div class="min-h-screen bg-slate-50 flex">
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-navy-800 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-brand-400 rounded-full blur-3xl" />
      </div>
      <div class="relative z-10 flex flex-col justify-center px-16 text-white">
        <div class="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
          <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
          </svg>
        </div>
        <h2 class="text-4xl font-bold leading-tight mb-4">Selamat Datang<br />di SchoolHub</h2>
        <p class="text-lg text-white/70 leading-relaxed max-w-md">
          Sistem Manajemen Kesiswaan Modern untuk mengelola data siswa, guru, jadwal, absensi, dan nilai secara efisien.
        </p>
        <div class="flex gap-6 mt-12">
          <div class="text-center">
            <p class="text-3xl font-bold">500+</p>
            <p class="text-sm text-white/60 mt-1">Siswa Aktif</p>
          </div>
          <div class="w-px bg-white/20" />
          <div class="text-center">
            <p class="text-3xl font-bold">50+</p>
            <p class="text-sm text-white/60 mt-1">Guru Pengajar</p>
          </div>
          <div class="w-px bg-white/20" />
          <div class="text-center">
            <p class="text-3xl font-bold">20+</p>
            <p class="text-sm text-white/60 mt-1">Kelas</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <div class="text-center mb-8 lg:text-left">
          <div class="flex items-center gap-3 justify-center lg:justify-start mb-6">
            <div class="w-11 h-11 bg-gradient-to-br from-brand-600 to-brand-500 rounded-xl flex items-center justify-center shadow-md">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
            </div>
            <span class="text-2xl font-bold text-gray-900 tracking-tight lg:hidden">SchoolHub</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Masuk ke Akun</h1>
          <p class="text-gray-500 mt-1 text-sm">Masukkan kredensial Anda untuk mengakses dashboard</p>
        </div>

        <div class="bg-white rounded-2xl shadow-soft border border-gray-100 p-7">
          <form @submit.prevent="handleLogin">
            <div class="mb-5">
              <label class="label">Username atau Email</label>
              <div class="relative">
                <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <input
                  v-model="form.username"
                  type="text"
                  class="input pl-10"
                  :class="{ 'input-error': errors.username }"
                  placeholder="Masukkan username atau email"
                  autocomplete="username"
                />
              </div>
              <p v-if="errors.username" class="text-xs text-red-500 mt-1.5 font-medium">{{ errors.username }}</p>
            </div>

            <div class="mb-6">
              <label class="label">Password</label>
              <div class="relative">
                <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="input pl-10 pr-10"
                  :class="{ 'input-error': errors.password }"
                  placeholder="Masukkan password"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  @click="showPassword = !showPassword"
                >
                  <svg v-if="showPassword" class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                  <svg v-else class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
              </div>
              <p v-if="errors.password" class="text-xs text-red-500 mt-1.5 font-medium">{{ errors.password }}</p>
            </div>

            <div
              v-if="loginError"
              class="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 mb-5 border border-red-100"
            >
              <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              {{ loginError }}
            </div>

            <button
              type="submit"
              class="btn-primary w-full py-3"
              :disabled="loading"
            >
              <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{{ loading ? 'Memproses...' : 'Masuk' }}</span>
            </button>
          </form>

          <div class="mt-6 pt-6 border-t border-gray-100">
            <p class="text-xs text-gray-400 text-center mb-3 font-medium uppercase tracking-wide">Akun Demo</p>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="demo in demoAccounts"
                :key="demo.role"
                class="text-xs py-2.5 px-3 rounded-xl border border-gray-200 hover:border-brand-300 hover:bg-brand-50/50 transition-all duration-200 text-center group"
                @click="fillDemo(demo)"
              >
                <span class="block font-semibold text-gray-700 group-hover:text-brand-700">{{ demo.role }}</span>
                <span class="text-gray-400 group-hover:text-brand-500">{{ demo.username }}</span>
              </button>
            </div>
          </div>
        </div>

        <p class="text-center text-gray-400 text-xs mt-6">
          SchoolHub &copy; 2024 — Tugas Akhir PPLG
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default', middleware: 'guest' })

const { login } = useAuth()

const form = reactive({ username: '', password: '' })
const errors = reactive({ username: '', password: '' })
const loading = ref(false)
const loginError = ref('')
const showPassword = ref(false)

const demoAccounts = [
  { role: 'Admin', username: 'admin', password: 'admin123' },
  { role: 'Guru', username: 'budi.santoso', password: 'guru123' },
  { role: 'Siswa', username: 'andi.pratama', password: 'siswa123' },
]

const fillDemo = (demo) => {
  form.username = demo.username
  form.password = demo.password
}

const validate = () => {
  errors.username = ''
  errors.password = ''
  let valid = true

  if (!form.username.trim()) {
    errors.username = 'Username wajib diisi'
    valid = false
  }
  if (!form.password) {
    errors.password = 'Password wajib diisi'
    valid = false
  }

  return valid
}

const handleLogin = async () => {
  if (!validate()) return
  loading.value = true
  loginError.value = ''
  try {
    await login(form.username, form.password)
  } catch (error) {
    loginError.value = error.response?.data?.message || 'Login gagal, periksa kembali kredensial Anda'
  } finally {
    loading.value = false
  }
}
</script>
