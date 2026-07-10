/**
 * Minimal in-memory rate limiter, keyed by an arbitrary string (e.g.
 * `booking:<ip>`).
 *
 * Best-effort only: this Next.js app runs as serverless functions with no
 * shared memory across instances/regions, and this Map resets on every cold
 * start. It will not stop a distributed or persistent attacker, but it does
 * cap a single script hammering one warm instance — which is the realistic
 * abuse case for a small café's booking form. If real abuse shows up in
 * practice, upgrade to a shared store (e.g. Upstash Redis).
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Returns true if `key` has exceeded `limit` requests within the current
 * `windowMs` window, recording this call either way.
 */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}
