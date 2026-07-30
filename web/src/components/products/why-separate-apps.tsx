"use client";

import React from "react";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { Monitor, Globe, Store, Database, Users, Cloud, Shield, Cpu, Share2, Lock, Zap, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const reasons = [
  {
    icon: Cpu,
    title: "Local-First Architecture",
    desc: "The Desktop App runs entirely on your machine. AI inference, prompt processing, and data storage happen locally. No network required for core workflows.",
    detail: "This means zero latency for prompt execution, complete privacy for sensitive code, and full functionality offline. The Online Hub adds sync capabilities but is never required.",
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    desc: "Enterprise environments often require air-gapped deployments, strict data residency, or compliance certifications that cloud services cannot satisfy.",
    detail: "A native desktop app can run in fully isolated networks. The Registry spec enables private registries. Future Cloud is opt-in for teams needing managed hosting with audit logs and SSO.",
  },
  {
    icon: Layers,
    title: "Separation of Concerns",
    desc: "Each product has a single responsibility. The Desktop App creates. The Hub syncs. The Marketplace discovers. The Registry validates. The Community governs.",
    detail: "This prevents bloat and lets each team iterate independently. You can use the Desktop App alone, or add Hub for team sync, or Marketplace for discovery — without unwanted dependencies.",
  },
  {
    icon: Share2,
    title: "Open Protocols Over Proprietary APIs",
    desc: "Products communicate via open standards (.acs packages, manifest schema, MCP protocol). No vendor lock-in. You can swap any component.",
    detail: "Want a different marketplace? Use the same registry. Need custom sync? Build on the open spec. The ecosystem grows because anyone can extend it without permission.",
  },
  {
    icon: Zap,
    title: "Performance & Resource Isolation",
    desc: "Running AI workloads locally requires GPU/NPU access, memory management, and process isolation — things browsers sandbox heavily.",
    detail: "Tauri/Rust gives the Desktop App direct system access for model inference, file watching, and shell integration. The web-based Hub handles lighter coordination tasks.",
  },
  {
    icon: Lock,
    title: "Data Ownership",
    desc: "Your prompts, memories, and configurations live in local files you control. Export as JSON, YAML, or .acs packages anytime. No account required to start.",
    detail: "The Desktop App never phones home. Telemetry is opt-in and anonymous. Future Cloud is purely additive — sync if you want, stay local if you don't.",
  },
];

const products = [
  { name: "Desktop App", focus: "Creation & local execution", tech: "Tauri + Rust + React", users: "Individual developers, offline-first teams" },
  { name: "Online Hub", focus: "Sync, collaboration, teams", tech: "Next.js + React 19", users: "Distributed teams, multi-device users" },
  { name: "Marketplace", focus: "Discovery & distribution", tech: "Static export + CDN", users: "All users finding community assets" },
  { name: "Registry", focus: "Packaging & validation", tech: "Open spec + JSON Schema", users: "Tool authors, CI/CD, marketplace" },
  { name: "Community", focus: "Governance & contribution", tech: "GitHub Discussions + Discord", users: "Contributors, maintainers, users" },
];

export function WhySeparateApps() {
  return (
    <section id="why-separate" className="section bg-[var(--color-bg-secondary)]" aria-labelledby="why-heading">
      <div className="container-app">
        <ScrollReveal className="text-center mb-16">
          <h2 id="why-heading" className="text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
            Why Separate Apps?
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            We could have built one monolithic web app. Here's why we didn't — and why it matters for you.
          </p>
        </ScrollReveal>

        <div className="space-y-16">
          {reasons.map((reason, index) => (
            <ScrollReveal key={reason.title}>
              <div className="grid gap-8 lg:grid-cols-12 items-start">
                <div className="lg:col-span-3 flex-shrink-0">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center sticky top-24",
                    "bg-[var(--color-accent-light)] text-[var(--color-accent)]"
                  )}>
                    <reason.icon className="h-8 w-8" aria-hidden="true" />
                  </div>
                </div>
                <div className="lg:col-span-9">
                  <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">{reason.title}</h3>
                  <p className="text-[var(--color-text-secondary)] mb-4">{reason.desc}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{reason.detail}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}

          <ScrollReveal className="mt-8">
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)] text-center mb-12">
              Product Overview
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ScrollReveal key={product.name}>
                  <div className="card p-6">
                    <h4 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">{product.name}</h4>
                    <p className="text-sm text-[var(--color-accent)] font-medium mb-3">{product.focus}</p>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-4">{product.tech}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">Primary: {product.users}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}