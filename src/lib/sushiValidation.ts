import { SUSHI_OPENING_HOURS, type OpeningHours } from '@/data/sushiData';

/**
 * Returns ISO string formatted for datetime-local input, 24 hours from now.
 * Format: YYYY-MM-DDTHH:MM
 */
export function getMinDateTime(): string {
  const now = new Date();
  const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const year = minDate.getFullYear();
  const month = String(minDate.getMonth() + 1).padStart(2, '0');
  const day = String(minDate.getDate()).padStart(2, '0');
  const hours = String(minDate.getHours()).padStart(2, '0');
  const minutes = String(minDate.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Validates that the pickup datetime is at least 24 hours from now
 * and falls within sushi pickup opening hours.
 *
 * @param dateTimeString - ISO datetime string from datetime-local input
 * @returns Error message if invalid, empty string if valid
 */
export function validatePickupDateTime(dateTimeString: string): string {
  if (!dateTimeString) {
    return 'Please select a pickup date and time.';
  }

  const selectedDate = new Date(dateTimeString);

  // Reject unparseable input before any date arithmetic. Without this guard a
  // malformed string yields an Invalid Date whose getDay()/getHours() return
  // NaN, so SUSHI_OPENING_HOURS[dayNames[NaN]] is undefined and reading .start
  // throws a TypeError (surfaces as an opaque 500 from the order API route).
  if (Number.isNaN(selectedDate.getTime())) {
    return 'Please select a pickup date and time.';
  }

  const now = new Date();
  const minAllowedTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Check if date is at least 24 hours from now
  if (selectedDate < minAllowedTime) {
    return 'Please select a pickup time at least 24 hours from now to allow for preparation.';
  }

  // Get day of week (0 = Sunday, 1 = Monday, etc.)
  const dayOfWeek = selectedDate.getDay();
  const dayNames: (keyof OpeningHours)[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const dayName = dayNames[dayOfWeek];

  const selectedHour = selectedDate.getHours();
  const selectedMinutes = selectedDate.getMinutes();
  const selectedTimeInMinutes = selectedHour * 60 + selectedMinutes;

  const openingHours = SUSHI_OPENING_HOURS[dayName];
  const openTimeInMinutes = openingHours.start * 60;
  const closeTimeInMinutes = openingHours.end * 60;

  // Check if time falls within opening hours
  if (selectedTimeInMinutes < openTimeInMinutes || selectedTimeInMinutes >= closeTimeInMinutes) {
    const dayDisplayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

    if (dayName === 'sunday') {
      return `Collection is available on ${dayDisplayName}s from 12:00 PM to 5:00 PM. Please select a time within these hours.`;
    } else {
      return `Collection is available Monday-Saturday from 12:00 PM to 6:00 PM. Please select a time within these hours.`;
    }
  }

  return '';
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number (basic UK format check)
 */
export function validatePhone(phone: string): boolean {
  // Allow UK formats: +44..., 07..., 0..., or international formats
  const phoneRegex = /^(\+?\d{1,4}[\s-]?)?(\d{10,14})$/;
  const cleaned = phone.replace(/[\s-]/g, '');
  return phoneRegex.test(cleaned) && cleaned.length >= 10;
}

export interface SushiOrderFormData {
  fullName: string;
  phone: string;
  email: string;
  pickupDateTime: string;
  specialRequests: string;
  variation: string;
  pieces: number;
  price: number;
}

/**
 * Server-side validation for sushi order form data.
 * Returns an array of error messages, empty if valid.
 */
export function validateSushiOrder(data: SushiOrderFormData): string[] {
  const errors: string[] = [];

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.push('Full name is required.');
  }

  if (!data.phone || !validatePhone(data.phone)) {
    errors.push('Valid phone number is required.');
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push('Valid email address is required.');
  }

  const dateTimeError = validatePickupDateTime(data.pickupDateTime);
  if (dateTimeError) {
    errors.push(dateTimeError);
  }

  if (!data.variation || !['Meat', 'Seafood', 'Vegan', 'Mix'].includes(data.variation)) {
    errors.push('Please select a valid sushi variation.');
  }

  if (!data.pieces || ![8, 16, 20, 30, 50].includes(data.pieces)) {
    errors.push('Please select a valid quantity.');
  }

  return errors;
}
