'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { ScrollReveal, FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';
import { ArrowRight, Sparkles, Coffee, IceCream, GlassWater, Utensils, Leaf, Heart } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import {
  bingsuItems,
  goldenToastItems,
  milkTeaItems,
  fruitTeaItems,
  bobaItems,
} from '@/data/specialtyData';

// Custom animation styles
const animationStyles = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) scale(1);
      opacity: 0.4;
    }
    25% {
      transform: translateY(-15px) scale(1.2);
      opacity: 0.6;
    }
    50% {
      transform: translateY(-25px) scale(1.1);
      opacity: 0.5;
    }
    75% {
      transform: translateY(-15px) scale(1.3);
      opacity: 0.7;
    }
  }

  .floating-bubble {
    animation: float 5s ease-in-out infinite;
  }

  @keyframes snowfall {
    0% {
      transform: translateY(-20px) rotate(0deg);
      opacity: 0;
    }
    5% {
      opacity: 0.8;
    }
    95% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }

  .snowflake {
    animation: snowfall 12s linear infinite;
    position: absolute;
    color: rgba(135, 206, 235, 0.8);
    font-size: 1.2rem;
    pointer-events: none;
    text-shadow: 0 0 10px rgba(135, 206, 235, 0.5);
  }

  .swiper-pagination-bullet {
    background: #ffe0b2;
    opacity: 1;
    width: 10px;
    height: 10px;
    margin: 0 4px !important;
    transition: background 0.3s, transform 0.3s;
  }
  .swiper-pagination-bullet-active {
    background: #F79D28;
    transform: scale(1.3);
  }
`;

// Snowflake component for cleaner rendering
const Snowflakes = () => {
  const snowflakePositions = [
    { left: '5%', delay: '0s', duration: '12s' },
    { left: '10%', delay: '1s', duration: '14s' },
    { left: '15%', delay: '2s', duration: '13s' },
    { left: '20%', delay: '0.5s', duration: '15s' },
    { left: '25%', delay: '1.5s', duration: '12.5s' },
    { left: '30%', delay: '2.5s', duration: '13.5s' },
    { left: '35%', delay: '0.8s', duration: '14.5s' },
    { left: '40%', delay: '1.8s', duration: '12.8s' },
    { left: '45%', delay: '2.8s', duration: '13.8s' },
    { left: '50%', delay: '3s', duration: '16s' },
    { left: '55%', delay: '3.5s', duration: '15.5s' },
    { left: '60%', delay: '4s', duration: '14.8s' },
    { left: '65%', delay: '4.5s', duration: '13.2s' },
    { left: '70%', delay: '5s', duration: '15.2s' },
    { left: '75%', delay: '5.5s', duration: '12.7s' },
    { left: '80%', delay: '6s', duration: '14.3s' },
    { left: '85%', delay: '6.5s', duration: '13.7s' },
    { left: '90%', delay: '7s', duration: '15.8s' },
    { left: '95%', delay: '7.5s', duration: '14.2s' },
  ];

  const snowflakeChars = ['❄', '❅', '❆'];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {snowflakePositions.map((pos, idx) => (
        <div
          key={idx}
          className="snowflake"
          style={{
            left: pos.left,
            top: '-50px',
            animationDelay: pos.delay,
            animationDuration: pos.duration,
          }}
        >
          {snowflakeChars[idx % 3]}
        </div>
      ))}
    </div>
  );
};

// Floating bubbles component
const FloatingBubbles = () => {
  const bubbles = [
    { top: '5%', left: '10%', size: 48, delay: '0s', duration: '5s' },
    { top: '15%', right: '15%', size: 40, delay: '1s', duration: '6s' },
    { top: '8%', left: '25%', size: 64, delay: '2s', duration: '5.5s' },
    { top: '12%', right: '50%', size: 32, delay: '0.8s', duration: '4s' },
    { top: '25%', right: '33%', size: 44, delay: '0.5s', duration: '4.5s' },
    { top: '35%', left: '50%', size: 32, delay: '1.5s', duration: '5s' },
    { top: '28%', left: '16%', size: 28, delay: '1.2s', duration: '4.8s' },
    { top: '55%', left: '20%', size: 56, delay: '0.2s', duration: '5.3s' },
    { top: '65%', right: '25%', size: 40, delay: '1.3s', duration: '4.6s' },
    { top: '58%', left: '75%', size: 44, delay: '0.6s', duration: '5.1s' },
    { top: '72%', right: '33%', size: 32, delay: '1.7s', duration: '4.3s' },
    { top: '82%', right: '20%', size: 28, delay: '1.9s', duration: '4.5s' },
    { top: '88%', left: '25%', size: 48, delay: '0.5s', duration: '5.6s' },
    { top: '45%', left: '33%', size: 32, delay: '0.9s', duration: '5.1s' },
    { top: '52%', right: '40%', size: 52, delay: '1.4s', duration: '4.8s' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {bubbles.map((bubble, idx) => (
        <div
          key={idx}
          className="absolute rounded-full bg-primary/40 floating-bubble"
          style={{
            top: bubble.top,
            left: bubble.left,
            right: bubble.right,
            width: bubble.size,
            height: bubble.size,
            animationDelay: bubble.delay,
            animationDuration: bubble.duration,
          }}
        />
      ))}
    </div>
  );
};

export default function SpecialtyMenuPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />

      <div className="overflow-x-hidden">
        {/* ═══════════════════════════════════════════════════════════════════════════
            HERO SECTION - Dramatic visual opening
        ═══════════════════════════════════════════════════════════════════════════ */}
        <section className="relative min-h-[75vh] flex items-center -mt-16 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/Bingsu/OreoCrunchBingsu.webp"
              alt="Signature Korean Bingsu"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/70 to-transparent" />
          </div>

          {/* Snowflakes in hero */}
          <Snowflakes />

          {/* Hero Content */}
          <div className="relative z-10 container pt-16">
            <div className="max-w-3xl">
              <FadeIn delay={0.2}>
                <span className="text-primary font-semibold tracking-[0.3em] uppercase text-sm mb-6 block">
                  Our Best Dishes
                </span>
              </FadeIn>
              <FadeIn delay={0.3}>
                <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] mb-8">
                  Signature
                  <br />
                  <span className="text-primary">Collection</span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.5}>
                <p className="text-xl md:text-2xl text-white/80 max-w-xl leading-relaxed mb-10">
                  Customer favorites from our savory Korean dishes to sweet Bingsu and refreshing Bubble Teas — discover what makes us special.
                </p>
              </FadeIn>
              <FadeIn delay={0.6}>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="#savory"
                    className="btn btn-primary btn-glow inline-flex items-center"
                  >
                    <Utensils size={20} className="mr-3" />
                    Savory Favorites
                  </a>
                  <a
                    href="#bingsu"
                    className="btn bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-charcoal inline-flex items-center transition-all duration-300"
                  >
                    <IceCream size={20} className="mr-3" />
                    Sweet Treats
                  </a>
                  <a
                    href="#healthy"
                    className="btn bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-charcoal inline-flex items-center transition-all duration-300"
                  >
                    <Leaf size={20} className="mr-3" />
                    Healthy Options
                  </a>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Gradient fade to next section */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-warm-cream to-transparent" />
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════════
            SAVORY SIGNATURES - Customer Favorites
        ═══════════════════════════════════════════════════════════════════════════ */}
        <section id="savory" className="py-20 md:py-28 bg-warm-cream">
          <div className="container">
            <ScrollReveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <Utensils size={16} />
                  Customer Favorites
                </div>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6">
                  Savory Signatures
                </h2>
                <p className="text-lg text-rich-brown/70 max-w-3xl mx-auto leading-relaxed">
                  These dishes have earned rave reviews from our customers. Fresh ingredients, authentic Korean flavors, and made-to-order quality.
                </p>
              </div>
            </ScrollReveal>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto" staggerDelay={0.15}>
              {[
                {
                  name: 'Poke Bowl',
                  description: 'Fresh cubed salmon or tuna over seasoned rice with avocado, edamame, seaweed, and our signature poke sauce.',
                  image: '/Lunch/PokeBowl.webp',
                  badge: 'Most Popular',
                  badgeColor: 'bg-primary text-charcoal'
                },
                {
                  name: 'Bibimbap',
                  description: 'Traditional Korean rice bowl with assorted vegetables, a fried egg, and spicy gochujang sauce served in a sizzling hot stone bowl.',
                  image: '/Bibimbap.webp',
                  badge: 'Authentic',
                  badgeColor: 'bg-red-500 text-white'
                },
                {
                  name: 'Sourdough Pizza',
                  description: 'Artisan sourdough crust topped with fresh ingredients. A customer favorite for lunch or a light dinner.',
                  image: '/Lunch/SourdoughPizza.webp',
                  badge: 'Popular',
                  badgeColor: 'bg-primary text-charcoal'
                },
                {
                  name: 'Ramen Soup',
                  description: 'Rich, savory broth with chewy noodles, tender pork, soft-boiled egg, and fresh vegetables.',
                  image: '/Lunch/RamenSoup.webp',
                  badge: 'Warming',
                  badgeColor: 'bg-amber-500 text-white'
                },
                {
                  name: 'Souffle Pancakes',
                  description: 'Cloud-like fluffy Japanese-style pancakes, light as air and served with whipped butter and maple syrup.',
                  image: '/souffle.webp',
                  badge: 'Iconic',
                  badgeColor: 'bg-primary text-charcoal'
                },
                {
                  name: 'Spinach Cake',
                  description: 'Our famous green velvet cake with cream cheese frosting. Surprisingly delicious and Instagram-worthy.',
                  image: '/Cakes/Spinach.webp',
                  badge: 'Must Try',
                  badgeColor: 'bg-green-600 text-white'
                }
              ].map((item, idx) => (
                <StaggerItem key={idx}>
                  <div className="group bg-white rounded-2xl shadow-warm overflow-hidden hover:shadow-warm-lg transition-all duration-500 h-full hover:-translate-y-2">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {item.badge && (
                        <div className={`absolute top-4 left-4 ${item.badgeColor} px-3 py-1 rounded-full text-xs font-bold`}>
                          {item.badge}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-xl font-bold text-charcoal mb-2">{item.name}</h3>
                      <p className="text-rich-brown/70 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <FadeIn delay={0.3}>
              <div className="text-center mt-12">
                <Link
                  href="/menu"
                  className="btn btn-primary inline-flex items-center"
                >
                  View Full Menu
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════════
            BINGSU SECTION - Korean Shaved Ice
        ═══════════════════════════════════════════════════════════════════════════ */}
        <section id="bingsu" className="py-20 md:py-28 bg-gradient-to-b from-[#E8F4F8] to-white relative overflow-hidden">
          {/* Snowfall Animation */}
          <Snowflakes />

          <div className="container relative z-10">
            <ScrollReveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <Sparkles size={16} />
                  Our Signature
                </div>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6">
                  Korean Bingsu
                </h2>
                <p className="text-lg text-rich-brown/70 max-w-3xl mx-auto leading-relaxed">
                  A unique and refreshing treat made with finely shaved milk ice, topped with sweet syrups, fresh fruits, and delicious toppings. Each bowl is a work of art, perfect for sharing or savoring alone.
                </p>
              </div>
            </ScrollReveal>

            {/* Bingsu Carousel */}
            <FadeIn delay={0.2}>
              <div className="max-w-7xl mx-auto">
                <Swiper
                  modules={[Autoplay, Pagination]}
                  slidesPerView={1}
                  spaceBetween={24}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  breakpoints={{
                    768: { slidesPerView: 2, spaceBetween: 32 },
                    1024: { slidesPerView: 3, spaceBetween: 32 },
                  }}
                  className="!pb-14"
                >
                  {bingsuItems.map((item, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="group bg-white rounded-2xl shadow-warm overflow-hidden hover:shadow-warm-lg transition-all duration-500 border border-gray-100 h-full hover:-translate-y-2">
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <div className="p-6 text-center">
                          <h3 className="font-display text-2xl font-bold text-charcoal mb-2">{item.name}</h3>
                          <p className="text-rich-brown/70">{item.desc}</p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════════
            GOLDEN TOAST SECTION - Full Bleed Image Break
        ═══════════════════════════════════════════════════════════════════════════ */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <Image
            src="/goldentoast1.webp"
            alt="Golden Toast"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-charcoal/90 via-charcoal/60 to-charcoal/30" />
          <div className="absolute inset-0 flex items-center">
            <div className="container">
              <ScrollReveal direction="right">
                <div className="max-w-lg ml-auto text-right">
                  <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                    Indulgent Treat
                  </span>
                  <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                    Golden Toast
                  </h2>
                  <p className="text-lg text-white/80 mb-6">
                    Thick slices of perfectly toasted bread, crispy outside and pillowy soft inside, loaded with your choice of decadent toppings.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Golden Toast Grid */}
        <section className="py-20 md:py-28 bg-warm-beige">
          <div className="container">
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto" staggerDelay={0.1}>
              {goldenToastItems.map((item, idx) => (
                <StaggerItem key={idx}>
                  <div className="group bg-white rounded-2xl shadow-warm overflow-hidden hover:shadow-warm-lg transition-all duration-500 h-full hover:-translate-y-2">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-xl font-bold text-charcoal mb-2">{item.name}</h3>
                      <p className="text-rich-brown/70 text-sm">{item.desc}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════════
            HEALTHY SIGNATURES - Keto, Vegan, Gluten-Free
        ═══════════════════════════════════════════════════════════════════════════ */}
        <section id="healthy" className="py-20 md:py-28 bg-charcoal text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

          <div className="container relative z-10">
            <ScrollReveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <Leaf size={16} />
                  Dietary Friendly
                </div>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Healthy Signatures
                </h2>
                <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
                  We believe everyone deserves delicious food. Explore our 18 Keto, Vegan, and Gluten-Free options — no compromises on taste.
                </p>
              </div>
            </ScrollReveal>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto" staggerDelay={0.15}>
              {[
                {
                  name: 'Sushi Bowl (K)(GF)',
                  description: 'Ketogenic and gluten-free! Fresh sashimi over cauliflower rice with avocado, cucumber, and sesame.',
                  image: '/Keto/SushiBowl.webp',
                  tags: ['Keto', 'GF'],
                  tagColors: ['bg-blue-500', 'bg-amber-500']
                },
                {
                  name: 'Vegan Burger (GF)(V)',
                  description: 'Plant-based patty with fresh lettuce, tomato, pickles, and vegan aioli on a gluten-free bun.',
                  image: '/Keto/VeganBurger.webp',
                  tags: ['Vegan', 'GF'],
                  tagColors: ['bg-green-500', 'bg-amber-500']
                },
                {
                  name: 'Poke Bowl (GF)',
                  description: 'Naturally gluten-free with fresh fish, rice, and our signature sauce made without soy.',
                  image: '/Lunch/PokeBowl.webp',
                  tags: ['GF', 'Popular'],
                  tagColors: ['bg-amber-500', 'bg-primary']
                }
              ].map((item, idx) => (
                <StaggerItem key={idx}>
                  <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 h-full hover:-translate-y-2">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {item.tags.map((tag, tagIdx) => (
                          <span key={tagIdx} className={`${item.tagColors[tagIdx]} text-white px-2 py-1 rounded text-xs font-bold`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-xl font-bold mb-2">{item.name}</h3>
                      <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <FadeIn delay={0.3}>
              <div className="text-center mt-12">
                <Link
                  href="/menu"
                  className="btn bg-white text-charcoal hover:bg-primary inline-flex items-center"
                >
                  <Heart size={18} className="mr-2" />
                  View All 18 Dietary Options
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════════
            BUBBLE TEA SECTION - Refreshing drinks
        ═══════════════════════════════════════════════════════════════════════════ */}
        <section id="bubble-tea" className="py-20 md:py-28 bg-white relative overflow-hidden">
          {/* Subtle background texture instead of floating bubbles */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }} />

          <div className="container relative z-10">
            <ScrollReveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <GlassWater size={16} />
                  Refreshing Drinks
                </div>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6">
                  Bubble Teas
                </h2>
                <p className="text-lg text-rich-brown/70 max-w-2xl mx-auto">
                  From creamy milk teas to refreshing fruit infusions — customize your perfect drink with our selection of toppings.
                </p>
              </div>
            </ScrollReveal>

            {/* Boba Toppings */}
            <ScrollReveal delay={0.1}>
              <div className="max-w-4xl mx-auto mb-20">
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl p-8 md:p-12">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-charcoal text-center mb-2">
                    Add Boba Toppings
                  </h3>
                  <p className="text-center text-rich-brown/70 mb-8">+£1.00 each</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {bobaItems.map((item, idx) => (
                      <div key={idx} className="group bg-white rounded-2xl shadow-warm overflow-hidden hover:shadow-warm-lg transition-all duration-500 hover:-translate-y-1">
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        <div className="p-5 text-center">
                          <h4 className="font-display text-lg font-bold text-charcoal mb-1">{item.name}</h4>
                          <p className="text-sm text-rich-brown/70">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Milk Teas */}
            <ScrollReveal delay={0.2}>
              <div className="mb-20">
                <div className="text-center mb-10">
                  <h3 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-2">
                    Milk Teas
                  </h3>
                  <p className="text-rich-brown/70">Available hot or cold</p>
                </div>

                <Swiper
                  modules={[Autoplay, Pagination]}
                  slidesPerView={2}
                  spaceBetween={16}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 3500, disableOnInteraction: false }}
                  breakpoints={{
                    640: { slidesPerView: 3, spaceBetween: 24 },
                    1024: { slidesPerView: 5, spaceBetween: 24 },
                  }}
                  className="!pb-14"
                >
                  {milkTeaItems.map((item, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="group bg-white rounded-2xl shadow-warm overflow-hidden hover:shadow-warm-lg transition-all duration-500 hover:-translate-y-1">
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        <div className="p-4 text-center">
                          <h4 className="font-display text-lg font-bold text-charcoal">{item.name}</h4>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </ScrollReveal>

            {/* Fruit Teas */}
            <ScrollReveal delay={0.3}>
              <div>
                <div className="text-center mb-10">
                  <h3 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-2">
                    Fruit Teas
                  </h3>
                  <p className="text-rich-brown/70">Still or sparkling, cold or hot</p>
                </div>

                <Swiper
                  modules={[Autoplay, Pagination]}
                  slidesPerView={2}
                  spaceBetween={16}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  breakpoints={{
                    640: { slidesPerView: 3, spaceBetween: 24 },
                    1024: { slidesPerView: 4, spaceBetween: 24 },
                  }}
                  className="!pb-14"
                >
                  {fruitTeaItems.map((item, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="group bg-white rounded-2xl shadow-warm overflow-hidden hover:shadow-warm-lg transition-all duration-500 hover:-translate-y-1">
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        <div className="p-4 text-center">
                          <h4 className="font-display text-lg font-bold text-charcoal mb-1">{item.name}</h4>
                          {item.desc && (
                            <p className="text-sm text-rich-brown/70">{item.desc}</p>
                          )}
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
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
                    Ready to Try Our Specialties?
                  </h3>
                  <p className="text-white/60 text-lg">
                    Visit us to experience these unique creations or check out our full menu.
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
    </>
  );
}
