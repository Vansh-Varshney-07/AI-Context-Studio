'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors whitespace-nowrap',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]',
        accent: 'bg-[var(--color-accent-light)] text-[var(--color-accent)]',
        violet: 'bg-[var(--color-violet-light)] text-[var(--color-violet)]',
        cyan: 'bg-[var(--color-cyan-light)] text-[var(--color-cyan)]',
        success: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
        warning: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
        danger: 'bg-[var(--color-error-bg)] text-[var(--color-error)]',
        outline:
          'bg-transparent border border-[var(--color-border-strong)] text-[var(--color-text-secondary)]',
        dot: 'relative pl-6',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  dotColor?: 'accent' | 'violet' | 'cyan' | 'success' | 'warning' | 'danger';
}

function Badge({ className, variant, dotColor, children, ...props }: BadgeProps) {
  const isDot = variant === 'dot';

  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {isDot && dotColor && (
        <span
          className={cn('absolute top-1/2 left-2 size-1.5 -translate-y-1/2 rounded-full', {
            'bg-[var(--color-accent)]': dotColor === 'accent',
            'bg-[var(--color-violet)]': dotColor === 'violet',
            'bg-[var(--color-cyan)]': dotColor === 'cyan',
            'bg-[var(--color-success)]': dotColor === 'success',
            'bg-[var(--color-warning)]': dotColor === 'warning',
            'bg-[var(--color-error)]': dotColor === 'danger',
          })}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
