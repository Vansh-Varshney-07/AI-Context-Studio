'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Star, Github, Download, ExternalLink, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="section bg-[var(--color-accent)]" aria-labelledby="cta-heading">
      <div className="container-app text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 id="cta-heading" className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            Ready to transform your AI workflow?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-[var(--color-accent-light)]">
            Join 12,000+ developers building better prompts, faster. Local-first, open source, and
            completely free.
          </p>

          <div className="sm:flex_row mb-12 flex flex-col items-center justify-center gap-4">
            <Button size="xl" variant="secondary" className="w-full sm:w-auto">
              <Link
                href="/download"
                className="inline-flex w-full items-center justify-center gap-2"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="xl"
              variant="ghost"
              className="w-full border-white/20 text-white hover:bg-white/10 sm:w-auto"
            >
              <Link
                href="https://github.com/ai-context-studio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2"
              >
                <Github className="mr-2 h-5 w-5" />
                Star on GitHub
                <ExternalLink className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-[var(--color-accent-light)]">
            <span className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-current" />
              4.2K+ Stars
            </span>
            <span className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              85K+ Downloads
            </span>
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              MIT Licensed
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
