# Task Board — Adhivasindo Frontend Test

Aplikasi manajemen tugas (Kanban board) sederhana dibuat menggunakan **Ionic React + Vite**.
Semua data disimpan di **LocalStorage** browser (tanpa backend).

## Fitur
- Board & Column (To Do, Doing, Review, Done, Rework) — bisa tambah column baru
- Task Card: judul, deskripsi, assignee (multi), due date, label, priority, checklist, attachment (dummy), cover image
- Filtering & Searching (by assignee, label, due date, judul task)
- CRUD lengkap lewat modal (Create, Read, Update, Delete)
- Drag & drop antar column (`@hello-pangea/dnd`)
- Checklist/subtask dengan progress bar otomatis
- Toast notification saat create/update/delete
- Responsive (desktop & mobile)

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Build production

```bash
npm run build
npm run preview
```

## Deploy

Project ini adalah static Vite app, bisa langsung di-deploy ke **Vercel** atau **Netlify**:

- Build command: `npm run build`
- Output directory: `dist`
