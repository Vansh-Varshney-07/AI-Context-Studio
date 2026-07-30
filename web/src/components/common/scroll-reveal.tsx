"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
  margin?: string;
}

export function ScrollReveal({
  children,
  className,
  once = true,
  margin = "0px 0px -100px 0px",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { rootMargin: margin, threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [margin, once]);

  if (reducedMotion) {
    return <div ref={ref} className={cn("opacity-100", className)}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
    >
      {children}
    </div>
  );
}