import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getMinDate,
  validatePhone,
  validateBookingDate,
  validateBookingTime,
  validateBookingRequest,
  type BookingFormData,
} from './bookingValidation';

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
  it('accepts a fully valid booking', () => {
    expect(validateBookingRequest(validBooking())).toEqual([]);
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

  it('rejects an absurdly large party size', () => {
    expect(validateBookingRequest(validBooking({ partySize: 501 }))).toContain(
      'Please enter a valid party size.'
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
