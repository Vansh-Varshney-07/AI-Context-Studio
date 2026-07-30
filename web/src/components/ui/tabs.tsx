'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components/ui/tabs';
import { cn } from '@shared/utils/cn';

export { Tabs, TabsContent, TabsList, TabsTrigger };

export interface TabsProps extends React.ComponentPropsWithoutRef<typeof Tabs> {
  variant?: 'default' | 'underline';
}

export const TabsRoot = ({ className, variant = 'default', ...props }: TabsProps) => {
  const variantClasses = {
    default: '',
    underline: 'bg-transparent',
  };

  return <Tabs className={cn(variantClasses[variant], className)} {...props} />;
};

TabsRoot.displayName = 'TabsRoot';
