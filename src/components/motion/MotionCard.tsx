'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface MotionCardProps {
  children: ReactNode;
  className?: string;
  hoverLift?: number;
}

/**
 * An animated card component with hover lift and shadow effects.
 * Provides a smooth, inviting interaction for card elements.
 */
export default function MotionCard({
  children,
  className = '',
  hoverLift = 8,
}: MotionCardProps) {
  return (
    <motion.div
      className={className}
      whileHover={{
        y: -hoverLift,
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

interface MotionImageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * A container for images that provides a subtle zoom effect on hover.
 * Works well for gallery items and featured images.
 */
export function MotionImageContainer({
  children,
  className = '',
}: MotionImageContainerProps) {
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      whileHover="hover"
    >
      <motion.div
        variants={{
          hover: {
            scale: 1.05,
            transition: {
              duration: 0.4,
              ease: [0.25, 0.4, 0.25, 1],
            },
          },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
