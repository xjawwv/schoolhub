<template>
  <div class="min-h-screen bg-gradient-to-br from-navy-950 via-brand-900 to-brand-800 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span class="text-brand-700 font-black text-2xl">S</span>
        </div>
        <h1 class="text-3xl font-bold text-white">SchoolHub</h1>
        <p class="text-brand-200 mt-1 text-sm">Sistem Manajemen Kesiswaan Modern</p>
      </div>

      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Masuk ke Akun</h2>

        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label class="label">Username atau Email</label>
            <input
              v-model="form.username"
              type="text"
              class="input"
              :class="{ 'input-error': errors.username }"
              placeholder="Masukkan username atau email"
              autocomplete="username"
            />
            <p v-if="errors.username" class="text-xs text-red-500 mt-1">{{ errors.username }}</p>
          </div>

          <div class="mb-6">
            <label class="label">Password</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="input pr-10"
                :class="{ 'input-error': errors.password }"
                placeholder="Masukkan password"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '🙈' : '👁' }}
              </button>
            </div>
            <p v-if="errors.password" class="text-xs text-red-500 mt-1">{{ errors.password }}</p>
          </div>

          <p v-if="loginError" class="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">
            {{ loginError }}
          </p>

          <button
            type="submit"
            class="btn-primary w-full py-2.5"
            :disabled="loading"
          >
            <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>{{ loading ? 'Memproses...' : 'Masuk' }}</span>
          </button>
        </form>

        <div class="mt-6 pt-6 border-t border-gray-100">
          <p class="text-xs text-gray-400 text-center mb-3">Akun Demo</p>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="demo in demoAccounts"
              :key="demo.role"
              class="text-xs py-2 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center"
              @click="fillDemo(demo)"
            >
              <span class="block font-medium text-gray-700">{{ demo.role }}</span>
              <span class="text-gray-400">{{ demo.username }}</span>
            </button>
          </div>
        </div>
      </div>

      <p class="text-center text-brand-200 text-xs mt-6">
        SchoolHub &copy; 2024 — Tugas Akhir PPLG
      </p>
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
