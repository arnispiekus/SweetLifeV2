'use client';

import Image from 'next/image';
import Link from 'next/link';
import SushiGallery from '@/components/sushi/SushiGallery';
import SushiOrderForm from '@/components/sushi/SushiOrderForm';
import LazyVideo from '@/components/ui/LazyVideo';
import { sushiVideos, sushiVariations } from '@/data/sushiData';
import { Phone, Mail, Clock, ArrowRight, Utensils, Leaf, Fish, Beef, Quote, Coffee, Sparkles } from 'lucide-react';
import { ScrollReveal, FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';

const variationIcons: Record<string, React.ReactNode> = {
  Meat: <Beef size={28} />,
  Seafood: <Fish size={28} />,
  Vegan: <Leaf size={28} />,
  Mix: <Utensils size={28} />,
};

export default function SushiPage() {
  return (
    <div className="overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════════════════
          HERO SECTION - Premium visual
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[75vh] flex items-center -mt-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/SushiHero.webp"
            alt="Fresh Sushi Platters"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/70 to-charcoal/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container pt-16">
          <div className="max-w-3xl">
            <FadeIn delay={0.2}>
              <span className="text-primary font-semibold tracking-[0.3em] uppercase text-sm mb-6 block">
                Made to Order
              </span>
            </FadeIn>
            <FadeIn delay={0.3}>
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] mb-8">
                Sushi
                <br />
                <span className="text-primary">Platters</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.5}>
              <p className="text-xl md:text-2xl text-white/80 max-w-xl leading-relaxed mb-10">
                Fresh, handcrafted sushi platters prepared with premium ingredients and expert technique. Pre-order for pickup.
              </p>
            </FadeIn>
            <FadeIn delay={0.6}>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#order"
                  className="btn btn-primary btn-glow inline-flex items-center"
                >
                  Pre-Order Now
                  <ArrowRight size={20} className="ml-3" />
                </a>
                <a
                  href="#gallery"
                  className="btn bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-charcoal inline-flex items-center transition-all duration-300"
                >
                  View Gallery
                </a>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Gradient fade to next section */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-warm-cream to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          INTRO SECTION - Handcrafted Excellence
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-warm-cream">
        <div className="container">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                Premium Quality
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-8">
                Handcrafted Excellence
              </h2>
              <p className="text-lg md:text-xl text-rich-brown/70 leading-relaxed mb-12">
                Each sushi platter is made to order using premium ingredients and expert technique. Choose from our selection of variations including meat, seafood, vegan options, or a curated mix of all three.
              </p>
            </div>
          </ScrollReveal>

          {/* Variation Cards */}
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto" staggerDelay={0.1}>
            {sushiVariations.map((variation) => (
              <StaggerItem key={variation.title}>
                <div className="group bg-white rounded-2xl shadow-warm p-6 md:p-8 text-center hover:shadow-warm-lg transition-all duration-500 hover:-translate-y-2 h-full">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {variationIcons[variation.title]}
                  </div>
                  <h3 className="font-display text-xl font-bold text-charcoal mb-2">
                    {variation.title}
                  </h3>
                  <p className="text-rich-brown/70 text-sm leading-relaxed">
                    {variation.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          GALLERY SECTION - Full Bleed Image Break
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src="/Sushi/Sushi7.jpg"
          alt="Fresh Sushi Platter"
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
                  Fresh & Premium
                </span>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  Made With Care
                </h2>
                <p className="text-lg text-white/80">
                  Every piece is carefully crafted using the finest ingredients, ensuring a taste of authentic sushi perfection.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section id="gallery" className="py-20 md:py-28 bg-white">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                Our Creations
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6">
                Fresh Sushi Gallery
              </h2>
              <p className="text-lg text-rich-brown/70 max-w-2xl mx-auto">
                Handcrafted sushi platters made with premium ingredients and expert technique
              </p>
            </div>
          </ScrollReveal>

          <FadeIn delay={0.2}>
            <div className="max-w-6xl mx-auto">
              <SushiGallery />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          VIDEO SECTION - Watch the Process
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-charcoal text-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
            <ScrollReveal>
              <div>
                <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                  Behind the Scenes
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                  Watch Our<br />
                  <span className="text-primary">Craft</span>
                </h2>
                <p className="text-lg text-white/70 leading-relaxed mb-8">
                  See how we handcraft each piece with care and precision. Every sushi platter tells a story of dedication to quality and authentic technique.
                </p>
                <a
                  href="#order"
                  className="btn btn-primary inline-flex items-center"
                >
                  Pre-Order Now
                  <ArrowRight size={18} className="ml-2" />
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <div className="rounded-2xl overflow-hidden shadow-warm-lg">
                <LazyVideo
                  src={sushiVideos[0].src}
                  poster={sushiVideos[0].poster}
                  alt={sushiVideos[0].alt}
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          TESTIMONIALS - Customer quotes about sushi
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-warm-cream relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

        <div className="container relative">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                What Customers Say
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal">
                Sushi Reviews
              </h2>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                quote: "The sushi platters are absolutely stunning! Fresh ingredients and beautiful presentation. Always order for our family gatherings.",
                author: "Sarah M.",
                detail: "Regular Customer"
              },
              {
                quote: "Best sushi in Newry! The vegan options are incredible - you'd never know they're plant-based. Such attention to detail.",
                author: "James K.",
                detail: "Vegan Platter"
              },
              {
                quote: "Pre-ordered for my birthday party and everyone was blown away. The mix platter had something for everyone.",
                author: "Emma T.",
                detail: "Party Order"
              }
            ].map((testimonial, index) => (
              <StaggerItem key={index}>
                <div className="bg-white rounded-2xl p-8 shadow-warm h-full flex flex-col">
                  <Quote className="w-10 h-10 text-primary/30 mb-4" />
                  <p className="text-rich-brown/80 leading-relaxed flex-grow mb-6 italic">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="border-t border-stone-200 pt-4">
                    <p className="font-semibold text-charcoal">{testimonial.author}</p>
                    <p className="text-sm text-primary">{testimonial.detail}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          ORDER FORM SECTION
      ═══════════════════════════════════════════════════════════════════════════ */}
      <div id="order">
        <SushiOrderForm />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          CROSS-SELL SECTION - Complete Your Order
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-charcoal text-white relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container relative">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                Perfect Pairings
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Complete Your Order
              </h2>
              <p className="text-white/60 max-w-xl mx-auto">
                Add these popular items to complement your sushi platter
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: 'Specialty Lattes',
                description: 'Try our famous Korean-style lattes - taro, matcha, or caramel.',
                image: '/Drinks/IcedMatcha.webp',
                icon: Coffee,
                link: '/menu#drinks'
              },
              {
                name: 'Golden Toast',
                description: 'Our signature dessert - crispy bread with ice cream & toppings.',
                image: '/GoldenToastBK.webp',
                icon: Sparkles,
                link: '/specialty-menu'
              },
              {
                name: 'Bingsu',
                description: 'Fluffy Korean shaved ice with premium toppings.',
                image: '/Bingsu.png.webp',
                icon: Sparkles,
                link: '/specialty-menu'
              }
            ].map((item, index) => (
              <StaggerItem key={index}>
                <Link href={item.link} className="group block">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500">
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <div className="w-10 h-10 bg-primary/90 rounded-lg flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-charcoal" />
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          CONTACT SECTION - How to Order
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <ScrollReveal>
            <div className="max-w-5xl mx-auto">
              <div className="bg-warm-cream rounded-3xl overflow-hidden shadow-warm">
                <div className="grid md:grid-cols-2">
                  {/* Contact Info */}
                  <div className="p-8 md:p-12 bg-primary">
                    <h3 className="font-display text-3xl font-bold text-charcoal mb-6">
                      Contact Us to Order
                    </h3>
                    <p className="text-charcoal/70 mb-8">
                      Have questions? Reach out directly and we&apos;ll help you with your sushi order.
                    </p>
                    <StaggerContainer className="space-y-4" staggerDelay={0.1}>
                      <StaggerItem>
                        <a
                          href="tel:+447716508513"
                          className="flex items-center p-4 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 group"
                        >
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                            <Phone size={22} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-charcoal/70">Call us</p>
                            <p className="font-semibold text-charcoal">+44 7716 508513</p>
                          </div>
                        </a>
                      </StaggerItem>
                      <StaggerItem>
                        <a
                          href="mailto:info@sweetlife.cafe"
                          className="flex items-center p-4 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 group"
                        >
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                            <Mail size={22} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-charcoal/70">Email us</p>
                            <p className="font-semibold text-charcoal">info@sweetlife.cafe</p>
                          </div>
                        </a>
                      </StaggerItem>
                      <StaggerItem>
                        <div className="flex items-center p-4 bg-white/90 backdrop-blur-sm rounded-xl">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                            <Clock size={22} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-charcoal/70">Collection Hours</p>
                            <p className="font-semibold text-charcoal">Mon-Sat 12-6pm, Sun 12-5pm</p>
                          </div>
                        </div>
                      </StaggerItem>
                    </StaggerContainer>
                  </div>

                  {/* Ordering Process */}
                  <div className="p-8 md:p-12">
                    <h3 className="font-display text-2xl font-bold text-charcoal mb-6">
                      Ordering Process
                    </h3>
                    <StaggerContainer className="space-y-4" staggerDelay={0.08}>
                      {[
                        'Select your sushi type (Meat, Seafood, Vegan, or Mix)',
                        'Choose your quantity (8, 16, 20, 30, or 50 pieces)',
                        'Fill out the pre-order form with your details',
                        'Submit your order request',
                        'Complete payment via Revolut link provided',
                        "We'll confirm your order and pickup time",
                      ].map((step, index) => (
                        <StaggerItem key={index}>
                          <div className="flex items-start group">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 mr-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                              <span className="text-sm font-bold text-primary group-hover:text-white transition-colors">{index + 1}</span>
                            </div>
                            <p className="text-rich-brown/80 leading-relaxed">{step}</p>
                          </div>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
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
                  Explore More of Our Menu
                </h3>
                <p className="text-white/60 text-lg">
                  Discover our full selection of Korean dishes, drinks, and desserts.
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
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
