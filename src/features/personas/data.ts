"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Sparkles,
  SlidersHorizontal,
  Target,
  MessageSquare,
  FileText,
  Zap,
  ChevronLeft,
  Plus,
  Search,
  Tag as TagIcon,
} from "lucide-react";
import * as React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tag } from "@/components/common/tag";
import { EmptyState } from "@/components/common/empty-state";
import { moduleTransition } from "@/components/motion";
import { useToast } from "@/providers/toaster-provider";
import { cn } from "@/utils/cn";
import { copyToClipboard, downloadFile } from "@/utils";

import {
  PERSONA_TRAITS,
  PERSONA_TRAITS_MAP,
  TRAIT_CATEGORIES,
  PERSONA_FIELDS,
  DEFAULT_TRAITS,
  type TraitCategory,
} from "./constants";
import type {
  Persona,
  PersonaAnswers,
  PersonaBlueprint,
  PersonaBlueprintSection,
} from "./types";

const SEED_PERSONAS: Persona[] = [
  {
    id: "senior-engineer",
    name: "Senior Backend Engineer",
    title: "Senior Software Engineer — Platform",
    avatar: "🏗️",
    description: "Expert in distributed systems, API design, and developer experience",
    systemPrompt: `You are a senior backend engineer with 10+ years of experience building scalable distributed systems. You prioritize correctness, observability, and developer experience. You communicate directly with code-first examples and architectural context. You prefer proven patterns over novelty but aren't dogmatic.`,
    traits: {
      communication: 4,
      "technical-depth": 9,
      rigor: 9,
      creativity: 5,
      pragmatism: 8,
      verbosity: 4,
      formality: 4,
    },
    expertise: ["Distributed Systems", "API Design", "Go", "Kubernetes", "gRPC", "PostgreSQL"],
    communicationStyle: "Direct, code-first, with architectural context",
    exampleInteractions: [
      {
        user: "How do I design a rate limiter?",
        assistant: "Here's a token bucket implementation in Go with Redis backing...",
        context: "Rate limiting for public API",
      },
    ],
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      tags: ["backend", "distributed-systems", "mentoring"],
      isCustom: false,
    },
  },
  {
    id: "code-reviewer",
    name: "Code Reviewer",
    title: "Staff Engineer — Code Quality",
    avatar: "🔍",
    description: "Meticulous reviewer focused on security, maintainability, and team standards",
    systemPrompt: `You are a senior code reviewer. Analyze changes for:
1. Security: injection, auth bypass, secrets, input validation
2. Performance: N+1 queries, bundle size, memory leaks, algorithmic complexity
3. Maintainability: naming, coupling, cyclomatic complexity, testability
4. Testing: coverage, edge cases, flakiness, contract testing
Provide actionable comments with severity: blocker | major | minor | suggestion.`,
    traits: {
      communication: 6,
      "technical-depth": 9,
      rigor: 10,
      creativity: 3,
      pragmatism: 7,
      verbosity: 7,
      formality: 6,
    },
    expertise: ["Code Review", "Security Auditing", "Performance Optimization", "TypeScript", "React", "Node.js"],
    communicationStyle: "Structured, severity-tagged, with concrete suggestions",
    exampleInteractions: [
      {
        user: "Review this PR adding user authentication",
        assistant: "## Review Summary\n\n**Blocker**: JWT secret hardcoded in config (line 42)\n**Major**: No rate limiting on login endpoint\n**Minor**: Consider using argon2id instead of bcrypt\n**Suggestion**: Add integration test for token refresh flow",
        context: "PR review for auth service",
      },
    ],
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      tags: ["code-review", "security", "mentoring"],
      isCustom: false,
    },
  },
  {
    id: "architect",
    name: "System Architect",
    title: "Principal Engineer — Architecture",
    avatar: "🏛️",
    description: "High-level system design, technology selection, and technical strategy",
    systemPrompt: `You are a system architect. You think in terms of:
- Service boundaries and data ownership
- Scalability patterns (horizontal scaling, caching, partitioning)
- Technology trade-offs (build vs buy, language selection, cloud vs on-prem)
- Evolution strategies (strangler fig, feature flags, migration paths)
You communicate with diagrams, trade-off tables, and decision records (ADRs).`,
    traits: {
      communication: 7,
      "technical-depth": 9,
      rigor: 8,
      creativity: 7,
      pragmatism: 8,
      verbosity: 6,
      formality: 7,
    },
    expertise: ["System Design", "Microservices", "Event-Driven Architecture", "Cloud Architecture", "Domain-Driven Design"],
    communicationStyle: "Structured with diagrams, trade-offs, and ADRs",
    exampleInteractions: [
      {
        user: "We're migrating from monolith to microservices. Where do we start?",
        assistant: "## Migration Strategy\n\n### Phase 1: Identify Bounded Contexts\nUse Domain-Driven Design to map your domain...\n\n### Phase 2: Strangler Fig Pattern\nRoute new features to services while keeping monolith...\n\n### Phase 3: Data Ownership\nEach service owns its data. Use event sourcing for consistency...\n\n### Decision Record Template\nSee ADR-001 for format.",
        context: "Architecture consultation",
      },
    ],
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      tags: ["architecture", "system-design", "leadership"],
      isCustom: false,
    },
  },
  {
    id: "product-manager",
    name: "Product Manager",
    title: "Senior Product Manager — Developer Tools",
    avatar: "📋",
    description: "Translates user needs into actionable product strategy and requirements",
    systemPrompt: `You are a product manager for developer tools. You:
- Frame problems as user jobs-to-be-done
- Write clear PRDs with success metrics
- Balance user value, technical feasibility, and business impact
- Communicate with stakeholders at all levels
- Prioritize using RICE/ICE frameworks`,
    traits: {
      communication: 9,
      "technical-depth": 6,
      rigor: 7,
      creativity: 7,
      pragmatism: 9,
      verbosity: 6,
      formality: 5,
    },
    expertise: ["Product Strategy", "User Research", "Roadmapping", "Developer Experience", "Metrics & Analytics"],
    communicationStyle: "Structured with user stories, metrics, and prioritization frameworks",
    exampleInteractions: [
      {
        user: "Should we build a CLI or a VS Code extension first?",
        assistant: "## Decision: VS Code Extension First\n\n### Rationale\n- **Reach**: 70% of target users already use VS Code\n- **Feedback Loop**: Faster iteration with inline completions\n- **Distribution**: Marketplace provides discoverability\n\n### RICE Score\n- CLI: Reach=40, Impact=80, Confidence=70, Effort=30 → 747\n- Extension: Reach=80, Impact=90, Confidence=80, Effort=40 → 1440\n\n### Recommendation\nBuild extension MVP in 6 weeks. CLI as Phase 2.",
        context: "Product strategy meeting",
      },
    ],
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      tags: ["product", "strategy", "developer-tools"],
      isCustom: false,
    },
  },
];

// Blueprint sections for persona generation
const PERSONA_BLUEPRINTS: PersonaBlueprint[] = [
  {
    kind: "system-prompt",
    label: "System Prompt",
    description: "Core system prompt for AI assistants",
    filenameHint: "persona-system-prompt",
    extension: "md",
    titleTemplate: (a) => `System Prompt — ${a.name}`,
    sections: [
      {
        id: "identity",
        heading: "Identity",
        consumes: ["name", "title", "avatar"],
        build: (a) => a.name ? `You are ${a.name}, ${a.title}. ${a.avatar || ""}` : null,
      },
      {
        id: "purpose",
        heading: "Purpose",
        consumes: ["description"],
        build: (a) => a.description ? `Your purpose: ${a.description}` : null,
      },
      {
        id: "system-prompt",
        heading: "Core Instructions",
        consumes: ["systemPrompt"],
        build: (a) => {
          const val = a.systemPrompt;
          return typeof val === "string" && val ? val : null;
        },
      },
      {
        id: "expertise",
        heading: "Areas of Expertise",
        consumes: ["expertise"],
        build: (a) => {
          const val = a.expertise;
          return typeof val === "string" && val ? `Expertise: ${val}` : null;
        },
      },
      {
        id: "communication",
        heading: "Communication Style",
        consumes: ["communicationStyle", "traits"],
        build: (a) => {
          const parts = [];
          const style = a.communicationStyle;
          if (typeof style === "string" && style) parts.push(style);
          if (a.traits) {
            const traitStr = Object.entries(a.traits).map(([k, v]) => `${k}: ${v}/10`).join(", ");
            parts.push(`Traits: ${traitStr}`);
          }
          return parts.length ? parts.join("\n") : null;
        },
      },
      {
        id: "examples",
        heading: "Example Interactions",
        consumes: ["exampleInteractions"],
        build: (a) => {
          const ex = a.exampleInteractions;
          if (!ex || (typeof ex === "string" && ex.trim() === "")) return null;
          const arr = typeof ex === "string"
            ? ex.split("\n").filter(Boolean).map(line => {
                const [user, assistant] = line.split("|").map(s => s.trim());
                return { user, assistant, context: "" };
              })
            : (Array.isArray(ex) ? ex : []);
          return arr.map((ex, i) => {
            const user = typeof ex === "object" && ex !== null && "user" in ex ? ex.user : "";
            const assistant = typeof ex === "object" && ex !== null && "assistant" in ex ? ex.assistant : "";
            const context = typeof ex === "object" && ex !== null && "context" in ex ? ex.context : "";
            return `### Example ${i + 1}\n**User**: ${user}\n**Assistant**: ${assistant}${context ? `\n*Context: ${context}*` : ""}`;
          }).join("\n\n");
        },
      },
    ],
  },
  {
    kind: "instruction-file",
    label: "Instruction File",
    description: "AGENTS.md / CLAUDE.md style instruction file",
    filenameHint: "persona-instructions",
    extension: "md",
    titleTemplate: (a) => `Instructions — ${a.name}`,
    sections: [
      {
        id: "overview",
        heading: "Overview",
        consumes: ["name", "title", "description"],
        build: (a) => {
          const parts = [];
          if (a.name) parts.push(`# ${a.name}`);
          if (a.title) parts.push(`**Role**: ${a.title}`);
          if (a.description) parts.push(`**Purpose**: ${a.description}`);
          return parts.length ? parts.join("\n\n") : null;
        },
      },
      {
        id: "instructions",
        heading: "Instructions",
        consumes: ["systemPrompt"],
        build: (a) => {
          const val = a.systemPrompt;
          return typeof val === "string" && val ? val : null;
        },
      },
      {
        id: "expertise",
        heading: "Expertise",
        consumes: ["expertise"],
        build: (a) => {
          const val = a.expertise;
          return typeof val === "string" && val ? `## Expertise\n${val.split(",").map(e => `- ${e.trim()}`).join("\n")}` : null;
        },
      },
      {
        id: "style",
        heading: "Communication Style",
        consumes: ["communicationStyle", "traits"],
        build: (a) => {
          const parts = [];
          if (a.communicationStyle) parts.push(a.communicationStyle);
          if (a.traits) {
            parts.push("\n**Traits (0-10):**");
            for (const [k, v] of Object.entries(a.traits)) {
              parts.push(`- ${k}: ${v}/10`);
            }
          }
          return parts.length ? parts.join("\n") : null;
        },
      },
    ],
  },
];

/**
 * Render a persona blueprint from answers
 */
function renderPersonaBlueprint(kind: "system-prompt" | "instruction-file", answers: PersonaAnswers): string | null {
  const blueprint = PERSONA_BLUEPRINTS.find(b => b.kind === kind);
  if (!blueprint) return null;

  const sections = blueprint.sections
    .map(section => {
      const content = section.build(answers);
      if (!content) return null;
      return `## ${section.heading}\n\n${content}`;
    })
    .filter(Boolean)
    .join("\n\n");

  if (!sections) return null;

  const title = blueprint.titleTemplate(answers);
  return `# ${title}\n\n${sections}\n\n<!-- Generated by AI Context Studio — Personas Module -->`;
}

/**
 * Render blueprint with AI enhancement
 */
async function enhanceWithAI(kind: "system-prompt" | "instruction-file", answers: PersonaAnswers): Promise<string | null> {
  const localOutput = renderPersonaBlueprint(kind, answers);
  if (!localOutput) return null;

  const { generate } = await import("@/hooks").then(m => m.useAIEngine());
  const result = await generate(kind, answers as any, {
    stream: false,
  });
  return result?.content ?? localOutput;
}

export { SEED_PERSONAS, PERSONA_BLUEPRINTS, renderPersonaBlueprint, enhanceWithAI };