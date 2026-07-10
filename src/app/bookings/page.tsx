'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Check, ArrowRight, Phone, MessageCircle, Users, Sparkles } from 'lucide-react';
import { ScrollReveal, FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';
import BookingRequestForm from '@/components/bookings/BookingRequestForm';
import {
  eventTypes,
  includedItems,
  bookingSteps,
  venueInfo,
  cateringInfo,
} from '@/data/bookingsData';

const WHATSAPP_URL = 'https://wa.me/447716508513?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20booking%20the%20private%20room.';

export default function BookingsPage() {
  return (
    <div className="overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════════════════
          HERO SECTION - Inviting atmosphere
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[75vh] flex items-center -mt-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/private-room.webp"
            alt="Private Event Space"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-charcoal/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container pt-16">
          <div className="max-w-3xl">
            <FadeIn delay={0.2}>
              <span className="text-primary font-semibold tracking-[0.3em] uppercase text-sm mb-6 block">
                Private Events
              </span>
            </FadeIn>
            <FadeIn delay={0.3}>
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] mb-8">
                Your Special
                <br />
                <span className="text-primary">Occasion</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.5}>
              <p className="text-xl md:text-2xl text-white/80 max-w-xl leading-relaxed mb-10">
                Host intimate gatherings and celebrations in our charming upstairs space. Full catering, dedicated service, unforgettable memories.
              </p>
            </FadeIn>
            <FadeIn delay={0.6}>
              <div className="flex flex-wrap gap-4">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-glow inline-flex items-center"
                >
                  <MessageCircle size={20} className="mr-3" />
                  Book on WhatsApp
                </a>
                <a
                  href="tel:+447716508513"
                  className="btn bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-charcoal inline-flex items-center transition-all duration-300"
                >
                  <Phone size={20} className="mr-3" />
                  Call Us
                </a>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Gradient fade to next section */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-warm-cream to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          VENUE SECTION - The Space
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-warm-cream">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
            <ScrollReveal direction="left">
              <div>
                <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                  Our Venue
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal mb-6">
                  A Space for<br />
                  <span className="text-primary">Togetherness</span>
                </h2>
                <p className="text-lg text-rich-brown/70 leading-relaxed mb-6">
                  {venueInfo.description}
                </p>
                <p className="text-lg text-rich-brown/70 leading-relaxed mb-8">
                  {venueInfo.details}
                </p>

                {/* Capacity highlight */}
                <div className="inline-flex items-center bg-white rounded-2xl p-5 shadow-warm">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                    <Users size={28} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-rich-brown/70">Maximum Capacity</p>
                    <p className="font-display text-2xl font-bold text-charcoal">{venueInfo.capacity} Guests</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-warm-lg">
                  <Image
                    src="/privateroom2.webp"
                    alt="Private Event Space"
                    width={600}
                    height={600}
                    className="w-full aspect-square object-cover"
                  />
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-3xl -z-10" />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/10 rounded-2xl -z-10" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          FULL-BLEED CATERING IMAGE BREAK
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src="/catering.webp"
          alt="Catering at Sweet Life"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <ScrollReveal>
              <div className="max-w-lg">
                <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                  Full Service
                </span>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  Delicious<br />
                  <span className="text-primary">Catering</span>
                </h2>
                <p className="text-lg text-white/80">
                  {cateringInfo.description}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          EVENT TYPES SECTION
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                Perfect For
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6">
                Every Occasion
              </h2>
              <p className="text-lg text-rich-brown/70 max-w-2xl mx-auto">
                We cater to a variety of private functions, each with its own unique requirements and atmosphere
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto" staggerDelay={0.1}>
            {eventTypes.map((event) => {
              const IconComponent = event.icon;
              return (
                <StaggerItem key={event.title}>
                  <div className="group bg-white rounded-2xl shadow-warm p-8 text-center hover:shadow-warm-lg transition-all duration-500 hover:-translate-y-2 h-full border border-warm-cream">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                      <IconComponent size={32} className="text-primary group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-charcoal mb-3">
                      {event.title}
                    </h3>
                    <p className="text-rich-brown/70 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          BOOKING INFORMATION SECTION
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-warm-beige">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                How It Works
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6">
                Booking Details
              </h2>
              <p className="text-lg text-rich-brown/70 max-w-2xl mx-auto">
                Everything you need to know about booking our private space for your event
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* What's Included */}
            <ScrollReveal direction="left">
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-warm h-full">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                    <Sparkles size={24} className="text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-charcoal">What&apos;s Included</h3>
                </div>
                <StaggerContainer className="space-y-4" staggerDelay={0.05}>
                  {includedItems.map((item, index) => (
                    <StaggerItem key={index}>
                      <div className="flex items-start group">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-4 group-hover:bg-primary transition-colors">
                          <Check size={14} className="text-primary group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-rich-brown/80 leading-relaxed">{item.text}</span>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </ScrollReveal>

            {/* Booking Process */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="bg-primary rounded-3xl p-8 md:p-10 shadow-warm h-full">
                <h3 className="font-display text-2xl font-bold text-charcoal mb-8">Booking Process</h3>
                <StaggerContainer className="space-y-6" staggerDelay={0.08}>
                  {bookingSteps.map((step, index) => (
                    <StaggerItem key={index}>
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center flex-shrink-0 mr-4 shadow-sm">
                          <span className="font-display text-lg font-bold text-primary">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-charcoal mb-1">{step.title}</h4>
                          <p className="text-charcoal/70 text-sm leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          BOOKING REQUEST FORM
      ═══════════════════════════════════════════════════════════════════════════ */}
      <BookingRequestForm />

      {/* ═══════════════════════════════════════════════════════════════════════════
          CTA SECTION - Book Now
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-charcoal text-white relative overflow-hidden">
        {/* Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container relative">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center">
                <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                  Ready to Book?
                </span>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Let&apos;s Plan Your
                  <br />
                  <span className="text-primary">Perfect Event</span>
                </h2>
                <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
                  Contact us today to check availability and discuss your event requirements. We&apos;re here to make your special occasion truly memorable.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-glow inline-flex items-center justify-center text-lg px-8 py-4"
                  >
                    <MessageCircle size={22} className="mr-3" />
                    Book via WhatsApp
                  </a>
                  <a
                    href="tel:+447716508513"
                    className="btn bg-white/10 border border-white/20 text-white hover:bg-white/20 inline-flex items-center justify-center text-lg px-8 py-4"
                  >
                    <Phone size={22} className="mr-3" />
                    +44 7716 508513
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Additional CTAs */}
            <ScrollReveal delay={0.2}>
              <div className="mt-16 pt-16 border-t border-white/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <h3 className="font-display text-2xl font-bold mb-2">
                      Explore Our Menu
                    </h3>
                    <p className="text-white/60">
                      See what we can serve at your event
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Link
                      href="/menu"
                      className="btn btn-primary whitespace-nowrap inline-flex items-center"
                    >
                      Full Menu
                      <ArrowRight size={18} className="ml-2" />
                    </Link>
                    <Link
                      href="/specialty-menu"
                      className="btn bg-white/10 border border-white/20 text-white hover:bg-white/20 whitespace-nowrap"
                    >
                      Specialty Items
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
