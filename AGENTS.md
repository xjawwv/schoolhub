# AGENTS.md — SchoolHub AI Agent Rules

This file defines strict rules and conventions that ALL AI agents MUST follow when contributing to the SchoolHub project.

---

## ABSOLUTE PROHIBITIONS

These rules are non-negotiable and must never be violated under any circumstance.

### No Comments in Code
- DO NOT add any comments inside source code files.
- This includes inline comments, block comments, JSDoc, and section dividers.
- No `//`, `/* */`, `/** */`, `#`, `<!-- -->` in any code file.
- Exception: `schema.prisma` field descriptions are allowed only if strictly required by Prisma tooling.

### No Emojis in Code
- DO NOT use emojis anywhere inside source code files.
- No emojis in variable names, string values, console outputs, log messages, or error messages.
- No emojis in file names, folder names, or import paths.

### No Hardcoded Values
- All configuration values (ports, URLs, secrets, DB credentials) MUST use environment variables via `.env`.
- Never hardcode API keys, passwords, tokens, or base URLs.

### No Monolith Patterns
- Frontend (`client/`) and Backend (`server/`) must remain fully decoupled.
- Frontend must ONLY communicate with the backend via REST API or Socket.IO.
- No server-side rendering of backend logic inside Nuxt.

---

## PROJECT OVERVIEW

**Name:** SchoolHub  
**Type:** Fullstack Student Management System  
**Stack:** Nuxt.js v4.4.4 + Express.js + MySQL + Prisma + Socket.IO  
**Architecture:** Monorepo (client / server / docs)

---

## TECH STACK

### Frontend
- Nuxt.js (latest)
- Vue 3 Composition API
- Tailwind CSS
- Pinia
- Axios
- VueUse (optional)
- JavaScript (preferred over TypeScript for development speed)

### Backend
- Node.js
- Express.js
- MySQL
- Prisma ORM
- JWT Authentication
- Multer (file uploads)
- Socket.IO
- bcrypt
- express-validator or zod

---

## MONOREPO STRUCTURE

```text
schoolhub/
├── client/
├── server/
└── docs/
```

---

## CODING STANDARDS

### General
- Use `async/await` for all asynchronous operations.
- Always implement proper error handling — use try/catch and global error middleware.
- Use consistent and meaningful naming — avoid abbreviations except for industry-standard ones (`req`, `res`, `id`).
- All files and folders must use `kebab-case`.
- All JavaScript variables and functions must use `camelCase`.
- All Prisma models and database tables must use `snake_case`.
- All Vue components must use `PascalCase`.

### Functions
- Keep functions small and single-purpose.
- Avoid deeply nested logic — extract to helper functions.
- Always return consistent shapes from service functions.

### API Response Standard
All REST API responses must follow this exact shape:

Success:
```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": {}
}
```

Error:
```json
{
  "success": false,
  "message": "Terjadi kesalahan"
}
```

---

## ARCHITECTURE RULES

### Backend (Express.js)
- Use modular route structure: each module has its own `routes.js`, `controller.js`, `service.js`.
- Controllers handle HTTP logic only — delegate business logic to services.
- Services handle business logic only — delegate database queries to Prisma.
- Middleware must be placed in `src/middleware/`.
- Socket.IO logic must be isolated in `src/sockets/`.

### Frontend (Nuxt.js)
- All API calls must go through a service abstraction layer in `services/`.
- State management must use Pinia stores in `stores/`.
- Reusable logic must be extracted into composables in `composables/`.
- Auth protection must use Nuxt middleware in `middleware/`.
- Components must be split by domain: `ui/`, `dashboard/`, `forms/`, `tables/`.

---

## BACKEND FOLDER STRUCTURE

```text
server/
├── src/
│   ├── config/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── students/
│   │   ├── teachers/
│   │   ├── classes/
│   │   ├── subjects/
│   │   ├── attendance/
│   │   ├── grades/
│   │   ├── schedules/
│   │   ├── announcements/
│   │   └── notifications/
│   ├── sockets/
│   ├── middleware/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── uploads/
├── package.json
└── .env.example
```

---

## FRONTEND FOLDER STRUCTURE

```text
client/
├── app/
├── assets/
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── forms/
│   └── tables/
├── composables/
├── layouts/
├── middleware/
├── pages/
│   ├── admin/
│   ├── guru/
│   └── siswa/
├── plugins/
├── services/
├── stores/
├── utils/
├── public/
└── nuxt.config.ts
```

---

## SOCKET.IO EVENTS

The following Socket.IO events must be implemented:

| Event | Direction | Description |
|---|---|---|
| `notification:new` | server → client | New notification pushed to user |
| `announcement:new` | server → client | New announcement broadcast to all |
| `attendance:update` | server → client | Attendance data updated realtime |
| `grades:update` | server → client | Grade data updated realtime |

---

## ROLE SYSTEM

Three roles are supported: `ADMIN`, `GURU`, `SISWA`.

- Role is stored in the `users` table.
- `students` and `teachers` tables reference `users` via `user_id`.
- Route protection must be enforced via JWT middleware + role middleware on every protected endpoint.

---

## SECURITY REQUIREMENTS

- All passwords must be hashed using `bcrypt`.
- JWT must be used for all authentication.
- CORS must be configured explicitly — never use wildcard `*` in production.
- Rate limiting must be applied to auth endpoints.
- All sensitive data must be stored in `.env` only.
- Never commit `.env` files to the repository.

---

## DATABASE RULES

- Use Prisma ORM exclusively — no raw SQL queries unless absolutely unavoidable.
- All relations must be explicitly defined in `schema.prisma`.
- Always use Prisma migrations — never manually alter the database schema.
- Minimum required tables: `users`, `students`, `teachers`, `classes`, `subjects`, `schedules`, `attendance`, `attendance_details`, `grades`, `announcements`, `notifications`.

---

## UI/UX RULES

- Theme: modern, clean, minimalist, dashboard-style.
- Color palette: navy, blue, emerald. Dark mode is optional.
- All pages must be responsive (mobile + desktop).
- Sidebar navigation is required on all dashboard pages.
- All tables must support pagination.
- All forms must have loading states and error feedback.

---

## DEVELOPMENT ORDER

AI agents must follow this sequence when building features:

1. Setup backend Express.js
2. Setup Prisma schema and database
3. Implement authentication system
4. Implement role middleware
5. Setup Nuxt.js frontend
6. Integrate API service layer
7. Build dashboard UI layouts
8. Build CRUD modules per role
9. Integrate Socket.IO realtime features
10. Final polish and seeder data

---

## OUTPUT QUALITY

Every generated output must be:
- Production-ready quality code
- Modular and scalable
- Free of placeholder logic (`TODO`, `FIXME`, dummy returns)
- Consistent with the conventions defined in this file
- Immediately runnable without modification

---

## SCOPE

This project is a final-year capstone (Tugas Akhir) for PPLG vocational track. The result must be presentable as a professional modern SaaS school management dashboard and serve as a strong fullstack developer portfolio piece.
