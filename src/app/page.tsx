'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { MapPin, ArrowRight, MessageCircle, Check, ChevronDown, Sparkles, Users, UtensilsCrossed, Lock, UserCheck } from 'lucide-react';
import FeaturedCarousel from '@/components/ui/FeaturedCarousel';
import GoogleReviews from '@/components/ui/GoogleReviews';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/motion';

// Interim: FoodServe (foodserveadmin.com) ordering platform is no longer used.
// Routed to WhatsApp for now, matching the existing booking CTA pattern.
const WHATSAPP_ORDER_URL = 'https://wa.me/447716508513?text=Hi%2C%20I%27d%20like%20to%20place%20an%20order%20for%20pickup.';

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <div className="overflow-x-hidden">
      <h1 className="sr-only">Sweet Life Cafe - Korean Cafe & Restaurant in Newry</h1>

      {/* ═══════════════════════════════════════════════════════════════════════════
          HERO SECTION - Full screen editorial impact
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center -mt-16 overflow-hidden"
      >
        {/* Background Image with Parallax */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: prefersReducedMotion ? '0%' : backgroundY }}
        >
          <Image
            src="/SweetLifeCafe_Hero_1.webp"
            alt="Sweet Life Cafe"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-110"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal/80" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 container text-center text-white px-4"
          style={{ opacity: prefersReducedMotion ? 1 : contentOpacity }}
        >
          {/* Small tagline */}
          <motion.p
            className="text-primary font-semibold tracking-[0.3em] uppercase text-sm mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Newry&apos;s Korean Cafe
          </motion.p>

          {/* Giant Editorial Headline with Playfair Display */}
          <motion.h2
            className="font-display font-black leading-[0.85] tracking-tight mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white drop-shadow-2xl">
              Sweet.
            </span>
            <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white drop-shadow-2xl">
              Savory.
            </span>
            <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-primary">
              Unforgettable.
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl lg:text-2xl mb-12 max-w-2xl mx-auto text-white/80 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Authentic Korean cuisine, artisan coffee, and sweet indulgences in the heart of Newry.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <a
              href={WHATSAPP_ORDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary inline-flex items-center text-lg font-bold px-10 py-4 whitespace-nowrap"
            >
              <MessageCircle size={22} className="mr-3" />
              Order via WhatsApp
            </a>
            <Link
              href="/menu"
              className="btn bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-charcoal px-8 py-4 whitespace-nowrap transition-all duration-300"
            >
              Explore Menu
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          style={{ opacity: prefersReducedMotion ? 1 : scrollIndicatorOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.div
            className="flex flex-col items-center text-white/60 cursor-pointer hover:text-white transition-colors"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            onClick={() => window.scrollTo({ top: window.innerHeight - 64, behavior: 'smooth' })}
          >
            <span className="text-sm mb-2 tracking-widest uppercase">Scroll</span>
            <ChevronDown size={24} />
          </motion.div>
        </motion.div>
      </section>

      {/* SEO Content (Hidden) */}
      <div className="sr-only">
        <p>Welcome to Sweet Life Cafe, the premier Korean cafe in Newry offering authentic Bingsu, bubble tea, specialty coffee, sushi, and more.</p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SIGNATURE ORANGE SECTION - Bold brand statement
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="bg-primary py-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="container relative">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-charcoal font-semibold text-sm md:text-base tracking-wide">
            <span className="flex items-center gap-2">
              <Sparkles size={18} />
              Bingsu
            </span>
            <span className="opacity-40">•</span>
            <span>Bubble Tea</span>
            <span className="opacity-40">•</span>
            <span>Korean Cuisine</span>
            <span className="opacity-40">•</span>
            <span>Sushi</span>
            <span className="opacity-40">•</span>
            <span>Specialty Coffee</span>
            <span className="opacity-40">•</span>
            <span>All-Day Brunch</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          ORDER ONLINE - Full bleed asymmetric layout
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-warm-cream grain-overlay">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[450px]">
          {/* Left: Large Image */}
          <ScrollReveal direction="left" className="relative h-[300px] lg:h-auto">
            <Image
              src="/SweetLifeTakeaway.webp"
              alt="Sweet Life takeaway in branded packaging"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Decorative corner accent */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary clip-corner hidden lg:block" />
          </ScrollReveal>

          {/* Right: Content */}
          <div className="flex items-center px-8 py-10 lg:px-16 lg:py-12">
            <ScrollReveal direction="right" delay={0.2}>
              <div className="max-w-lg">
                <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                  Quick & Easy
                </span>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6 leading-tight">
                  Order Online.
                  <br />
                  <span className="text-primary">Eat Sooner.</span>
                </h2>
                <p className="text-lg text-rich-brown/80 mb-8 leading-relaxed">
                  Skip the wait and the extra fees. Order directly for the fastest service, best prices, and our full menu.
                </p>

                <StaggerContainer className="space-y-3 mb-10">
                  {[
                    'Pickup & Delivery Available',
                    'Real-Time Order Tracking',
                    'Best Prices Guaranteed',
                  ].map((benefit, i) => (
                    <StaggerItem key={i} className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                        <Check size={14} className="text-primary" />
                      </div>
                      <span className="text-charcoal font-medium">{benefit}</span>
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                <a
                  href={WHATSAPP_ORDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary inline-flex items-center text-lg"
                >
                  <MessageCircle size={20} className="mr-3" />
                  Order via WhatsApp
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SPECIALTIES - Dramatic showcase
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 bg-white relative">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-10">
              <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-3 block">
                Fan Favorites
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6">
                Our Specialties
              </h2>
              <p className="text-lg text-rich-brown/70 max-w-2xl mx-auto">
                Discover the dishes that keep our guests coming back for more
              </p>
            </div>
          </ScrollReveal>

          <FeaturedCarousel />

          <ScrollReveal delay={0.3}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-14">
              <Link
                href="/specialty-menu"
                className="btn btn-primary inline-flex items-center text-lg px-8 py-4"
              >
                View Specialty Items
                <ArrowRight size={20} className="ml-3" />
              </Link>
              <Link
                href="/menu"
                className="btn btn-outline inline-flex items-center text-lg px-8 py-4"
              >
                Full Menu
                <ArrowRight size={20} className="ml-3" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          DIETARY OPTIONS - Editorial navigation cards
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                For Every Diet
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-4">
                Dietary Options Available
              </h2>
              <p className="text-rich-brown/70 max-w-xl mx-auto">
                We cater to all dietary needs with 18+ options across our menus.
              </p>
            </div>
          </ScrollReveal>

          {/* Editorial Navigation Cards - Horizontal layout */}
          <div className="max-w-5xl mx-auto space-y-4">
            {/* Keto */}
            <ScrollReveal delay={0.1}>
              <Link href="/menu" className="group block">
                <div className="flex items-center bg-gradient-to-r from-blue-50 to-transparent rounded-2xl overflow-hidden border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
                  <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden">
                    <img
                      src="/Keto/SushiBowl.webp"
                      alt="Keto options"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 px-6 py-4 md:px-8 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                          Keto
                        </span>
                        <span className="text-rich-brown/50 text-sm">8+ items</span>
                      </div>
                      <h3 className="font-display text-xl md:text-2xl font-bold text-charcoal group-hover:text-blue-600 transition-colors">
                        Low-Carb & High-Protein
                      </h3>
                      <p className="text-rich-brown/60 text-sm mt-1 hidden md:block">
                        Sushi bowls, omelettes, almond waffles & more
                      </p>
                    </div>
                    <ArrowRight size={24} className="text-blue-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {/* Vegan */}
            <ScrollReveal delay={0.2}>
              <Link href="/menu" className="group block">
                <div className="flex items-center bg-gradient-to-r from-green-50 to-transparent rounded-2xl overflow-hidden border border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
                  <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden">
                    <img
                      src="/Keto/VeganBurger.webp"
                      alt="Vegan options"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 px-6 py-4 md:px-8 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="bg-green-600 text-white px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                          Vegan
                        </span>
                        <span className="text-rich-brown/50 text-sm">6+ items</span>
                      </div>
                      <h3 className="font-display text-xl md:text-2xl font-bold text-charcoal group-hover:text-green-600 transition-colors">
                        Plant-Based Delights
                      </h3>
                      <p className="text-rich-brown/60 text-sm mt-1 hidden md:block">
                        Burgers, tacos, kiev & sausage baps
                      </p>
                    </div>
                    <ArrowRight size={24} className="text-green-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {/* Gluten-Free */}
            <ScrollReveal delay={0.3}>
              <Link href="/menu" className="group block">
                <div className="flex items-center bg-gradient-to-r from-amber-50 to-transparent rounded-2xl overflow-hidden border border-amber-100 hover:border-amber-200 transition-all duration-300 hover:shadow-lg">
                  <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden">
                    <img
                      src="/Keto/AlmondBelgianWaffle.webp"
                      alt="Gluten-free options"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 px-6 py-4 md:px-8 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="bg-amber-600 text-white px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                          Gluten Free
                        </span>
                        <span className="text-rich-brown/50 text-sm">10+ items</span>
                      </div>
                      <h3 className="font-display text-xl md:text-2xl font-bold text-charcoal group-hover:text-amber-600 transition-colors">
                        GF Friendly Options
                      </h3>
                      <p className="text-rich-brown/60 text-sm mt-1 hidden md:block">
                        Waffles, cakes, sandwiches & bagels
                      </p>
                    </div>
                    <ArrowRight size={24} className="text-amber-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          FULL-BLEED FOOD SHOWCASE - Visual break
      ═══════════════════════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <Image
            src="/Bingsu/MangoCheesecakeBingsu.webp"
            alt="Mango Cheesecake Bingsu - Korean shaved ice dessert"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/40 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container">
              <div className="max-w-lg text-white">
                <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                  Signature Dessert
                </span>
                <h3 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  Korean Bingsu
                </h3>
                <p className="text-lg text-white/80 mb-6">
                  Fluffy shaved ice topped with fresh fruits, sweet condensed milk, and artisanal toppings. A Korean classic, perfected.
                </p>
                <Link
                  href="/specialty-menu"
                  className="btn bg-white text-charcoal hover:bg-primary hover:text-charcoal inline-flex items-center"
                >
                  Explore Bingsu Menu
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ═══════════════════════════════════════════════════════════════════════════
          ABOUT SECTION - Warm storytelling
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-10 md:py-12 bg-warm-beige relative overflow-hidden grain-overlay">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal>
              <div>
                <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                  Our Story
                </span>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6 leading-tight">
                  A Taste of Korea,
                  <br />
                  <span className="text-primary">In Newry</span>
                </h2>
                <p className="text-lg text-rich-brown/80 mb-6 leading-relaxed">
                  Sweet Life is a unique South Korean-style cafe in the heart of Newry. We create indulgent foods made fresh to order, bringing authentic Korean flavors to Ireland.
                </p>
                <p className="text-lg text-rich-brown/80 mb-8 leading-relaxed">
                  Our mission is to create a warm, welcoming space where you can enjoy delicious food, refreshing drinks, and sweet treats in a cozy atmosphere.
                </p>
                <Link href="/about" className="btn btn-outline inline-flex items-center">
                  Learn More About Us
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-warm aspect-[4/3]">
                  <Image
                    src="/SLNEWRY.webp"
                    alt="Sweet Life Cafe Interior"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                {/* Floating accent card */}
                <div className="absolute -bottom-6 -left-6 bg-primary text-charcoal px-6 py-4 rounded-xl shadow-lg">
                  <p className="font-display font-bold text-2xl">Since 2019</p>
                  <p className="text-sm opacity-80">Serving Newry</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          REVIEWS SECTION
      ═══════════════════════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <GoogleReviews />
      </ScrollReveal>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SUSHI SECTION - Premium presentation
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-charcoal text-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[450px]">
          {/* Content */}
          <div className="flex items-center px-8 py-10 lg:px-16 lg:py-12 order-2 lg:order-1">
            <ScrollReveal>
              <div className="max-w-lg">
                <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                  Pre-Order Only
                </span>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Fresh Sushi,
                  <br />
                  <span className="text-primary">Made to Order</span>
                </h2>
                <p className="text-lg text-white/70 mb-6 leading-relaxed">
                  Experience our selection of freshly made sushi, from classic rolls to creative specials. Premium ingredients, expert technique.
                </p>
                <div className="bg-white/10 border-l-4 border-primary p-4 mb-8 rounded-r-lg backdrop-blur-sm">
                  <p className="font-medium">
                    All sushi items require <span className="text-primary font-bold">advance ordering</span> to ensure maximum freshness.
                  </p>
                </div>
                <Link href="/sushi" className="btn btn-primary inline-flex items-center">
                  View Sushi Menu
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Image */}
          <ScrollReveal direction="right" className="relative h-[300px] lg:h-auto order-1 lg:order-2">
            <Image
              src="/SushiPlatter.webp"
              alt="Fresh Sushi Platter"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-charcoal/30 lg:bg-gradient-to-r" />
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          PRIVATE EVENTS - Full-width hero treatment
      ═══════════════════════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <Image
            src="/private-room.webp"
            alt="Private event space at Sweet Life"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/50 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container">
              <div className="max-w-xl text-white">
                <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                  Special Events
                </span>
                <h3 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  Private Events
                  <br />
                  <span className="text-primary">& Parties</span>
                </h3>
                <p className="text-lg text-white/80 mb-6">
                  Celebrate birthdays, baby showers, or gatherings in our cozy upstairs room. Full catering available.
                </p>

                {/* KPI Stat Blocks - Prominent display */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-4 rounded-xl border border-white/20 text-center">
                    <Users size={28} className="text-primary mx-auto mb-2" />
                    <div className="font-display text-2xl font-bold text-white">30</div>
                    <div className="text-white/60 text-xs uppercase tracking-wide">Guests Max</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-4 rounded-xl border border-white/20 text-center">
                    <UtensilsCrossed size={28} className="text-primary mx-auto mb-2" />
                    <div className="font-display text-2xl font-bold text-white">Full</div>
                    <div className="text-white/60 text-xs uppercase tracking-wide">Catering</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-4 rounded-xl border border-white/20 text-center">
                    <Lock size={28} className="text-primary mx-auto mb-2" />
                    <div className="font-display text-2xl font-bold text-white">Private</div>
                    <div className="text-white/60 text-xs uppercase tracking-wide">Space</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-4 rounded-xl border border-white/20 text-center">
                    <UserCheck size={28} className="text-primary mx-auto mb-2" />
                    <div className="font-display text-2xl font-bold text-white">Dedicated</div>
                    <div className="text-white/60 text-xs uppercase tracking-wide">Staff</div>
                  </div>
                </div>

                <Link
                  href="/bookings"
                  className="btn bg-white text-charcoal hover:bg-primary hover:text-charcoal inline-flex items-center"
                >
                  Book the Room
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ═══════════════════════════════════════════════════════════════════════════
          FIND US - Map only (Hours & Contact in footer)
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 bg-charcoal text-white">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-10">
              <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-3 block">
                Find Us
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Visit Sweet Life
              </h2>
              <a
                href="https://maps.google.com/?q=12+Monaghan+St,+Newry+BT35+6AA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-lg text-white/70 hover:text-primary transition-colors"
              >
                <MapPin size={20} className="mr-2 text-primary" />
                12 Monaghan St, Newry BT35 6AA
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="max-w-4xl mx-auto">
              <div className="aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2328.9160391331177!2d-6.340289684069388!3d54.17557798015985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4860e39752bb8bdb%3A0xe7da43be7a44acb9!2s12%20Monaghan%20St%2C%20Newry%20BT35%206AA%2C%20UK!5e0!3m2!1sen!2sie!4v1652354523691!5m2!1sen!2sie"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Sweet Life Ireland Location"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
