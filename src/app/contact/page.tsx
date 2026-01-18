'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader';
import WaveSeparator from '@/components/ui/WaveSeparator';
import { MapPin, Clock, Phone, Mail, Send, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');

    // Simulate form submission - actual handling will be implemented later
    setTimeout(() => {
      setFormStatus('success');
      // Reset form after success
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="We'd love to hear from you"
        backgroundImage="/contacthero.webp"
      />

      {/* Wave Separator */}
      <WaveSeparator bgColor="bg-primary" fillColor="text-white" />

      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <SectionHeader
                title="Get In Touch"
                subtitle="Have questions or feedback? We're here to help"
              />

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-stone-700 font-medium mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-stone-700 font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-stone-700 font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Subject"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-stone-700 font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Your message"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="btn btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                  <Send size={18} className="ml-2" />
                </button>

                {formStatus === 'success' && (
                  <p className="text-green-600 font-medium">Thank you! Your message has been sent.</p>
                )}
                {formStatus === 'error' && (
                  <p className="text-red-600 font-medium">Something went wrong. Please try again.</p>
                )}
              </form>
            </div>

            <div>
              <div className="h-64 mb-8 rounded-lg overflow-hidden shadow-md">
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

              <div className="bg-stone-50 p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-semibold text-primary mb-6">Contact Information</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-stone-800 mb-2 flex items-center justify-center">
                      <MapPin size={18} className="text-primary mr-2" />
                      Address
                    </h4>
                    <a
                      href="https://maps.google.com/?q=12+Monaghan+St,+Newry+BT35+6AA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-600 hover:text-primary transition-colors"
                    >
                      12 Monaghan St, Newry BT35 6AA
                    </a>
                  </div>

                  <div>
                    <h4 className="font-medium text-stone-800 mb-2 flex items-center justify-center">
                      <Phone size={18} className="text-primary mr-2" />
                      Phone
                    </h4>
                    <a
                      href="tel:+447716508513"
                      className="text-stone-600 hover:text-primary transition-colors"
                    >
                      +447716508513
                    </a>
                  </div>

                  <div>
                    <h4 className="font-medium text-stone-800 mb-2 flex items-center justify-center">
                      <Mail size={18} className="text-primary mr-2" />
                      Email
                    </h4>
                    <a
                      href="mailto:info@sweetlifecafe.co.uk"
                      className="text-stone-600 hover:text-primary transition-colors"
                    >
                      info@sweetlifecafe.co.uk
                    </a>
                  </div>

                  <div>
                    <h4 className="font-medium text-stone-800 mb-2 flex items-center justify-center">
                      <MessageCircle size={18} className="text-primary mr-2" />
                      WhatsApp
                    </h4>
                    <a
                      href="https://wa.me/447716508513"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-600 hover:text-primary transition-colors"
                    >
                      +447716508513
                    </a>
                  </div>

                  <div>
                    <h4 className="font-medium text-stone-800 mb-3 flex items-center justify-center">
                      <Clock size={18} className="text-primary mr-2" />
                      Opening Hours
                    </h4>
                    <div className="space-y-2">
                      <div className="bg-white px-3 py-2 rounded-lg border border-stone-200 text-center">
                        <p className="font-medium text-stone-700">Mon - Tue - Wed</p>
                        <p className="text-stone-600">8 am - 6 pm</p>
                      </div>
                      <div className="bg-white px-3 py-2 rounded-lg border border-stone-200 text-center">
                        <p className="font-medium text-stone-700">Thu - Fri</p>
                        <p className="text-stone-600">8 am - 8 pm</p>
                      </div>
                      <div className="bg-white px-3 py-2 rounded-lg border border-stone-200 text-center">
                        <p className="font-medium text-stone-700">Saturday</p>
                        <p className="text-stone-600">9 am - 6 pm</p>
                      </div>
                      <div className="bg-red-50 px-3 py-2 rounded-lg border border-red-200 text-center">
                        <p className="font-medium text-red-700">Sunday</p>
                        <p className="text-red-600">Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
