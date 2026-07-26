"use client";

import { motion } from "framer-motion";
import { Cpu, Sparkles, Wand2, Zap, Layers, FileCode, Settings, Plus, Search, ChevronLeft, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/common/tag";
import { EmptyState } from "@/components/common/empty-state";
import { moduleTransition } from "@/components/motion";
import { useToast } from "@/providers/toaster-provider";
import { Label } from "@/components/ui/label";

/**
 * Skills module — Phase 7+
 * Atomic, composable AI skills that can be plugged into workflows.
 *
 * Layout:
 *   [Sidebar: categories + search] | [Main: skill cards grid + detail]
 */
export function SkillsModule() {
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>("all");
  const [selectedSkill, setSelectedSkill] = React.useState<Skill | null>(null);
  const [creating, setCreating] = React.useState(false);
  const { toast } = useToast();

  const categories = ["all", "programming", "writing", "analysis", "creative", "research", "devops"];

  const filteredSkills = SKILLS.filter((s) => {
    if (selectedCategory !== "all" && s.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <motion.div
      variants={moduleTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid h-full grid-cols-[16rem_minmax(0,1fr)] overflow-hidden"
    >
      <aside className="flex h-full flex-col border-r border-border bg-bg-secondary">
        <div className="flex flex-col gap-3 p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
            <Input
              placeholder="Search skills…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              size="sm"
            />
          </div>
          <div className="space-y-1">
            <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">Categories</p>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                  selectedCategory === cat
                    ? "bg-accent-light text-accent"
                    : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                }`}
              >
                {cat === "all" ? (
                  <Sparkles className="size-3.5 shrink-0 text-accent" />
                ) : (
                  <span className="size-2 rounded-full bg-border" />
                )}
                <span className="truncate flex-1 capitalize">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Skills ({filteredSkills.length})
            </p>
            {filteredSkills.map((skill) => (
              <SkillSidebarItem
                key={skill.id}
                skill={skill}
                active={selectedSkill?.id === skill.id}
                onClick={() => setSelectedSkill(skill)}
              />
            ))}
          </div>
        </div>
      </aside>

      <section className="flex h-full flex-col overflow-hidden">
        <header className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Cpu className="size-4" />
            </span>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-text-primary">Skills</h1>
              <p className="text-xs text-text-muted">Atomic, composable AI skills for workflows</p>
            </div>
          </div>
          <Button onClick={() => setCreating(true)} size="sm">
            <Plus className="mr-1.5 size-3.5" />
            New Skill
          </Button>
        </header>

        <div className="flex-1 overflow-hidden">
          {selectedSkill ? (
            <SkillDetailPane skill={selectedSkill} onClose={() => setSelectedSkill(null)} onRun={() => toast({ title: "Running…", description: `${selectedSkill.name} executed (demo)` })} />
          ) : (
            <SkillsGrid skills={filteredSkills} onSelect={setSelectedSkill} creating={creating} onCreateClose={() => setCreating(false)} />
          )}
        </div>
      </section>
    </motion.div>
  );
}

function SkillSidebarItem({ skill, active, onClick }: { skill: Skill; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
        active
          ? "bg-accent-light text-accent"
          : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
      }`}
    >
      <span className="size-7 shrink-0 flex items-center justify-center rounded-md bg-accent/10 text-accent">
        <skill.icon className="size-3.5" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium">{skill.name}</p>
        <p className="truncate text-xs text-text-muted">{skill.description}</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {skill.tags.slice(0, 2).map((t) => (
            <Tag key={t} variant="muted" className="text-[9px]">{t}</Tag>
          ))}
          {skill.tags.length > 2 && <Tag variant="muted" className="text-[9px]">+{skill.tags.length - 2}</Tag>}
        </div>
      </div>
    </button>
  );
}

function SkillsGrid({
  skills,
  onSelect,
  creating,
  onCreateClose,
}: {
  skills: Skill[];
  onSelect: (s: Skill) => void;
  creating: boolean;
  onCreateClose: () => void;
}) {
  const { toast } = useToast();

  if (creating) {
    return (
      <CreateSkillForm
        onClose={onCreateClose}
        onSubmit={(data) => {
          toast({ title: "Created", description: `${data.name} skill created (demo)` });
          onCreateClose();
        }}
      />
    );
  }

  if (skills.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          icon={Search}
          title="No skills found"
          description="Adjust your search or filters to see results."
        />
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 p-4 overflow-y-auto">
      {skills.map((skill) => (
        <motion.article
          key={skill.id}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="group flex h-full flex-col rounded-xl border border-border bg-bg-primary p-4 transition-all hover:border-border-strong hover:shadow-sm"
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <skill.icon className="size-4.5" />
            </span>
            <Tag variant="muted" className="text-[9px] capitalize">{skill.category}</Tag>
          </div>
          <h3 className="font-medium text-text-primary mb-1">{skill.name}</h3>
          <p className="text-sm text-text-muted mb-3 flex-1">{skill.description}</p>
          <div className="flex flex-wrap gap-1 mb-4">
            {skill.tags.map((t) => (
              <Tag key={t} variant="default" className="text-[9px]">{t}</Tag>
            ))}
          </div>
          <div className="mt-auto pt-3 border-t border-border">
            <Button variant="ghost" size="sm" className="w-full" onClick={() => onSelect(skill)}>
              View details →
            </Button>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

function SkillDetailPane({
  skill,
  onClose,
  onRun,
}: {
  skill: Skill;
  onClose: () => void;
  onRun: () => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded hover:bg-bg-secondary transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="size-4 rotate-180 text-text-muted" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text-primary">{skill.name}</p>
          <p className="truncate text-xs text-text-muted">{skill.category}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-text-secondary">Description</p>
            <p className="text-text-secondary">{skill.description}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-text-secondary">Tags</p>
            <div className="flex flex-wrap gap-1">
              {skill.tags.map((t) => (
                <Tag key={t} variant="default">{t}</Tag>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-text-secondary">System Prompt</p>
            <pre className="rounded-lg border border-border bg-cream p-3 text-sm font-mono leading-relaxed text-text-secondary whitespace-pre-wrap break-words">
              {skill.systemPrompt}
            </pre>
          </div>

          {skill.examples.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-text-secondary">Examples</p>
              <div className="space-y-2">
                {skill.examples.map((ex, i) => (
                  <div key={i} className="rounded-lg border border-border bg-bg-tertiary p-3 text-sm text-text-secondary">
                    <p className="text-xs text-text-muted mb-1">Example {i + 1}</p>
                    <p>{ex}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium text-text-secondary">Parameters</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {skill.parameters.map((p) => (
                <div key={p.name} className="rounded-lg border border-border bg-bg-tertiary p-3">
                  <p className="font-mono text-sm text-text-primary">{p.name}</p>
                  <p className="text-xs text-text-muted">{p.type} — {p.required ? "Required" : "Optional"}</p>
                  <p className="text-xs text-text-secondary mt-1">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border p-4 bg-bg-secondary/60">
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button variant="primary" onClick={onRun}>
            <Zap className="mr-1.5 size-3.5" />
            Run Skill
          </Button>
        </div>
      </div>
    </div>
  );
}

function CreateSkillForm({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; category: string; tags: string; systemPrompt: string }) => void;
}) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("programming");
  const [tags, setTags] = React.useState("");
  const [systemPrompt, setSystemPrompt] = React.useState("");
  const { toast } = useToast();

  return (
    <div className="flex h-full items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl rounded-xl border border-border bg-bg-primary p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Create New Skill</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-bg-secondary transition-colors" aria-label="Close">
            <X className="size-4 text-text-muted" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ name, description, category, tags, systemPrompt });
            toast({ title: "Created", description: `${name} skill created (demo)` });
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="skill-name">Name</Label>
            <Input
              id="skill-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Refactor to functional style"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="skill-category">Category</Label>
            <select
              id="skill-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <option value="programming">Programming</option>
              <option value="writing">Writing</option>
              <option value="analysis">Analysis</option>
              <option value="creative">Creative</option>
              <option value="research">Research</option>
              <option value="devops">DevOps</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="skill-description">Description</Label>
            <textarea
              id="skill-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="flex w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              placeholder="What does this skill do?"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="skill-tags">Tags (comma separated)</Label>
            <Input
              id="skill-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="refactor, functional, clean-code"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="skill-prompt">System Prompt</Label>
            <textarea
              id="skill-prompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={6}
              className="flex w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm font-mono leading-relaxed text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus resize-none"
              placeholder="You are an expert at…"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Wand2 className="mr-1.5 size-3.5" />
              Create Skill
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Type definitions
interface SkillParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  systemPrompt: string;
  examples: string[];
  parameters: SkillParameter[];
  icon: React.ComponentType<{ className?: string }>;
}

// Seed skills data
const SKILLS: Skill[] = [
  {
    id: "refactor-functional",
    name: "Refactor to Functional Style",
    description: "Convert imperative code to functional patterns with immutability",
    category: "programming",
    tags: ["refactor", "functional", "typescript", "clean-code"],
    systemPrompt: `You are an expert at refactoring imperative code to functional style.
Rules:
- Prefer pure functions with no side effects
- Use map/filter/reduce over loops
- Avoid mutation; use immutable data structures
- Leverage TypeScript's type system for safety
- Return new objects/arrays instead of modifying`,
    examples: [
      "// Input: imperative loop\nconst results = [];\nfor (const item of items) {\n  if (item.active) results.push(item.value * 2);\n}\n// Output: functional\nconst results = items.filter(i => i.active).map(i => i.value * 2);",
    ],
    parameters: [
      { name: "code", type: "string", required: true, description: "Source code to refactor" },
      { name: "language", type: "string", required: false, description: "Target language (default: TypeScript)" },
    ],
    icon: FileCode,
  },
  {
    id: "generate-tests",
    name: "Generate Unit Tests",
    description: "Create comprehensive test suites for functions and components",
    category: "programming",
    tags: ["testing", "vitest", "unit-test", "coverage"],
    systemPrompt: `You are a test generation expert. Create thorough, maintainable tests.
- Use Vitest + React Testing Library for React
- Cover happy paths, edge cases, and error states
- Use descriptive test names: "should do X when Y"
- Mock external dependencies with MSW or vi.mock
- Aim for meaningful assertions, not implementation details`,
    examples: [
      "// Generates: describe('Button', () => { it('renders children', ...); it('handles click', ...); });",
    ],
    parameters: [
      { name: "sourceFile", type: "string", required: true, description: "Path to component/function" },
      { name: "framework", type: "string", required: false, description: "vitest | jest | playwright" },
    ],
    icon: FileCode,
  },
  {
    id: "code-review",
    name: "Code Review Assistant",
    description: "Automated PR review focusing on security, performance, and maintainability",
    category: "analysis",
    tags: ["review", "security", "performance", "best-practices"],
    systemPrompt: `You are a senior code reviewer. Analyze changes for:
1. Security: injection, auth, secrets, validation
2. Performance: N+1, bundle size, memory leaks
3. Maintainability: naming, coupling, complexity
4. Testing: coverage, edge cases, flakiness
Provide actionable comments with severity: blocker | major | minor | suggestion`,
    examples: [],
    parameters: [
      { name: "diff", type: "string", required: true, description: "Git diff or PR changes" },
      { name: "context", type: "string", required: false, description: "Repo context (optional)" },
    ],
    icon: FileCode,
  },
  {
    id: "write-docs",
    name: "Generate Documentation",
    description: "Create JSDoc, README, and API docs from source code",
    category: "writing",
    tags: ["docs", "jsdoc", "readme", "api"],
    systemPrompt: `You are a technical writer. Generate clear, accurate documentation:
- JSDoc for all exported functions/classes
- README with install, usage, examples
- API reference with types and examples
- Keep it concise but complete`,
    examples: [],
    parameters: [
      { name: "files", type: "string[]", required: true, description: "Source files to document" },
      { name: "format", type: "string", required: false, description: "markdown | html | json" },
    ],
    icon: FileCode,
  },
  {
    id: "dockerfile-optimize",
    name: "Optimize Dockerfile",
    description: "Reduce image size, improve build speed, fix security issues",
    category: "devops",
    tags: ["docker", "container", "optimization", "security"],
    systemPrompt: `You are a container expert. Optimize Dockerfiles:
- Use multi-stage builds
- Leverage layer caching (copy package.json first)
- Use distroless/alpine bases
- Remove build deps in final stage
- Scan for vulnerabilities (hadolint)`,
    examples: [],
    parameters: [
      { name: "dockerfile", type: "string", required: true, description: "Dockerfile content" },
      { name: "baseImage", type: "string", required: false, description: "Preferred base" },
    ],
    icon: FileCode,
  },
  {
    id: "sql-optimize",
    name: "Optimize SQL Queries",
    description: "Analyze query plans, add indexes, rewrite for performance",
    category: "analysis",
    tags: ["sql", "database", "performance", "indexing"],
    systemPrompt: `You are a database performance expert. Optimize queries:
- Analyze EXPLAIN ANALYZE output
- Identify missing indexes, seq scans
- Rewrite subqueries as joins where appropriate
- Suggest partitioning, materialized views
- Consider query hints only as last resort`,
    examples: [],
    parameters: [
      { name: "query", type: "string", required: true, description: "SQL query to optimize" },
      { name: "schema", type: "string", required: false, description: "Table schemas (DDL)" },
      { name: "dialect", type: "string", required: false, description: "postgres | mysql | sqlite" },
    ],
    icon: FileCode,
  },
];