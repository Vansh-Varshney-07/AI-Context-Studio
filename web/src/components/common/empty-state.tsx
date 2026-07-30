'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Search, Package, Loader2, Shield, AlertCircle, FileText } from 'lucide-react';
import Link from 'next/link';

type EmptyStateVariant = 'default' | 'search' | 'marketplace' | 'loading' | 'error' | 'security';

const variantConfigs: Record<
  EmptyStateVariant,
  { icon: React.ReactNode; title: string; description: string }
> = {
  default: {
    icon: <Package className="h-12 w-12" />,
    title: 'Nothing found',
    description: 'No items match your current filters or search query.',
  },
  search: {
    icon: <Search className="h-12 w-12" />,
    title: 'No results found',
    description: 'Try adjusting your search terms or filters.',
  },
  marketplace: {
    icon: <Package className="h-12 w-12" />,
    title: 'Marketplace is empty',
    description: 'No assets have been published yet. Be the first to share!',
  },
  loading: {
    icon: <Loader2 className="h-12 w-12 animate-spin" />,
    title: 'Loading...',
    description: 'Please wait while we fetch the data.',
  },
  error: {
    icon: <AlertCircle className="h-12 w-12 text-[var(--color-error)]" />,
    title: 'Something went wrong',
    description: "We couldn't load the data. Please try again later.",
  },
  security: {
    icon: <Shield className="h-12 w-12" />,
    title: 'Security scan in progress',
    description: "We're verifying the integrity of this asset.",
  },
};

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    href: string;
    variant?: 'primary' | 'outline' | 'ghost' | 'secondary';
  };
  className?: string;
}

export function EmptyState({
  variant = 'default',
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  const config = variantConfigs[variant];

  return (
    <div
      className={cn('flex flex-col items-center justify-center px-4 py-16 text-center', className)}
    >
      <div
        className={cn(
          'mb-4 text-[var(--color-text-muted)]',
          variant === 'loading' && 'text-[var(--color-accent)]'
        )}
      >
        {icon || config.icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]">
        {title || config.title}
      </h3>
      <p className="mb-6 max-w-sm text-[var(--color-text-secondary)]">
        {description || config.description}
      </p>
      {action && (
        <Link href={action.href}>
          <Button variant={action.variant || 'primary'} size="lg">
            {action.label}
          </Button>
        </Link>
      )}
    </div>
  );
}

export function SearchEmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <EmptyState
      variant="search"
      title={`No results for "${query}"`}
      description="Try different keywords or clear your search to browse all items."
      action={{ label: 'Clear search', href: '#', variant: 'outline' }}
    />
  );
}
