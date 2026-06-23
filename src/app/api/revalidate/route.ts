import { createHmac, timingSafeEqual } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import type { NextRequest } from 'next/server';

// node:crypto requires Node.js runtime (not Edge)
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const secret = process.env.SWEETLIFE_REVALIDATE_SECRET;
  if (!secret) {
    console.error('[revalidate] SWEETLIFE_REVALIDATE_SECRET not set');
    return Response.json({ error: 'misconfigured' }, { status: 500 });
  }

  const timestampMs = parseInt(req.headers.get('x-sinra-timestamp') ?? '0', 10);
  const signature = req.headers.get('x-sinra-signature') ?? '';

  // 5-minute replay window — reject stale or missing timestamps
  if (!timestampMs || Math.abs(Date.now() - timestampMs) > 5 * 60 * 1000) {
    return Response.json({ error: 'timestamp_expired' }, { status: 401 });
  }

  const rawBody = await req.text();

  // HMAC-SHA-256 over "${timestampMs}.${rawBody}" — same computation as sinra-os sender
  const expected = createHmac('sha256', secret)
    .update(`${timestampMs}.${rawBody}`)
    .digest('hex');

  // Constant-time comparison prevents timing attacks
  const sigBuffer = Buffer.from(signature, 'hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  if (
    sigBuffer.length === 0 ||
    sigBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    return Response.json({ error: 'invalid_signature' }, { status: 401 });
  }

  let body: { paths?: string[] };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const paths = body.paths ?? ['/'];
  for (const path of paths) {
    revalidatePath(path);
  }

  return Response.json({ ok: true, revalidated: paths });
}
