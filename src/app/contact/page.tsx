'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Phone, Mail, Send, MessageCircle, ArrowRight, Navigation } from 'lucide-react';
import { validateContactForm, type ContactFormData } from '@/lib/contactValidation';
import { ScrollReveal, FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';

const WHATSAPP_URL = 'https://wa.me/447716508513';

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setFormStatus('idle');

    const validationErrors = validateContactForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setFormStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        setFormStatus('error');
        setErrors([result.error || 'Something went wrong. Please try again.']);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setFormStatus('error');
      setErrors(['Something went wrong. Please try again.']);
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════════════════
          HERO SECTION - Warm and inviting
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[60vh] flex items-center -mt-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/contacthero.webp"
            alt="Contact Sweet Life"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-charcoal/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container pt-16">
          <div className="max-w-2xl">
            <FadeIn delay={0.2}>
              <span className="text-primary font-semibold tracking-[0.3em] uppercase text-sm mb-6 block">
                Get In Touch
              </span>
            </FadeIn>
            <FadeIn delay={0.3}>
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[0.9] mb-8">
                We&apos;d Love
                <br />
                <span className="text-primary">To Hear</span>
                <br />
                From You
              </h1>
            </FadeIn>
            <FadeIn delay={0.5}>
              <p className="text-xl md:text-2xl text-white/80 max-w-xl leading-relaxed">
                Questions, feedback, or just want to say hello? We&apos;re always happy to hear from you.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Gradient fade to next section */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-warm-cream to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          QUICK CONTACT CARDS
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-warm-cream">
        <div className="container">
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto" staggerDelay={0.1}>
            <StaggerItem>
              <a
                href="tel:+447716508513"
                className="group flex items-center p-5 bg-white rounded-2xl shadow-warm hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary transition-colors">
                  <Phone size={22} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-sm text-rich-brown/60">Call us</p>
                  <p className="font-semibold text-charcoal">+44 7716 508513</p>
                </div>
              </a>
            </StaggerItem>

            <StaggerItem>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center p-5 bg-white rounded-2xl shadow-warm hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary transition-colors">
                  <MessageCircle size={22} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-sm text-rich-brown/60">WhatsApp</p>
                  <p className="font-semibold text-charcoal">Message us</p>
                </div>
              </a>
            </StaggerItem>

            <StaggerItem>
              <a
                href="mailto:info@sweetlifecafe.co.uk"
                className="group flex items-center p-5 bg-white rounded-2xl shadow-warm hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary transition-colors">
                  <Mail size={22} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-sm text-rich-brown/60">Email</p>
                  <p className="font-semibold text-charcoal text-sm">info@sweetlifecafe.co.uk</p>
                </div>
              </a>
            </StaggerItem>

            <StaggerItem>
              <a
                href="https://maps.google.com/?q=12+Monaghan+St,+Newry+BT35+6AA"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center p-5 bg-white rounded-2xl shadow-warm hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary transition-colors">
                  <Navigation size={22} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-sm text-rich-brown/60">Directions</p>
                  <p className="font-semibold text-charcoal">Get directions</p>
                </div>
              </a>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          CONTACT FORM & INFO SECTION
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto">
            {/* Contact Form */}
            <ScrollReveal direction="left">
              <div>
                <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                  Send a Message
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal mb-6">
                  Get In Touch
                </h2>
                <p className="text-lg text-rich-brown/70 mb-10">
                  Have questions or feedback? Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>

                {formStatus === 'success' ? (
                  <div className="bg-green-50 border-l-4 border-green-500 p-8 rounded-2xl">
                    <h3 className="font-display text-xl font-bold text-green-800 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-green-700 mb-6">
                      Thank you for reaching out. We&apos;ll get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => setFormStatus('idle')}
                      className="text-green-700 hover:text-green-800 underline font-medium"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-charcoal mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-charcoal mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                          placeholder="Your email"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-charcoal mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                        placeholder="Subject of your message"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-charcoal mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 resize-none"
                        placeholder="Your message"
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
                      {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                      <Send size={18} className="ml-3" />
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>

            {/* Contact Info & Map */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="space-y-8">
                {/* Map */}
                <div className="rounded-3xl overflow-hidden shadow-warm-lg h-72">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2328.9160391331177!2d-6.340289684069388!3d54.17557798015985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4860e39752bb8bdb%3A0xe7da43be7a44acb9!2s12%20Monaghan%20St%2C%20Newry%20BT35%206AA%2C%20UK!5e0!3m2!1sen!2sie!4v1652354523691!5m2!1sen!2sie"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Sweet Life Ireland Location"
                  ></iframe>
                </div>

                {/* Address Card */}
                <div className="bg-warm-cream rounded-3xl p-8 shadow-warm">
                  <div className="flex items-start mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <MapPin size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-charcoal mb-1">Visit Us</h3>
                      <p className="text-rich-brown/70">12 Monaghan St, Newry BT35 6AA</p>
                    </div>
                  </div>
                  <a
                    href="https://maps.google.com/?q=12+Monaghan+St,+Newry+BT35+6AA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm inline-flex items-center"
                  >
                    Get Directions
                    <ArrowRight size={16} className="ml-2" />
                  </a>
                </div>

                {/* Opening Hours */}
                <div className="bg-primary rounded-3xl p-8 shadow-warm">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center mr-4">
                      <Clock size={24} className="text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-charcoal">Opening Hours</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-white/80 rounded-xl px-4 py-3">
                      <span className="font-medium text-charcoal">Mon - Wed</span>
                      <span className="text-charcoal/70">8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/80 rounded-xl px-4 py-3">
                      <span className="font-medium text-charcoal">Thu - Fri</span>
                      <span className="text-charcoal/70">8:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/80 rounded-xl px-4 py-3">
                      <span className="font-medium text-charcoal">Saturday</span>
                      <span className="text-charcoal/70">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center bg-red-100 rounded-xl px-4 py-3">
                      <span className="font-medium text-red-700">Sunday</span>
                      <span className="text-red-600">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-charcoal text-white relative overflow-hidden">
        {/* Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container relative">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="font-display text-3xl md:text-4xl font-bold mb-2">
                  Looking for Our Menu?
                </h3>
                <p className="text-white/60 text-lg">
                  Explore our full selection of Korean dishes, drinks, and desserts.
                </p>
              </div>
              <div className="flex gap-4">
                <Link
                  href="/menu"
                  className="btn btn-primary whitespace-nowrap inline-flex items-center"
                >
                  View Menu
                  <ArrowRight size={18} className="ml-2" />
                </Link>
                <Link
                  href="/bookings"
                  className="btn bg-white/10 border border-white/20 text-white hover:bg-white/20 whitespace-nowrap"
                >
                  Private Bookings
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
