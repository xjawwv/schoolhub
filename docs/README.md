# SchoolHub — Dokumentasi

Sistem Manajemen Kesiswaan Modern berbasis Nuxt.js + Express.js

## Stack

- **Frontend**: Nuxt.js 3, Vue 3, Tailwind CSS, Pinia, Axios, Socket.IO Client
- **Backend**: Node.js, Express.js, Prisma ORM, MySQL, JWT, Socket.IO
- **Database**: MySQL

## Struktur Monorepo

```
schoolhub/
├── client/     Nuxt.js frontend
├── server/     Express.js backend
└── docs/       Dokumentasi
```

## Cara Menjalankan

### Backend

```bash
cd server
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

### Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

## Akun Demo

| Role  | Username         | Password  |
|-------|-----------------|-----------|
| Admin | admin           | admin123  |
| Guru  | budi.santoso    | guru123   |
| Guru  | siti.rahayu     | guru123   |
| Siswa | andi.pratama    | siswa123  |
| Siswa | dewi.lestari    | siswa123  |
| Siswa | rizky.firmansyah| siswa123  |

## API Endpoints

### Auth
- `POST /api/auth/login`
- `GET  /api/auth/profile`
- `PUT  /api/auth/change-password`
- `POST /api/auth/logout`

### Dashboard
- `GET /api/dashboard/stats`

### Students
- `GET    /api/students`
- `GET    /api/students/me`
- `GET    /api/students/:id`
- `POST   /api/students`
- `PUT    /api/students/:id`
- `DELETE /api/students/:id`

### Teachers
- `GET    /api/teachers`
- `GET    /api/teachers/me`
- `GET    /api/teachers/:id`
- `POST   /api/teachers`
- `PUT    /api/teachers/:id`
- `DELETE /api/teachers/:id`

### Classes
- `GET    /api/classes`
- `GET    /api/classes/:id`
- `POST   /api/classes`
- `PUT    /api/classes/:id`
- `DELETE /api/classes/:id`

### Subjects
- `GET    /api/subjects`
- `GET    /api/subjects/:id`
- `POST   /api/subjects`
- `PUT    /api/subjects/:id`
- `DELETE /api/subjects/:id`

### Schedules
- `GET    /api/schedules`
- `GET    /api/schedules/my`
- `GET    /api/schedules/student`
- `GET    /api/schedules/:id`
- `POST   /api/schedules`
- `PUT    /api/schedules/:id`
- `DELETE /api/schedules/:id`

### Attendance
- `GET  /api/attendance`
- `GET  /api/attendance/my`
- `GET  /api/attendance/summary`
- `GET  /api/attendance/:id`
- `POST /api/attendance`
- `PUT  /api/attendance/:id`

### Grades
- `GET    /api/grades`
- `GET    /api/grades/my`
- `GET    /api/grades/:id`
- `POST   /api/grades`
- `PUT    /api/grades/:id`
- `DELETE /api/grades/:id`

### Announcements
- `GET    /api/announcements`
- `GET    /api/announcements/:id`
- `POST   /api/announcements`
- `PUT    /api/announcements/:id`
- `DELETE /api/announcements/:id`

### Notifications
- `GET /api/notifications`
- `GET /api/notifications/unread-count`
- `PUT /api/notifications/read-all`
- `PUT /api/notifications/:id/read`

## Socket.IO Events

| Event              | Arah              | Deskripsi                        |
|--------------------|-------------------|----------------------------------|
| `notification:new` | server → client   | Notifikasi baru ke user          |
| `announcement:new` | server → client   | Pengumuman baru ke semua client  |
| `attendance:update`| server → client   | Update absensi realtime          |
| `grades:update`    | server → client   | Update nilai realtime            |
