/**
 * @vitest-environment node
 *
 * Route-level tests for POST /api/revalidate — the signed webhook target that
 * sinra-os calls when mum edits the menu.
 *
 * Coverage:
 * 1. Valid signature → 200, revalidates only allow-listed paths.
 * 2. Disallowed paths are filtered out (no arbitrary-route revalidation).
 * 3. Missing signature/timestamp headers → 401.
 * 4. Wrong signature → 401 and no revalidation.
 * 5. Tampered body (valid sig over a different body) → 401.
 * 6. Stale timestamp outside the replay window → 401.
 * 7. Secret not configured → 503 (fail-closed, service-not-configured gate).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createHmac } from 'node:crypto';
import { NextRequest } from 'next/server';

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
import { revalidatePath } from 'next/cache';
import { POST } from './route';

const SECRET = 'test-secret';

function sign(ts: number, body: string, secret = SECRET): string {
  return createHmac('sha256', secret).update(`${ts}.${body}`).digest('hex');
}

function makeReq(
  bodyObj: unknown,
  opts: { ts?: number; signature?: string; rawBody?: string; omitHeaders?: boolean } = {}
): NextRequest {
  const ts = opts.ts ?? Date.now();
  const body = opts.rawBody ?? JSON.stringify(bodyObj);
  const signature = opts.signature ?? sign(ts, JSON.stringify(bodyObj));
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (!opts.omitHeaders) {
    headers['x-sinra-timestamp'] = String(ts);
    headers['x-sinra-signature'] = signature;
  }
  return new NextRequest('https://sweetlife.cafe/api/revalidate', { method: 'POST', headers, body });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.SWEETLIFE_REVALIDATE_SECRET = SECRET;
});

describe('POST /api/revalidate', () => {
  it('revalidates allow-listed paths for a valid signature', async () => {
    const res = await POST(makeReq({ paths: ['/menu', '/'], ts: Date.now() }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toBe(true);
    expect(json.paths.sort()).toEqual(['/', '/menu']);
    expect(revalidatePath).toHaveBeenCalledWith('/menu');
    expect(revalidatePath).toHaveBeenCalledWith('/');
  });

  it('revalidates nothing when no allow-listed path matched', async () => {
    const res = await POST(makeReq({ paths: ['/admin'] }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.paths).toEqual([]);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('filters out non-allow-listed paths', async () => {
    const res = await POST(makeReq({ paths: ['/admin', '/menu'] }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.paths).toEqual(['/menu']);
    expect(revalidatePath).toHaveBeenCalledTimes(1);
    expect(revalidatePath).not.toHaveBeenCalledWith('/admin');
  });

  it('rejects a request with missing headers (401)', async () => {
    const res = await POST(makeReq({ paths: ['/menu'] }, { omitHeaders: true }));
    expect(res.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('rejects a wrong signature (401)', async () => {
    const res = await POST(makeReq({ paths: ['/menu'] }, { signature: 'deadbeef' }));
    expect(res.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('rejects a tampered body (401)', async () => {
    // Sign over the original body, then send a different raw body.
    const ts = Date.now();
    const signature = sign(ts, JSON.stringify({ paths: ['/menu'] }));
    const res = await POST(
      makeReq({ paths: ['/menu'] }, { ts, signature, rawBody: JSON.stringify({ paths: ['/', '/menu'] }) })
    );
    expect(res.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('rejects a stale timestamp (401)', async () => {
    const staleTs = Date.now() - 10 * 60 * 1000;
    const res = await POST(makeReq({ paths: ['/menu'] }, { ts: staleTs }));
    expect(res.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('returns 503 when the secret is not configured (fail closed, no revalidation)', async () => {
    delete process.env.SWEETLIFE_REVALIDATE_SECRET;
    const res = await POST(makeReq({ paths: ['/menu'] }));
    expect(res.status).toBe(503);
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
