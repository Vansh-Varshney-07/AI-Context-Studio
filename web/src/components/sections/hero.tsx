"use client";

import Link from "next/link";
import { MotionDiv, MotionSpan, MotionH1, MotionP } from "@/components/ui/motion";
import { Download, ArrowRight, Github, Shield, Code, Globe, Users, Cpu, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeIn, slideUp } from "@/lib/animations";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-[var(--color-bg-primary)]" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-accent-light)]/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-violet-light)]/30 rounded-full blur-3xl" />
      </div>

      <div className="relative container-app py-20">
        <MotionDiv
          className="text-center max-w-4xl mx-auto"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <MotionSpan
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)] text-sm font-medium mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]" />
            </span>
            Now with MCP Server Support & AI Agent Orchestration
          </MotionSpan>

          <MotionH1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--color-text-primary)] mb-6 leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Build, customize, and export{" "}
            <span className="bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-violet)] to-[var(--color-cyan)] bg-clip-text text-transparent">
              AI instruction assets
            </span>
            <br />
            for any coding assistant
          </MotionH1>

          <MotionP
            className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Local-first, offline-first prompt engineering studio. Create system prompts, instruction files,
            memories, MCP configurations, and workflows — then export to Cursor, Claude Code, Windsurf,
            VS Code, and more.
          </MotionP>

          <MotionDiv
            className="flex flex-col sm:flex_row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button size="xl" className="w-full sm:w-auto">
              <Link href="/download" className="inline-flex items-center gap-2 w-full justify-center">
                <Download className="h-5 w-5 mr-2" aria-hidden="true" />
                Download Free
                <ArrowRight className="h-5 w-5 ml-2" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" className="w-full sm:w-auto">
              <Link href="https://github.com/ai-context-studio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 w-full justify-center">
                <Github className="h-5 w-5 mr-2" aria-hidden="true" />
                View on GitHub
                <ArrowRight className="h-5 w-5 ml-2" aria-hidden="true" />
              </Link>
            </Button>
          </MotionDiv>

          <MotionDiv
            className="flex flex-wrap items-center justify-center gap-8 text-sm text-[var(--color-text-muted)] mt-16"
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
          <div className="relative aspect-[4/3] max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-light)]/20 via-transparent to-[var(--color-violet-light)]/20" />
              <div className="relative p-6 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center text-sm text-[var(--color-text-muted)] font-mono">
                    workspace.ai-context-studio
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="flex gap-4 flex-wrap justify-center">
                    <Cpu className="h-16 w-16 text-[var(--color-accent)]/30" aria-hidden="true" />
                    <Sparkles className="h-16 w-16 text-[var(--color-violet)]/30" aria-hidden="true" />
                    <Zap className="h-16 w-16 text-[var(--color-cyan)]/30" aria-hidden="true" />
                  </div>
                  <p className="text-[var(--color-text-muted)] max-w-sm">
                    Floating UI preview — drag, resize, and compose assets visually
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 lg:-bottom-12 lg:-right-12 w-72 h-72 bg-gradient-to-br from-[var(--color-accent)]/10 to-[var(--color-violet)]/10 rounded-2xl blur-2xl" aria-hidden="true" />
            <div className="absolute -top-6 -left-6 lg:-top-12 lg:-left-12 w-72 h-72 bg-gradient-to-br from-[var(--color-cyan)]/10 to-[var(--color-accent)]/10 rounded-2xl blur-2xl" aria-hidden="true" />
          </div>
        </MotionDiv>
      </div>
    </section>
  );
}