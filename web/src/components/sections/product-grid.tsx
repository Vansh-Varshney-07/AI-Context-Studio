'use client';

import { MotionDiv } from '@/components/ui/motion';
import { Card } from '@/components/ui/card';
import { products } from '@/data/constants';
import { Monitor, Globe, Store, Database, Users, Cloud, ArrowRight } from 'lucide-react';

const productIcons = {
  Desktop: Monitor,
  'Online Hub': Globe,
  Marketplace: Store,
  Registry: Database,
  Community: Users,
  'Future Cloud': Cloud,
};

export function ProductGrid() {
  return (
    <section id="products" className="section" aria-labelledby="products-heading">
      <div className="container-app">
        <MotionDiv
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2
            id="products-heading"
            className="mb-4 text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl"
          >
            The AI Context Studio Ecosystem
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--color-text-secondary)]">
            Six interconnected products that work together — use them individually or as a complete
            platform.
          </p>
        </MotionDiv>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => {
            const Icon = productIcons[product.name as keyof typeof productIcons] || Monitor;
            return (
              <MotionDiv
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-hover flex h-full flex-col p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)]">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="mb-2 inline-flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                      {product.name}
                    </h3>
                    {product.comingSoon && (
                      <span className="rounded-full bg-[var(--color-warning-bg)] px-2 py-0.5 text-xs text-[var(--color-warning)]">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="mb-4 text-sm text-[var(--color-text-muted)]">{product.tagline}</p>
                  <p className="mb-6 flex-1 text-[var(--color-text-secondary)]">
                    {product.description}
                  </p>
                  <ul className="mb-6 flex-1 space-y-2">
                    {product.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={product.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </Card>
              </MotionDiv>
            );
          })}
        </div>
      </div>
    </section>
  );
}
