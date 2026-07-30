"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Sparkles, 
  FileText, 
  Library, 
  Boxes, 
  Bot, 
  Cpu, 
  Layers, 
  BookText, 
  Server, 
  Shield, 
  Zap, 
  Settings, 
  Search, 
  Check, 
  Monitor 
} from "lucide-react";

const modules = [
  { icon: Sparkles, label: "Dashboard", desc: "Overview & quick actions" },
  { icon: FileText, label: "Instruction Files", desc: "AGENTS.md & per-target configs" },
  { icon: Library, label: "Prompt Library", desc: "Curated templates by domain" },
  { icon: Boxes, label: "Prompt Engine", desc: "Structured system prompt builder" },
  { icon: Bot, label: "Personas", desc: "Reusable AI roles & behaviors" },
  { icon: Cpu, label: "Skills", desc: "Atomic composable capabilities" },
  { icon: Layers, label: "Workflows", desc: "Multi-step orchestration" },
  { icon: BookText, label: "Memories", desc: "Persistent context blocks" },
  { icon: Server, label: "MCP Manager", desc: "Protocol server configs" },
  { icon: Shield, label: "Asset Validator", desc: "Quality & compatibility checks" },
  { icon: Zap, label: "Prompt Optimizer", desc: "Clarity & model tuning" },
  { icon: Settings, label: "Settings", desc: "Providers, data, privacy" },
  { icon: Search, label: "Search", desc: "Cross-workspace find" },
];

export function DesktopPreview() {
  return (
    <section id="desktop" className="section" aria-labelledby="desktop-heading">
      <div className="container-app">
        <div className="text-center mb-16 animate-slide-up">
          <h2 id="desktop-heading" className="text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
            Desktop App — Your Productivity Workspace
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Native Tauri + Next.js application with 13 integrated modules. Fast, secure, and works completely offline.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {modules.map((module, index) => (
            <motion.div
              key={module.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="card-hover p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-light)] text-[var(--color-accent)]">
                    <module.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--color-text-primary)]">{module.label}</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">{module.desc}</p>
                  </div>
                  <Check className="h-5 w-5 text-[var(--color-success)] shrink-0 mt-1" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 relative animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-accent-light)]/20 to-transparent rounded-2xl blur-2xl" />
          <Card className="relative p-8 lg:p-12 bg-[var(--color-bg-surface)]/50 border-[var(--color-glass-border)]">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
                  Ready to transform your AI workflow?
                </h3>
                <p className="text-[var(--color-text-secondary)] mb-6 max-w-md">
                  Join 12,000+ developers building better prompts, faster. Download the native app for your platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a href="/download" className="inline-flex items-center gap-2">
                    <Button size="lg">Download for Free</Button>
                  </a>
                  <a href="https://github.com/ai-context-studio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                    <Button variant="outline" size="lg">View on GitHub</Button>
                  </a>
                </div>
              </div>
              <div className="flex-1 hidden lg:block">
                <div className="aspect-video bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border)] flex items-center justify-center">
                  <div className="text-center p-8">
                    <Monitor className="h-16 w-16 text-[var(--color-text-muted)] mx-auto mb-4" />
                    <p className="text-[var(--color-text-muted)]">Desktop App Screenshot</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-2">Interactive workspace preview</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}