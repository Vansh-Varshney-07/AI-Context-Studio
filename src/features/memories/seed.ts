"use client";

import type { MemoryBlock, MemoryType } from "./types";

/**
 * Seed memories for the Memories module.
 */
export const SEED_MEMORIES: MemoryBlock[] = [
  {
    id: "project-context-ai-context-studio",
    title: "AI Context Studio Project Context",
    type: "context",
    content: `# AI Context Studio — Project Context

## Overview
Local-first AI prompt engineering studio for building, testing, and sharing prompts, skills, personas, workflows, and MCP servers.

## Tech Stack
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Zustand, Framer Motion, Radix UI
- **Desktop**: Tauri v2, Rust (1.97+)
- **Storage**: IndexedDB with AES-GCM encryption
- **AI Providers**: OpenAI, Anthropic, Google Gemini, DeepSeek, NVIDIA, Ollama, OpenRouter

## Key Modules
1. Dashboard — Overview, quick start, recent files
2. Instruction Files — AGENTS.md, CLAUDE.md generators
3. Prompt Library — Curated templates by domain
4. System Prompt Engine — Structured prompt generation
5. Personas — Reusable AI personas
6. Skills — Atomic composable AI skills
7. Workflows — Multi-step pipelines
8. Memories — Long-running context blocks
9. MCP Manager — MCP server configurations
10. Validator — Asset quality validation
11. Optimizer — Prompt optimization
12. Settings — App configuration

## Architecture Principles
- Local-first, offline-capable
- No auth/backend required
- Encrypted local storage
- Extensible module registry
- Cross-platform (web + desktop)`,
    tags: ["project", "context", "architecture"],
    favorite: true,
    pinned: true,
    createdAt: new Date("2024-01-15").toISOString(),
    updatedAt: new Date("2024-07-20").toISOString(),
  },
  {
    id: "coding-standards-typescript",
    title: "TypeScript Coding Standards",
    type: "standard",
    content: `# TypeScript Coding Standards

## General Principles
- Use strict mode always
- Prefer 'type' over 'interface' for object types
- Use 'const' assertions for literal types
- Avoid 'any' — use 'unknown' with type guards
- Enable exactOptionalPropertyTypes

## Naming
- PascalCase for types, interfaces, enums
- camelCase for variables, functions, methods
- UPPER_SNAKE_CASE for constants
- Prefix private members with '_'

## Patterns
- Discriminated unions over optional fields
- Branded types for domain primitives
- Result<T, E> for error handling
- Zod schemas for runtime validation

## Imports
- Group: external → internal → relative
- Use path aliases (@/)
- No barrel exports for internal modules

## React/Next.js
- Server Components by default
- "use client" only when needed
- Use Server Actions for mutations
- Prefer RSC-compatible libraries`,
    tags: ["typescript", "coding-standards", "react", "nextjs"],
    favorite: false,
    pinned: false,
    createdAt: new Date("2024-02-01").toISOString(),
    updatedAt: new Date("2024-02-01").toISOString(),
  },
  {
    id: "api-design-principles",
    title: "API Design Principles",
    type: "reference",
    content: `# API Design Principles

## RESTful Conventions
- Nouns for resources, plural: /users, /projects
- HTTP verbs: GET, POST, PUT, PATCH, DELETE
- Nested resources: /users/{id}/posts
- Version in URL: /v1/users

## Request/Response
- JSON only, camelCase fields
- Envelope: { data, meta?, errors? }
- Pagination: cursor-based preferred
- Filtering: ?filter[field]=value
- Sorting: ?sort=field,-field

## Errors
- Standard format: { code, message, details? }
- HTTP status: 400, 401, 403, 404, 422, 500
- Include request_id for tracing

## Security
- Bearer tokens in Authorization header
- Rate limiting with Retry-After
- CORS configured per environment
- Input validation on all endpoints

## Versioning
- URL versioning for breaking changes
- Additive changes only within version
- Deprecation headers: Sunset, Deprecation`,
    tags: ["api", "rest", "design", "conventions"],
    favorite: true,
    pinned: false,
    createdAt: new Date("2024-01-20").toISOString(),
    updatedAt: new Date("2024-01-20").toISOString(),
  },
  {
    id: "debugging-checklist",
    title: "Debugging Checklist",
    type: "standard",
    content: `# Debugging Checklist

## Before Starting
- [ ] Reproduce consistently
- [ ] Identify minimal reproduction case
- [ ] Check recent changes (git log, deps)
- [ ] Verify environment (node version, deps)

## Investigation
- [ ] Read error message fully
- [ ] Check stack trace origin
- [ ] Add strategic console.log / debugger
- [ ] Check network tab (if web)
- [ ] Verify data at boundaries
- [ ] Test assumptions with unit test

## Common Issues
- [ ] Async/await missing
- [ ] Race conditions
- [ ] Stale closures
- [ ] Type coercion bugs
- [ ] Off-by-one errors
- [ ] Null/undefined access
- [ ] Mutating shared state

## After Fix
- [ ] Verify fix works
- [ ] Run related tests
- [ ] Check for regressions
- [ ] Add test for regression
- [ ] Document root cause`,
    tags: ["debugging", "checklist", "troubleshooting"],
    favorite: false,
    pinned: true,
    createdAt: new Date("2024-02-15").toISOString(),
    updatedAt: new Date("2024-02-15").toISOString(),
  },
  {
    id: "meeting-notes-2024-q1",
    title: "Q1 2024 Meeting Notes",
    type: "decision",
    content: `# Q1 2024 Meeting Notes

## Jan 15 — Project Kickoff
- Decided on Tauri v2 for desktop
- Module registry architecture approved
- Local-first storage with IndexedDB

## Feb 1 — Architecture Review
- Provider abstraction layer designed
- Streaming support for all providers
- MCP integration planned for desktop

## Mar 1 — Phase 3 Planning
- Seed data for all modules
- Settings module spec
- Search module deferred to Phase 6

## Apr 1 — Desktop MVP
- Tauri commands working
- NSIS installer building
- MCP stdio transport functional`,
    tags: ["meetings", "planning", "quarterly"],
    favorite: false,
    pinned: false,
    createdAt: new Date("2024-04-01").toISOString(),
    updatedAt: new Date("2024-04-01").toISOString(),
  },
  {
    id: "research-llm-prompting",
    title: "LLM Prompting Research",
    type: "knowledge",
    content: `# LLM Prompting Research

## Key Papers & Resources
- "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" (Wei et al., 2022)
- "Tree of Thoughts: Deliberate Problem Solving with Large Language Models" (Yao et al., 2023)
- "Reflexion: Language Agents with Verbal Reinforcement Learning" (Shinn et al., 2023)
- "AutoGPT: Autonomous GPT-4 Experiment"

## Prompting Techniques
1. **Zero-shot** — Direct instruction
2. **Few-shot** — Examples in context
3. **Chain-of-Thought** — Step-by-step reasoning
4. **Self-Consistency** — Multiple CoT, majority vote
5. **Tree of Thoughts** — Branching exploration
6. **ReAct** — Reasoning + Acting
7. **Reflexion** — Self-reflection + improvement

## Best Practices
- Be specific about format
- Provide context and constraints
- Use system prompts for role definition
- Structure output with clear delimiters
- Include negative examples
- Iterate and test with real inputs`,
    tags: ["research", "llm", "prompting", "chain-of-thought"],
    favorite: true,
    pinned: false,
    createdAt: new Date("2024-01-10").toISOString(),
    updatedAt: new Date("2024-03-15").toISOString(),
  },
  {
    id: "feature-ideas-backlog",
    title: "Feature Ideas Backlog",
    type: "context",
    content: `# Feature Ideas Backlog

## High Priority
- [ ] Settings module (theme, API keys, export/import)
- [ ] Search across all modules
- [ ] Keyboard shortcuts / command palette enhancements
- [ ] Drag-and-drop workflow builder
- [ ] MCP marketplace integration

## Medium Priority
- [ ] Collaborative workspaces (sync via git)
- [ ] Plugin system for custom modules
- [ ] Visual prompt builder (nodes/edges)
- [ ] Automated testing of prompts
- [ ] Cost tracking per provider

## Low Priority / Nice to Have
- [ ] Voice input for prompts
- [ ] AI-generated module scaffolds
- [ ] Integration with VS Code / Cursor
- [ ] Mobile-responsive web version
- [ ] Community template gallery`,
    tags: ["backlog", "features", "roadmap", "planning"],
    favorite: false,
    pinned: true,
    createdAt: new Date("2024-01-20").toISOString(),
    updatedAt: new Date("2024-07-20").toISOString(),
  },
];

export const MEMORY_TYPES: { value: MemoryType; label: string; description: string }[] = [
  { value: "context", label: "Project Context", description: "High-level project overview and architecture" },
  { value: "knowledge", label: "Knowledge", description: "Investigation findings and research" },
  { value: "decision", label: "Decision Log", description: "Decisions and action items" },
  { value: "standard", label: "Standards", description: "Team conventions and best practices" },
  { value: "reference", label: "Reference", description: "Quick reference material" },
];