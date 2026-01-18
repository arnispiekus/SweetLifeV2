'use client';

import Link from 'next/link';
import Image from 'next/image';
import PageHeader from '@/components/ui/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader';
import WaveSeparator from '@/components/ui/WaveSeparator';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import {
  bingsuItems,
  goldenToastItems,
  milkTeaItems,
  fruitTeaItems,
  bobaItems,
} from '@/data/specialtyData';

// Custom floating animation styles
const floatingBubbleStyles = `
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
      opacity: 1;
    }
    95% {
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }

  .snowflake {
    animation: snowfall 12s linear infinite;
    position: absolute;
    color: #87CEEB;
    font-size: 1rem;
    pointer-events: none;
  }
`;

// Swiper pagination color override
const swiperPaginationStyle = `
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

export default function SpecialtyMenuPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: floatingBubbleStyles + swiperPaginationStyle }} />
      <PageHeader
        title="Specialty Menu"
        subtitle="Discover our unique and signature creations with multiple flavors and variations"
        backgroundImage="/displayfridge.webp"
      />

      {/* Wave Separator */}
      <WaveSeparator bgColor="bg-primary" fillColor="text-white" />

      {/* Bingsu Section */}
      <section className="section bg-white relative overflow-hidden">
        {/* Snowfall Animation */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Snowflakes */}
          <div className="snowflake" style={{ left: '10%', top: '-50px', animationDelay: '0s', animationDuration: '12s' }}>&#10052;</div>
          <div className="snowflake" style={{ left: '20%', top: '-50px', animationDelay: '1s', animationDuration: '14s' }}>&#10053;</div>
          <div className="snowflake" style={{ left: '30%', top: '-50px', animationDelay: '2s', animationDuration: '13s' }}>&#10054;</div>
          <div className="snowflake" style={{ left: '40%', top: '-50px', animationDelay: '0.5s', animationDuration: '15s' }}>&#10052;</div>
          <div className="snowflake" style={{ left: '50%', top: '-50px', animationDelay: '1.5s', animationDuration: '12.5s' }}>&#10053;</div>
          <div className="snowflake" style={{ left: '60%', top: '-50px', animationDelay: '2.5s', animationDuration: '13.5s' }}>&#10054;</div>
          <div className="snowflake" style={{ left: '70%', top: '-50px', animationDelay: '0.8s', animationDuration: '14.5s' }}>&#10052;</div>
          <div className="snowflake" style={{ left: '80%', top: '-50px', animationDelay: '1.8s', animationDuration: '12.8s' }}>&#10053;</div>
          <div className="snowflake" style={{ left: '90%', top: '-50px', animationDelay: '2.8s', animationDuration: '13.8s' }}>&#10054;</div>

          {/* Additional snowflakes for more coverage */}
          <div className="snowflake" style={{ left: '15%', top: '-50px', animationDelay: '3s', animationDuration: '16s' }}>&#10052;</div>
          <div className="snowflake" style={{ left: '25%', top: '-50px', animationDelay: '3.5s', animationDuration: '15.5s' }}>&#10053;</div>
          <div className="snowflake" style={{ left: '35%', top: '-50px', animationDelay: '4s', animationDuration: '14.8s' }}>&#10054;</div>
          <div className="snowflake" style={{ left: '45%', top: '-50px', animationDelay: '4.5s', animationDuration: '13.2s' }}>&#10052;</div>
          <div className="snowflake" style={{ left: '55%', top: '-50px', animationDelay: '5s', animationDuration: '15.2s' }}>&#10053;</div>
          <div className="snowflake" style={{ left: '65%', top: '-50px', animationDelay: '5.5s', animationDuration: '12.7s' }}>&#10054;</div>
          <div className="snowflake" style={{ left: '75%', top: '-50px', animationDelay: '6s', animationDuration: '14.3s' }}>&#10052;</div>
          <div className="snowflake" style={{ left: '85%', top: '-50px', animationDelay: '6.5s', animationDuration: '13.7s' }}>&#10053;</div>
          <div className="snowflake" style={{ left: '95%', top: '-50px', animationDelay: '7s', animationDuration: '15.8s' }}>&#10054;</div>

          {/* More scattered snowflakes */}
          <div className="snowflake" style={{ left: '5%', top: '-50px', animationDelay: '3.2s', animationDuration: '14.2s' }}>&#10052;</div>
          <div className="snowflake" style={{ left: '12%', top: '-50px', animationDelay: '4.2s', animationDuration: '13.8s' }}>&#10053;</div>
          <div className="snowflake" style={{ left: '22%', top: '-50px', animationDelay: '5.2s', animationDuration: '15.5s' }}>&#10054;</div>
          <div className="snowflake" style={{ left: '32%', top: '-50px', animationDelay: '6.2s', animationDuration: '12.9s' }}>&#10052;</div>
          <div className="snowflake" style={{ left: '42%', top: '-50px', animationDelay: '7.2s', animationDuration: '14.7s' }}>&#10053;</div>
          <div className="snowflake" style={{ left: '52%', top: '-50px', animationDelay: '8.2s', animationDuration: '13.4s' }}>&#10054;</div>
          <div className="snowflake" style={{ left: '62%', top: '-50px', animationDelay: '9.2s', animationDuration: '15.1s' }}>&#10052;</div>
          <div className="snowflake" style={{ left: '72%', top: '-50px', animationDelay: '10.2s', animationDuration: '12.6s' }}>&#10053;</div>
          <div className="snowflake" style={{ left: '82%', top: '-50px', animationDelay: '11.2s', animationDuration: '14.4s' }}>&#10054;</div>
          <div className="snowflake" style={{ left: '92%', top: '-50px', animationDelay: '12.2s', animationDuration: '13.9s' }}>&#10052;</div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Bingsu"
              subtitle="Korean Shaved Ice Dessert - A unique and refreshing treat made with finely shaved ice, topped with sweet syrups, fresh fruits, and delicious toppings. Perfect for cooling down on a warm day or as a sweet indulgence any time."
              centered={true}
            />

            {/* Bingsu Flavor Gallery */}
            <Swiper
              modules={[Autoplay, Pagination]}
              slidesPerView={1}
              spaceBetween={24}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                1024: { slidesPerView: 3, spaceBetween: 32 },
                640: { slidesPerView: 2, spaceBetween: 24 },
              }}
              className="!pb-12"
            >
              {bingsuItems.map((item, idx) => (
                <SwiperSlide key={idx}>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
                    <div className="relative aspect-square">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-semibold text-stone-800 text-center mb-2">{item.name}</h3>
                      <p className="text-stone-600 text-center flex-1">{item.desc}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Golden Toast Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Golden Toast"
              subtitle="An indulgent treat with thick slices of toasted bread, crispy outside and soft inside. Perfect for breakfast, brunch, or as a sweet dessert."
              centered={true}
            />

            {/* Golden Toast Gallery */}
            <Swiper
              modules={[Autoplay, Pagination]}
              slidesPerView={1}
              spaceBetween={24}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                1024: { slidesPerView: 3, spaceBetween: 32 },
                640: { slidesPerView: 2, spaceBetween: 24 },
              }}
              className="!pb-12"
            >
              {goldenToastItems.map((item, idx) => (
                <SwiperSlide key={idx}>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
                    <div className="relative aspect-square">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-semibold text-stone-800 text-center mb-2">{item.name}</h3>
                      <p className="text-stone-600 text-center flex-1">{item.desc}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Bubble Teas Section */}
      <section className="section bg-white relative overflow-hidden">
        {/* Floating Bubbles Animation */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top section bubbles (0-20%) */}
          <div className="absolute top-[5%] left-[10%] w-12 h-12 bg-[#F79D28]/40 rounded-full floating-bubble" style={{ animationDelay: '0s', animationDuration: '5s' }}></div>
          <div className="absolute top-[15%] right-[15%] w-10 h-10 bg-[#F79D28]/45 rounded-full floating-bubble" style={{ animationDelay: '1s', animationDuration: '6s' }}></div>
          <div className="absolute top-[8%] left-[25%] w-16 h-16 bg-[#F79D28]/42 rounded-full floating-bubble" style={{ animationDelay: '2s', animationDuration: '5.5s' }}></div>
          <div className="absolute top-[12%] right-[50%] w-8 h-8 bg-[#F79D28]/50 rounded-full floating-bubble" style={{ animationDelay: '0.8s', animationDuration: '4s' }}></div>
          <div className="absolute top-[18%] right-[8%] w-6 h-6 bg-[#F79D28]/55 rounded-full floating-bubble" style={{ animationDelay: '0.3s', animationDuration: '4.2s' }}></div>
          <div className="absolute top-[6%] left-[75%] w-10 h-10 bg-[#F79D28]/45 rounded-full floating-bubble" style={{ animationDelay: '1.8s', animationDuration: '5.2s' }}></div>
          <div className="absolute top-[14%] right-[16%] w-9 h-9 bg-[#F79D28]/42 rounded-full floating-bubble" style={{ animationDelay: '0.4s', animationDuration: '5.8s' }}></div>

          {/* Middle section bubbles (20-50%) */}
          <div className="absolute top-[25%] right-[33%] w-11 h-11 bg-[#F79D28]/50 rounded-full floating-bubble" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}></div>
          <div className="absolute top-[35%] left-[50%] w-8 h-8 bg-[#F79D28]/55 rounded-full floating-bubble" style={{ animationDelay: '1.5s', animationDuration: '5s' }}></div>
          <div className="absolute top-[28%] left-[16%] w-7 h-7 bg-[#F79D28]/60 rounded-full floating-bubble" style={{ animationDelay: '1.2s', animationDuration: '4.8s' }}></div>
          <div className="absolute top-[32%] right-[25%] w-12 h-12 bg-[#F79D28]/45 rounded-full floating-bubble" style={{ animationDelay: '0.7s', animationDuration: '4.7s' }}></div>
          <div className="absolute top-[38%] left-[66%] w-9 h-9 bg-[#F79D28]/50 rounded-full floating-bubble" style={{ animationDelay: '1.1s', animationDuration: '4.4s' }}></div>
          <div className="absolute top-[22%] left-[16%] w-10 h-10 bg-[#F79D28]/55 rounded-full floating-bubble" style={{ animationDelay: '1.6s', animationDuration: '4.9s' }}></div>
          <div className="absolute top-[42%] right-[33%] w-6 h-6 bg-[#F79D28]/60 rounded-full floating-bubble" style={{ animationDelay: '0.9s', animationDuration: '4.1s' }}></div>

          {/* Lower section bubbles (50-80%) */}
          <div className="absolute top-[55%] left-[20%] w-14 h-14 bg-[#F79D28]/45 rounded-full floating-bubble" style={{ animationDelay: '0.2s', animationDuration: '5.3s' }}></div>
          <div className="absolute top-[65%] right-[25%] w-10 h-10 bg-[#F79D28]/50 rounded-full floating-bubble" style={{ animationDelay: '1.3s', animationDuration: '4.6s' }}></div>
          <div className="absolute top-[58%] left-[75%] w-11 h-11 bg-[#F79D28]/55 rounded-full floating-bubble" style={{ animationDelay: '0.6s', animationDuration: '5.1s' }}></div>
          <div className="absolute top-[72%] right-[33%] w-8 h-8 bg-[#F79D28]/60 rounded-full floating-bubble" style={{ animationDelay: '1.7s', animationDuration: '4.3s' }}></div>
          <div className="absolute top-[68%] left-[50%] w-[3.25rem] h-[3.25rem] bg-[#F79D28]/50 rounded-full floating-bubble" style={{ animationDelay: '0.1s', animationDuration: '5.7s' }}></div>
          <div className="absolute top-[62%] right-[16%] w-9 h-9 bg-[#F79D28]/55 rounded-full floating-bubble" style={{ animationDelay: '1.4s', animationDuration: '4.8s' }}></div>
          <div className="absolute top-[75%] left-[66%] w-10 h-10 bg-[#F79D28]/45 rounded-full floating-bubble" style={{ animationDelay: '0.8s', animationDuration: '5.4s' }}></div>

          {/* Bottom section bubbles (80-100%) */}
          <div className="absolute top-[82%] right-[20%] w-7 h-7 bg-[#F79D28]/60 rounded-full floating-bubble" style={{ animationDelay: '1.9s', animationDuration: '4.5s' }}></div>
          <div className="absolute top-[88%] left-[25%] w-12 h-12 bg-[#F79D28]/50 rounded-full floating-bubble" style={{ animationDelay: '0.5s', animationDuration: '5.6s' }}></div>
          <div className="absolute top-[85%] right-[50%] w-9 h-9 bg-[#F79D28]/55 rounded-full floating-bubble" style={{ animationDelay: '1.1s', animationDuration: '4.9s' }}></div>
          <div className="absolute top-[92%] left-[60%] w-11 h-11 bg-[#F79D28]/60 rounded-full floating-bubble" style={{ animationDelay: '0.3s', animationDuration: '5.2s' }}></div>
          <div className="absolute top-[78%] right-[33%] w-8 h-8 bg-[#F79D28]/55 rounded-full floating-bubble" style={{ animationDelay: '1.6s', animationDuration: '4.7s' }}></div>
          <div className="absolute top-[95%] left-[16%] w-10 h-10 bg-[#F79D28]/50 rounded-full floating-bubble" style={{ animationDelay: '0.7s', animationDuration: '5.5s' }}></div>
          <div className="absolute top-[86%] right-[66%] w-9 h-9 bg-[#F79D28]/45 rounded-full floating-bubble" style={{ animationDelay: '1.2s', animationDuration: '4.4s' }}></div>

          {/* Additional scattered bubbles */}
          <div className="absolute top-[45%] left-[33%] w-8 h-8 bg-[#F79D28]/55 rounded-full floating-bubble" style={{ animationDelay: '0.9s', animationDuration: '5.1s' }}></div>
          <div className="absolute top-[52%] right-[40%] w-[3.25rem] h-[3.25rem] bg-[#F79D28]/50 rounded-full floating-bubble" style={{ animationDelay: '1.4s', animationDuration: '4.8s' }}></div>
          <div className="absolute top-[48%] left-[80%] w-10 h-10 bg-[#F79D28]/60 rounded-full floating-bubble" style={{ animationDelay: '0.2s', animationDuration: '5.3s' }}></div>
          <div className="absolute top-[90%] right-[10%] w-11 h-11 bg-[#F79D28]/55 rounded-full floating-bubble" style={{ animationDelay: '1.7s', animationDuration: '4.6s' }}></div>
          <div className="absolute top-[98%] left-[40%] w-7 h-7 bg-[#F79D28]/60 rounded-full floating-bubble" style={{ animationDelay: '0.6s', animationDuration: '5.7s' }}></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Bubble Teas"
              subtitle="Discover our unique tea creations, from refreshing fruit teas to creamy milk teas with various flavors and toppings."
              centered={true}
            />

            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-stone-800 mb-2">Boba +{'\u00A3'}1.00</h3>
              <p className="text-stone-600 mb-6">Tapioca, Popping Boba, Rainbow Jelly</p>
              {/* Swiper carousel for Boba cards on mobile, grid on desktop */}
              <div className="block md:hidden">
                <Swiper
                  modules={[Autoplay, Pagination]}
                  slidesPerView={1}
                  spaceBetween={24}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  className="!pb-12"
                >
                  {bobaItems.map((item, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                        <div className="relative aspect-square">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="100vw"
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="text-lg font-semibold text-stone-800 text-center mb-2">{item.name}</h4>
                          <p className="text-sm text-stone-600 text-center">{item.desc}</p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="hidden md:grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                {bobaItems.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <div className="relative aspect-square">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 1024px) 33vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-stone-800 text-center mb-2">{item.name}</h4>
                      <p className="text-sm text-stone-600 text-center">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milk Teas */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-stone-800 text-center mb-4">Milk Teas</h3>
              <p className="text-stone-600 text-center mb-8">Can be served hot or cold</p>

              <Swiper
                modules={[Autoplay, Pagination]}
                slidesPerView={1}
                spaceBetween={24}
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                breakpoints={{
                  1024: { slidesPerView: 4, spaceBetween: 32 },
                  640: { slidesPerView: 2, spaceBetween: 24 },
                }}
                className="!pb-12"
              >
                {milkTeaItems.map((item, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
                      <div className="relative aspect-square">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h4 className="text-lg font-semibold text-stone-800 text-center mb-2">{item.name}</h4>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Fruit Teas */}
            <div>
              <h3 className="text-2xl font-bold text-stone-800 text-center mb-4">Fruit Teas</h3>
              <p className="text-stone-600 text-center mb-8">Can be still or sparkling, cold or hot</p>

              <Swiper
                modules={[Autoplay, Pagination]}
                slidesPerView={1}
                spaceBetween={24}
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                breakpoints={{
                  1024: { slidesPerView: 4, spaceBetween: 32 },
                  640: { slidesPerView: 2, spaceBetween: 24 },
                }}
                className="!pb-12"
              >
                {fruitTeaItems.map((item, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
                      <div className="relative aspect-square">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h4 className="text-lg font-semibold text-stone-800 text-center mb-2">{item.name}</h4>
                        <p className="text-sm text-stone-600 text-center">{item.desc}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-stone-800 mb-4">Ready to Try Our Specialties?</h2>
            <p className="text-lg text-stone-600 mb-8">
              Visit us to experience these unique creations in person, or check out our full menu for more delicious options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center bg-[#F79D28] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 hover:bg-[#E68A1A] hover:scale-105 hover:shadow-xl"
              >
                View Full Menu
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-white text-[#F79D28] border-2 border-[#F79D28] px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 hover:bg-orange-50 hover:scale-105 hover:shadow-xl"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
