#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const envPaths = [
    path.resolve(__dirname, '../.env.local'),
    path.resolve(__dirname, '../apps/admin/.env.local'),
    path.resolve(__dirname, '../apps/web/.env.local'),
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const [key, ...values] = trimmed.split('=');
        if (key && !process.env[key.trim()]) {
          process.env[key.trim()] = values.join('=').trim().replace(/^['"]|['"]$/g, '');
        }
      });
    }
  }
}

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus terisi di .env.local');
  process.exit(1);
}

// Polyfill dummy websocket for Node 20
if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = class DummyWebSocket {};
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const args = process.argv.slice(2);
const email = args[0] || 'admin@stackbyalif.my.id';
const password = args[1] || 'Admin12345!';
const fullName = args[2] || 'Alif Admin';

async function createAdminUser() {
  console.log(`\n🚀 Membuat akun Admin Supabase...`);
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Password: ${password}`);

  try {
    // 1. Create user via Supabase Auth Admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    let userId = authData?.user?.id;

    if (authError) {
      if (authError.message.includes('already') || authError.message.includes('exists')) {
        console.log(`ℹ️ Akun auth ${email} sudah ada, memperbarui password dan role admin...`);
        // List users to get id
        const { data: listData } = await supabase.auth.admin.listUsers();
        const existing = listData?.users?.find((u) => u.email === email);
        if (existing) {
          userId = existing.id;
          await supabase.auth.admin.updateUserById(userId, {
            password,
            email_confirm: true,
          });
        }
      } else {
        throw authError;
      }
    }

    if (!userId) {
      throw new Error('Gagal mendapatkan User ID dari Supabase.');
    }

    // 2. Ensure role is 'admin' in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email,
        full_name: fullName,
        role: 'admin',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (profileError) {
      console.warn(`⚠️ Warning: Gagal upsert profiles (pastikan schema.sql sudah dijalankan di Supabase):`, profileError.message);
    } else {
      console.log(`✅ Profil user berhasil diset sebagai role 'admin'.`);
    }

    console.log(`\n🎉 SUKSES! Akun admin berhasil dibuat.`);
    console.log(`Silakan login di http://localhost:3001/login menggunakan:`);
    console.log(`📧 Email:    ${email}`);
    console.log(`🔑 Password: ${password}\n`);
  } catch (err) {
    console.error(`\n❌ Gagal membuat akun:`, err.message);
  }
}

createAdminUser();
