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
 *
 * Bounded: every call sweeps expired buckets first, and the map is capped at
 * MAX_BUCKETS with oldest (least-recently-touched) eviction, so a flood of
 * distinct keys (e.g. rotating/spoofed IPs) can't grow this map without
 * bound on a long-lived warm instance. Callers should also avoid allocating
 * a bucket for a request until after cheap payload-shape checks pass, so
 * garbage bodies don't consume a slot at all.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Hard cap on tracked keys; past this, the oldest bucket is evicted first. */
export const MAX_BUCKETS = 1000;

function sweepExpired(now: number): void {
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) {
      buckets.delete(key);
    }
  }
}

/**
 * Returns true if `key` has exceeded `limit` requests within the current
 * `windowMs` window, recording this call either way.
 */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  sweepExpired(now);

  const bucket = buckets.get(key);

  if (bucket && now <= bucket.resetAt) {
    bucket.count += 1;
    // Re-insert to move this key to the end of the Map's iteration order
    // (Map.set on an existing key does not reorder it), so eviction below
    // — which removes from the front — targets the least-recently-touched
    // key rather than this one.
    buckets.delete(key);
    buckets.set(key, bucket);
    return bucket.count > limit;
  }

  buckets.delete(key); // no-op if absent; drops a stale entry's old position
  if (buckets.size >= MAX_BUCKETS) {
    const oldestKey = buckets.keys().next().value;
    if (oldestKey !== undefined) {
      buckets.delete(oldestKey);
    }
  }
  buckets.set(key, { count: 1, resetAt: now + windowMs });
  return false;
}

/** Test-only: number of buckets currently tracked. */
export function _bucketCountForTests(): number {
  return buckets.size;
}

/** Test-only: clears all tracked buckets so cap/eviction tests are isolated. */
export function _resetForTests(): void {
  buckets.clear();
}
