'use client';

import { Separator as SharedSeparator } from '@shared/components/ui/separator';
import { cn } from '@shared/utils/cn';

export interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof SharedSeparator> {
  variant?: 'default' | 'strong';
}

export const Separator = ({ className, variant = 'default', ...props }: SeparatorProps) => {
  const variantClasses = {
    default: 'divider',
    strong: 'divider-strong',
  };

  return <SharedSeparator className={cn(variantClasses[variant], className)} {...props} />;
};

Separator.displayName = 'Separator';
