"use client";

import { MotionDiv } from "@/components/ui/motion";
import { Card } from "@/components/ui/card";
import { products } from "@/data/constants";
import { Monitor, Globe, Store, Database, Users, Cloud, ArrowRight } from "lucide-react";

const productIcons = {
  Desktop: Monitor,
  "Online Hub": Globe,
  Marketplace: Store,
  Registry: Database,
  Community: Users,
  "Future Cloud": Cloud,
};

export function ProductGrid() {
  return (
    <section id="products" className="section" aria-labelledby="products-heading">
      <div className="container-app">
        <MotionDiv
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 id="products-heading" className="text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
            The AI Context Studio Ecosystem
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Six interconnected products that work together — use them individually or as a complete platform.
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
                <Card className="card-hover h-full p-6 flex flex-col">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)]">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="mb-2 inline-flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">{product.name}</h3>
                    {product.comingSoon && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-warning-bg)] text-[var(--color-warning)]">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] mb-4">{product.tagline}</p>
                  <p className="text-[var(--color-text-secondary)] mb-6 flex-1">{product.description}</p>
                  <ul className="mb-6 space-y-2 flex-1">
                    {product.features.map((feature) => (
                      <li key={feature} className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a href={product.href} className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors">
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