'use client';

import { useState } from 'react';
import { Send, Users, Calendar, Clock } from 'lucide-react';
import { validateBookingRequest, getMinDate, type BookingFormData } from '@/lib/bookingValidation';
import { ScrollReveal } from '@/components/motion';

const emptyForm: BookingFormData = {
  fullName: '',
  phone: '',
  partySize: 0,
  bookingDate: '',
  bookingTime: '',
  notes: '',
};

const BookingRequestForm = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<BookingFormData>(emptyForm);
  // Honeypot: hidden from real visitors via CSS, but a scripted bot filling
  // in every field will often fill this too. Never rendered as visible UI.
  const [honeypot, setHoneypot] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'partySize' ? Number(value) : value,
    }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setFormStatus('idle');

    const validationErrors = validateBookingRequest(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setFormStatus('submitting');

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, website: honeypot }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormStatus('success');
        setFormData(emptyForm);
      } else {
        setFormStatus('error');
        setErrors([result.error || 'Something went wrong. Please try again.']);
      }
    } catch (error) {
      console.error('Booking request error:', error);
      setFormStatus('error');
      setErrors(['Something went wrong. Please try again.']);
    }
  };

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                Prefer Not to Call?
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal mb-6">
                Request a Booking
              </h2>
              <p className="text-lg text-rich-brown/70">
                Send us your event details and we&apos;ll get back to you to confirm availability.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            {formStatus === 'success' ? (
              <div className="bg-green-50 border-l-4 border-green-500 p-8 rounded-2xl">
                <h3 className="font-display text-xl font-bold text-green-800 mb-2">
                  Request Sent!
                </h3>
                <p className="text-green-700 mb-6">
                  Thanks for your booking request. We&apos;ll be in touch to confirm availability.
                </p>
                <button
                  onClick={() => setFormStatus('idle')}
                  className="text-green-700 hover:text-green-800 underline font-medium"
                >
                  Request another booking
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field — hidden from sighted and screen-reader users alike.
                    Left unstyled/visible would tip off bots; positioned off-screen
                    instead of display:none since some bots skip that check. */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-charcoal mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-charcoal mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="partySize" className="block text-sm font-semibold text-charcoal mb-2">
                      <Users size={14} className="inline mr-1.5 -mt-0.5" />
                      Party Size *
                    </label>
                    <input
                      type="number"
                      id="partySize"
                      name="partySize"
                      min={1}
                      value={formData.partySize || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                      placeholder="Guests"
                    />
                  </div>
                  <div>
                    <label htmlFor="bookingDate" className="block text-sm font-semibold text-charcoal mb-2">
                      <Calendar size={14} className="inline mr-1.5 -mt-0.5" />
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      id="bookingDate"
                      name="bookingDate"
                      min={getMinDate()}
                      value={formData.bookingDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="bookingTime" className="block text-sm font-semibold text-charcoal mb-2">
                      <Clock size={14} className="inline mr-1.5 -mt-0.5" />
                      Preferred Time *
                    </label>
                    <input
                      type="time"
                      id="bookingTime"
                      name="bookingTime"
                      value={formData.bookingTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-semibold text-charcoal mb-2">
                    Note
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 resize-none"
                    placeholder="Tell us about your event, e.g. occasion or catering preferences"
                  ></textarea>
                </div>

                {/* Validation Errors */}
                {errors.length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <ul className="list-disc pl-5 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index} className="text-red-600 text-sm">{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="btn btn-primary btn-glow inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus === 'submitting' ? 'Sending...' : 'Send Booking Request'}
                  <Send size={18} className="ml-3" />
                </button>
              </form>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default BookingRequestForm;
