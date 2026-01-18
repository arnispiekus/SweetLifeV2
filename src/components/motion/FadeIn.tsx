'use client';

import { motion, type Variants } from 'framer-motion';
import { type ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface FadeInProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

const getDirectionOffset = (direction: Direction): { x: number; y: number } => {
  switch (direction) {
    case 'up':
      return { x: 0, y: 24 };
    case 'down':
      return { x: 0, y: -24 };
    case 'left':
      return { x: 24, y: 0 };
    case 'right':
      return { x: -24, y: 0 };
    case 'none':
    default:
      return { x: 0, y: 0 };
  }
};

export default function FadeIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className = '',
  once = true,
}: FadeInProps) {
  const offset = getDirectionOffset(direction);

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: offset.x,
      y: offset.y,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
