"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, Github, Download, ExternalLink, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="section bg-[var(--color-accent)]" aria-labelledby="cta-heading">
      <div className="container-app text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 id="cta-heading" className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Ready to transform your AI workflow?
          </h2>
          <p className="text-lg text-[var(--color-accent-light)] max-w-2xl mx-auto mb-10">
            Join 12,000+ developers building better prompts, faster. Local-first, open source, and completely free.
          </p>

          <div className="flex flex-col sm:flex_row items-center justify-center gap-4 mb-12">
            <Button size="xl" variant="secondary" className="w-full sm:w-auto">
              <Link href="/download" className="inline-flex items-center gap-2 w-full justify-center">
                <Download className="h-5 w-5 mr-2" />
                Download Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button size="xl" variant="ghost" className="text-white hover:bg-white/10 border-white/20 w-full sm:w-auto">
              <Link href="https://github.com/ai-context-studio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 w-full justify-center">
                <Github className="h-5 w-5 mr-2" />
                Star on GitHub
                <ExternalLink className="h-5 w-5 ml-2" />
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