# AI Context Studio — Project Roadmap

> Central hub for AI instruction engineering. Build, customize, manage, and export
> AI assets (instruction files, prompt templates, personas, skills, workflows,
> memories, MCP configurations) for multiple AI coding assistants.
>
> **Feel**: Linear + Raycast + Cursor + Vercel — minimalistic, fast, smooth, modern.
> Dark premium UI with subtle gradients, glassmorphism, rounded cards, smooth
> animations, excellent typography.

---

## Project Charter (Top-level prompt)

- Project Name: **AI Context Studio**
- Modern, premium web application acting as central hub for AI instruction engineering.
- NOT a simple prompt library — users create, customize, manage and export AI assets for
  multiple AI coding assistants.
- Design feel: Linear + Raycast + Cursor + Vercel.
- Minimalistic. Fast. Smooth. Modern.
- Dark premium interface, subtle gradients, glassmorphism, rounded cards, smooth
  animations, excellent typography.
- Every component production ready.
- TypeScript. No placeholder code. No TODOs. No mock implementations unless requested.
- Senior frontend architect mindset. Scalable. No duplicate code.
- Prefer reusable components. Modular folder structure.
- Do not implement features that were not requested.
- Always explain architectural decisions before coding.

### Staff Engineer Operating Contract
- Act as Staff Software Engineer + Senior UI/UX Architect.
- Before writing code: (1) analyze phase, (2) identify architectural issues,
  (3) propose improvements without changing vision, (4) explain plan,
  (5) implement only the requested phase.
- Never modify previous phases unless required.
- Never introduce placeholder code.
- Never skip responsiveness.
- Never create duplicate components.
- Prefer composition over inheritance.
- Clean architecture, modular, reusable.
- Every component production ready.
- Stop immediately after completing current phase. Wait for next phase.

---

## Phase 1 — Project Foundation

### Goal
Create the complete project foundation.

### Requirements
- Next.js latest (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion
- Lucide Icons
- Zustand
- TanStack Query
- React Hook Form
- Zod
- ESLint
- Prettier
- Dark Theme

### Deliverables
- Enterprise folder structure:
  - `components`
  - `features`
  - `hooks`
  - `services`
  - `types`
  - `lib`
  - `providers`
  - `constants`
  - `styles`
  - `utils`
- Reusable layout components.
- Do NOT build pages yet.
- Deliver only the project architecture.
- Stop after completion.

---

## Phase 2 — Dashboard

### Goal
Build the dashboard exactly as described.

### Layout
- Left Sidebar
- Main Workspace
- Top-Right User Section
- Responsive

### Sidebar contents
- Instruction Files
- Prompt Library
- Personas
- Skills
- Workflows
- Memories & Context
- Configurations
- Bottom Section: API Provider dropdown, API Key input, Save button

### Main Area
- Hero Section
- Quick Start Cards
- Recent Files

### Constraints
- Everything component-based.
- Use Framer Motion.
- Smooth hover animations.
- Do not implement routing yet.
- Stop after completion.

---

## Phase 3 — Navigation System

### Goal
Implement navigation architecture.

### Behavior
- Clicking Instruction Files / Prompt Library / Personas / Skills / etc must NOT reload page.
- Replace content inside the main workspace instead.

### Tech
- Use Zustand.
- Keep navigation scalable: future modules require zero layout changes.
- Do not build generators.
- Only navigation.

---

## Phase 4 — Instruction File Module

### Goal
Build the Instruction File module.

### Hierarchy
- Instruction Files
  - ↓ Agent Instructions
    - ↓ Claude / Cursor / Copilot / Gemini / Codex / OpenCode / Continue / Roo / General AGENTS.md
      - ↓ Content View

### Content View
Split screen:
- Upper → Reference Syntax (official structure)
- Lower → Custom Generator (asks dynamic questions depending on selected instruction file)

### Constraints
- Do not connect AI.
- Use dummy generator.
- Focus only on UI and architecture.

---

## Phase 5 — Prompt Library

### Goal
Create Prompt Library.

### Hierarchy
- Personal / Programming / Business / Writing / Education / AI Specific
  - ↓ Subcategories
    - ↓ Prompt Editor (split screen: Reference Prompt ↓ Custom Prompt Builder)

### Features
- Search
- Favorites
- Recent
- Copy
- Export

### Constraint
- No AI integration yet.

---

## Phase 6 — AI Generation

### Goal
Implement AI generation.

### Architecture
Provider Interface ↓
Adapters: OpenAI, Claude, Gemini, DeepSeek, OpenRouter, NVIDIA, Local Ollama

### Constraints
- Every provider implements the same interface.
- Never hardcode provider logic.
- Allow users to add API Keys; store securely.
- Generator calls the selected provider and generates:
  - Instruction Files
  - Prompt Templates
  - System Prompts
  - Personas
  - Skills
  - Workflows
- Keep providers modular.

---

## Phase 7 — System Prompt Engine

### Goal
Build a prompt generation engine.

### Engine Inputs (structured data)
- purpose, target AI, framework, language, coding style, project type,
  architecture, experience level, testing framework, deployment target,
  coding conventions

### Engine Outputs
- System Prompt
- Instruction File
- Prompt Template
- Context File
- Memory
- Workflow

### Constraints
- Use reusable templates.
- Never hardcode text.
- Everything generated from structured data.

---

## Phase 8 — Polish

### Goal
Transform application into production quality.

### Improve
- Animations
- Loading States
- Transitions
- Error Handling
- Accessibility
- Responsive Design
- Theme
- Performance
- Skeletons
- Toast Notifications
- Keyboard Shortcuts
- Search
- Command Palette
- Context Menu
- Recent Files
- Pinned Files
- Empty States

### Final
- Review. Refactor. Optimize.
- No duplicate components. No unused code. Production ready.
