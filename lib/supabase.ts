import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;
let lastUsedConfig: string | null = null;

export function getSupabase(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  const configSignature = `${supabaseUrl}::${supabaseKey}`;

  if (!cachedClient || lastUsedConfig !== configSignature) {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Supabase credentials are not fully set in process.env');
    }
    cachedClient = createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseKey || 'placeholder-key'
    );
    lastUsedConfig = configSignature;
  }

  return cachedClient;
}

// Proxy wrapper ensuring runtime evaluation of process.env upon request
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
