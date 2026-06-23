import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validateContactForm,
  type ContactFormData,
} from './contactValidation';

describe('validateEmail', () => {
  it('accepts a well-formed address', () => {
    expect(validateEmail('hello@sweetlife.cafe')).toBe(true);
  });

  it('trims surrounding whitespace before validating', () => {
    expect(validateEmail('  hello@sweetlife.cafe  ')).toBe(true);
  });

  it('rejects an address with no @', () => {
    expect(validateEmail('hello.sweetlife.cafe')).toBe(false);
  });

  it('rejects an address with no domain dot', () => {
    expect(validateEmail('hello@sweetlife')).toBe(false);
  });

  it('rejects an address with internal whitespace', () => {
    expect(validateEmail('hel lo@sweetlife.cafe')).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(validateEmail('')).toBe(false);
  });
});

function makeContact(overrides: Partial<ContactFormData> = {}): ContactFormData {
  return {
    name: 'Jane Doe',
    email: 'jane@example.com',
    subject: 'Hello',
    message: 'I would like to ask about catering options please.',
    ...overrides,
  };
}

describe('validateContactForm', () => {
  it('returns no errors for a fully valid form', () => {
    expect(validateContactForm(makeContact())).toEqual([]);
  });

  it('does not require a subject', () => {
    expect(validateContactForm(makeContact({ subject: '' }))).toEqual([]);
  });

  it('flags a missing name', () => {
    expect(validateContactForm(makeContact({ name: '' }))).toContain(
      'Name is required.'
    );
  });

  it('flags a name that is only whitespace as required', () => {
    expect(validateContactForm(makeContact({ name: '   ' }))).toContain(
      'Name is required.'
    );
  });

  it('flags a name that is too short', () => {
    expect(validateContactForm(makeContact({ name: 'A' }))).toContain(
      'Name must be at least 2 characters.'
    );
  });

  it('flags a missing email', () => {
    expect(validateContactForm(makeContact({ email: '' }))).toContain(
      'Email is required.'
    );
  });

  it('flags a malformed email', () => {
    expect(validateContactForm(makeContact({ email: 'not-an-email' }))).toContain(
      'Please enter a valid email address.'
    );
  });

  it('flags a missing message', () => {
    expect(validateContactForm(makeContact({ message: '' }))).toContain(
      'Message is required.'
    );
  });

  it('flags a message shorter than 10 characters', () => {
    expect(validateContactForm(makeContact({ message: 'short' }))).toContain(
      'Message must be at least 10 characters.'
    );
  });

  it('counts message length after trimming', () => {
    expect(
      validateContactForm(makeContact({ message: '   short    ' }))
    ).toContain('Message must be at least 10 characters.');
  });

  it('accumulates multiple errors at once', () => {
    const errors = validateContactForm(
      makeContact({ name: '', email: 'bad', message: '' })
    );
    expect(errors).toHaveLength(3);
  });
});
