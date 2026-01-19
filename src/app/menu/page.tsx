'use client';

import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader';
import WaveSeparator from '@/components/ui/WaveSeparator';
import FeaturedCarousel from '@/components/ui/FeaturedCarousel';
import MenuCategory from '@/components/menu/MenuCategory';
import { menuData } from '@/data/menuData';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { ScrollReveal, FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';

export default function MenuPage() {
  return (
    <>
      <PageHeader
        title="Our Menu"
        subtitle="Discover our extensive selection of drinks, meals, and treats"
        backgroundImage="/displayfridge.webp"
      />

      {/* Wave Separator */}
      <WaveSeparator bgColor="bg-primary" fillColor="text-stone-50" />

      {/* PDF Menu Section */}
      <ScrollReveal>
        <section className="section bg-gradient-to-br from-primary/5 to-primary/10 py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 items-center">
                  {/* Left side - Visual element */}
                  <div className="lg:col-span-1 p-8 lg:p-12 flex justify-center lg:justify-start">
                    <div className="relative">
                      {/* Menu icon background */}
                      <div className="w-24 h-32 bg-gradient-to-br from-primary/20 to-primary/30 rounded-lg shadow-lg transform rotate-3 absolute -top-2 -left-2"></div>
                      <div className="w-24 h-32 bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-xl relative z-10 flex items-center justify-center">
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="drop-shadow-sm"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14,2 14,8 20,8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                          <polyline points="10,9 9,9 8,9"/>
                        </svg>
                      </div>
                      {/* Floating elements */}
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary/40 rounded-full animate-pulse"></div>
                      <div className="absolute -bottom-2 -right-3 w-2 h-2 bg-primary/60 rounded-full animate-pulse delay-300"></div>
                    </div>
                  </div>

                  {/* Right side - Content */}
                  <div className="lg:col-span-2 p-8 lg:p-12 lg:pl-0">
                    <div className="text-center lg:text-left">
                      <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                        Prefer a Visual Menu?
                      </h2>
                      <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                        You can view or download our beautifully designed full menu — including photos and more.
                      </p>

                      {/* Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <a
                          href="/SweetLifeMenuNewry.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-glow inline-flex items-center justify-center text-lg group"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-3 transition-transform duration-300 group-hover:scale-110"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          View Menu
                        </a>

                        <a
                          href="/SweetLifeMenuNewry.pdf"
                          download="SweetLifeMenuNewry.pdf"
                          className="btn btn-outline inline-flex items-center justify-center text-lg group"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-3 transition-transform duration-300 group-hover:translate-y-1"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7,10 12,15 17,10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                          </svg>
                          Download Menu
                        </a>
                      </div>

                      {/* Additional info */}
                      <div className="mt-6 text-sm text-stone-500 text-center lg:text-left">
                        <p>PDF format - High quality images - Complete pricing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Our Specialties Section */}
      <ScrollReveal>
        <section className="section bg-white">
          <div className="container">
            <SectionHeader
              title="Our Specialties"
              subtitle="Discover our signature dishes and most beloved creations"
              centered={true}
            />

            <FeaturedCarousel />

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 px-4 sm:px-0 text-center">
              <Link
                href="/specialty-menu"
                className="btn btn-outline inline-flex items-center text-lg px-8 py-4 w-full sm:w-auto justify-center"
              >
                View Specialty Items
                <ArrowRight size={20} className="ml-3" />
              </Link>
              <a
                href="https://www.foodserveadmin.com/ordering/restaurant/menu?restaurant_uid=bf3e6aff-e235-4431-a82f-c5653e976642&client_is_mobile=true"
                className="btn btn-primary inline-flex items-center text-lg px-8 py-4 w-full sm:w-auto justify-center"
              >
                <ShoppingBag size={20} className="mr-3" />
                Order Now
              </a>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Main Menu Section */}
      <section className="section bg-stone-50">
        <div className="container">
          <ScrollReveal>
            <SectionHeader
              title="Full Menu"
              subtitle="All our items are made fresh to order using premium ingredients"
            />
          </ScrollReveal>

          <StaggerContainer className="space-y-6" staggerDelay={0.05}>
            {menuData.map((category) => (
              <StaggerItem key={category.id}>
                <MenuCategory
                  name={category.name}
                  items={category.items}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.3}>
            <div className="bg-white p-6 rounded-lg shadow-md mt-12">
              <h3 className="text-xl font-semibold mb-4">Special Dietary Requirements</h3>
              <p className="text-stone-700">
                Please inform our staff about any allergies or dietary restrictions. We offer vegetarian, vegan, and gluten-free options and can accommodate most dietary needs.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
