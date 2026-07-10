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
 */
export function validateBookingDate(dateString: string): string {
  if (!dateString) {
    return 'Please select a preferred date.';
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return 'Please select a valid date.';
  }

  const selectedDate = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(selectedDate.getTime())) {
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

  if (
    !data.partySize ||
    !Number.isInteger(data.partySize) ||
    data.partySize < 1 ||
    data.partySize > 500
  ) {
    errors.push('Please enter a valid party size.');
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
