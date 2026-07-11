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
  priceFrom?: boolean;
  seasonal?: string;
}

interface MenuCategoryProps {
  name: string;
  items: MenuItemType[];
  defaultExpanded?: boolean;
  activeFilter?: string;
}

// Items mentioned in Google Reviews (customer favorites)
const popularItems = [
  'Poke Bowl',
  'Souffle Pancake',
  'Sourdough Pizza',
  'Golden Toast',
  'Bibimbap',
  'Ramen Soup',
  'Bingsu',
  'Spinach',
];

const MenuCategory = ({ name, items, defaultExpanded = true, activeFilter }: MenuCategoryProps) => {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  // Filter items based on dietary filter
  const filteredItems = activeFilter && activeFilter !== 'all'
    ? items.filter(item => {
        const itemName = item.name.toLowerCase();
        if (activeFilter === 'keto') return itemName.includes('(k)');
        if (activeFilter === 'vegan') return itemName.includes('(v)');
        if (activeFilter === 'gf') return itemName.includes('(gf)');
        return true;
      })
    : items;

  // Don't render category if no items match filter
  if (filteredItems.length === 0) return null;

  // Check if item is popular (mentioned in reviews)
  const isPopular = (itemName: string) => {
    return popularItems.some(popular =>
      itemName.toLowerCase().includes(popular.toLowerCase())
    );
  };

  return (
    <div className="mb-6" id={`category-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-primary">{name}</h3>
          <span className="text-sm text-rich-brown/50">({filteredItems.length} items)</span>
        </div>
        {isOpen ? (
          <ChevronUp className="text-primary" size={20} />
        ) : (
          <ChevronDown className="text-primary" size={20} />
        )}
      </button>

      {isOpen && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
          {filteredItems.map((item) => (
            <MenuItem
              key={item.id}
              name={item.name}
              description={item.description}
              price={item.price}
              priceFrom={item.priceFrom}
              seasonal={item.seasonal}
              image={item.image}
              isPopular={isPopular(item.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuCategory;
