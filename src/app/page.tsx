'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { MapPin, Clock, ArrowRight, Phone, ShoppingBag, Check, ChevronDown, Sparkles } from 'lucide-react';
import FeaturedCarousel from '@/components/ui/FeaturedCarousel';
import GoogleReviews from '@/components/ui/GoogleReviews';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/motion';

const FOODSERVE_URL = 'https://www.foodserveadmin.com/ordering/restaurant/menu?restaurant_uid=bf3e6aff-e235-4431-a82f-c5653e976642';

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
          {/* Rich gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/10" />
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
            <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-primary drop-shadow-[0_4px_30px_rgba(247,157,40,0.6)]">
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
              href={FOODSERVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-glow inline-flex items-center text-lg font-bold px-10 py-4 whitespace-nowrap"
            >
              <ShoppingBag size={22} className="mr-3" />
              Order Now
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
      <section className="relative bg-warm-cream">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Left: Large Image */}
          <ScrollReveal direction="left" className="relative h-[400px] lg:h-auto">
            <Image
              src="/sweetlifetakeaway.webp"
              alt="Sweet Life takeaway in branded packaging"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Decorative corner accent */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary clip-corner hidden lg:block" />
          </ScrollReveal>

          {/* Right: Content */}
          <div className="flex items-center px-8 py-16 lg:px-16 lg:py-24">
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
                  href={FOODSERVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-glow inline-flex items-center text-lg"
                >
                  <ShoppingBag size={20} className="mr-3" />
                  Start Your Order
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SPECIALTIES - Dramatic showcase
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white relative">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
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
          FULL-BLEED FOOD SHOWCASE - Visual break
      ═══════════════════════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
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
      <section className="py-20 md:py-28 bg-warm-beige relative overflow-hidden">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Content */}
          <div className="flex items-center px-8 py-16 lg:px-16 lg:py-24 order-2 lg:order-1">
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
          <ScrollReveal direction="right" className="relative h-[400px] lg:h-auto order-1 lg:order-2">
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
          PRIVATE ROOM - Full width showcase
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-warm-cream">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                Special Events
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6">
                Private Events & Parties
              </h2>
              <p className="text-lg text-rich-brown/70 max-w-2xl mx-auto mb-8">
                Celebrate birthdays, baby showers, or gatherings in our cozy upstairs room. Full catering available.
              </p>

              <StaggerContainer className="flex flex-wrap justify-center gap-4 mb-10">
                {[
                  'Up to 30 guests',
                  'Full catering menu',
                  'Private atmosphere',
                  'Dedicated staff',
                ].map((feature, i) => (
                  <StaggerItem
                    key={i}
                    className="bg-white px-5 py-2 rounded-full text-charcoal font-medium shadow-sm border border-warm-stone"
                  >
                    {feature}
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <Link
                href="/bookings"
                className="btn btn-primary btn-glow inline-flex items-center text-lg px-8 py-4"
              >
                Book the Room
                <ArrowRight size={20} className="ml-3" />
              </Link>
            </div>
          </ScrollReveal>

          {/* Full-width image */}
          <ScrollReveal delay={0.2}>
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-warm">
              <Image
                src="/private-room.webp"
                alt="Private event space at Sweet Life"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          LOCATION & HOURS - Modern card layout
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-charcoal text-white">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                Find Us
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Visit Sweet Life
              </h2>
              <p className="text-lg text-white/60 max-w-xl mx-auto">
                Conveniently located in the heart of Newry town centre
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Location Card */}
            <ScrollReveal delay={0.1}>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 h-full">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                  <MapPin className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-4">Location</h3>
                <a
                  href="https://maps.google.com/?q=12+Monaghan+St,+Newry+BT35+6AA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-primary transition-colors block mb-6"
                >
                  12 Monaghan St<br />
                  Newry BT35 6AA
                </a>
                <div className="aspect-video rounded-xl overflow-hidden">
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

            {/* Hours Card */}
            <ScrollReveal delay={0.2}>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 h-full">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                  <Clock className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-4">Opening Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-white/70">Mon - Wed</span>
                    <span className="font-medium">8am - 6pm</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-white/70">Thu - Fri</span>
                    <span className="font-medium">8am - 8pm</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-white/70">Saturday</span>
                    <span className="font-medium">9am - 6pm</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-white/70">Sunday</span>
                    <span className="text-red-400 font-medium">Closed</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Contact Card */}
            <ScrollReveal delay={0.3}>
              <div className="bg-primary rounded-2xl p-8 text-charcoal h-full flex flex-col">
                <div className="w-12 h-12 bg-charcoal/10 rounded-xl flex items-center justify-center mb-6">
                  <Phone className="text-charcoal" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
                <div className="space-y-4 flex-grow">
                  <a
                    href="tel:+447716508513"
                    className="block text-charcoal/80 hover:text-charcoal transition-colors"
                  >
                    +44 7716 508513
                  </a>
                  <a
                    href="mailto:info@sweetlifecafe.co.uk"
                    className="block text-charcoal/80 hover:text-charcoal transition-colors"
                  >
                    info@sweetlifecafe.co.uk
                  </a>
                  <a
                    href="https://wa.me/447716508513"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-charcoal/80 hover:text-charcoal transition-colors"
                  >
                    WhatsApp Us
                  </a>
                </div>
                <Link
                  href="/contact"
                  className="btn bg-charcoal text-white hover:bg-charcoal/90 mt-6 inline-flex items-center justify-center"
                >
                  Contact Page
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
