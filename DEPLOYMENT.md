# Panduan Deployment Cloudflare & Konfigurasi Monorepo

## 🏗️ Struktur Arsitektur Monorepo

```
portfolio/
├── apps/
│   ├── web/                    # Website Portfolio Publik (stackbyalif.my.id)
│   ├── admin/                  # Dashboard Admin (admin.stackbyalif.my.id)
│   └── client/                 # Client Onboarding & Tanda Tangan Kontrak (client.stackbyalif.my.id)
├── packages/
│   └── database/
│       ├── schema.sql          # Supabase SQL (RLS, Buckets, Trigger Immutability, Client Registrations)
│       └── seed.sql            # Data awal project portfolio
├── scripts/
│   └── backup.mjs              # Skrip backup otomatis database & kontrak
├── package.json                # Root NPM Workspaces configuration
└── DEPLOYMENT.md               # Panduan ini
```

---

## 🚀 1. Setup Supabase Database & Storage

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) proyek Anda.
2. Masuk ke menu **SQL Editor**.
3. Buka file `packages/database/schema.sql`, salin seluruh isinya, dan klik **Run**.
   - Ini akan membuat tabel `profiles`, `projects`, `clients`, `agreements`, `agreement_versions`, `inquiries`, dan `audit_logs`.
   - Mengaktifkan **Row Level Security (RLS)** ketat: data klien dan kontrak tidak bisa diakses publik.
   - Membuat storage bucket `project-images` (publik untuk aset portfolio) dan `contracts` (privat).
   - Menambahkan **Database Trigger** untuk memastikan agreement yang telah berstatus `signed` bersifat **immutable (tidak dapat diubah)**.
4. Jalankan juga skrip `packages/database/seed.sql` di SQL Editor untuk memasukkan 6 data project awal Anda ke tabel database.
5. Buat Akun Admin Pertama:
   - Di Supabase Dashboard, buka **Authentication -> Users** -> **Add user**.
   - Masukkan email dan password admin Anda.
   - Setelah user dibuat, buat row di tabel `profiles`:
     ```sql
     INSERT INTO public.profiles (id, email, full_name, role)
     VALUES ('<USER_UUID_DARI_AUTH>', 'admin@stackbyalif.my.id', 'Alif', 'admin');
     ```

---

## ☁️ 2. Deployment ke Cloudflare Pages

### A. Deployment Website Publik (`stackbyalif.my.id`)

1. Buka **Cloudflare Dashboard** -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
2. Pilih repository GitHub Anda.
3. Konfigurasi build settings:
   - **Project Name:** `stackbyalif-web`
   - **Framework preset:** `Next.js` (atau jalankan opennext)
   - **Root directory:** `apps/web`  👈 *(Pilih folder monorepo web)*
   - **Build command:** `npm run build`
   - **Build output directory:** `.open-next/assets` (atau `.next`)
4. **Environment Variables** (Settings -> Environment variables):
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://qkkcwxdwgtjvnrwrqtsd.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `<anon_key>`
   - `TELEGRAM_BOT_TOKEN`: `<bot_token>`
   - `TELEGRAM_CHAT_ID`: `<chat_id>`
   *(Catatan Keamanan: JANGAN pernah memasukkan SUPABASE_SERVICE_ROLE_KEY di website publik)*
5. Tambahkan Custom Domain: `stackbyalif.my.id`

---

### B. Deployment Dashboard Admin (`admin.stackbyalif.my.id`)

1. Di Cloudflare Dashboard, klik **Create application** -> **Pages** -> **Connect to Git** (pilih repository yang sama).
2. Konfigurasi build settings:
   - **Project Name:** `stackbyalif-admin`
   - **Framework preset:** `Next.js`
   - **Root directory:** `apps/admin`  👈 *(Pilih folder monorepo admin)*
   - **Build command:** `npm run build`
   - **Build output directory:** `.open-next/assets` (atau `.next`)
3. **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://qkkcwxdwgtjvnrwrqtsd.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `<anon_key>`
   - `SUPABASE_SERVICE_ROLE_KEY`: `<service_role_key>`
4. Tambahkan Custom Domain: `admin.stackbyalif.my.id`

---

### C. Deployment Client Portal (`client.stackbyalif.my.id`)

1. Di Cloudflare Dashboard, klik **Create application** -> **Pages** -> **Connect to Git** (pilih repository yang sama).
2. Konfigurasi build settings:
   - **Project Name:** `stackbyalif-client`
   - **Framework preset:** `Next.js`
   - **Root directory:** `apps/client`  👈 *(Pilih folder monorepo client)*
   - **Build command:** `npm run build`
   - **Build output directory:** `.open-next/assets` (atau `.next`)
3. **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://qkkcwxdwgtjvnrwrqtsd.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `<anon_key>`
   - `SUPABASE_SERVICE_ROLE_KEY`: `<service_role_key>`
   - `TELEGRAM_BOT_TOKEN`: `<bot_token>`
   - `TELEGRAM_CHAT_ID`: `<chat_id>`
4. Tambahkan Custom Domain: `client.stackbyalif.my.id` (atau `form.stackbyalif.my.id` / `kontrak.stackbyalif.my.id`)

---

## 🔒 3. Implementasi 7 Prinsip Keamanan

1. **Dashboard Tidak Sembarangan Diakses:**
   - Middleware memblokir semua request non-login dan me-redirect ke `/login`.
   - Verifikasi role `admin` pada tabel `profiles`. Akun tanpa role admin otomatis di-logout.
2. **Supabase RLS & Authorization:**
   - Tabel `clients` dan `agreements` memiliki RLS dengan policy `TO authenticated USING (is_admin())`. Publik `anon` dilarang membaca data klien.
3. **Token Acak & Kedaluwarsa:**
   - Pembuatan agreement meng-generate token kriptografis 256-bit dan kode akses 6 digit.
   - Kolom `expires_at` membatasi waktu berlaku (misal 7 hari). Jika lewat waktu, status otomatis menjadi `expired` dan form TTD dikunci.
4. **Data Klien Terisolasi:**
   - Aplikasi `apps/web` hanya membaca tabel `projects`. Tidak ada endpoint ataupun query ke tabel klien maupun dokumen kontrak di website publik.
5. **Zero Sensitive Info in URL:**
   - URL penandatanganan hanya menyertakan referensi ID (`/agreement?ref=<id>`). Klien wajib memasukkan kode verifikasi secara manual di halaman portal, sehingga token dan data rahasia tidak terekspos di URL browser atau HTTP Referrer logs.
6. **Dokumen Final Immutable & Versioned:**
   - Saat ditandatangani, data tanda tangan disimpan bersama SHA-256 integrity checksum, IP address, user-agent, dan snapshot di tabel `agreement_versions`.
   - PostgreSQL Trigger `trg_prevent_signed_tampering` secara otomatis membatalkan setiap upaya UPDATE pada agreement yang telah berstatus `signed`.
7. **Backup Database & Dokumen:**
   - Di dashboard admin tersedia menu **Backup & Security** dengan tombol **One-Click JSON Snapshot**.
   - Tersedia skrip CLI: jalankan `npm run backup` untuk mencadangkan seluruh tabel dan indeks kontrak ke folder `/backups/`.
