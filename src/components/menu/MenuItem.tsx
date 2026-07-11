'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface MenuItemProps {
  name: string;
  description: string;
  price: number;
  // Live-menu only: price is the lowest of several variants → render "from £x".
  priceFrom?: boolean;
  // Live-menu only: free-text seasonal label (e.g. "Summer only") → small badge.
  seasonal?: string;
  image?: string;
  isPopular?: boolean;
}

// Extract dietary tags from name
const getDietaryTags = (name: string) => {
  const tags: { label: string; color: string }[] = [];
  if (name.includes('(K)')) tags.push({ label: 'Keto', color: 'bg-blue-100 text-blue-700' });
  if (name.includes('(GF)')) tags.push({ label: 'GF', color: 'bg-amber-100 text-amber-700' });
  if (name.includes('(V)')) tags.push({ label: 'Vegan', color: 'bg-green-100 text-green-700' });
  return tags;
};

const MenuItem = ({ name, description, price, priceFrom, seasonal, image, isPopular }: MenuItemProps) => {
  const dietaryTags = getDietaryTags(name);

  return (
    <motion.div
      className="flex bg-white rounded-lg shadow-md overflow-hidden relative"
      whileHover={{
        y: -4,
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      }}
      transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {image && (
        <div className="w-24 h-24 flex-shrink-0 relative">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="96px"
          />
          {/* Popular badge on image */}
          {isPopular && (
            <div className="absolute top-1 left-1 bg-primary text-charcoal px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5">
              <Star size={10} className="fill-current" />
              Popular
            </div>
          )}
        </div>
      )}
      <div className={`${image ? 'flex-1' : 'w-full'} p-4`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h4 className="text-lg font-medium">{name}</h4>
            {/* Dietary tags + optional seasonal label */}
            {(dietaryTags.length > 0 || seasonal) && (
              <div className="flex flex-wrap gap-1 mt-1">
                {dietaryTags.map((tag) => (
                  <span
                    key={tag.label}
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${tag.color}`}
                  >
                    {tag.label}
                  </span>
                ))}
                {seasonal && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                    {seasonal}
                  </span>
                )}
              </div>
            )}
          </div>
          <span className="font-semibold text-primary ml-2 whitespace-nowrap">
            {priceFrom && <span className="text-xs font-normal text-rich-brown/60 mr-1">from</span>}
            {'\u00A3'}{price.toFixed(2)}
          </span>
        </div>
        <p className="text-stone-600 text-sm">{description}</p>
      </div>
      {/* Popular badge for items without image */}
      {isPopular && !image && (
        <div className="absolute top-2 right-2 bg-primary text-charcoal px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
          <Star size={12} className="fill-current" />
          Popular
        </div>
      )}
    </motion.div>
  );
};

export default MenuItem;
