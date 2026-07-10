import { describe, it, expect, beforeEach } from 'vitest';
import { isRateLimited, _bucketCountForTests, _resetForTests, MAX_BUCKETS } from './rateLimit';

describe('isRateLimited', () => {
  it('allows requests up to the limit', () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 3; i += 1) {
      expect(isRateLimited(key, 3, 60_000)).toBe(false);
    }
  });

  it('blocks once the limit is exceeded within the window', () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 3; i += 1) {
      isRateLimited(key, 3, 60_000);
    }
    expect(isRateLimited(key, 3, 60_000)).toBe(true);
  });

  it('tracks separate keys independently', () => {
    const keyA = `test-a-${Math.random()}`;
    const keyB = `test-b-${Math.random()}`;
    for (let i = 0; i < 3; i += 1) {
      isRateLimited(keyA, 3, 60_000);
    }
    expect(isRateLimited(keyA, 3, 60_000)).toBe(true);
    expect(isRateLimited(keyB, 3, 60_000)).toBe(false);
  });

  it('resets the count after the window elapses', () => {
    const key = `test-${Math.random()}`;
    expect(isRateLimited(key, 1, 10)).toBe(false);
    expect(isRateLimited(key, 1, 10)).toBe(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(isRateLimited(key, 1, 10)).toBe(false);
        resolve();
      }, 20);
    });
  });

  describe('bounded buckets map', () => {
    beforeEach(() => {
      _resetForTests();
    });

    it('sweeps expired buckets on access instead of letting them linger', () => {
      const staleKey = `stale-${Math.random()}`;
      isRateLimited(staleKey, 5, 5); // 5ms window — expires almost immediately
      expect(_bucketCountForTests()).toBe(1);

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          // Any access sweeps expired entries first, regardless of which
          // key is being queried.
          isRateLimited(`fresh-${Math.random()}`, 5, 60_000);
          // If the sweep ran, the expired staleKey bucket is gone and only
          // the fresh key remains; if it didn't, both would still be present.
          expect(_bucketCountForTests()).toBe(1);
          resolve();
        }, 20);
      });
    });

    it('caps the number of tracked buckets at MAX_BUCKETS', () => {
      for (let i = 0; i < MAX_BUCKETS + 50; i += 1) {
        isRateLimited(`cap-fill-${i}`, 5, 60_000);
      }
      expect(_bucketCountForTests()).toBe(MAX_BUCKETS);
    });

    it('evicts the oldest (least-recently-touched) bucket first', () => {
      for (let i = 0; i < MAX_BUCKETS; i += 1) {
        isRateLimited(`evict-order-${i}`, 5, 60_000);
      }
      expect(_bucketCountForTests()).toBe(MAX_BUCKETS);

      // Touch every key except the very first one, moving them to the
      // "recently used" end and leaving key 0 as the sole
      // least-recently-touched (oldest) entry.
      for (let i = 1; i < MAX_BUCKETS; i += 1) {
        isRateLimited(`evict-order-${i}`, 5, 60_000);
      }

      // One more distinct key pushes the map over the cap, forcing exactly
      // one eviction — it should take the untouched oldest key, not one of
      // the ones just refreshed.
      isRateLimited('evict-order-new', 5, 60_000);
      expect(_bucketCountForTests()).toBe(MAX_BUCKETS);

      // Check the refreshed key first: it still remembers its earlier hits
      // (fill + refresh = 2), so a 3rd hit against limit 2 is blocked. This
      // must run before the evict-order-0 check below, since that check
      // inserts a "new" key of its own (evict-order-0 was itself evicted)
      // and would otherwise trigger a second eviction that could reorder
      // things before we get to read evict-order-1's state.
      expect(isRateLimited('evict-order-1', 2, 60_000)).toBe(true);
      // The oldest key's bucket was evicted, so hitting it again starts a
      // fresh count (limit 1 is not yet exceeded on this 2nd-ever hit).
      expect(isRateLimited('evict-order-0', 1, 60_000)).toBe(false);
    });
  });
});
