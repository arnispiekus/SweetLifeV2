'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FeaturedCarousel from '@/components/ui/FeaturedCarousel';
import MenuCategory from '@/components/menu/MenuCategory';
import type { MenuCategory as MenuCategoryData } from '@/data/menuData';
import { ArrowRight, MessageCircle, Download, Eye, FileText, Info, Leaf, Sparkles, Wheat } from 'lucide-react';
import { ScrollReveal, FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';

// Interim: FoodServe (foodserveadmin.com) ordering platform is no longer used.
// Routed to WhatsApp for now, matching the existing booking CTA pattern.
const WHATSAPP_ORDER_URL = 'https://wa.me/447716508513?text=Hi%2C%20I%27d%20like%20to%20place%20an%20order%20for%20pickup.';

// Dietary filter options
const dietaryFilters = [
  { id: 'all', label: 'All Items', icon: Sparkles, count: 184 },
  { id: 'keto', label: 'Keto', icon: Sparkles, count: 6 },
  { id: 'vegan', label: 'Vegan', icon: Leaf, count: 6 },
  { id: 'gf', label: 'Gluten Free', icon: Wheat, count: 18 },
];

export default function MenuView({ categories }: { categories: MenuCategoryData[] }) {
  const [activeFilter, setActiveFilter] = useState('all');

  // Scroll to category
  const scrollToCategory = (categoryName: string) => {
    const id = `category-${categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };
  return (
    <div className="overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════════════════
          HERO SECTION - Appetizing visual
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[70vh] flex items-center -mt-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/Bibimbap.webp"
            alt="Delicious Bibimbap"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-charcoal/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container pt-16">
          <div className="max-w-2xl">
            <FadeIn delay={0.2}>
              <span className="text-primary font-semibold tracking-[0.3em] uppercase text-sm mb-6 block">
                Fresh & Made to Order
              </span>
            </FadeIn>
            <FadeIn delay={0.3}>
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] mb-8">
                Our Menu
              </h1>
            </FadeIn>
            <FadeIn delay={0.5}>
              <p className="text-xl md:text-2xl text-white/80 max-w-xl leading-relaxed mb-10">
                From Korean classics to artisan coffee, explore our full selection of freshly prepared dishes and drinks.
              </p>
            </FadeIn>
            <FadeIn delay={0.6}>
              <div className="flex flex-wrap gap-4">
                <a
                  href={WHATSAPP_ORDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-glow inline-flex items-center"
                >
                  <MessageCircle size={20} className="mr-3" />
                  Order via WhatsApp
                </a>
                <a
                  href="/SweetLifeMenuNewry.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-charcoal inline-flex items-center transition-all duration-300"
                >
                  <Eye size={20} className="mr-3" />
                  View PDF Menu
                </a>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Gradient fade to next section */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-warm-cream to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          PDF MENU CARD - Quick access
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-warm-cream">
        <div className="container">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-warm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  {/* Icon Section */}
                  <div className="bg-primary p-8 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-charcoal mx-auto mb-4" />
                      <p className="font-display text-2xl font-bold text-charcoal">
                        Full Menu
                      </p>
                      <p className="text-charcoal/70 text-sm">PDF with photos</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-2 p-8 flex flex-col justify-center">
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-4">
                      Prefer a Visual Menu?
                    </h2>
                    <p className="text-rich-brown/70 mb-6">
                      View or download our beautifully designed menu with photos, descriptions, and complete pricing.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="/SweetLifeMenuNewry.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-primary inline-flex items-center"
                      >
                        <Eye size={16} className="mr-2" />
                        View Menu
                      </a>
                      <a
                        href="/SweetLifeMenuNewry.pdf"
                        download="SweetLifeMenuNewry.pdf"
                        className="btn btn-sm btn-outline inline-flex items-center"
                      >
                        <Download size={16} className="mr-2" />
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SPECIALTIES CAROUSEL
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                Must Try
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6">
                Our Specialties
              </h2>
              <p className="text-lg text-rich-brown/70 max-w-2xl mx-auto">
                Signature dishes and beloved creations that define the Sweet Life experience.
              </p>
            </div>
          </ScrollReveal>

          <FeaturedCarousel />

          <ScrollReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-14">
              <Link
                href="/specialty-menu"
                className="btn btn-primary inline-flex items-center text-lg px-8 py-4"
              >
                View Specialty Items
                <ArrowRight size={20} className="ml-3" />
              </Link>
              <a
                href={WHATSAPP_ORDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline inline-flex items-center text-lg px-8 py-4"
              >
                <MessageCircle size={20} className="mr-3" />
                Order via WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          FULL MENU CATEGORIES
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-warm-beige">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-10">
              <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                Complete Selection
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6">
                Full Menu
              </h2>
              <p className="text-lg text-rich-brown/70 max-w-2xl mx-auto">
                All items made fresh to order using premium ingredients
              </p>
            </div>
          </ScrollReveal>

          {/* Dietary Filter Bar */}
          <ScrollReveal delay={0.1}>
            <div className="bg-white rounded-2xl shadow-warm p-4 mb-8 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <span className="text-sm font-semibold text-charcoal whitespace-nowrap">Filter by:</span>
                <div className="flex flex-wrap justify-center gap-2">
                  {dietaryFilters.map((filter) => {
                    const Icon = filter.icon;
                    return (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          activeFilter === filter.id
                            ? 'bg-primary text-charcoal shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Icon size={16} />
                        {filter.label}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          activeFilter === filter.id
                            ? 'bg-charcoal/20'
                            : 'bg-gray-200'
                        }`}>
                          {filter.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Quick Jump Category Pills */}
          <ScrollReveal delay={0.15}>
            <div className="mb-10 overflow-x-auto pb-2 -mx-4 px-4">
              <div className="flex gap-2 min-w-max">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => scrollToCategory(category.name)}
                    className="px-4 py-2 bg-white rounded-full text-sm font-medium text-charcoal hover:bg-primary hover:text-charcoal transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <StaggerContainer className="space-y-6" staggerDelay={0.05}>
            {categories.map((category) => (
              <StaggerItem key={category.id}>
                <MenuCategory
                  name={category.name}
                  items={category.items}
                  activeFilter={activeFilter}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Dietary Info */}
          <ScrollReveal delay={0.3}>
            <div className="mt-16 max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-warm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Info className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-charcoal mb-2">
                      Special Dietary Requirements
                    </h3>
                    <p className="text-rich-brown/70 leading-relaxed">
                      Please inform our staff about any allergies or dietary restrictions. We offer vegetarian, vegan, and gluten-free options and can accommodate most dietary needs.
                    </p>
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
      <section className="py-16 bg-primary relative overflow-hidden">
        {/* Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container relative">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-2">
                  Ready to Order?
                </h3>
                <p className="text-charcoal/70 text-lg">
                  Skip the queue - order online for pickup or delivery
                </p>
              </div>
              <a
                href={WHATSAPP_ORDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-charcoal text-white hover:bg-espresso whitespace-nowrap inline-flex items-center"
              >
                <MessageCircle size={20} className="mr-3" />
                Order via WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
