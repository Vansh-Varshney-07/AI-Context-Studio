'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ScrollReveal } from '@/components/common/scroll-reveal';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';
import Link from 'next/link';
import {
  FileJson,
  Tag,
  GitBranch,
  Package,
  Shield,
  Search,
  Zap,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';

const manifestSchema = {
  id: 'unique-asset-id',
  name: 'Asset Name',
  version: '1.0.0',
  author: 'Author Name',
  type: 'skill | persona | workflow | promptPack | memory | instructionFile | systemPrompt | moduleConfig',
  description: 'Human-readable description',
  tags: ['tag1', 'tag2'],
  minAppVersion: '1.0.0',
  checksum: 'sha256:...',
  license: 'MIT',
  dependencies: {
    'other-asset-id': '^1.0.0',
  },
  targets: ['cursor', 'claude', 'copilot', 'windsurf', 'vscode'],
  screenshots: ['preview.png'],
  readme: 'README.md',
};

const schemaFields = [
  { field: 'id', type: 'string', required: true, desc: 'Unique identifier (UUID v4)' },
  { field: 'name', type: 'string', required: true, desc: 'Human-readable asset name' },
  {
    field: 'version',
    type: 'semver',
    required: true,
    desc: 'Semantic version (MAJOR.MINOR.PATCH)',
  },
  { field: 'author', type: 'string', required: true, desc: 'Author name or organization' },
  { field: 'type', type: 'enum', required: true, desc: 'Asset kind (8 supported types)' },
  { field: 'description', type: 'string', required: true, desc: 'Detailed description' },
  { field: 'tags', type: 'string[]', required: false, desc: 'Searchable tags' },
  { field: 'minAppVersion', type: 'semver', required: true, desc: 'Minimum app version required' },
  { field: 'checksum', type: 'sha256', required: true, desc: 'SHA256 integrity hash' },
  { field: 'license', type: 'spdx', required: true, desc: 'SPDX license identifier' },
  {
    field: 'dependencies',
    type: 'object',
    required: false,
    desc: 'Dependency map with semver ranges',
  },
  { field: 'targets', type: 'string[]', required: true, desc: 'Compatible export targets' },
  { field: 'screenshots', type: 'string[]', required: false, desc: 'Preview image paths' },
  { field: 'readme', type: 'string', required: false, desc: 'Path to markdown documentation' },
];

const assetTypes = [
  {
    id: 'skill',
    name: 'Skill',
    desc: 'Composable AI capabilities with inputs/outputs',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'persona',
    name: 'Persona',
    desc: 'Character definitions with voice and expertise',
    color: 'bg-pink-100 text-pink-700',
  },
  {
    id: 'workflow',
    name: 'Workflow',
    desc: 'Multi-step pipelines chaining prompts and tools',
    color: 'bg-teal-100 text-teal-700',
  },
  {
    id: 'promptPack',
    name: 'Prompt Pack',
    desc: 'Curated prompt templates for specific tasks',
    color: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 'memory',
    name: 'Memory',
    desc: 'Persistent context blocks for agent recall',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'instructionFile',
    name: 'Instruction File',
    desc: 'AGENTS.md, CLAUDE.md, per-target instructions',
    color: 'bg-orange-100 text-orange-700',
  },
  {
    id: 'systemPrompt',
    name: 'System Prompt',
    desc: 'Base system instructions for AI assistants',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'moduleConfig',
    name: 'Module Config',
    desc: 'Configuration for AI Context Studio modules',
    color: 'bg-cyan-100 text-cyan-700',
  },
];

const targets = ['Cursor', 'Claude Code', 'Windsurf', 'VS Code', 'Custom'];

const compatibilityMatrix = [
  {
    feature: 'System Prompts',
    cursor: true,
    claude: true,
    windsurf: true,
    vscode: true,
    custom: true,
  },
  {
    feature: 'Instruction Files',
    cursor: true,
    claude: true,
    windsurf: true,
    vscode: true,
    custom: true,
  },
  {
    feature: 'Prompt Library',
    cursor: true,
    claude: true,
    windsurf: true,
    vscode: true,
    custom: false,
  },
  { feature: 'Personas', cursor: true, claude: true, windsurf: true, vscode: true, custom: true },
  { feature: 'Skills', cursor: true, claude: true, windsurf: true, vscode: false, custom: true },
  { feature: 'Workflows', cursor: true, claude: true, windsurf: true, vscode: false, custom: true },
  {
    feature: 'Memories',
    cursor: true,
    claude: false,
    windsurf: false,
    vscode: false,
    custom: true,
  },
  {
    feature: 'MCP Configs',
    cursor: true,
    claude: true,
    windsurf: true,
    vscode: true,
    custom: true,
  },
];

function VersionBadge({ version, label }: { version: string; label?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
        'border border-green-200 bg-green-100 text-green-800'
      )}
    >
      v{version}
      {label && <span className="ml-1 text-[10px] uppercase">{label}</span>}
    </span>
  );
}

function SchemaTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]" role="table">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-primary)]">
              Field
            </th>
            <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-primary)]">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-primary)]">
              Req
            </th>
            <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-primary)]">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {schemaFields.map((field) => (
            <tr key={field.field} className="border-b border-[var(--color-border-subtle)]">
              <td className="px-4 py-3">
                <code className="rounded bg-[var(--color-bg-surface)] px-2 py-0.5 font-mono text-[var(--color-accent)]">
                  {field.field}
                </code>
              </td>
              <td className="px-4 py-3">
                <span className="rounded bg-[var(--color-accent-light)] px-2 py-0.5 text-xs font-medium text-[var(--color-accent)]">
                  {field.type}
                </span>
              </td>
              <td className="px-4 py-3">
                {field.required ? (
                  <Badge variant="dot" dotColor="accent" className="text-xs">
                    Required
                  </Badge>
                ) : (
                  <span className="text-xs text-[var(--color-text-muted)]">Optional</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{field.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AssetTypeCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {assetTypes.map((type) => (
        <Card key={type.id} className="card-hover p-4 text-center">
          <div
            className={cn(
              'mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg',
              type.color
            )}
          >
            <Package className="h-5 w-5" aria-hidden="true" />
          </div>
          <h4 className="mb-1 font-semibold text-[var(--color-text-primary)]">{type.name}</h4>
          <p className="text-sm text-[var(--color-text-secondary)]">{type.desc}</p>
        </Card>
      ))}
    </div>
  );
}

function CompatibilityMatrix() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]" role="table">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            <th className="sticky left-0 z-10 bg-[var(--color-bg-secondary)] px-4 py-3 text-left font-semibold text-[var(--color-text-primary)]">
              Feature
            </th>
            {targets.map((t) => (
              <th
                key={t}
                className="px-4 py-3 text-center font-semibold text-[var(--color-text-primary)]"
              >
                {t}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {compatibilityMatrix.map((row) => (
            <tr key={row.feature} className="border-b border-[var(--color-border-subtle)]">
              <td className="sticky left-0 z-10 bg-[var(--color-bg-primary)] px-4 py-3 font-medium text-[var(--color-text-primary)]">
                {row.feature}
              </td>
              {targets.map((t) => (
                <td key={t} className="px-4 py-3 text-center">
                  {row[t as keyof typeof row] ? (
                    <CheckCircle
                      className="mx-auto h-5 w-5 text-[var(--color-success)]"
                      aria-hidden="true"
                    />
                  ) : (
                    <span className="mx-auto flex h-5 w-5 items-center justify-center rounded-full text-[var(--color-border)]">
                      <span className="text-[10px]">✕</span>
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DependencyGraph() {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] p-6 font-mono text-sm">
      <pre className="text-[var(--color-text-secondary)]">
        {`graph TD
    A[my-skill v2.1.0] --> B[prompt-template v1.3.0]
    A --> C[persona-senior-engineer v1.0.0]
    B --> D[base-prompt v1.0.0]
    C --> E[base-persona v1.0.0]
    D --> F[core-utils v1.2.0]
    E --> F
    F --> G[logger v1.0.0]
    style A fill:#e0e7ff,color:#3730a3
    style B fill:#fce7f3,color:#9d174d
    style C fill:#fce7f3,color:#9d174d
    style F fill:#dcfce7,color:#166534`}
      </pre>
    </div>
  );
}

function ManifestValidator() {
  const [input, setInput] = useState(JSON.stringify(manifestSchema, null, 2));
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  const validate = () => {
    try {
      const parsed = JSON.parse(input);
      const required = [
        'id',
        'name',
        'version',
        'author',
        'type',
        'description',
        'minAppVersion',
        'checksum',
        'license',
        'targets',
      ];
      const errs: string[] = [];

      required.forEach((field) => {
        if (!parsed[field]) errs.push(`Missing required field: ${field}`);
      });

      if (parsed.version && !/^\d+\.\d+\.\d+$/.test(parsed.version)) {
        errs.push('Version must be semantic (MAJOR.MINOR.PATCH)');
      }

      if (parsed.checksum && !/^sha256:[a-f0-9]{64}$/.test(parsed.checksum)) {
        errs.push('Checksum must be sha256:<64 hex chars>');
      }

      if (parsed.targets && !Array.isArray(parsed.targets)) {
        errs.push('Targets must be an array');
      }

      setErrors(errs);
      setIsValid(errs.length === 0);
    } catch {
      setIsValid(false);
      setErrors(['Invalid JSON']);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={validate} variant="primary">
          <Zap className="mr-2 h-4 w-4" />
          Validate Manifest
        </Button>
        <Button variant="outline" onClick={() => setInput(JSON.stringify(manifestSchema, null, 2))}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Example
        </Button>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
            manifest.json
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[300px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] p-4 font-mono text-sm"
            placeholder="Paste your manifest.json here..."
            spellCheck={false}
          />
        </div>
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
            Validation Result
          </label>
          <div
            className={cn(
              'min-h-[300px] rounded-lg border p-4 font-mono text-sm',
              isValid
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-red-200 bg-red-50 text-red-800'
            )}
          >
            {isValid ? (
              <>
                <div className="mb-2 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-semibold">Valid manifest</span>
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">
                  All required fields present and correctly formatted.
                </p>
              </>
            ) : (
              <>
                <div className="mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="font-semibold">Validation errors</span>
                </div>
                <ul className="list-inside list-disc space-y-1">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenshotGallery() {
  const screenshots = [
    { src: 'https://picsum.photos/seed/registry1/600/400', alt: 'Manifest editor UI' },
    { src: 'https://picsum.photos/seed/registry2/600/400', alt: 'Dependency graph visualization' },
    { src: 'https://picsum.photos/seed/registry3/600/400', alt: 'Compatibility matrix' },
    { src: 'https://picsum.photos/seed/registry4/600/400', alt: 'Validator output' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {screenshots.map((shot, i) => (
        <div
          key={i}
          className="group relative aspect-video overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-tertiary)]"
        >
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="font-medium text-white">View full size</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function VersioningSection() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
        Semantic Versioning Strategy
      </h3>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: 'MAJOR',
            version: '2.0.0',
            desc: 'Breaking changes to manifest schema or required fields',
            color: 'bg-red-100 text-red-700',
          },
          {
            label: 'MINOR',
            version: '1.1.0',
            desc: 'New optional fields, new asset types, backward compatible',
            color: 'bg-blue-100 text-blue-700',
          },
          {
            label: 'PATCH',
            version: '1.0.1',
            desc: 'Bug fixes, typo corrections, documentation updates',
            color: 'bg-green-100 text-green-700',
          },
        ].map((item) => (
          <Card key={item.label} className="p-4">
            <div className="mb-2 flex items-center gap-3">
              <span className={cn('rounded-full px-3 py-1 text-sm font-semibold', item.color)}>
                {item.label}
              </span>
              <VersionBadge version={item.version} />
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">{item.desc}</p>
          </Card>
        ))}
      </div>

      <Callout type="note" title="Version Ranges">
        <p>
          Dependencies use semantic version ranges (e.g.,{' '}
          <code className="font-mono text-[var(--color-accent)]">{'^1.0.0'}</code>,{' '}
          <code className="font-mono text-[var(--color-accent)]">{'~2.1.0'}</code>,{' '}
          <code className="font-mono text-[var(--color-accent)]">{'>=1.0.0 <2.0.0'}</code>). The
          resolver picks the highest compatible version.
        </p>
      </Callout>
    </div>
  );
}

export function RegistryPageContent() {
  return (
    <section className="flex flex-1 flex-col">
      <header className="section bg-[var(--color-bg-secondary)]" aria-labelledby="registry-heading">
        <div className="container-app">
          <ScrollReveal className="mb-16 text-center">
            <h2
              id="registry-heading"
              className="mb-4 text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl"
            >
              Registry — Asset Infrastructure
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-[var(--color-text-secondary)]">
              Open specification for AI asset packaging: manifest schema, semantic versioning,
              dependencies, compatibility matrix, and checksums.
            </p>
            <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
              {[
                'Manifest Schema',
                'Metadata Fields',
                'Asset Types',
                'Versioning',
                'Dependencies',
                'Compatibility',
                'Validator',
                'Package Structure',
              ].map((item, _i) => (
                <Badge key={item} variant="outline" className="text-sm">
                  {item}
                </Badge>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <Tabs defaultValue="schema" className="w-full">
              <TabsList className="grid w-full grid-cols-4 md:grid-cols-8">
                <TabsTrigger value="schema">Manifest Schema</TabsTrigger>
                <TabsTrigger value="fields">Metadata Fields</TabsTrigger>
                <TabsTrigger value="types">Asset Types</TabsTrigger>
                <TabsTrigger value="versioning">Versioning</TabsTrigger>
                <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
                <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
                <TabsTrigger value="validator">Validator</TabsTrigger>
                <TabsTrigger value="structure">Package Structure</TabsTrigger>
              </TabsList>

              <TabsContent value="schema" className="mt-6 space-y-6">
                <ScrollReveal>
                  <Card className="p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[var(--color-text-primary)]">
                      <FileJson className="h-5 w-5 text-[var(--color-accent)]" />
                      Manifest Schema (manifest.json)
                    </h3>
                    <CodeBlock
                      code={JSON.stringify(manifestSchema, null, 2)}
                      language="json"
                      filename="manifest.json"
                      showLineNumbers
                    />
                  </Card>
                </ScrollReveal>
              </TabsContent>

              <TabsContent value="fields" className="mt-6 space-y-6">
                <ScrollReveal>
                  <Card className="p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[var(--color-text-primary)]">
                      <Tag className="h-5 w-5 text-[var(--color-accent)]" />
                      Schema Fields
                    </h3>
                    <SchemaTable />
                  </Card>
                </ScrollReveal>
              </TabsContent>

              <TabsContent value="types" className="mt-6 space-y-6">
                <ScrollReveal>
                  <Card className="p-6">
                    <h3 className="mb-4 text-xl font-semibold text-[var(--color-text-primary)]">
                      Supported Asset Types
                    </h3>
                    <AssetTypeCards />
                  </Card>
                </ScrollReveal>
              </TabsContent>

              <TabsContent value="versioning" className="mt-6 space-y-6">
                <ScrollReveal>
                  <Card className="p-6">
                    <VersioningSection />
                  </Card>
                </ScrollReveal>
              </TabsContent>

              <TabsContent value="dependencies" className="mt-6 space-y-6">
                <ScrollReveal>
                  <Card className="p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[var(--color-text-primary)]">
                      <GitBranch className="h-5 w-5 text-[var(--color-accent)]" />
                      Dependency Graph
                    </h3>
                    <DependencyGraph />
                    <Callout type="tip" title="Transitive Resolution" className="mt-4">
                      <p>
                        The registry resolves transitive dependencies automatically. Circular
                        dependencies are detected and reported as validation errors.
                      </p>
                    </Callout>
                  </Card>
                </ScrollReveal>
              </TabsContent>

              <TabsContent value="compatibility" className="mt-6 space-y-6">
                <ScrollReveal>
                  <Card className="p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[var(--color-text-primary)]">
                      <Search className="h-5 w-5 text-[var(--color-accent)]" />
                      Target Compatibility Matrix
                    </h3>
                    <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
                      Each target has different capabilities. The matrix below shows which asset
                      features are supported by each target.
                    </p>
                    <CompatibilityMatrix />
                  </Card>
                </ScrollReveal>
              </TabsContent>

              <TabsContent value="validator" className="mt-6 space-y-6">
                <ScrollReveal>
                  <Card className="p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[var(--color-text-primary)]">
                      <Shield className="h-5 w-5 text-[var(--color-accent)]" />
                      Manifest Validator
                    </h3>
                    <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
                      Validate your manifest.json against the official schema. Client-side
                      validation using JSON Schema Draft 7.
                    </p>
                    <ManifestValidator />
                  </Card>
                </ScrollReveal>
              </TabsContent>

              <TabsContent value="structure" className="mt-6 space-y-6">
                <ScrollReveal>
                  <Card className="p-6">
                    <h3 className="mb-4 text-xl font-semibold text-[var(--color-text-primary)]">
                      Asset Package Structure (.acs)
                    </h3>
                    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] p-6 font-mono text-sm">
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

                    <div className="mt-8">
                      <h4 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
                        Screenshot Gallery
                      </h4>
                      <ScreenshotGallery />
                    </div>
                  </Card>
                </ScrollReveal>
              </TabsContent>
            </Tabs>
          </ScrollReveal>

          <ScrollReveal className="mt-12 text-center">
            <Callout type="tip" title="Ready to Publish?">
              <p className="mb-4">
                Learn how to package and publish your assets to the marketplace.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/docs/marketplace/publishing">
                  <Button variant="outline">
                    Publishing Guide
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/docs/registry/schema">
                  <Button>
                    Registry Spec
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Callout>
          </ScrollReveal>
        </div>
      </header>
    </section>
  );
}
