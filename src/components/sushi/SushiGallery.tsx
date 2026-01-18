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
          background: #f79d28;
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
        className="sushi-gallery !pb-12"
      >
        {sushiImages.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="relative aspect-square">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default SushiGallery;
