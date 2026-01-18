'use client';

import Image from 'next/image';
import PageHeader from '@/components/ui/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader';
import WaveSeparator from '@/components/ui/WaveSeparator';
import { Coffee, Heart, Users, Utensils } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem, FadeIn } from '@/components/motion';

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Our Sweet Name is Just the Start of Our Story."
        subtitle="Discover the family, passion, and flavor behind Sweet Life"
        backgroundImage="/sweetlifeindoor.webp"
      />

      {/* Wave Separator from primary to stone-50 */}
      <WaveSeparator bgColor="bg-primary" fillColor="text-stone-50" />

      <section className="section bg-stone-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Story Card */}
            <ScrollReveal direction="left">
              <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 relative border-t-4 border-primary">
                <span className="absolute top-0 left-0 -mt-2 ml-2 text-9xl font-serif text-primary/10 z-0" aria-hidden="true">
                  &ldquo;
                </span>
                <div className="relative z-10 space-y-6 text-stone-700">
                  <p className="text-lg leading-relaxed">
                    You might have guessed from our name that we love desserts. And you are right! But that is only half of our story. At its heart, Sweet Life is a family-owned business with a passion for bringing people together over incredible food - both sweet <span className="font-bold text-primary">and</span> savory.
                  </p>
                  <h3 className="text-2xl font-bold text-primary pt-4">A Taste of South Korea in Ireland</h3>
                  <p>
                    Our journey began in 2019 with a simple dream: to create a space that felt like home. To do that, we partnered with a unique South Korean franchise to bring the authentic tastes and creative spirit of the country to Ireland. This partnership is our secret to serving our unique dishes, from the milky ice of our signature Bingsu to the rich flavours of Bibimbap.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Image Grid */}
            <StaggerContainer className="grid grid-cols-3 grid-rows-3 gap-4 h-96 lg:h-auto">
              <StaggerItem className="col-span-2 row-span-3 rounded-2xl overflow-hidden shadow-lg relative">
                <Image
                  src="/SweetLifeLocation.webp"
                  alt="Sweet Life Location"
                  fill
                  sizes="(max-width: 1024px) 66vw, 33vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </StaggerItem>
              <StaggerItem className="col-span-1 row-span-2 rounded-2xl overflow-hidden shadow-lg relative">
                <Image
                  src="/goldentoast1.webp"
                  alt="A sweet dish from Sweet Life"
                  fill
                  sizes="(max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </StaggerItem>
              <StaggerItem className="col-span-1 row-span-1 rounded-2xl overflow-hidden shadow-lg relative">
                <Image
                  src="/displayfridge.webp"
                  alt="Sweet Life Cakes"
                  fill
                  sizes="(max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>

      <section className="section bg-stone-50">
        <div className="container">
          <ScrollReveal>
            <SectionHeader
              title="What We Stand For"
              subtitle="The core values that define the Sweet Life experience"
              centered={true}
            />
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <StaggerItem className="text-center p-4 group">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                <Utensils size={32} className="text-primary transition-transform duration-300 group-hover:rotate-[-5deg]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Made-to-Order Quality</h3>
              <p className="text-stone-600">We use the finest ingredients to craft every dish fresh, just for you. Nothing is pre-made.</p>
            </StaggerItem>

            <StaggerItem className="text-center p-4 group">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                <Coffee size={32} className="text-primary transition-transform duration-300 group-hover:rotate-[-5deg]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Creative Flavors</h3>
              <p className="text-stone-600">We blend authentic Korean recipes with innovative ideas to create a truly unique menu.</p>
            </StaggerItem>

            <StaggerItem className="text-center p-4 group">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                <Heart size={32} className="text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-bold mb-2">Family & Passion</h3>
              <p className="text-stone-600">As a family-owned business, our love for food and culture is at the heart of everything we do.</p>
            </StaggerItem>

            <StaggerItem className="text-center p-4 group">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                <Users size={32} className="text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-bold mb-2">A Seat for Everyone</h3>
              <p className="text-stone-600">We offer a warm, welcoming space and a diverse menu for every taste and dietary need.</p>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      <section className="section bg-stone-50 pt-0">
        <FadeIn delay={0.2}>
          <div className="container max-w-4xl mx-auto text-center bg-white p-8 rounded-2xl shadow-lg border-t-4 border-primary">
            <h3 className="text-2xl font-bold text-primary">Our Promise to You</h3>
            <p className="text-lg mt-4 text-stone-700">
              We live by a simple rule: if it is not fresh, it is not on our menu. This commitment to freshness and five-star customer service is our promise to you, and it is what keeps our amazing customers - our extended family - coming back for more.
            </p>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
