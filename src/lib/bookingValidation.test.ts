import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getMinDate,
  validatePhone,
  validateBookingDate,
  validateBookingTime,
  validateBookingRequest,
  parseBookingPayload,
  type BookingFormData,
} from './bookingValidation';
import { venueInfo } from '@/data/bookingsData';

// Fixed "now": Wednesday 2026-06-24, local time.
const NOW = new Date('2026-06-24T10:00:00');

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

function validBooking(overrides: Partial<BookingFormData> = {}): BookingFormData {
  return {
    fullName: 'Jane Doe',
    phone: '07123456789',
    partySize: 8,
    bookingDate: '2026-06-25',
    bookingTime: '18:30',
    notes: '',
    ...overrides,
  };
}

describe('getMinDate', () => {
  it('returns today as YYYY-MM-DD', () => {
    expect(getMinDate()).toBe('2026-06-24');
  });

  it('zero-pads month and day', () => {
    vi.setSystemTime(new Date('2026-01-05T08:00:00'));
    expect(getMinDate()).toBe('2026-01-05');
  });
});

describe('validatePhone', () => {
  it('accepts a UK mobile starting 07', () => {
    expect(validatePhone('07123456789')).toBe(true);
  });

  it('accepts an international +44 number with spaces', () => {
    expect(validatePhone('+44 7123 456789')).toBe(true);
  });

  it('rejects a number that is too short', () => {
    expect(validatePhone('12345')).toBe(false);
  });

  it('rejects letters', () => {
    expect(validatePhone('not-a-phone')).toBe(false);
  });
});

describe('validateBookingDate', () => {
  it('rejects an empty value', () => {
    expect(validateBookingDate('')).toBe('Please select a preferred date.');
  });

  it('rejects an unparseable date string without throwing', () => {
    expect(() => validateBookingDate('not-a-date')).not.toThrow();
    expect(validateBookingDate('not-a-date')).toBe('Please select a valid date.');
    expect(validateBookingDate('2026-13-45')).toBe('Please select a valid date.');
  });

  it('rejects an impossible calendar date that Date silently rolls over', () => {
    // 2027-02-30 doesn't exist; Date normalizes it to 2027-03-02 instead of
    // throwing, so a plain parseability check would wrongly accept it.
    expect(validateBookingDate('2027-02-30')).toBe('Please select a valid date.');
  });

  it('rejects Feb 29 in a non-leap year', () => {
    expect(validateBookingDate('2027-02-29')).toBe('Please select a valid date.');
  });

  it('accepts Feb 29 in a leap year', () => {
    expect(validateBookingDate('2028-02-29')).toBe('');
  });

  it('rejects a date in the past', () => {
    expect(validateBookingDate('2026-06-23')).toBe(
      'Please select a date that is not in the past.'
    );
  });

  it('accepts today', () => {
    expect(validateBookingDate('2026-06-24')).toBe('');
  });

  it('accepts a future date', () => {
    expect(validateBookingDate('2026-07-01')).toBe('');
  });
});

describe('validateBookingTime', () => {
  it('rejects an empty value', () => {
    expect(validateBookingTime('')).toBe('Please select a preferred time.');
  });

  it('rejects a malformed value without throwing', () => {
    expect(() => validateBookingTime('not-a-time')).not.toThrow();
    expect(validateBookingTime('25:99')).toBe('Please select a valid time.');
    expect(validateBookingTime('9:30')).toBe('Please select a valid time.');
  });

  it('accepts a valid 24-hour time', () => {
    expect(validateBookingTime('18:30')).toBe('');
  });

  it('accepts midnight', () => {
    expect(validateBookingTime('00:00')).toBe('');
  });
});

describe('validateBookingRequest', () => {
  it('accepts a fully valid booking without an email', () => {
    expect(validateBookingRequest(validBooking())).toEqual([]);
  });

  it('accepts an empty optional email', () => {
    expect(validateBookingRequest(validBooking({ email: '' }))).toEqual([]);
  });

  it('accepts a valid optional email', () => {
    expect(validateBookingRequest(validBooking({ email: 'jane@example.com' }))).toEqual([]);
  });

  it('rejects a missing/short name', () => {
    expect(validateBookingRequest(validBooking({ fullName: 'J' }))).toContain(
      'Full name is required.'
    );
  });

  it('rejects an invalid phone', () => {
    expect(validateBookingRequest(validBooking({ phone: '123' }))).toContain(
      'Valid phone number is required.'
    );
  });

  it('rejects an invalid optional email with a plain-English message', () => {
    expect(validateBookingRequest(validBooking({ email: 'not-an-email' }))).toContain(
      'Please enter a valid email address.'
    );
  });

  it('rejects an optional email over 254 characters', () => {
    const email = `${'a'.repeat(243)}@example.com`;
    expect(validateBookingRequest(validBooking({ email }))).toContain(
      'Email must be 254 characters or fewer.'
    );
  });

  it('rejects a zero or negative party size', () => {
    expect(validateBookingRequest(validBooking({ partySize: 0 }))).toContain(
      'Please enter a valid party size.'
    );
    expect(validateBookingRequest(validBooking({ partySize: -5 }))).toContain(
      'Please enter a valid party size.'
    );
  });

  it('rejects a non-integer party size', () => {
    expect(validateBookingRequest(validBooking({ partySize: 4.5 }))).toContain(
      'Please enter a valid party size.'
    );
  });

  it('rejects a party size over the venue capacity with a friendly message', () => {
    const errors = validateBookingRequest(validBooking({ partySize: venueInfo.capacity + 1 }));
    expect(errors).toContain(
      `Our private space seats up to ${venueInfo.capacity} guests. For larger groups, please contact us directly.`
    );
  });

  it('accepts a party size at exactly the venue capacity', () => {
    expect(validateBookingRequest(validBooking({ partySize: venueInfo.capacity }))).toEqual([]);
  });

  it('rejects an absurdly large party size', () => {
    const errors = validateBookingRequest(validBooking({ partySize: 501 }));
    expect(errors).toContain(
      `Our private space seats up to ${venueInfo.capacity} guests. For larger groups, please contact us directly.`
    );
  });

  it('rejects a past date', () => {
    const errors = validateBookingRequest(validBooking({ bookingDate: '2026-01-01' }));
    expect(errors).toContain('Please select a date that is not in the past.');
  });

  it('rejects an invalid time', () => {
    const errors = validateBookingRequest(validBooking({ bookingTime: '99:99' }));
    expect(errors).toContain('Please select a valid time.');
  });

  it('rejects a note over 1000 characters', () => {
    const errors = validateBookingRequest(validBooking({ notes: 'x'.repeat(1001) }));
    expect(errors).toContain('Note must be 1000 characters or fewer.');
  });

  it('accepts a note at exactly 1000 characters', () => {
    expect(validateBookingRequest(validBooking({ notes: 'x'.repeat(1000) }))).toEqual([]);
  });

  it('accepts an empty note', () => {
    expect(validateBookingRequest(validBooking({ notes: '' }))).toEqual([]);
  });

  it('collects multiple errors at once', () => {
    const errors = validateBookingRequest(
      validBooking({ fullName: '', phone: '', partySize: 0 })
    );
    expect(errors.length).toBeGreaterThanOrEqual(3);
  });
});

describe('parseBookingPayload', () => {
  const validBody = () => ({
    fullName: 'Jane Doe',
    phone: '07123456789',
    partySize: 8,
    bookingDate: '2026-06-25',
    bookingTime: '18:30',
    notes: 'A note',
  });

  it('parses a well-formed payload', () => {
    const result = parseBookingPayload(validBody());
    expect(result).toEqual({
      data: {
        fullName: 'Jane Doe',
        phone: '07123456789',
        partySize: 8,
        bookingDate: '2026-06-25',
        bookingTime: '18:30',
        notes: 'A note',
      },
    });
  });

  it('trims an optional email address when present', () => {
    const result = parseBookingPayload({
      ...validBody(),
      email: '  jane@example.com  ',
    });
    expect(result).toEqual({ data: expect.objectContaining({ email: 'jane@example.com' }) });
  });

  it('accepts a numeric-string partySize', () => {
    const result = parseBookingPayload({ ...validBody(), partySize: '8' });
    expect(result).toEqual({ data: expect.objectContaining({ partySize: 8 }) });
  });

  it('defaults a missing notes field to an empty string', () => {
    const body = validBody();
    delete (body as { notes?: string }).notes;
    const result = parseBookingPayload(body);
    expect(result).toEqual({ data: expect.objectContaining({ notes: '' }) });
  });

  it('rejects a top-level array body', () => {
    expect(parseBookingPayload([8])).toEqual({ errors: ['Invalid request body.'] });
  });

  it('rejects a null body', () => {
    expect(parseBookingPayload(null)).toEqual({ errors: ['Invalid request body.'] });
  });

  it('rejects a non-object body', () => {
    expect(parseBookingPayload('hello')).toEqual({ errors: ['Invalid request body.'] });
  });

  it('rejects partySize: true (boolean coerces via Number() but is not a real party size)', () => {
    const result = parseBookingPayload({ ...validBody(), partySize: true });
    expect(result).toEqual({ errors: ['Please enter a valid party size.'] });
  });

  it('rejects partySize: "0x10" (hex string coerces via Number() but is not a decimal party size)', () => {
    const result = parseBookingPayload({ ...validBody(), partySize: '0x10' });
    expect(result).toEqual({ errors: ['Please enter a valid party size.'] });
  });

  it('rejects partySize: [8] (single-element array coerces via Number() but is not a party size)', () => {
    const result = parseBookingPayload({ ...validBody(), partySize: [8] });
    expect(result).toEqual({ errors: ['Please enter a valid party size.'] });
  });

  it('rejects a non-integer partySize', () => {
    const result = parseBookingPayload({ ...validBody(), partySize: 4.5 });
    expect(result).toEqual({ errors: ['Please enter a valid party size.'] });
  });

  it('rejects a non-string fullName instead of throwing downstream', () => {
    const result = parseBookingPayload({ ...validBody(), fullName: ['Jane'] });
    expect(result).toEqual({ errors: ['Invalid request body.'] });
  });

  it('rejects a non-string phone instead of throwing downstream', () => {
    const result = parseBookingPayload({ ...validBody(), phone: 447123456789 });
    expect(result).toEqual({ errors: ['Invalid request body.'] });
  });

  it('rejects a non-string bookingDate', () => {
    const result = parseBookingPayload({ ...validBody(), bookingDate: 20260625 });
    expect(result).toEqual({ errors: ['Invalid request body.'] });
  });

  it('rejects a non-string notes field', () => {
    const result = parseBookingPayload({ ...validBody(), notes: { nested: true } });
    expect(result).toEqual({ errors: ['Invalid request body.'] });
  });
});
