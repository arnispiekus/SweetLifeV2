'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  once = true,
  direction = 'up',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-80px' });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: 40, x: 0 };
      case 'down':
        return { y: -40, x: 0 };
      case 'left':
        return { y: 0, x: 40 };
      case 'right':
        return { y: 0, x: -40 };
      case 'none':
      default:
        return { y: 0, x: 0 };
    }
  };

  const initialPosition = getInitialPosition();

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...initialPosition,
      }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : initialPosition.y,
        x: isInView ? 0 : initialPosition.x,
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
