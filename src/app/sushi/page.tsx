'use client';

import PageHeader from '@/components/ui/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader';
import WaveSeparator from '@/components/ui/WaveSeparator';
import SushiGallery from '@/components/sushi/SushiGallery';
import SushiOrderForm from '@/components/sushi/SushiOrderForm';
import LazyVideo from '@/components/ui/LazyVideo';
import { sushiVideos } from '@/data/sushiData';
import { Phone, Mail } from 'lucide-react';
import { ScrollReveal, FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';

export default function SushiPage() {
  return (
    <>
      <PageHeader
        title="Sushi Platters"
        subtitle="Fresh, handcrafted sushi platters made to order"
        backgroundImage="/SushiHero.webp"
      />

      <WaveSeparator bgColor="bg-primary" fillColor="text-white" />

      {/* Intro Section */}
      <section className="section bg-white">
        <div className="container">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <SectionHeader
                title="Handcrafted Excellence"
                subtitle="Each sushi platter is made to order using premium ingredients and expert technique"
                centered={true}
              />
              <p className="text-stone-600 text-lg">
                Our sushi is prepared fresh for every order, ensuring you receive the highest quality
                experience. Choose from our selection of variations including meat, seafood, vegan
                options, or a curated mix of all three.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section bg-stone-50">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <SectionHeader
                title="Our Fresh Sushi"
                subtitle="Handcrafted sushi platters made with premium ingredients and expert technique"
                centered={true}
              />
            </ScrollReveal>
            <FadeIn delay={0.2}>
              <SushiGallery />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <SectionHeader
                title="Watch Our Sushi Making Process"
                subtitle="See how we handcraft each piece with care and precision"
                centered={true}
              />
            </ScrollReveal>
            <FadeIn delay={0.2}>
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <LazyVideo
                    src={sushiVideos[0].src}
                    poster={sushiVideos[0].poster}
                    alt={sushiVideos[0].alt}
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Order Form Section */}
      <SushiOrderForm />

      {/* Contact Section */}
      <section className="section bg-white">
        <div className="container max-w-6xl">
          <ScrollReveal>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8 bg-primary/5">
                  <h3 className="text-2xl font-semibold text-primary mb-6">Contact Us to Order</h3>
                  <StaggerContainer className="space-y-4">
                    <StaggerItem>
                      <a
                        href="tel:+447716508513"
                        className="flex items-center p-4 bg-white rounded-lg hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                      >
                        <Phone size={20} className="text-primary mr-3" />
                        <span>+447716508513</span>
                      </a>
                    </StaggerItem>
                    <StaggerItem>
                      <a
                        href="mailto:info@sweetlifecafe.co.uk"
                        className="flex items-center p-4 bg-white rounded-lg hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                      >
                        <Mail size={20} className="text-primary mr-3" />
                        <span>info@sweetlifecafe.co.uk</span>
                      </a>
                    </StaggerItem>
                  </StaggerContainer>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-semibold mb-6">Ordering Process</h3>
                  <StaggerContainer className="space-y-4">
                    {[
                      'Select your sushi type (Meat, Seafood, Vegan, or Mix)',
                      'Choose your quantity (8, 16, 20, 30, or 50 pieces)',
                      'Fill out the pre-order form with your details',
                      'Submit your order request',
                      'Complete payment via Revolut link provided',
                      "We'll confirm your order and pickup time via email or text",
                    ].map((step, index) => (
                      <StaggerItem key={index}>
                        <div className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1 mr-3">
                            <span className="text-xs font-medium text-primary">{index + 1}</span>
                          </div>
                          <p className="text-stone-700">{step}</p>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
