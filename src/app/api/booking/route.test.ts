/**
 * @vitest-environment node
 *
 * Route-level tests for POST /api/booking.
 *
 * Coverage:
 * 1. Honeypot: a filled `website` field returns a fake success and never
 *    touches the intake fetch.
 * 2. Intake env vars absent → honest 503, no fake success.
 * 3. Intake fetch succeeds → 200 success, correct payload forwarded.
 * 4. Intake fetch returns a non-ok status → 502, honest error (no silent loss).
 * 5. Intake fetch throws (network error) → 502, honest error.
 * 6. Hostile JSON shapes for partySize (true / '0x10' / [8]) and a top-level
 *    array body → 400, and the intake fetch is never called.
 * 7. Rate limiting: requests beyond the per-IP cap in the window → 429.
 * 8. Rate limiting: malformed bodies are shape-rejected before the limiter
 *    ever sees them, so they don't consume a bucket slot.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

// A booking date safely in the future regardless of when this suite runs.
function futureDateString(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

function validBookingBody(overrides: Record<string, unknown> = {}) {
  return {
    fullName: 'Jane Doe',
    phone: '07123456789',
    partySize: 8,
    bookingDate: futureDateString(),
    bookingTime: '18:30',
    notes: '',
    ...overrides,
  };
}

function makeRequest(body: unknown, ip: string): NextRequest {
  return new NextRequest('http://localhost/api/booking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  });
}

const ORIGINAL_ENV = { ...process.env };
let ipCounter = 0;
// Each test gets its own IP so the module-level rate-limit bucket from one
// test never bleeds into another.
function freshIp(): string {
  ipCounter += 1;
  return `10.0.0.${ipCounter}`;
}

beforeEach(() => {
  vi.restoreAllMocks();
  delete process.env.SINRA_OS_INTAKE_URL;
  delete process.env.SINRA_INTAKE_SECRET;
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe('POST /api/booking — honeypot', () => {
  it('returns a fake success and never calls the intake fetch when the honeypot is filled', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    const request = makeRequest(validBookingBody({ website: 'http://spam.example' }), freshIp());

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe('POST /api/booking — intake unavailable', () => {
  it('returns an honest 503 when intake env vars are not configured, not a fake success', async () => {
    const request = makeRequest(validBookingBody(), freshIp());

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(503);
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/unavailable/i);
  });
});

describe('POST /api/booking — intake fetch outcomes', () => {
  beforeEach(() => {
    process.env.SINRA_OS_INTAKE_URL = 'https://sinra.example';
    process.env.SINRA_INTAKE_SECRET = 'test-secret';
  });

  it('returns 200 success and forwards the correct payload when intake succeeds', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );
    const request = makeRequest(validBookingBody({ fullName: 'Amy Smith' }), freshIp());

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe('https://sinra.example/api/intake/sweet-life-cafe/booking');
    expect(init?.headers).toMatchObject({ Authorization: 'Bearer test-secret' });
    const sentBody = JSON.parse(init?.body as string);
    expect(sentBody.full_name).toBe('Amy Smith');
  });

  it('returns an honest 502 (not fake success) when intake responds with a failure status', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response('boom', { status: 500 }));
    const request = makeRequest(validBookingBody(), freshIp());

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(502);
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/unavailable/i);
  });

  it('returns an honest 502 (not fake success) when the intake fetch throws', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('network down'));
    const request = makeRequest(validBookingBody(), freshIp());

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(502);
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/unavailable/i);
  });
});

describe('POST /api/booking — hostile JSON shapes', () => {
  it('rejects partySize: true with 400 and never calls the intake fetch', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    const request = makeRequest(validBookingBody({ partySize: true }), freshIp());

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("rejects partySize: '0x10' with 400", async () => {
    const request = makeRequest(validBookingBody({ partySize: '0x10' }), freshIp());
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
  });

  it('rejects partySize: [8] with 400', async () => {
    const request = makeRequest(validBookingBody({ partySize: [8] }), freshIp());
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
  });

  it('rejects a top-level array body with 400 instead of a 500', async () => {
    const request = makeRequest([8], freshIp());
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
  });

  it('rejects a non-string fullName with 400 instead of throwing a 500', async () => {
    const request = makeRequest(validBookingBody({ fullName: ['Jane'] }), freshIp());
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
  });
});

describe('POST /api/booking — rate limiting', () => {
  it('returns 429 after exceeding the per-IP request cap in the window', async () => {
    const ip = freshIp();
    let lastResponse;
    for (let i = 0; i < 6; i += 1) {
      const request = makeRequest(validBookingBody(), ip);
      lastResponse = await POST(request);
    }

    expect(lastResponse!.status).toBe(429);
    const json = await lastResponse!.json();
    expect(json.success).toBe(false);
  });

  it('does not rate limit a fresh IP', async () => {
    const request = makeRequest(validBookingBody(), freshIp());
    const response = await POST(request);
    // Intake isn't configured in this describe block, so this hits the
    // honest 503 path — the point here is only that it isn't 429.
    expect(response.status).not.toBe(429);
  });

  it('does not consume the rate-limit bucket for malformed (shape-invalid) bodies', async () => {
    const ip = freshIp();
    // 6 hostile-shaped requests from the same IP — if these allocated or
    // incremented a rate-limit bucket, the 6th (over the cap of 5) would
    // already trip 429 instead of 400.
    for (let i = 0; i < 6; i += 1) {
      const request = makeRequest(validBookingBody({ partySize: true }), ip);
      const response = await POST(request);
      expect(response.status).toBe(400);
    }

    // A single valid request from the same IP right after is still let
    // through (not 429), proving the hostile requests above never touched
    // the limiter.
    const validRequest = makeRequest(validBookingBody(), ip);
    const validResponse = await POST(validRequest);
    expect(validResponse.status).not.toBe(429);
  });
});
