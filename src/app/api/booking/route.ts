import { NextRequest, NextResponse } from 'next/server';
import { validateBookingRequest, type BookingFormData } from '@/lib/bookingValidation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const bookingData: BookingFormData = {
      fullName: body.fullName,
      phone: body.phone,
      partySize: Number(body.partySize),
      bookingDate: body.bookingDate,
      bookingTime: body.bookingTime,
      notes: body.notes || '',
    };

    // Server-side validation
    const errors = validateBookingRequest(bookingData);
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors.join(' ') },
        { status: 400 }
      );
    }

    // Fire-and-forget: POST booking data to sinra-os intake for the ops inbox.
    // Non-blocking, and a genuine no-op (flag-off placeholder) until
    // SINRA_OS_INTAKE_URL + SINRA_INTAKE_SECRET are provisioned — no outbound
    // notification of any kind fires from this route until then. Same pattern
    // as the contact/sushi-order handlers (see sinra-os
    // src/app/api/intake/[businessSlug]/[channel]/route.ts, channel: 'booking').
    const intakeUrl = process.env.SINRA_OS_INTAKE_URL;
    const intakeSecret = process.env.SINRA_INTAKE_SECRET;
    if (intakeUrl && intakeSecret) {
      fetch(`${intakeUrl}/api/intake/sweet-life-cafe/booking`, {
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
      }).catch(err => console.error('[booking] intake POST failed (non-fatal):', err));
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
