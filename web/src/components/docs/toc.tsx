"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  className?: string;
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const content = document.querySelector("article.prose");
    if (!content) return;

    const headingElements = content.querySelectorAll("h2, h3");
    const newHeadings: Array<{ id: string; text: string; level: number }> = [];

    headingElements.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`;
      heading.id = id;
      newHeadings.push({
        id,
        text: heading.textContent || "",
        level: parseInt(heading.tagName.charAt(1)),
      });
    });

    setHeadings(newHeadings);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -66%", threshold: 0.1 }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className={cn("hidden lg:block w-64", className)} aria-label="Table of contents">
      <div className="sticky top-24 space-y-2">
        <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 px-2">
          On this page
        </h3>
        <nav aria-label="Table of contents">
          <ul className="space-y-1">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    "block px-2 py-1 text-sm transition-colors rounded border-l-2",
                    heading.level === 3 && "pl-6",
                    activeId === heading.id
                      ? "text-[var(--color-accent)] border-[var(--color-accent)] font-medium"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border-transparent"
                  )}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}