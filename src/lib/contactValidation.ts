export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Validates an email address format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates the contact form data and returns an array of error messages
 */
export function validateContactForm(data: ContactFormData): string[] {
  const errors: string[] = [];

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required.');
  } else if (data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters.');
  }

  // Email validation
  if (!data.email || data.email.trim().length === 0) {
    errors.push('Email is required.');
  } else if (!validateEmail(data.email)) {
    errors.push('Please enter a valid email address.');
  }

  // Message validation
  if (!data.message || data.message.trim().length === 0) {
    errors.push('Message is required.');
  } else if (data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters.');
  }

  // Subject is optional, no validation needed

  return errors;
}
