'use client';

import { useReducedMotion } from '@/hooks';
import { cn } from '@/lib/utils';

interface FloatingPreviewProps {
  children: React.ReactNode;
  className?: string;
}

export function FloatingPreview({ children, className }: FloatingPreviewProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={cn('relative', className)}>{children}</div>;
  }

  return (
    <div className={cn('relative animate-[float_6s_ease-in-out_infinite]', className)}>
      {children}
    </div>
  );
}
