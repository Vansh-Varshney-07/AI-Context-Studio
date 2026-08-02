"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Zap,
  FileCode,
  User,
  Server,
  GitBranch,
  Cpu,
  Wand2,
  Shield,
  Brain,
  ArrowRight,
  Sparkles,
  FileText,
  MessageSquare,
  Layers,
  Database,
  Terminal,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  featured?: boolean;
}

const TOOLS: Tool[] = [
  {
    id: "generate",
    name: "⚡ Generate File",
    description: "Create system prompts, instruction files, prompt templates, context files, memories, and workflows with structured forms and AI enhancement.",
    href: "/generate",
    icon: Zap,
    iconColor: "text-yellow-500",
    featured: true,
  },
  {
    id: "instruction-files",
    name: "📋 Instruction Files",
    description: "Generate AGENTS.md, CLAUDE.md, .cursorrules, and 9 other target formats with per-target dynamic questions.",
    href: "/tools/instruction-files",
    icon: FileCode,
    iconColor: "text-blue-500",
  },
  {
    id: "personas",
    name: "🎭 Personas",
    description: "Browse 10 built-in AI personas (code reviewer, architect, devops, security, etc.) and render them to system prompts or instruction files.",
    href: "/tools/personas",
    icon: User,
    iconColor: "text-purple-500",
  },
  {
    id: "mcp-config",
    name: "🔧 MCP Config Generator",
    description: "Build MCP server configurations for 11 AI clients (Claude Desktop, Cursor, OpenCode, Continue, etc.) with validation.",
    href: "/tools/mcp-config",
    icon: Server,
    iconColor: "text-green-500",
  },
  {
    id: "workflows",
    name: "📦 Workflows",
    description: "Browse 7 built-in workflow pipelines (feature development, bug fix, code review, refactoring, etc.) and render to YAML.",
    href: "/tools/workflows",
    icon: GitBranch,
    iconColor: "text-orange-500",
  },
  {
    id: "skills",
    name: "⚡ Skills",
    description: "Explore 12 atomic AI skills across programming, writing, analysis, devops categories with full prompts and parameters.",
    href: "/tools/skills",
    icon: Cpu,
    iconColor: "text-pink-500",
  },
  {
    id: "optimize",
    name: "✨ Optimizer",
    description: "Optimize prompts with 16 engines (clarity, conciseness, CoT, token reduction, safety, etc.) with diff view and stats.",
    href: "/tools/optimize",
    icon: Wand2,
    iconColor: "text-cyan-500",
  },
  {
    id: "validate",
    name: "✅ Validator",
    description: "Validate AI assets with quality scoring, AI performance estimates, token efficiency, and compatibility matrix.",
    href: "/tools/validate",
    icon: Shield,
    iconColor: "text-red-500",
  },
  {
    id: "memories",
    name: "🧠 Memories",
    description: "Manage memory blocks (context, knowledge, decisions, standards, references) and render to markdown.",
    href: "/tools/memories",
    icon: Brain,
    iconColor: "text-indigo-500",
  },
];

export function ToolGrid() {
  return (
    <div className="container-app py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            AI Tools & Generators
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            A complete suite of generators for creating AI instruction files, personas, workflows, MCP configs, and more.
            Use structured forms for deterministic output, or enhance with AI using your own API keys.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <article
              key={tool.id}
              className={cn(
                "relative overflow-hidden transition-all duration-300 hover:shadow-xl",
                tool.featured && "ring-2 ring-[var(--color-accent)]"
              )}
            >
              <Card className="h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl",
                      tool.iconColor
                    )}
                  >
                    <tool.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {tool.featured && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--color-accent)] text-white">
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                  {tool.name}
                </h3>
                <p className="text-[var(--color-text-secondary)] text-sm mb-6 flex-1">
                  {tool.description}
                </p>

                <Link href={tool.href} className="flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] hover:underline">
                  Explore tool
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Card>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-[var(--color-text-secondary)] mb-4">
            All tools run locally in your browser with deterministic engines.
            <br />
            API keys for AI enhancement are session-only and never stored.
          </p>
          <Link href="/generate" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg font-medium hover:bg-[var(--color-accent-dark)] transition-colors">
            <Zap className="h-5 w-5" />
            Start Generating
          </Link>
        </div>
      </div>
    </div>
  );
}