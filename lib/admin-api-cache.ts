import "server-only";

type CacheEntry<T> = { expiresAt: number; value: T };

// Global cache survives across requests within a warm serverless instance.
const g = globalThis as unknown as { __urbanJobsAdminCache?: Map<string, CacheEntry<unknown>> };
const cache = (g.__urbanJobsAdminCache ??= new Map());

export async function withTtlCache<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const existing = cache.get(key) as CacheEntry<T> | undefined;
  if (existing && existing.expiresAt > now) return existing.value;

  const value = await fn();
  cache.set(key, { expiresAt: now + ttlMs, value });
  return value;
}

export function clampLimit(raw: string | null, fallback: number, max: number) {
  const n = raw ? Number(raw) : NaN;
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(Math.floor(n), max);
}

