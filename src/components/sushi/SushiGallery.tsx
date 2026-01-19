'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { sushiImages } from '@/data/sushiData';

const SushiGallery = () => {
  return (
    <>
      <style jsx global>{`
        .sushi-gallery .swiper-pagination-bullet {
          background: #ffe0b2;
          opacity: 1;
          width: 10px;
          height: 10px;
          margin: 0 4px !important;
          transition: background 0.3s, transform 0.3s;
        }
        .sushi-gallery .swiper-pagination-bullet-active {
          background: #F79D28;
          transform: scale(1.3);
        }
      `}</style>
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        spaceBetween={24}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 24 },
          1024: { slidesPerView: 3, spaceBetween: 32 },
        }}
        className="sushi-gallery !pb-14"
      >
        {sushiImages.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className="group bg-white rounded-2xl shadow-warm overflow-hidden hover:shadow-warm-lg transition-all duration-500 hover:-translate-y-2">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default SushiGallery;
