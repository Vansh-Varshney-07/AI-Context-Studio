"use client";

import { useEffect, useState } from "react";
import { Package, Download, Users, Star } from "lucide-react";

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  description: string;
  icon: string;
}

interface StatsClientProps {
  initialStats: StatItem[];
}

function getIconComponent(name: string) {
  switch (name) {
    case "Package":
      return Package;
    case "Download":
      return Download;
    case "Users":
      return Users;
    case "Star":
      return Star;
    default:
      return Package;
  }
}

export function StatsClient({ initialStats }: StatsClientProps) {
  const [counts, setCounts] = useState<number[]>(initialStats.map((s) => s.value));

  useEffect(() => {
    const animate = () => {
      setCounts(
        initialStats.map((stat) => {
          const target = stat.value;
          if (isNaN(target)) return target;

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
              newCounts[initialStats.indexOf(stat)] = current;
              return newCounts;
            });
            if (progress < 1) requestAnimationFrame(animateValue);
          };

          requestAnimationFrame(animateValue);
          return target;
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

    const element = document.getElementById("stats-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [initialStats]);

  return (
    <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
      {initialStats.map((stat, index) => {
        const Icon = getIconComponent(stat.icon);
        return (
          <div
            key={stat.label}
            className="animate-slide-up text-center"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="mb-2 text-4xl font-bold text-[var(--color-accent)] lg:text-5xl">
              {counts[index]?.toLocaleString() ?? stat.value.toLocaleString()}
              {stat.suffix || ""}
            </div>
            <div className="text-lg font-semibold text-[var(--color-text-primary)]">
              {stat.label}
            </div>
            <div className="mt-1 text-sm text-[var(--color-text-muted)]">{stat.description}</div>
          </div>
        );
      })}
    </div>
  );
}