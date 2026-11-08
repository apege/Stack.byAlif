/**
 * Universal environment variable accessor that reads from Cloudflare Workers context
 * (for encrypted secrets / bindings) with fallback to statically inlined process.env.
 */
export function getEnv(key: string): string {
  // 1. Check Cloudflare runtime context if available
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getCloudflareContext } = require('@opennextjs/cloudflare');
    const ctx = getCloudflareContext();
    if (ctx?.env && typeof ctx.env[key] !== 'undefined' && ctx.env[key] !== null) {
      const val = String(ctx.env[key]).trim();
      if (val) return val;
    }
  } catch {
    // Not running inside active Cloudflare worker request
  }

  // 2. Explicit static property access so Next.js build compiler inlines NEXT_PUBLIC_* variables
  switch (key) {
    case 'NEXT_PUBLIC_SUPABASE_URL':
      return process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    case 'NEXT_PUBLIC_SUPABASE_ANON_KEY':
      return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    case 'SUPABASE_SERVICE_ROLE_KEY':
      return process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    case 'TELEGRAM_BOT_TOKEN':
      return process.env.TELEGRAM_BOT_TOKEN || '';
    case 'TELEGRAM_CHAT_ID':
      return process.env.TELEGRAM_CHAT_ID || '';
    case 'ADMIN_SESSION_SECRET':
      return process.env.ADMIN_SESSION_SECRET || '';
    default:
      return (process.env[key] || '').trim();
  }
}
