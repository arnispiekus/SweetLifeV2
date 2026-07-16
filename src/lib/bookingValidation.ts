import { venueInfo } from '@/data/bookingsData';
import { validateEmail } from '@/lib/contactValidation';

/**
 * Returns today's date as YYYY-MM-DD, for use as the `min` on a date input
 * so a booking preference can't be submitted for a date that has passed.
 */
export function getMinDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Validates phone number (basic UK format check).
 * Same rule as the sushi order form (src/lib/sushiValidation.ts).
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(\+?\d{1,4}[\s-]?)?(\d{10,14})$/;
  const cleaned = phone.replace(/[\s-]/g, '');
  return phoneRegex.test(cleaned) && cleaned.length >= 10;
}

/**
 * Validates that a booking date is a real calendar date and not in the past.
 * Accepts the YYYY-MM-DD format produced by an <input type="date">.
 *
 * JavaScript's Date silently rolls invalid components forward (e.g.
 * 2027-02-30 becomes 2027-03-02), so a plain parseability check isn't
 * enough — round-trip the parsed date back to year/month/day and confirm
 * it matches what was submitted before accepting it.
 */
export function validateBookingDate(dateString: string): string {
  if (!dateString) {
    return 'Please select a preferred date.';
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
  if (!match) {
    return 'Please select a valid date.';
  }

  const [, yearStr, monthStr, dayStr] = match;
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const selectedDate = new Date(`${dateString}T00:00:00`);
  const isRealCalendarDate =
    !Number.isNaN(selectedDate.getTime()) &&
    selectedDate.getFullYear() === year &&
    selectedDate.getMonth() + 1 === month &&
    selectedDate.getDate() === day;

  if (!isRealCalendarDate) {
    return 'Please select a valid date.';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return 'Please select a date that is not in the past.';
  }

  return '';
}

/**
 * Validates that a booking time is a real HH:MM value.
 * Accepts the 24-hour format produced by an <input type="time">.
 */
export function validateBookingTime(timeString: string): string {
  if (!timeString) {
    return 'Please select a preferred time.';
  }

  if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(timeString)) {
    return 'Please select a valid time.';
  }

  return '';
}

export interface BookingFormData {
  fullName: string;
  phone: string;
  email?: string;
  partySize: number;
  bookingDate: string;
  bookingTime: string;
  notes: string;
}

/**
 * Server-side validation for a booking request. Returns an array of error
 * messages, empty if valid. This is an enquiry (mum confirms availability
 * manually), so dates/times are checked for validity only, not against an
 * opening-hours table.
 */
export function validateBookingRequest(data: BookingFormData): string[] {
  const errors: string[] = [];

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.push('Full name is required.');
  }

  if (!data.phone || !validatePhone(data.phone)) {
    errors.push('Valid phone number is required.');
  }

  const email = data.email?.trim();
  if (email && email.length > 254) {
    errors.push('Email must be 254 characters or fewer.');
  } else if (email && !validateEmail(email)) {
    errors.push('Please enter a valid email address.');
  }

  if (!data.partySize || !Number.isInteger(data.partySize) || data.partySize < 1) {
    errors.push('Please enter a valid party size.');
  } else if (data.partySize > venueInfo.capacity) {
    errors.push(
      `Our private space seats up to ${venueInfo.capacity} guests. For larger groups, please contact us directly.`
    );
  }

  const dateError = validateBookingDate(data.bookingDate);
  if (dateError) {
    errors.push(dateError);
  }

  const timeError = validateBookingTime(data.bookingTime);
  if (timeError) {
    errors.push(timeError);
  }

  if (data.notes && data.notes.length > 1000) {
    errors.push('Note must be 1000 characters or fewer.');
  }

  return errors;
}

/**
 * Strictly parses `partySize` from a raw JSON body. Unlike `Number(value)`,
 * this refuses to coerce non-numeric shapes — `Number(true) === 1`,
 * `Number('0x10') === 16`, and `Number([8]) === 8` all silently produce a
 * "valid" party size from hostile input. Returns null for anything that
 * isn't a plain integer or a base-10 digit string.
 */
function parsePartySize(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value : null;
  }
  if (typeof value === 'string' && /^\d+$/.test(value.trim())) {
    return parseInt(value, 10);
  }
  return null;
}

export type ParsedBookingPayload =
  | { data: BookingFormData }
  | { errors: string[] };

/**
 * Type-checks a raw request body into `BookingFormData` before any semantic
 * validation runs. The previous route trusted the TypeScript type
 * annotation at runtime (`body.fullName`, `Number(body.partySize)`, …), so
 * arrays, booleans, and hex-like strings could coerce into "valid" fields
 * and non-string name/phone values threw uncaught 500s instead of a clean
 * 400. This is the route boundary guard: every field's runtime type is
 * checked explicitly before it's trusted.
 */
export function parseBookingPayload(body: unknown): ParsedBookingPayload {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { errors: ['Invalid request body.'] };
  }

  const record = body as Record<string, unknown>;
  const { fullName, phone, email, bookingDate, bookingTime, notes } = record;

  if (
    typeof fullName !== 'string' ||
    typeof phone !== 'string' ||
    typeof bookingDate !== 'string' ||
    typeof bookingTime !== 'string'
  ) {
    return { errors: ['Invalid request body.'] };
  }

  if (notes !== undefined && notes !== null && typeof notes !== 'string') {
    return { errors: ['Invalid request body.'] };
  }

  if (email !== undefined && email !== null && typeof email !== 'string') {
    return { errors: ['Invalid request body.'] };
  }

  const partySize = parsePartySize(record.partySize);
  if (partySize === null) {
    return { errors: ['Please enter a valid party size.'] };
  }

  return {
    data: {
      fullName,
      phone,
      email: typeof email === 'string' && email.trim() ? email.trim() : undefined,
      partySize,
      bookingDate,
      bookingTime,
      notes: typeof notes === 'string' ? notes : '',
    },
  };
}
