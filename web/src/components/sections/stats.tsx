'use client';

import { useEffect, useState } from 'react';
import { animatedStats } from '@/data/stats';

export function Stats() {
  const [counts, setCounts] = useState<number[]>([]);

  useEffect(() => {
    const animate = () => {
      setCounts(
        animatedStats.map((stat) => {
          const target = parseInt(String(stat.value).replace(/,/g, ''), 10);
          if (isNaN(target)) return 0;

          const duration = 2000;
          const startTime = Date.now();
          const startValue = 0;

          const animateValue = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startValue + (target - startValue) * eased);
            setCounts((prev) => {
              const newCounts = [...prev];
              newCounts[animatedStats.indexOf(stat)] = current;
              return newCounts;
            });
            if (progress < 1) requestAnimationFrame(animateValue);
          };

          requestAnimationFrame(animateValue);
          return 0;
        })
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('stats-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="stats-section"
      className="border-y border-[var(--color-border)] bg-[var(--color-bg-secondary)] py-16 lg:py-24"
      aria-labelledby="stats-heading"
    >
      <div className="container-app">
        <h2 id="stats-heading" className="sr-only">
          Key Statistics
        </h2>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {animatedStats.map((stat, index) => (
            <div
              key={stat.label}
              className="animate-slide-up text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className="mb-2 text-4xl font-bold text-[var(--color-accent)] lg:text-5xl"
                data-count={stat.value}
              >
                {stat.prefix || ''}
                {counts[index] ?? stat.value}
                {stat.suffix || ''}
              </div>
              <div className="text-lg font-semibold text-[var(--color-text-primary)]">
                {stat.label}
              </div>
              <div className="mt-1 text-sm text-[var(--color-text-muted)]">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
