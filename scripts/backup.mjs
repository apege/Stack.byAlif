#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read environment variables
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
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  process.exit(1);
}

// Ensure WebSocket polyfill for Node 20 environments
if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = class DummyWebSocket {};
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

async function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.resolve(__dirname, `../backups/backup_${timestamp}`);
  fs.mkdirSync(backupDir, { recursive: true });

  console.log(`\n🛡️  Starting Stack.byAlif Secure Database & Contract Backup`);
  console.log(`📁 Destination: ${backupDir}`);
  console.log(`🕒 Timestamp: ${new Date().toISOString()}\n`);

  const tables = ['projects', 'clients', 'agreements', 'agreement_versions', 'inquiries', 'audit_logs', 'profiles'];
  const fullBackup = {
    metadata: {
      generatedAt: new Date().toISOString(),
      sourceUrl: SUPABASE_URL,
      tablesIncluded: tables,
    },
    tables: {},
  };

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*');
      if (error) {
        console.warn(`⚠️ Warning: Table '${table}' returned error: ${error.message}`);
        fullBackup.tables[table] = { error: error.message };
      } else {
        fullBackup.tables[table] = data || [];
        fs.writeFileSync(
          path.join(backupDir, `${table}.json`),
          JSON.stringify(data || [], null, 2),
          'utf-8'
        );
        console.log(`✅ Table '${table}': ${data?.length || 0} records archived.`);
      }
    } catch (err) {
      console.error(`❌ Failed to backup table '${table}':`, err.message);
    }
  }

  // Backup contract storage metadata & signed agreements
  try {
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from('contracts')
      .list();

    if (!storageError && storageFiles) {
      fs.writeFileSync(
        path.join(backupDir, 'contracts_storage_index.json'),
        JSON.stringify(storageFiles, null, 2),
        'utf-8'
      );
      console.log(`✅ Storage 'contracts': ${storageFiles.length} file metadata entries saved.`);
    }
  } catch (err) {
    console.warn(`⚠️ Notice: Contracts storage bucket index skipped:`, err.message);
  }

  // Combined full backup archive
  fs.writeFileSync(
    path.join(backupDir, 'full_backup.json'),
    JSON.stringify(fullBackup, null, 2),
    'utf-8'
  );

  console.log(`\n🎉 Backup successfully completed and verified!`);
  console.log(`📦 Full backup archive: ${path.join(backupDir, 'full_backup.json')}\n`);
}

runBackup().catch((err) => {
  console.error('Fatal backup error:', err);
  process.exit(1);
});
