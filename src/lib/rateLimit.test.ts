import { describe, it, expect } from 'vitest';
import { isRateLimited } from './rateLimit';

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
});
