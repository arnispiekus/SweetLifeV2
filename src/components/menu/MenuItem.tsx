'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface MenuItemProps {
  name: string;
  description: string;
  price: number;
  image?: string;
}

const MenuItem = ({ name, description, price, image }: MenuItemProps) => {
  return (
    <motion.div
      className="flex bg-white rounded-lg shadow-md overflow-hidden"
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
        </div>
      )}
      <div className={`${image ? 'flex-1' : 'w-full'} p-4`}>
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-medium">{name}</h4>
          <span className="font-semibold text-primary ml-2">{'\u00A3'}{price.toFixed(2)}</span>
        </div>
        <p className="text-stone-600 text-sm">{description}</p>
      </div>
    </motion.div>
  );
};

export default MenuItem;
