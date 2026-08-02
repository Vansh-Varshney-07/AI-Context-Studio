"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Github, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { mainNav, socialLinks, ctaButtons, marketplaceDropdown } from "@/data/navigation";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);
  const marketplaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (marketplaceRef.current && !marketplaceRef.current.contains(event.target as Node)) {
        setMarketplaceOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-[var(--z-sticky)] transition-all duration-200",
        scrolled
          ? "border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/80 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <nav className="container-app" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="AI Context Studio Home">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-[var(--color-text-primary)]">
              AI Context Studio
            </span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-6">
            {mainNav.map((item) => {
              const isMarketplace = item.href === "/marketplace";
              if (isMarketplace) {
                return (
                  <div key={item.href} className="relative" ref={marketplaceRef}>
                    <button
                      className="flex items-center gap-1 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                      onClick={() => setMarketplaceOpen(!marketplaceOpen)}
                      aria-expanded={marketplaceOpen}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown className={cn("h-4 w-4 transition-transform", marketplaceOpen && "rotate-180")} />
                    </button>
                    {marketplaceOpen && (
                      <div
                        className="absolute left-0 top-full mt-2 z-50 min-w-[220px] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] py-2 shadow-lg animate-slide-down"
                        role="menu"
                      >
                        {marketplaceDropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
                              dropdownItem.highlighted
                                ? "text-[var(--color-accent)] hover:bg-[var(--color-accent-light)]"
                                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
                            )}
                            role="menuitem"
                            onClick={() => setMarketplaceOpen(false)}
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex md:items-center md:gap-3">
            {ctaButtons.secondary && (
              <Button variant="ghost" size="sm">
                <Link href={ctaButtons.secondary.href}>{ctaButtons.secondary.label}</Link>
              </Button>
            )}
            {ctaButtons.primary && (
              <Button size="sm">
                <Link href={ctaButtons.primary.href}>{ctaButtons.primary.label}</Link>
              </Button>
            )}
          </div>

          <button
            className="rounded-lg p-2 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="animate-slide-down border-t border-[var(--color-border)] py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2 py-2 text-base font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 border-t border-[var(--color-border)] pt-4">
                <Button variant="outline" className="w-full">
                  <Link
                    href={ctaButtons.secondary?.href || "/download"}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {ctaButtons.secondary?.label || "Download"}
                  </Link>
                </Button>
                <Button className="w-full">
                  <Link
                    href={ctaButtons.primary?.href || "/download"}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {ctaButtons.primary?.label || "Get Started"}
                  </Link>
                </Button>
              </div>
              <div className="flex gap-4 pt-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]"
                    aria-label={social.label}
                  >
                    {social.component === "Github" && <Github className="h-5 w-5" />}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}