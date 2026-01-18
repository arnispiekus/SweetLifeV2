'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader';
import WaveSeparator from '@/components/ui/WaveSeparator';
import WhatsAppBookingCTA from '@/components/ui/WhatsAppBookingCTA';
import { ScrollReveal, FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';
import {
  eventTypes,
  includedItems,
  bookingSteps,
  venueInfo,
  cateringInfo,
} from '@/data/bookingsData';

export default function BookingsPage() {
  return (
    <>
      <PageHeader
        title="Private Bookings"
        subtitle="Host your special event in our upstairs space"
        backgroundImage="/private-room.webp"
      />

      <WaveSeparator bgColor="bg-primary" fillColor="text-white" />

      {/* Our Venue Section */}
      <section className="section bg-white">
        <div className="container">
          <ScrollReveal>
            <SectionHeader
              title="Our Venue"
              subtitle="A beautiful space for your private events"
              centered={true}
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <ScrollReveal direction="left">
              <div className="text-center lg:text-left">
                <p className="mb-6 text-stone-700">{venueInfo.description}</p>
                <p className="text-stone-700">{venueInfo.details}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.2}>
              <div className="flex justify-center">
                <Image
                  src="/privateroom2.webp"
                  alt="Private Event Space"
                  width={500}
                  height={500}
                  className="w-full max-w-md aspect-square object-cover object-center rounded-2xl shadow-xl"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Catering Section */}
      <section className="section bg-stone-50">
        <div className="container">
          <ScrollReveal>
            <SectionHeader title="Catering" centered={true} />
            <p className="text-stone-700 text-center max-w-3xl mx-auto mb-12">
              {cateringInfo.description}
            </p>
          </ScrollReveal>
          <FadeIn delay={0.2}>
            <div className="flex justify-center">
              <Image
                src="/catering.webp"
                alt="Catering at Sweet Life"
                width={900}
                height={600}
                className="w-full max-w-3xl rounded-2xl shadow-xl object-cover object-center"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Event Types Section */}
      <section className="section bg-white">
        <div className="container">
          <ScrollReveal>
            <SectionHeader
              title="Event Types"
              subtitle="We cater to a variety of private functions"
              centered={true}
            />
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {eventTypes.map((event) => {
              const IconComponent = event.icon;
              return (
                <StaggerItem key={event.title}>
                  <div className="bg-white p-6 rounded-lg shadow-md text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent size={28} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
                    <p className="text-stone-600">{event.description}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Booking Information Section */}
      <section className="section bg-stone-50">
        <div className="container">
          <ScrollReveal>
            <SectionHeader
              title="Booking Information"
              subtitle="Everything you need to know about booking our space"
              centered={true}
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* What's Included */}
            <ScrollReveal direction="left">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">What&apos;s Included</h3>
                <StaggerContainer>
                  <ul className="space-y-3">
                    {includedItems.map((item, index) => (
                      <StaggerItem key={index}>
                        <li className="flex">
                          <Check
                            size={20}
                            className="text-primary mr-3 flex-shrink-0 mt-0.5"
                          />
                          <span className="text-stone-700">{item.text}</span>
                        </li>
                      </StaggerItem>
                    ))}
                  </ul>
                </StaggerContainer>
              </div>
            </ScrollReveal>

            {/* Booking Process */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Booking Process</h3>
                <StaggerContainer>
                  <ol className="list-decimal pl-5 space-y-3 text-stone-700">
                    {bookingSteps.map((step, index) => (
                      <StaggerItem key={index}>
                        <li>
                          <span className="font-medium">{step.title}:</span>{' '}
                          {step.description}
                        </li>
                      </StaggerItem>
                    ))}
                  </ol>
                </StaggerContainer>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Ready to Book CTA Section */}
      <section className="section bg-white">
        <div className="container">
          <FadeIn>
            <WhatsAppBookingCTA />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
