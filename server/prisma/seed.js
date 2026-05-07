require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12

async function main() {
  const adminPassword = await bcrypt.hash('admin123', BCRYPT_ROUNDS)
  const guruPassword = await bcrypt.hash('guru123', BCRYPT_ROUNDS)
  const siswaPassword = await bcrypt.hash('siswa123', BCRYPT_ROUNDS)

  const admin = await prisma.users.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@schoolhub.id',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const guruUser1 = await prisma.users.upsert({
    where: { username: 'budi.santoso' },
    update: {},
    create: {
      username: 'budi.santoso',
      email: 'budi.santoso@schoolhub.id',
      password: guruPassword,
      role: 'GURU',
    },
  })

  const guruUser2 = await prisma.users.upsert({
    where: { username: 'siti.rahayu' },
    update: {},
    create: {
      username: 'siti.rahayu',
      email: 'siti.rahayu@schoolhub.id',
      password: guruPassword,
      role: 'GURU',
    },
  })

  const siswaUser1 = await prisma.users.upsert({
    where: { username: 'andi.pratama' },
    update: {},
    create: {
      username: 'andi.pratama',
      email: 'andi.pratama@schoolhub.id',
      password: siswaPassword,
      role: 'SISWA',
    },
  })

  const siswaUser2 = await prisma.users.upsert({
    where: { username: 'dewi.lestari' },
    update: {},
    create: {
      username: 'dewi.lestari',
      email: 'dewi.lestari@schoolhub.id',
      password: siswaPassword,
      role: 'SISWA',
    },
  })

  const siswaUser3 = await prisma.users.upsert({
    where: { username: 'rizky.firmansyah' },
    update: {},
    create: {
      username: 'rizky.firmansyah',
      email: 'rizky.firmansyah@schoolhub.id',
      password: siswaPassword,
      role: 'SISWA',
    },
  })

  const kelas10PPLG = await prisma.classes.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'X PPLG 1',
      grade: 'X',
      academic_year: '2024/2025',
    },
  })

  const kelas11PPLG = await prisma.classes.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'XI PPLG 1',
      grade: 'XI',
      academic_year: '2024/2025',
    },
  })

  const guru1 = await prisma.teachers.upsert({
    where: { nip: '198501012010011001' },
    update: {},
    create: {
      user_id: guruUser1.id,
      nip: '198501012010011001',
      full_name: 'Budi Santoso, S.Kom',
      gender: 'Laki-laki',
      birth_date: new Date('1985-01-01'),
      birth_place: 'Jakarta',
      address: 'Jl. Merdeka No. 1, Jakarta',
      phone: '081234567890',
    },
  })

  const guru2 = await prisma.teachers.upsert({
    where: { nip: '199002152015012002' },
    update: {},
    create: {
      user_id: guruUser2.id,
      nip: '199002152015012002',
      full_name: 'Siti Rahayu, S.Pd',
      gender: 'Perempuan',
      birth_date: new Date('1990-02-15'),
      birth_place: 'Bandung',
      address: 'Jl. Sudirman No. 5, Bandung',
      phone: '082345678901',
    },
  })

  const mapel1 = await prisma.subjects.upsert({
    where: { code: 'PPLG-01' },
    update: {},
    create: {
      code: 'PPLG-01',
      name: 'Pemrograman Web',
      description: 'Mata pelajaran pemrograman web dasar dan lanjutan',
      teacher_id: guru1.id,
    },
  })

  const mapel2 = await prisma.subjects.upsert({
    where: { code: 'PPLG-02' },
    update: {},
    create: {
      code: 'PPLG-02',
      name: 'Basis Data',
      description: 'Mata pelajaran basis data dan SQL',
      teacher_id: guru1.id,
    },
  })

  const mapel3 = await prisma.subjects.upsert({
    where: { code: 'MTK-01' },
    update: {},
    create: {
      code: 'MTK-01',
      name: 'Matematika',
      description: 'Mata pelajaran matematika',
      teacher_id: guru2.id,
    },
  })

  const siswa1 = await prisma.students.upsert({
    where: { nis: '2024001' },
    update: {},
    create: {
      user_id: siswaUser1.id,
      nis: '2024001',
      full_name: 'Andi Pratama',
      gender: 'Laki-laki',
      birth_date: new Date('2007-03-10'),
      birth_place: 'Surabaya',
      address: 'Jl. Pahlawan No. 10, Surabaya',
      phone: '083456789012',
      class_id: kelas10PPLG.id,
    },
  })

  const siswa2 = await prisma.students.upsert({
    where: { nis: '2024002' },
    update: {},
    create: {
      user_id: siswaUser2.id,
      nis: '2024002',
      full_name: 'Dewi Lestari',
      gender: 'Perempuan',
      birth_date: new Date('2007-07-22'),
      birth_place: 'Yogyakarta',
      address: 'Jl. Malioboro No. 3, Yogyakarta',
      phone: '084567890123',
      class_id: kelas10PPLG.id,
    },
  })

  const siswa3 = await prisma.students.upsert({
    where: { nis: '2023001' },
    update: {},
    create: {
      user_id: siswaUser3.id,
      nis: '2023001',
      full_name: 'Rizky Firmansyah',
      gender: 'Laki-laki',
      birth_date: new Date('2006-11-05'),
      birth_place: 'Medan',
      address: 'Jl. Diponegoro No. 7, Medan',
      phone: '085678901234',
      class_id: kelas11PPLG.id,
    },
  })

  await prisma.schedules.createMany({
    skipDuplicates: true,
    data: [
      { class_id: kelas10PPLG.id, subject_id: mapel1.id, teacher_id: guru1.id, day: 'Senin', start_time: '07:00', end_time: '08:30', room: 'Lab Komputer 1' },
      { class_id: kelas10PPLG.id, subject_id: mapel2.id, teacher_id: guru1.id, day: 'Selasa', start_time: '07:00', end_time: '08:30', room: 'Lab Komputer 1' },
      { class_id: kelas10PPLG.id, subject_id: mapel3.id, teacher_id: guru2.id, day: 'Rabu', start_time: '07:00', end_time: '08:30', room: 'Ruang 101' },
      { class_id: kelas11PPLG.id, subject_id: mapel1.id, teacher_id: guru1.id, day: 'Kamis', start_time: '07:00', end_time: '08:30', room: 'Lab Komputer 2' },
      { class_id: kelas11PPLG.id, subject_id: mapel3.id, teacher_id: guru2.id, day: 'Jumat', start_time: '07:00', end_time: '08:30', room: 'Ruang 102' },
    ],
  })

  await prisma.announcements.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Selamat Datang di SchoolHub',
        content: 'Sistem manajemen sekolah SchoolHub telah resmi diluncurkan. Semua siswa dan guru dapat mengakses fitur-fitur yang tersedia.',
        target_role: null,
        is_active: true,
        created_by: admin.id,
      },
      {
        title: 'Jadwal Ujian Tengah Semester',
        content: 'Ujian Tengah Semester akan dilaksanakan pada tanggal 15-20 Oktober 2024. Harap mempersiapkan diri dengan baik.',
        target_role: 'SISWA',
        is_active: true,
        created_by: admin.id,
      },
      {
        title: 'Rapat Guru Bulanan',
        content: 'Rapat guru bulanan akan dilaksanakan pada hari Sabtu, 12 Oktober 2024 pukul 09.00 WIB di ruang rapat.',
        target_role: 'GURU',
        is_active: true,
        created_by: admin.id,
      },
    ],
  })

  await prisma.grades.createMany({
    skipDuplicates: true,
    data: [
      { student_id: siswa1.id, subject_id: mapel1.id, semester: 1, score: 85, grade_type: 'Ulangan Harian' },
      { student_id: siswa1.id, subject_id: mapel2.id, semester: 1, score: 90, grade_type: 'Ulangan Harian' },
      { student_id: siswa1.id, subject_id: mapel3.id, semester: 1, score: 78, grade_type: 'Ulangan Harian' },
      { student_id: siswa2.id, subject_id: mapel1.id, semester: 1, score: 92, grade_type: 'Ulangan Harian' },
      { student_id: siswa2.id, subject_id: mapel2.id, semester: 1, score: 88, grade_type: 'Ulangan Harian' },
      { student_id: siswa3.id, subject_id: mapel1.id, semester: 1, score: 75, grade_type: 'Ulangan Harian' },
    ],
  })

  console.log('Seeder berhasil dijalankan')
  console.log('Akun tersedia:')
  console.log('  Admin   - username: admin, password: admin123')
  console.log('  Guru    - username: budi.santoso, password: guru123')
  console.log('  Guru    - username: siti.rahayu, password: guru123')
  console.log('  Siswa   - username: andi.pratama, password: siswa123')
  console.log('  Siswa   - username: dewi.lestari, password: siswa123')
  console.log('  Siswa   - username: rizky.firmansyah, password: siswa123')
}

main()
  .catch((e) => {
    console.error('Seeder gagal:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
