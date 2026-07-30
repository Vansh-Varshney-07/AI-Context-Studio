"use client";

import { MotionDiv } from "@/components/ui/motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileJson, Code, GitBranch, Package, Shield, Search, Tag, Clock, Link, CheckCircle, ChevronRight } from "lucide-react";

const manifestSchema = {
  id: "unique-asset-id",
  name: "Asset Name",
  version: "1.0.0",
  author: "Author Name",
  type: "skill | persona | workflow | promptPack | memory | instructionFile | systemPrompt | moduleConfig",
  description: "Human-readable description",
  tags: ["tag1", "tag2"],
  minAppVersion: "1.0.0",
  checksum: "sha256:...",
  license: "MIT",
  dependencies: {
    "other-asset-id": "^1.0.0",
  },
  targets: ["cursor", "claude", "copilot", "windsurf", "vscode"],
  screenshots: ["preview.png"],
  readme: "README.md",
};

const schemaFields = [
  { field: "id", type: "string", required: true, desc: "Unique identifier (UUID v4)" },
  { field: "name", type: "string", required: true, desc: "Human-readable asset name" },
  { field: "version", type: "semver", required: true, desc: "Semantic version (MAJOR.MINOR.PATCH)" },
  { field: "author", type: "string", required: true, desc: "Author name or organization" },
  { field: "type", type: "enum", required: true, desc: "Asset kind (8 supported types)" },
  { field: "description", type: "string", required: true, desc: "Detailed description" },
  { field: "tags", type: "string[]", required: false, desc: "Searchable tags" },
  { field: "minAppVersion", type: "semver", required: true, desc: "Minimum app version required" },
  { field: "checksum", type: "sha256", required: true, desc: "SHA256 integrity hash" },
  { field: "license", type: "spdx", required: true, desc: "SPDX license identifier" },
  { field: "dependencies", type: "object", required: false, desc: "Dependency map with semver ranges" },
  { field: "targets", type: "string[]", required: true, desc: "Compatible export targets" },
  { field: "screenshots", type: "string[]", required: false, desc: "Preview image paths" },
  { field: "readme", type: "string", required: false, desc: "Path to markdown documentation" },
];

export function RegistryPreview() {
  return (
    <section id="registry" className="section bg-[var(--color-bg-secondary)]" aria-labelledby="registry-heading">
      <div className="container-app">
        <MotionDiv
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 id="registry-heading" className="text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
            Registry — Asset Infrastructure
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-8">
            Open specification for AI asset packaging: manifest schema, semantic versioning, dependencies, compatibility matrix, and checksums.
          </p>
        </MotionDiv>

        <MotionDiv
          className="grid gap-8 lg:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="card-hover p-6 h-full">
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <FileJson className="h-5 w-5 text-[var(--color-accent)]" />
              Manifest Schema (manifest.json)
            </h3>
            <pre className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg p-4 overflow-x-auto text-sm font-mono text-[var(--color-text-secondary)]">
{JSON.stringify(manifestSchema, null, 2)}
            </pre>
          </Card>

          <Card className="card-hover p-6 h-full">
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <Tag className="h-5 w-5 text-[var(--color-accent)]" />
              Schema Fields
            </h3>
            <div className="space-y-3">
              {schemaFields.map((field, index) => (
                <div key={field.field} className="flex items-start gap-3 p-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="font-mono text-[var(--color-accent)] bg-[var(--color-bg-surface)] px-2 py-0.5 rounded">{field.field}</code>
                      <span className="text-xs px-2 py-0.5 rounded bg-[var(--color-accent-light)] text-[var(--color-accent)] font-medium">{field.type}</span>
                      {field.required && <Badge variant="dot" dotColor="accent" className="text-xs">Required</Badge>}
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)]">{field.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </MotionDiv>

        <MotionDiv
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { icon: Shield, label: "Integrity", desc: "SHA256 checksums on every asset", color: "accent" },
            { icon: GitBranch, label: "Versioning", desc: "Semantic versioning with ranges", color: "violet" },
            { icon: Package, label: "Dependencies", desc: "Transitive dependency resolution", color: "cyan" },
            { icon: Search, label: "Compatibility", desc: "Target & version matrix", color: "success" },
          ].map((item, index) => (
            <MotionDiv key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + index * 0.1 }}>
              <Card className="card-hover p-6 text-center h-full">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl mx-auto bg-[var(--color-accent-light)] text-[var(--color-accent)]">
                  {item.color === "violet" && <item.icon className="h-6 w-6 text-[var(--color-violet)]" />}
                  {item.color === "cyan" && <item.icon className="h-6 w-6 text-[var(--color-cyan)]" />}
                  {item.color === "success" && <item.icon className="h-6 w-6 text-[var(--color-success)]" />}
                  {item.color === "accent" && <item.icon className="h-6 w-6 text-[var(--color-accent)]" />}
                </div>
                <h4 className="font-semibold text-[var(--color-text-primary)] mb-1">{item.label}</h4>
                <p className="text-sm text-[var(--color-text-muted)]">{item.desc}</p>
              </Card>
            </MotionDiv>
          ))}
        </MotionDiv>

        <MotionDiv
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 text-center">Asset Package Structure (.acs)</h3>
          <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-xl p-6 font-mono text-sm overflow-x-auto">
            <pre className="text-[var(--color-text-secondary)]">
{`asset.acs/
├── manifest.json       # Asset metadata (schema above)
├── content/            # Asset content files
│   ├── prompts/        # System prompts & templates
│   ├── instructions/   # AGENTS.md, CLAUDE.md, etc.
│   ├── memories/       # Context & memory blocks
│   └── workflows/      # Multi-step pipelines
├── preview.png         # Optional preview image
└── README.md           # Optional documentation`}
            </pre>
          </div>
        </MotionDiv>

        <MotionDiv
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <a href="/registry" className="inline-flex items-center gap-2">
            <Button size="lg">View Full Registry Spec</Button>
            <span className="text-sm text-[var(--color-text-muted)]">Open specification →</span>
          </a>
        </MotionDiv>
      </div>
    </section>
  );
}