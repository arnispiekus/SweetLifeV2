'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { type ReactNode } from 'react';

interface MotionCardProps {
  children: ReactNode;
  className?: string;
  hoverLift?: number;
  /** Use warm orange-tinted shadow on hover */
  warmShadow?: boolean;
  /** Use spring physics for hover animation */
  useSpring?: boolean;
}

/**
 * An animated card component with hover lift and shadow effects.
 * Provides a smooth, inviting interaction for card elements.
 */
export default function MotionCard({
  children,
  className = '',
  hoverLift = 10,
  warmShadow = true,
  useSpring = true,
}: MotionCardProps) {
  const prefersReducedMotion = useReducedMotion();

  // Warm shadow with subtle orange tint vs neutral shadow
  const hoverShadow = warmShadow
    ? '0 25px 50px -12px rgba(247, 157, 40, 0.25), 0 12px 24px -8px rgba(0, 0, 0, 0.15)'
    : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 12px 24px -8px rgba(0, 0, 0, 0.15)';

  // Spring transition for bouncy feel
  const springTransition = {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
  };

  // Ease transition for smooth feel
  const easeTransition = {
    duration: 0.3,
    ease: [0.25, 0.4, 0.25, 1] as const,
  };

  return (
    <motion.div
      className={className}
      whileHover={prefersReducedMotion ? undefined : {
        y: -hoverLift,
        boxShadow: hoverShadow,
      }}
      transition={useSpring ? springTransition : easeTransition}
    >
      {children}
    </motion.div>
  );
}

interface MotionImageContainerProps {
  children: ReactNode;
  className?: string;
  /** Scale factor on hover (default: 1.05) */
  scale?: number;
  /** Show warm color overlay on hover */
  warmOverlay?: boolean;
}

/**
 * A container for images that provides a subtle zoom effect on hover.
 * Works well for gallery items and featured images.
 */
export function MotionImageContainer({
  children,
  className = '',
  scale = 1.05,
  warmOverlay = false,
}: MotionImageContainerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={`overflow-hidden relative ${className}`}
      whileHover="hover"
      initial="initial"
    >
      <motion.div
        variants={prefersReducedMotion ? {} : {
          initial: { scale: 1 },
          hover: {
            scale,
            transition: {
              duration: 0.5,
              ease: [0.25, 0.4, 0.25, 1],
            },
          },
        }}
      >
        {children}
      </motion.div>

      {/* Optional warm overlay on hover */}
      {warmOverlay && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none"
          variants={{
            initial: { opacity: 0 },
            hover: {
              opacity: 1,
              transition: { duration: 0.3 },
            },
          }}
        />
      )}
    </motion.div>
  );
}

interface MotionRevealImageProps {
  children: ReactNode;
  className?: string;
  /** Direction of the reveal wipe */
  direction?: 'left' | 'right' | 'up' | 'down';
}

/**
 * A container that reveals images with a clip-path wipe animation.
 * Creates a dramatic reveal effect for featured images.
 */
export function MotionRevealImage({
  children,
  className = '',
  direction = 'left',
}: MotionRevealImageProps) {
  const prefersReducedMotion = useReducedMotion();

  const getClipPath = () => {
    switch (direction) {
      case 'left':
        return {
          initial: 'inset(0 100% 0 0)',
          visible: 'inset(0 0% 0 0)',
        };
      case 'right':
        return {
          initial: 'inset(0 0 0 100%)',
          visible: 'inset(0 0 0 0%)',
        };
      case 'up':
        return {
          initial: 'inset(100% 0 0 0)',
          visible: 'inset(0% 0 0 0)',
        };
      case 'down':
        return {
          initial: 'inset(0 0 100% 0)',
          visible: 'inset(0 0 0% 0)',
        };
      default:
        return {
          initial: 'inset(0 100% 0 0)',
          visible: 'inset(0 0% 0 0)',
        };
    }
  };

  const clipPaths = getClipPath();

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={prefersReducedMotion ? undefined : { clipPath: clipPaths.initial }}
      whileInView={prefersReducedMotion ? undefined : { clipPath: clipPaths.visible }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
