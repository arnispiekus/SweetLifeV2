'use client';

import { useState } from 'react';
import MenuItem from './MenuItem';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MenuItemType {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface MenuCategoryProps {
  name: string;
  items: MenuItemType[];
}

const MenuCategory = ({ name, items }: MenuCategoryProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <h3 className="text-xl font-semibold text-primary">{name}</h3>
        {isOpen ? (
          <ChevronUp className="text-primary" size={20} />
        ) : (
          <ChevronDown className="text-primary" size={20} />
        )}
      </button>

      {isOpen && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
          {items.map((item) => (
            <MenuItem
              key={item.id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuCategory;
