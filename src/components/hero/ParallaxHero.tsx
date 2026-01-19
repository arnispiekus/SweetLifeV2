'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ShoppingBag, ChevronDown } from 'lucide-react';

interface ParallaxHeroProps {
  title?: string;
  highlightText?: string;
  subtitle?: string;
  backgroundImage: string;
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
}

export default function ParallaxHero({
  title = 'Sweet. Savory.',
  highlightText = 'Unforgettable.',
  subtitle = 'From authentic Korean Bingsu to vibrant poke bowls and gourmet coffee, discover the unexpected delights waiting for you at Sweet Life.',
  backgroundImage,
  ctaText = 'Order Now',
  ctaUrl = 'https://www.foodserveadmin.com/ordering/restaurant/menu?restaurant_uid=bf3e6aff-e235-4431-a82f-c5653e976642',
  secondaryCtaText = 'Explore Our Menu',
  secondaryCtaUrl = '/menu',
}: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms - background moves slower, content fades
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Disable parallax for users who prefer reduced motion
  const bgYValue = prefersReducedMotion ? '0%' : backgroundY;
  const contentYValue = prefersReducedMotion ? '0%' : contentY;

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center -mt-16 overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: bgYValue }}
      >
        <Image
          src={backgroundImage}
          alt="Sweet Life Cafe"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-110"
        />
        {/* Warm gradient overlay with subtle orange tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
      </motion.div>

      {/* Content with Parallax */}
      <motion.div
        className="relative z-10 container text-center text-white p-4"
        style={{
          y: contentYValue,
          opacity: prefersReducedMotion ? 1 : contentOpacity,
        }}
      >
        {/* Animated headline */}
        <motion.h2
          className="hero-headline text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-6 drop-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {title}{' '}
          <span className="text-primary drop-shadow-[0_2px_10px_rgba(247,157,40,0.5)]">
            {highlightText}
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto text-white/90 drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Primary CTA - Order Now */}
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-glow inline-flex items-center text-lg font-bold px-10 py-4 whitespace-nowrap"
          >
            <ShoppingBag size={22} className="mr-3" />
            {ctaText}
          </a>

          {/* Secondary CTA */}
          <Link
            href={secondaryCtaUrl}
            className="btn btn-outline text-white border-white hover:bg-white/20 px-8 py-4 whitespace-nowrap"
          >
            {secondaryCtaText}
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        style={{ opacity: prefersReducedMotion ? 1 : scrollIndicatorOpacity }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <motion.div
          className="flex flex-col items-center text-white/70 cursor-pointer hover:text-white transition-colors"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          onClick={() => {
            window.scrollTo({ top: window.innerHeight - 64, behavior: 'smooth' });
          }}
        >
          <span className="text-sm mb-2 font-medium">Scroll to explore</span>
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}
