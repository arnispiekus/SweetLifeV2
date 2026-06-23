import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getMinDateTime,
  validatePickupDateTime,
  validateEmail,
  validatePhone,
  validateSushiOrder,
  type SushiOrderFormData,
} from './sushiValidation';

// Fixed "now": Wednesday 2026-06-24 10:00 local time.
// Opening hours are Mon-Sat 12:00-18:00, Sun 12:00-17:00.
const NOW = new Date('2026-06-24T10:00:00');

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('getMinDateTime', () => {
  it('returns a datetime-local string exactly 24 hours ahead', () => {
    // NOW + 24h = Thursday 2026-06-25 10:00
    expect(getMinDateTime()).toBe('2026-06-25T10:00');
  });

  it('zero-pads month, day, hour and minute', () => {
    vi.setSystemTime(new Date('2026-01-05T08:07:00'));
    // +24h = 2026-01-06 08:07
    expect(getMinDateTime()).toBe('2026-01-06T08:07');
  });
});

describe('validateEmail', () => {
  it('accepts a valid address', () => {
    expect(validateEmail('a@b.co')).toBe(true);
  });

  it('rejects an address without a dot in the domain', () => {
    expect(validateEmail('a@b')).toBe(false);
  });

  it('rejects an address with whitespace', () => {
    expect(validateEmail('a b@c.co')).toBe(false);
  });
});

describe('validatePhone', () => {
  it('accepts a UK mobile starting 07', () => {
    expect(validatePhone('07123456789')).toBe(true);
  });

  it('accepts an international +44 number with spaces', () => {
    expect(validatePhone('+44 7123 456789')).toBe(true);
  });

  it('accepts a number with dashes', () => {
    expect(validatePhone('028-9012-3456')).toBe(true);
  });

  it('rejects a number that is too short', () => {
    expect(validatePhone('12345')).toBe(false);
  });

  it('rejects letters', () => {
    expect(validatePhone('not-a-phone')).toBe(false);
  });
});

describe('validatePickupDateTime', () => {
  it('rejects an empty value', () => {
    expect(validatePickupDateTime('')).toBe(
      'Please select a pickup date and time.'
    );
  });

  it('rejects a time less than 24 hours away', () => {
    // Same day, a couple of hours ahead.
    expect(validatePickupDateTime('2026-06-24T14:00')).toBe(
      'Please select a pickup time at least 24 hours from now to allow for preparation.'
    );
  });

  it('accepts a weekday pickup inside opening hours and >=24h away', () => {
    // Thursday 2026-06-25 13:00 -> 27h away, within 12-18.
    expect(validatePickupDateTime('2026-06-25T13:00')).toBe('');
  });

  it('rejects a weekday pickup before opening (11:00)', () => {
    expect(validatePickupDateTime('2026-06-26T11:00')).toBe(
      'Collection is available Monday-Saturday from 12:00 PM to 6:00 PM. Please select a time within these hours.'
    );
  });

  it('rejects a weekday pickup at exactly closing time (18:00, exclusive end)', () => {
    expect(validatePickupDateTime('2026-06-26T18:00')).toBe(
      'Collection is available Monday-Saturday from 12:00 PM to 6:00 PM. Please select a time within these hours.'
    );
  });

  it('accepts a weekday pickup at exactly opening time (12:00, inclusive start)', () => {
    expect(validatePickupDateTime('2026-06-26T12:00')).toBe('');
  });

  it('rejects a Sunday pickup after 17:00 with the Sunday-specific message', () => {
    // Sunday 2026-06-28 17:30 -> Sunday closes at 17:00.
    expect(validatePickupDateTime('2026-06-28T17:30')).toBe(
      'Collection is available on Sundays from 12:00 PM to 5:00 PM. Please select a time within these hours.'
    );
  });

  it('accepts a Sunday pickup inside Sunday hours', () => {
    // Sunday 2026-06-28 16:00 -> within 12-17.
    expect(validatePickupDateTime('2026-06-28T16:00')).toBe('');
  });
});

function makeOrder(overrides: Partial<SushiOrderFormData> = {}): SushiOrderFormData {
  return {
    fullName: 'Jane Doe',
    phone: '07123456789',
    email: 'jane@example.com',
    pickupDateTime: '2026-06-25T13:00', // Thursday, valid window, >=24h
    specialRequests: '',
    variation: 'Mix',
    pieces: 16,
    price: 25,
    ...overrides,
  };
}

describe('validateSushiOrder', () => {
  it('returns no errors for a fully valid order', () => {
    expect(validateSushiOrder(makeOrder())).toEqual([]);
  });

  it('flags a too-short name', () => {
    expect(validateSushiOrder(makeOrder({ fullName: 'J' }))).toContain(
      'Full name is required.'
    );
  });

  it('flags an invalid phone', () => {
    expect(validateSushiOrder(makeOrder({ phone: '123' }))).toContain(
      'Valid phone number is required.'
    );
  });

  it('flags an invalid email', () => {
    expect(validateSushiOrder(makeOrder({ email: 'nope' }))).toContain(
      'Valid email address is required.'
    );
  });

  it('flags an unknown variation', () => {
    expect(validateSushiOrder(makeOrder({ variation: 'Dragon' }))).toContain(
      'Please select a valid sushi variation.'
    );
  });

  it('flags an unsupported piece count', () => {
    expect(validateSushiOrder(makeOrder({ pieces: 12 }))).toContain(
      'Please select a valid quantity.'
    );
  });

  it('propagates the pickup datetime error', () => {
    expect(validateSushiOrder(makeOrder({ pickupDateTime: '' }))).toContain(
      'Please select a pickup date and time.'
    );
  });

  it('accumulates multiple errors', () => {
    const errors = validateSushiOrder(
      makeOrder({ fullName: '', phone: '1', email: 'x', variation: 'Z', pieces: 3 })
    );
    expect(errors.length).toBeGreaterThanOrEqual(5);
  });
});
