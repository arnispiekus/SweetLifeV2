'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

// Swiper pagination color override
const swiperPaginationStyle = `
  .swiper-pagination-bullet {
    background: #ffe0b2;
    opacity: 1;
    width: 12px;
    height: 12px;
    margin: 0 6px !important;
    transition: background 0.3s, transform 0.3s;
  }
  .swiper-pagination-bullet-active {
    background: #F79D28;
    transform: scale(1.3);
  }
`;

interface FeaturedItem {
  id: number;
  name: string;
  description: string;
  image: string;
  badge?: string;
}

// Updated with customer review favorites + dietary options
const featuredItems: FeaturedItem[] = [
  {
    id: 1,
    name: "Poke Bowl",
    description: "Fresh rice bowl with your choice of protein, avocado, cucumber and wasabi.",
    image: "/Lunch/PokeBowl.webp",
    badge: "Popular"
  },
  {
    id: 2,
    name: "Souffle Pancakes",
    description: "Fluffy, airy and melt-in-your-mouth Japanese-style pancakes.",
    image: "/souffle.webp",
    badge: "Popular"
  },
  {
    id: 3,
    name: "Sourdough Pizza",
    description: "Artisan sourdough base with your favorite toppings. Made fresh.",
    image: "/Lunch/SourdoughPizza.webp",
    badge: "Popular"
  },
  {
    id: 4,
    name: "Golden Toast",
    description: "Thick slices of toasted bread, crispy outside and soft inside.",
    image: "/GoldenToastBK.webp",
    badge: "Popular"
  },
  {
    id: 5,
    name: "Bingsu",
    description: "Korean shaved ice dessert with sweet, delicious toppings.",
    image: "/Bingsu.png.webp",
    badge: "Popular"
  },
  {
    id: 6,
    name: "Sushi Bowl",
    description: "Smoked salmon or chicken with cream cheese and avocado.",
    image: "/Keto/SushiBowl.webp",
    badge: "Keto/GF"
  },
  {
    id: 7,
    name: "Bibimbap",
    description: "Korean rice bowl with vegetables, protein and gochujang.",
    image: "/Bibimbap.webp",
    badge: "Korean"
  },
  {
    id: 8,
    name: "Vegan Burger",
    description: "Plant-based patty with fresh toppings. GF bun available.",
    image: "/Keto/VeganBurger.webp",
    badge: "Vegan/GF"
  }
];

const FeaturedCarousel: React.FC = () => {
  return (
    <div className="relative">
      <style>{swiperPaginationStyle}</style>
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1.2}
        centeredSlides={true}
        spaceBetween={20}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            centeredSlides: false,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 3,
            centeredSlides: false,
            spaceBetween: 32,
          },
        }}
        className="!pb-14"
      >
        {featuredItems.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full border border-warm-stone/20">
              {/* Image container with gradient overlay */}
              <div className="aspect-[4/3] overflow-hidden relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Subtle bottom gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* Badge */}
                {item.badge && (
                  <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg ${
                    item.badge === 'Popular'
                      ? 'bg-primary text-charcoal'
                      : item.badge === 'Korean'
                        ? 'bg-red-500 text-white'
                        : item.badge.includes('Vegan')
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-500 text-white'
                  }`}>
                    {item.badge}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-display text-xl md:text-2xl font-bold mb-2 text-charcoal">
                  {item.name}
                </h3>
                <p className="text-rich-brown/70 text-sm leading-relaxed flex-1 mb-4">
                  {item.description}
                </p>

                {/* View link */}
                <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300">
                  <span>View Details</span>
                  <ArrowRight size={16} className="ml-2" />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturedCarousel;
