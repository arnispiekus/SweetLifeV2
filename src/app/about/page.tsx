'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Coffee, Heart, Users, Utensils, ArrowRight, Quote, Salad } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem, FadeIn } from '@/components/motion';

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════════════════
          HERO SECTION - Dramatic visual opening
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[80vh] flex items-center -mt-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/sweetlifeindoor.webp"
            alt="Inside Sweet Life Cafe"
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
                Our Story
              </span>
            </FadeIn>
            <FadeIn delay={0.3}>
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] mb-8">
                More Than
                <br />
                <span className="text-primary">Just Desserts</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.5}>
              <p className="text-xl md:text-2xl text-white/80 max-w-xl leading-relaxed">
                A family-owned Korean cafe bringing authentic flavors and warm hospitality to Newry since 2019.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Decorative accent */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-warm-cream to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          ORIGIN STORY - Editorial split layout
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-warm-cream relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Content - Takes up more space */}
            <ScrollReveal className="lg:col-span-7 order-2 lg:order-1">
              <div className="max-w-xl">
                <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-6 block">
                  Where It All Began
                </span>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-8 leading-tight">
                  A Dream Born
                  <br />
                  <span className="text-primary">in 2019</span>
                </h2>

                <div className="space-y-6 text-lg text-rich-brown/80 leading-relaxed">
                  <p>
                    You might have guessed from our name that we love desserts. And you&apos;re right! But that&apos;s only half of our story.
                  </p>
                  <p>
                    At its heart, <strong className="text-charcoal">Sweet Life is a family-owned business</strong> with a passion for bringing people together over incredible food — both sweet <span className="text-primary font-bold">and</span> savory.
                  </p>
                  <p>
                    Our journey began with a simple dream: to create a space that felt like home. To achieve this, we partnered with a unique South Korean franchise to bring authentic tastes and creative spirit to Ireland.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Image Grid - Creative arrangement */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <ScrollReveal direction="right" delay={0.2}>
                <div className="relative">
                  {/* Main large image */}
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-warm">
                    <Image
                      src="/SLNEWRY.webp"
                      alt="Sweet Life Cafe storefront"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Floating overlay image */}
                  <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-xl overflow-hidden shadow-lg border-4 border-warm-cream hidden md:block">
                    <Image
                      src="/goldentoast1.webp"
                      alt="Golden Toast dessert"
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>

                  {/* Floating accent */}
                  <div className="absolute -top-4 -right-4 bg-primary text-charcoal px-5 py-3 rounded-xl shadow-lg">
                    <p className="font-display font-bold text-lg">Est. 2019</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          BY THE NUMBERS - Stats section
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-charcoal relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="container relative">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                By the Numbers
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
                What Makes Us Special
              </h2>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { number: '184', label: 'Menu Items', sublabel: 'Sweet & Savory' },
              { number: '18', label: 'Dietary Options', sublabel: 'Keto • Vegan • GF' },
              { number: '30', label: 'Guest Capacity', sublabel: 'Private Events' },
              { number: '2019', label: 'Est.', sublabel: 'Newry, Ireland' },
            ].map((stat, index) => (
              <StaggerItem key={index}>
                <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-colors duration-300">
                  <span className="block font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.number}
                  </span>
                  <span className="block text-white font-semibold mb-1">{stat.label}</span>
                  <span className="block text-white/50 text-sm">{stat.sublabel}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          QUOTE SECTION - Full width orange band
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="bg-primary py-16 md:py-20 relative overflow-hidden">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container relative">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <Quote className="w-12 h-12 text-charcoal/20 mx-auto mb-6" />
              <blockquote className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal leading-tight mb-6">
                This partnership is our secret to serving unique dishes — from the milky ice of our signature Bingsu to the rich flavors of Bibimbap.
              </blockquote>
              <p className="text-charcoal/70 font-medium">— The Sweet Life Family</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          VALUES SECTION - Bold cards
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-charcoal text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

        <div className="container relative">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                Our Values
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                What We Stand For
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                The core principles that define every dish we serve and every guest we welcome.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Utensils,
                title: 'Made-to-Order Quality',
                description: 'We use the finest ingredients to craft every dish fresh, just for you. Nothing is pre-made, nothing is compromised.',
              },
              {
                icon: Coffee,
                title: 'Creative Flavors',
                description: 'We blend authentic Korean recipes with innovative ideas to create a menu that surprises and delights.',
              },
              {
                icon: Heart,
                title: 'Family & Passion',
                description: 'As a family-owned business, our love for food and culture is at the heart of everything we do.',
              },
              {
                icon: Users,
                title: 'A Seat for Everyone',
                description: 'We offer a warm, welcoming space and a diverse menu for every taste and dietary need.',
              },
              {
                icon: Salad,
                title: 'Dietary Inclusivity',
                description: 'With 18 Keto, Vegan, and Gluten-Free options, we ensure everyone can enjoy a delicious meal.',
              },
            ].map((value, index) => (
              <StaggerItem key={index}>
                <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 h-full">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300">
                      <value.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                      <p className="text-white/60 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          IMAGE BREAK - Full bleed food showcase
      ═══════════════════════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <Image
            src="/Bingsu/OreoCrunchBingsu.webp"
            alt="Oreo Crunch Bingsu"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-charcoal/80 via-charcoal/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-end">
            <div className="container">
              <div className="max-w-md text-white ml-auto text-right">
                <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                  Our Signature
                </span>
                <h3 className="font-display text-4xl md:text-5xl font-bold mb-4">
                  Korean Bingsu
                </h3>
                <p className="text-lg text-white/80 mb-6">
                  Fluffy shaved milk ice, topped with your choice of premium toppings. A Korean classic, perfected in Newry.
                </p>
                <Link
                  href="/specialty-menu"
                  className="btn bg-white text-charcoal hover:bg-primary hover:text-charcoal inline-flex items-center"
                >
                  See All Flavors
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ═══════════════════════════════════════════════════════════════════════════
          PROMISE SECTION - Warm closing
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-warm-beige relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <ScrollReveal>
              <div className="relative">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-warm">
                  <Image
                    src="/displayfridge.webp"
                    alt="Display of fresh cakes and desserts"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                {/* Decorative frame */}
                <div className="absolute -inset-4 border-2 border-primary/20 rounded-3xl -z-10" />
              </div>
            </ScrollReveal>

            {/* Content */}
            <ScrollReveal direction="right" delay={0.2}>
              <div>
                <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-6 block">
                  Our Promise
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal mb-8 leading-tight">
                  If It&apos;s Not Fresh,
                  <br />
                  <span className="text-primary">It&apos;s Not on Our Menu</span>
                </h2>
                <div className="space-y-6 text-lg text-rich-brown/80 leading-relaxed">
                  <p>
                    This commitment to freshness and five-star customer service is our promise to you, and it&apos;s what keeps our amazing customers — our extended family — coming back for more.
                  </p>
                  <p>
                    From our signature Bingsu to our savory Korean dishes, every item is made with care, made fresh, and made for you.
                  </p>
                </div>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/menu"
                    className="btn btn-primary inline-flex items-center"
                  >
                    Explore Our Menu
                    <ArrowRight size={18} className="ml-2" />
                  </Link>
                  <Link
                    href="/contact"
                    className="btn btn-outline inline-flex items-center"
                  >
                    Get in Touch
                    <ArrowRight size={18} className="ml-2" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          CTA SECTION - Visit us
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-charcoal text-white">
        <div className="container">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="font-display text-3xl md:text-4xl font-bold mb-2">
                  Ready to Experience Sweet Life?
                </h3>
                <p className="text-white/60 text-lg">
                  Visit us at 12 Monaghan St, Newry or order online.
                </p>
              </div>
              <div className="flex gap-4">
                <a
                  href="https://www.foodserveadmin.com/ordering/restaurant/menu?restaurant_uid=bf3e6aff-e235-4431-a82f-c5653e976642"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary whitespace-nowrap"
                >
                  Order Now
                </a>
                <Link
                  href="/contact"
                  className="btn bg-white/10 border border-white/20 text-white hover:bg-white/20 whitespace-nowrap"
                >
                  Find Us
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
