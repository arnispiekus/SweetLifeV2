'use client';

import { useState } from 'react';
import MenuCategory from '@/components/menu/MenuCategory';
import { Info, Leaf, Sparkles, Wheat } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/motion';
import type { MenuCategoryView } from '@/lib/menu';

interface MenuExplorerProps {
  categories: MenuCategoryView[];
}

const countByTag = (categories: MenuCategoryView[], tag: string) =>
  categories.reduce(
    (total, c) =>
      total + c.items.filter((i) => i.name.toLowerCase().includes(tag)).length,
    0,
  );

export default function MenuExplorer({ categories }: MenuExplorerProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const totalItems = categories.reduce((n, c) => n + c.items.length, 0);
  const dietaryFilters = [
    { id: 'all', label: 'All Items', icon: Sparkles, count: totalItems },
    { id: 'keto', label: 'Keto', icon: Sparkles, count: countByTag(categories, '(k)') },
    { id: 'vegan', label: 'Vegan', icon: Leaf, count: countByTag(categories, '(v)') },
    { id: 'gf', label: 'Gluten Free', icon: Wheat, count: countByTag(categories, '(gf)') },
  ];

  const scrollToCategory = (categoryName: string) => {
    const id = `category-${categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Dietary Filter Bar */}
      <ScrollReveal delay={0.1}>
        <div className="bg-white rounded-2xl shadow-warm p-4 mb-8 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-sm font-semibold text-charcoal whitespace-nowrap">Filter by:</span>
            <div className="flex flex-wrap justify-center gap-2">
              {dietaryFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeFilter === filter.id
                        ? 'bg-primary text-charcoal shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={16} />
                    {filter.label}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeFilter === filter.id ? 'bg-charcoal/20' : 'bg-gray-200'
                    }`}>
                      {filter.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Quick Jump Category Pills */}
      <ScrollReveal delay={0.15}>
        <div className="mb-10 overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.name)}
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-charcoal hover:bg-primary hover:text-charcoal transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <StaggerContainer className="space-y-6" staggerDelay={0.05}>
        {categories.map((category) => (
          <StaggerItem key={category.id}>
            <MenuCategory
              name={category.name}
              items={category.items}
              activeFilter={activeFilter}
            />
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Dietary Info */}
      <ScrollReveal delay={0.3}>
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-warm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-charcoal mb-2">
                  Special Dietary Requirements
                </h3>
                <p className="text-rich-brown/70 leading-relaxed">
                  Please inform our staff about any allergies or dietary restrictions. We offer vegetarian, vegan, and gluten-free options and can accommodate most dietary needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </>
  );
}
