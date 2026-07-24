/**
 * Very small in-memory rate limiter. Sufficient for basic abuse protection
 * on a single serverless instance. For production, back this with a shared
 * store (KV / Redis / Durable Object).
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

const hits = new Map<string, number[]>();

export function checkRateLimit(key: string): {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
} {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX_REQUESTS) {
    const oldest = arr[0];
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000)),
    };
  }
  arr.push(now);
  hits.set(key, arr);
  return { ok: true, remaining: MAX_REQUESTS - arr.length, retryAfterSec: 0 };
}
