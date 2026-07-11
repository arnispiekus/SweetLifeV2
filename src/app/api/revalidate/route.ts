import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';

// node:crypto requires the Node.js runtime (not Edge).
export const runtime = 'nodejs';

// Only these public paths may be revalidated by the webhook — a compromised or
// buggy caller cannot force revalidation of arbitrary routes.
const ALLOWED_PATHS = new Set(['/', '/menu', '/specialty-menu']);

// Reject timestamps outside this window to blunt replay of a captured request.
const MAX_SKEW_MS = 5 * 60 * 1000;

/**
 * Signed revalidate webhook target for sinra-os (mum's admin app).
 *
 * sinra-os signs `${timestampMs}.${rawBody}` with HMAC-SHA-256 using the shared
 * SWEETLIFE_REVALIDATE_SECRET and sends the signature + timestamp as headers.
 * We recompute over the exact raw body and constant-time compare before
 * revalidating any allow-listed path. This mirrors sendRevalidateWebhook() in
 * sinra-os (src/lib/menu/revalidate.ts).
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.SWEETLIFE_REVALIDATE_SECRET;
  if (!secret) {
    // Fail closed on an explicit "service not configured" gate: 503, not 500.
    // No revalidation happens, so the current ISR page stands and refreshes
    // naturally on its 300s window — the webhook simply has no effect.
    console.error('[revalidate] SWEETLIFE_REVALIDATE_SECRET not set');
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }

  const timestamp = req.headers.get('x-sinra-timestamp');
  const signature = req.headers.get('x-sinra-signature');
  if (!timestamp || !signature) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Replay window check on the timestamp.
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Date.now() - ts) > MAX_SKEW_MS) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Read the raw body and verify the signature over `${ts}.${rawBody}`.
  const rawBody = await req.text();
  const expected = createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex');

  const sigBuf = Buffer.from(signature, 'hex');
  const expBuf = Buffer.from(expected, 'hex');
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Signature valid — parse the (already-authenticated) body for paths.
  let paths: unknown;
  try {
    paths = (JSON.parse(rawBody) as { paths?: unknown }).paths;
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  const requested = Array.isArray(paths) ? paths.filter((p): p is string => typeof p === 'string') : [];
  const revalidated = requested.filter((p) => ALLOWED_PATHS.has(p));
  // revalidatePath purges the route's Full Route + Data Cache, so the next
  // /menu render re-runs the sinra fetch (getMenuCategories) with fresh data
  // rather than re-serving the previously cached upstream response.
  for (const p of revalidated) revalidatePath(p);

  return NextResponse.json({ revalidated: true, paths: revalidated });
}
