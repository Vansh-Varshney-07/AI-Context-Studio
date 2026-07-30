'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { bordered?: boolean; elevated?: boolean; glass?: boolean }
>(function Card({ className, bordered = true, elevated = false, glass = false, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'ease-smooth rounded-xl transition-all duration-150',
        glass
          ? 'border-[var(--color-glass-border)] bg-[var(--color-glass)] backdrop-blur-md'
          : 'bg-[var(--color-bg-surface)]',
        bordered && 'border border-[var(--color-border)]',
        elevated && !glass && 'shadow-md',
        className
      )}
      {...props}
    />
  );
});

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cn('px-6 py-5', className)} {...props} />;
  }
);

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, ...props }, ref) {
    return (
      <h3
        ref={ref}
        className={cn(
          'text-lg font-semibold tracking-tight text-[var(--color-text-primary)]',
          className
        )}
        {...props}
      />
    );
  }
);

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      className={cn('mt-1 text-sm text-[var(--color-text-secondary)]', className)}
      {...props}
    />
  );
});

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...props }, ref) {
    return <div ref={ref} className={cn('px-6 pb-6', className)} {...props} />;
  }
);

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-6 py-4',
          className
        )}
        {...props}
      />
    );
  }
);

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
