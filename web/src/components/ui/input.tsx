'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size = 'md', error = false, type = 'text', ...props },
  ref
) {
  const sizeClass =
    size === 'sm' ? 'h-8 text-xs' : size === 'lg' ? 'h-11 text-base' : 'h-9 text-sm';

  return (
    <input
      ref={ref}
      type={type}
      className={cn('input', sizeClass, error && 'input-error', className)}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
