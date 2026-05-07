<template>
  <form @submit.prevent="handleSubmit">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div v-if="!student">
        <label class="label">Username</label>
        <input v-model="form.username" type="text" class="input" :class="{ 'input-error': errors.username }" placeholder="username" />
        <p v-if="errors.username" class="text-xs text-red-500 mt-1">{{ errors.username }}</p>
      </div>

      <div v-if="!student">
        <label class="label">Email</label>
        <input v-model="form.email" type="email" class="input" :class="{ 'input-error': errors.email }" placeholder="email@sekolah.id" />
        <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
      </div>

      <div v-if="!student">
        <label class="label">Password</label>
        <input v-model="form.password" type="password" class="input" :class="{ 'input-error': errors.password }" placeholder="Minimal 6 karakter" />
        <p v-if="errors.password" class="text-xs text-red-500 mt-1">{{ errors.password }}</p>
      </div>

      <div>
        <label class="label">NIS</label>
        <input v-model="form.nis" type="text" class="input" :class="{ 'input-error': errors.nis }" placeholder="Nomor Induk Siswa" :disabled="!!student" />
        <p v-if="errors.nis" class="text-xs text-red-500 mt-1">{{ errors.nis }}</p>
      </div>

      <div class="sm:col-span-2">
        <label class="label">Nama Lengkap</label>
        <input v-model="form.full_name" type="text" class="input" :class="{ 'input-error': errors.full_name }" placeholder="Nama lengkap siswa" />
        <p v-if="errors.full_name" class="text-xs text-red-500 mt-1">{{ errors.full_name }}</p>
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
        <label class="label">Kelas</label>
        <select v-model="form.class_id" class="input">
          <option value="">Pilih kelas</option>
          <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
        </select>
      </div>

      <div>
        <label class="label">Tanggal Lahir</label>
        <input v-model="form.birth_date" type="date" class="input" />
      </div>

      <div>
        <label class="label">Tempat Lahir</label>
        <input v-model="form.birth_place" type="text" class="input" placeholder="Kota kelahiran" />
      </div>

      <div>
        <label class="label">No. Telepon</label>
        <input v-model="form.phone" type="tel" class="input" placeholder="08xxxxxxxxxx" />
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
        {{ student ? 'Simpan Perubahan' : 'Tambah Siswa' }}
      </button>
    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  student: { type: Object, default: null },
  classes: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  username: '',
  email: '',
  password: '',
  nis: '',
  full_name: '',
  gender: '',
  birth_date: '',
  birth_place: '',
  address: '',
  phone: '',
  class_id: '',
})

const errors = reactive({
  username: '',
  email: '',
  password: '',
  nis: '',
  full_name: '',
})

watch(() => props.student, (val) => {
  if (val) {
    form.nis = val.nis || ''
    form.full_name = val.full_name || ''
    form.gender = val.gender || ''
    form.birth_date = val.birth_date ? val.birth_date.split('T')[0] : ''
    form.birth_place = val.birth_place || ''
    form.address = val.address || ''
    form.phone = val.phone || ''
    form.class_id = val.class_id || ''
  }
}, { immediate: true })

const validate = () => {
  Object.keys(errors).forEach((k) => (errors[k] = ''))
  let valid = true

  if (!props.student) {
    if (!form.username.trim()) { errors.username = 'Username wajib diisi'; valid = false }
    if (!form.email.trim()) { errors.email = 'Email wajib diisi'; valid = false }
    if (!form.password || form.password.length < 6) { errors.password = 'Password minimal 6 karakter'; valid = false }
    if (!form.nis.trim()) { errors.nis = 'NIS wajib diisi'; valid = false }
  }

  if (!form.full_name.trim()) { errors.full_name = 'Nama lengkap wajib diisi'; valid = false }

  return valid
}

const handleSubmit = () => {
  if (!validate()) return
  const data = { ...form }
  if (!data.class_id) delete data.class_id
  if (!data.phone) delete data.phone
  emit('submit', data)
}
</script>
