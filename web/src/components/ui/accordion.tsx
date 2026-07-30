'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Accordion({ type = 'multiple', collapsible = true, className, children }: AccordionProps) {
  return (
    <div className={cn('space-y-2', className)} data-accordion-type={type} data-accordion-collapsible={collapsible}>
      {children}
    </div>
  );
}

interface AccordionItemProps {
  value?: string;
  className?: string;
  children: React.ReactNode;
}

export function AccordionItem({ value, className, children }: AccordionItemProps) {
  return (
    <div className={cn('rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)]', className)} data-accordion-value={value}>
      {children}
    </div>
  );
}

interface AccordionTriggerProps {
  className?: string;
  children: React.ReactNode;
}

export function AccordionTrigger({ className, children }: AccordionTriggerProps) {
  return (
    <span className={cn('font-medium text-[var(--color-text-primary)]', className)}>
      {children}
    </span>
  );
}

interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
}

export function AccordionContent({ className, children }: AccordionContentProps) {
  return (
    <div className={cn('px-4 pb-4 text-[var(--color-text-secondary)]', className)}>
      {children}
    </div>
  );
}

export function SimpleAccordion({ title, children, defaultOpen = false, className }: { 
  title: string; 
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn('border border-[var(--color-border)] rounded-xl bg-[var(--color-bg-surface)]', className)}>
      <button
        onClick={handleToggle}
        className="flex w-full items-center justify-between p-4 text-left font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-secondary)]"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-[var(--color-text-muted)] transition-transform',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-4 pb-4 text-[var(--color-text-secondary)]">{children}</div>
      </div>
    </div>
  );
}