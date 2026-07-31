'use client';

import Link from 'next/link';
import { MotionDiv, MotionSpan, MotionH1, MotionP } from '@/components/ui/motion';
import {
  Download,
  ArrowRight,
  Github,
  Shield,
  Code,
  Globe,
  Users,
  Cpu,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fadeIn } from '@/lib/animations';

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-[var(--color-bg-primary)]" aria-hidden="true">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[var(--color-accent-light)]/30 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-[var(--color-violet-light)]/30 blur-3xl" />
      </div>

      <div className="container-app relative py-20">
        <MotionDiv
          className="mx-auto max-w-4xl text-center"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <MotionSpan
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-light)] px-4 py-1.5 text-sm font-medium text-[var(--color-accent)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            </span>
            Now with MCP Server Support & AI Agent Orchestration
          </MotionSpan>

          <MotionH1
            className="mb-6 text-5xl leading-[1.1] font-bold tracking-tight text-[var(--color-text-primary)] sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Build, customize, and export{' '}
            <span className="bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-violet)] to-[var(--color-cyan)] bg-clip-text text-transparent">
              AI instruction assets
            </span>
            <br />
            for any coding assistant
          </MotionH1>

          <MotionP
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)] sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Local-first, offline-first prompt engineering studio. Create system prompts, instruction
            files, memories, MCP configurations, and workflows — then export to Cursor, Claude Code,
            Windsurf, VS Code, and more.
          </MotionP>

          <MotionDiv
            className="sm:flex_row flex flex-col items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button size="xl" className="w-full sm:w-auto">
              <Link
                href="/download"
                className="inline-flex w-full items-center justify-center gap-2"
              >
                <Download className="mr-2 h-5 w-5" aria-hidden="true" />
                Download Free
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" className="w-full sm:w-auto">
              <Link
                href="https://github.com/ai-context-studio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2"
              >
                <Github className="mr-2 h-5 w-5" aria-hidden="true" />
                View on GitHub
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </MotionDiv>

          <MotionDiv
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-[var(--color-text-muted)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
              100% Local-First
            </span>
            <span className="flex items-center gap-2">
              <Code className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
              Open Source (MIT)
            </span>
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
              Works Offline
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
              12K+ Developers
            </span>
          </MotionDiv>
        </MotionDiv>

        <MotionDiv
          className="relative mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="relative mx-auto aspect-[4/3] max-w-5xl">
            <div className="absolute inset-0 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-light)]/20 via-transparent to-[var(--color-violet-light)]/20" />
              <div className="relative flex h-full flex-col p-6">
                <div className="mb-6 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center font-mono text-sm text-[var(--color-text-muted)]">
                    workspace.ai-context-studio
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                  <div className="flex flex-wrap justify-center gap-4">
                    <Cpu className="h-16 w-16 text-[var(--color-accent)]/30" aria-hidden="true" />
                    <Sparkles
                      className="h-16 w-16 text-[var(--color-violet)]/30"
                      aria-hidden="true"
                    />
                    <Zap className="h-16 w-16 text-[var(--color-cyan)]/30" aria-hidden="true" />
                  </div>
                  <p className="max-w-sm text-[var(--color-text-muted)]">
                    Floating UI preview — drag, resize, and compose assets visually
                  </p>
                </div>
              </div>
            </div>
            <div
              className="absolute -right-6 -bottom-6 h-72 w-72 rounded-2xl bg-gradient-to-br from-[var(--color-accent)]/10 to-[var(--color-violet)]/10 blur-2xl lg:-right-12 lg:-bottom-12"
              aria-hidden="true"
            />
            <div
              className="absolute -top-6 -left-6 h-72 w-72 rounded-2xl bg-gradient-to-br from-[var(--color-cyan)]/10 to-[var(--color-accent)]/10 blur-2xl lg:-top-12 lg:-left-12"
              aria-hidden="true"
            />
          </div>
        </MotionDiv>
      </div>
    </section>
  );
}
