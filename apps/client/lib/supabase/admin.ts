import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getEnv } from '@/lib/env';

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = class DummyWebSocket {} as any;
}

export function getAdminClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    getEnv('NEXT_PUBLIC_SUPABASE_URL') ||
    '';

  const serviceRoleKey =
    getEnv('SUPABASE_SERVICE_ROLE_KEY') ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') ||
    '';

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
