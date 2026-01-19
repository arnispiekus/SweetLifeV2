'use client';

import { motion, useInView, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** Enable parallax effect (0-1) - higher = more movement */
  parallaxIntensity?: number;
  /** Use spring physics for smoother motion */
  useSpringPhysics?: boolean;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  once = true,
  direction = 'up',
  parallaxIntensity = 0,
  useSpringPhysics = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-80px' });
  const prefersReducedMotion = useReducedMotion();

  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Transform scroll progress to parallax movement
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [parallaxIntensity * 100, -parallaxIntensity * 100]
  );

  // Apply spring physics for smoother parallax
  const springConfig = { stiffness: 400, damping: 30, mass: 1 };
  const smoothParallaxY = useSpring(parallaxY, springConfig);

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

  // Respect reduced motion preferences
  const shouldAnimate = !prefersReducedMotion;
  const shouldParallax = parallaxIntensity > 0 && shouldAnimate;

  return (
    <motion.div
      ref={ref}
      initial={shouldAnimate ? {
        opacity: 0,
        ...initialPosition,
      } : undefined}
      animate={shouldAnimate ? {
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : initialPosition.y,
        x: isInView ? 0 : initialPosition.x,
      } : undefined}
      transition={useSpringPhysics
        ? { type: 'spring' as const, stiffness: 400, damping: 30, delay }
        : { duration, delay, ease: [0.25, 0.4, 0.25, 1] as const }
      }
      style={shouldParallax ? {
        y: smoothParallaxY,
      } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}
