"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Github, Twitter, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { mainNav, socialLinks, ctaButtons } from "@/data/navigation";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[var(--z-sticky)] transition-all duration-200",
        scrolled
          ? "bg-[var(--color-bg-primary)]/80 backdrop-blur-md border-b border-[var(--color-border)] shadow-sm"
          : "bg-transparent",
      )}
    >
      <nav className="container-app" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="AI Context Studio Home">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[var(--color-text-primary)]">AI Context Studio</span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-6">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
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
            className="md:hidden p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-[var(--color-border)] animate-slide-down">
            <div className="flex flex-col gap-4">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2 py-2 text-base font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-[var(--color-border)]">
                <Button variant="outline" className="w-full">
                  <Link href={ctaButtons.secondary?.href || "/download"} onClick={() => setMobileMenuOpen(false)}>
                    {ctaButtons.secondary?.label || "Download"}
                  </Link>
                </Button>
                <Button className="w-full">
                  <Link href={ctaButtons.primary?.href || "/download"} onClick={() => setMobileMenuOpen(false)}>
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
                    className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                    aria-label={social.label}
                  >
                    {social.component === "Github" && <Github className="h-5 w-5" />}
                    {social.component === "Twitter" && <Twitter className="h-5 w-5" />}
                    {social.component === "MessageCircle" && <MessageCircle className="h-5 w-5" />}
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