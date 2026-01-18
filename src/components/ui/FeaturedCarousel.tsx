'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';

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

interface FeaturedItem {
  id: number;
  name: string;
  description: string;
  image: string;
}

const featuredItems: FeaturedItem[] = [
  {
    id: 1,
    name: "Bingsu",
    description: "A unique Korean shaved ice dessert with your choice of sweet, delicious toppings.",
    image: "/Bingsu.png.webp"
  },
  {
    id: 2,
    name: "Golden Toast",
    description: "An indulgent treat with thick slices of toasted bread, crispy outside and soft inside.",
    image: "/GoldenToastBK.webp"
  },
  {
    id: 3,
    name: "Bubble Tea",
    description: "Iced milk tea with chewy tapioca pearls - sweet, creamy, and fun to sip.",
    image: "/Bubbletea.webp"
  },
  {
    id: 4,
    name: "Gourmet Lattes",
    description: "Premium coffee creations with unique flavors and artistic presentation.",
    image: "/Kinderbuenolatte.webp"
  },
  {
    id: 5,
    name: "Pancakes",
    description: "Fluffy, jiggly pancakes served with fresh cream and seasonal fruit.",
    image: "/souffle.webp"
  },
  {
    id: 6,
    name: "Shakes & Smoothies",
    description: "Refreshing blended drinks with fresh fruits and premium ingredients.",
    image: "/Bubbletea.webp"
  },
  {
    id: 7,
    name: "Korean Food",
    description: "Authentic Korean dishes including Bibimbap and other traditional favorites.",
    image: "/Bibimbap.webp"
  },
  {
    id: 8,
    name: "Soft Serve Ice Cream",
    description: "Creamy soft serve made fresh daily, available in rotating flavours.",
    image: "/icecream.webp"
  }
];

const FeaturedCarousel: React.FC = () => {
  return (
    <div className="relative">
      <style>{swiperPaginationStyle}</style>
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        spaceBetween={24}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          768: {
            slidesPerView: 4,
            spaceBetween: 32,
          },
        }}
        className="!pb-12"
      >
        {featuredItems.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full">
              <div className="aspect-square overflow-hidden relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold mb-2 text-stone-800">{item.name}</h3>
                <p className="text-stone-600 text-sm leading-relaxed flex-1">{item.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturedCarousel;
