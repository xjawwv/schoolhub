<template>
  <form @submit.prevent="handleSubmit">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div v-if="!teacher">
        <label class="label">Username</label>
        <input v-model="form.username" type="text" class="input" :class="{ 'input-error': errors.username }" placeholder="username" />
        <p v-if="errors.username" class="text-xs text-red-500 mt-1.5 font-medium">{{ errors.username }}</p>
      </div>

      <div v-if="!teacher">
        <label class="label">Email</label>
        <input v-model="form.email" type="email" class="input" :class="{ 'input-error': errors.email }" placeholder="email@sekolah.id" />
        <p v-if="errors.email" class="text-xs text-red-500 mt-1.5 font-medium">{{ errors.email }}</p>
      </div>

      <div v-if="!teacher">
        <label class="label">Password</label>
        <input v-model="form.password" type="password" class="input" :class="{ 'input-error': errors.password }" placeholder="Minimal 6 karakter" />
        <p v-if="errors.password" class="text-xs text-red-500 mt-1.5 font-medium">{{ errors.password }}</p>
      </div>

      <div>
        <label class="label">NIP</label>
        <input v-model="form.nip" type="text" class="input" :class="{ 'input-error': errors.nip }" placeholder="Nomor Induk Pegawai" :disabled="!!teacher" />
        <p v-if="errors.nip" class="text-xs text-red-500 mt-1.5 font-medium">{{ errors.nip }}</p>
      </div>

      <div class="sm:col-span-2">
        <label class="label">Nama Lengkap</label>
        <input v-model="form.full_name" type="text" class="input" :class="{ 'input-error': errors.full_name }" placeholder="Nama lengkap guru" />
        <p v-if="errors.full_name" class="text-xs text-red-500 mt-1.5 font-medium">{{ errors.full_name }}</p>
      </div>

      <div>
        <label class="label">Jenis Kelamin</label>
        <select v-model="form.gender" class="input">
          <option value="">Pilih jenis kelamin</option>
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </select>
      </div>

      <div>
        <label class="label">No. Telepon</label>
        <input v-model="form.phone" type="tel" class="input" placeholder="08xxxxxxxxxx" />
      </div>

      <div>
        <label class="label">Tanggal Lahir</label>
        <input v-model="form.birth_date" type="date" class="input" />
      </div>

      <div>
        <label class="label">Tempat Lahir</label>
        <input v-model="form.birth_place" type="text" class="input" placeholder="Kota kelahiran" />
      </div>

      <div class="sm:col-span-2">
        <label class="label">Alamat</label>
        <textarea v-model="form.address" class="input resize-none" rows="2" placeholder="Alamat lengkap" />
      </div>
    </div>

    <div class="flex gap-3 justify-end mt-6">
      <button type="button" class="btn-outline" @click="$emit('cancel')">Batal</button>
      <button type="submit" class="btn-primary" :disabled="loading">
        <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        {{ teacher ? 'Simpan Perubahan' : 'Tambah Guru' }}
      </button>
    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  teacher: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  username: '',
  email: '',
  password: '',
  nip: '',
  full_name: '',
  gender: '',
  birth_date: '',
  birth_place: '',
  address: '',
  phone: '',
})

const errors = reactive({ username: '', email: '', password: '', nip: '', full_name: '' })

watch(() => props.teacher, (val) => {
  if (val) {
    form.nip = val.nip || ''
    form.full_name = val.full_name || ''
    form.gender = val.gender || ''
    form.birth_date = val.birth_date ? val.birth_date.split('T')[0] : ''
    form.birth_place = val.birth_place || ''
    form.address = val.address || ''
    form.phone = val.phone || ''
  }
}, { immediate: true })

const validate = () => {
  Object.keys(errors).forEach((k) => (errors[k] = ''))
  let valid = true
  if (!props.teacher) {
    if (!form.username.trim()) { errors.username = 'Username wajib diisi'; valid = false }
    if (!form.email.trim()) { errors.email = 'Email wajib diisi'; valid = false }
    if (!form.password || form.password.length < 6) { errors.password = 'Password minimal 6 karakter'; valid = false }
    if (!form.nip.trim()) { errors.nip = 'NIP wajib diisi'; valid = false }
  }
  if (!form.full_name.trim()) { errors.full_name = 'Nama lengkap wajib diisi'; valid = false }
  return valid
}

const handleSubmit = () => {
  if (!validate()) return
  const data = { ...form }
  if (!data.phone) delete data.phone
  emit('submit', data)
}
</script>
