import { NextRequest, NextResponse } from 'next/server';
import { validateBookingRequest, parseBookingPayload } from '@/lib/bookingValidation';
import { isRateLimited } from '@/lib/rateLimit';

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;
const UNAVAILABLE_MESSAGE =
  'Booking system unavailable right now — please call or WhatsApp us on +447716508513 to book.';

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot: `website` is a hidden field a human never fills in but a
    // scripted bot often does. Report success without doing anything, so
    // the bot doesn't learn it was caught and adjust.
    if (
      typeof body === 'object' &&
      body !== null &&
      !Array.isArray(body) &&
      (body as Record<string, unknown>).website
    ) {
      return NextResponse.json({
        success: true,
        message: 'Booking request submitted successfully',
      });
    }

    const ip = getClientIp(request);
    if (isRateLimited(`booking:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please wait a minute and try again, or call/WhatsApp us directly.',
        },
        { status: 429 }
      );
    }

    const parsed = parseBookingPayload(body);
    if ('errors' in parsed) {
      return NextResponse.json(
        { success: false, error: parsed.errors.join(' ') },
        { status: 400 }
      );
    }
    const bookingData = parsed.data;

    // Server-side validation
    const errors = validateBookingRequest(bookingData);
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors.join(' ') },
        { status: 400 }
      );
    }

    // POST booking data to sinra-os intake for the ops inbox. This is the
    // only persistence for a booking request — it must be awaited and its
    // result checked, or a failure here is silent data loss (the customer
    // sees "success" and never gets a booking).
    const intakeUrl = process.env.SINRA_OS_INTAKE_URL;
    const intakeSecret = process.env.SINRA_INTAKE_SECRET;

    if (!intakeUrl || !intakeSecret) {
      console.error('[booking] intake not configured — SINRA_OS_INTAKE_URL/SINRA_INTAKE_SECRET missing');
      return NextResponse.json(
        { success: false, error: UNAVAILABLE_MESSAGE },
        { status: 503 }
      );
    }

    let intakeResponse: Response;
    try {
      intakeResponse = await fetch(`${intakeUrl}/api/intake/sweet-life-cafe/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${intakeSecret}`,
        },
        body: JSON.stringify({
          full_name: bookingData.fullName,
          phone: bookingData.phone,
          party_size: bookingData.partySize,
          booking_date: bookingData.bookingDate,
          booking_time: bookingData.bookingTime,
          notes: bookingData.notes,
        }),
        signal: AbortSignal.timeout(8000),
      });
    } catch (err) {
      console.error('[booking] intake POST failed:', err);
      return NextResponse.json(
        { success: false, error: UNAVAILABLE_MESSAGE },
        { status: 502 }
      );
    }

    if (!intakeResponse.ok) {
      console.error('[booking] intake POST returned', intakeResponse.status);
      return NextResponse.json(
        { success: false, error: UNAVAILABLE_MESSAGE },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Booking request submitted successfully',
    });
  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
