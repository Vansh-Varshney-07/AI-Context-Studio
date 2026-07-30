'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  to?: string;
  via?: string;
}

export function GradientText({
  children,
  className,
  from = 'var(--color-accent)',
  to = 'var(--color-violet)',
  via,
}: GradientTextProps) {
  return (
    <span
      className={cn(
        'inline-block bg-gradient-to-r bg-clip-text text-transparent',
        `from-[${from}] to-[${to}]`,
        via && `via-[${via}]`,
        className
      )}
    >
      {children}
    </span>
  );
}
