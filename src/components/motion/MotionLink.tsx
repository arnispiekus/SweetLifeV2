'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { type ReactNode, type ComponentPropsWithoutRef } from 'react';

interface MotionLinkProps extends Omit<ComponentPropsWithoutRef<typeof Link>, 'href'> {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}

/**
 * An animated link component with subtle hover and tap effects.
 * Use for important CTAs and navigation links.
 */
export default function MotionLink({
  href,
  children,
  className = '',
  external = false,
  ...props
}: MotionLinkProps) {
  const externalProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <Link href={href} className={className} {...externalProps} {...props}>
        {children}
      </Link>
    </motion.div>
  );
}

interface MotionButtonProps extends ComponentPropsWithoutRef<'button'> {
  children: ReactNode;
  className?: string;
}

/**
 * An animated button component with subtle hover and tap effects.
 * Use for form submissions and interactive actions.
 */
export function MotionButton({
  children,
  className = '',
  ...props
}: MotionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}
