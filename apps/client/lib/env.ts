/**
 * Universal environment variable accessor that reads from Cloudflare Workers context
 * (for encrypted secrets / bindings) with fallback to process.env.
 */
export function getEnv(key: string): string {
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

  return (process.env[key] || '').trim();
}
