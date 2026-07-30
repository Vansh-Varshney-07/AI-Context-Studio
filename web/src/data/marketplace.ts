export interface Asset {
  id: string;
  name: string;
  description: string;
  author: string;
  authorAvatar: string;
  category: string;
  kind: string;
  tags: string[];
  version: string;
  rating: number;
  reviewCount: number;
  downloads: number;
  updatedAt: string;
  compatibility: string[];
  verified: boolean;
  thumbnail?: string;
  readme: string;
  dependencies: string[];
  versions: Array<{ version: string; date: string; changelog: string }>;
}

export const assets: Asset[] = [
  {
    id: 'code-review-assistant',
    name: 'Code Review Assistant',
    description:
      'AI-powered code review assistant that analyzes PRs for bugs, security issues, and style violations. Provides inline comments and suggestions.',
    author: 'janedoe',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=janedoe',
    category: 'Skills',
    kind: 'Skill',
    tags: ['code-review', 'security', 'automation', 'github', 'gitlab'],
    version: '2.1.0',
    rating: 4.8,
    reviewCount: 127,
    downloads: 15420,
    updatedAt: '2024-01-15',
    compatibility: ['Cursor', 'Claude Code', 'Windsurf', 'VS Code'],
    verified: true,
    thumbnail: 'https://picsum.photos/seed/code-review/400/250',
    readme: `# Code Review Assistant

Automated code review for your pull requests.

## Features
- Detects security vulnerabilities
- Enforces coding standards
- Suggests performance improvements
- Integrates with GitHub/GitLab

## Installation
\`\`\`bash
acs install code-review-assistant
\`\`\``,
    dependencies: [],
    versions: [
      {
        version: '2.1.0',
        date: '2024-01-15',
        changelog: 'Added GitLab support, improved TypeScript analysis',
      },
      { version: '2.0.0', date: '2023-12-01', changelog: 'Major rewrite with better AST parsing' },
      { version: '1.5.2', date: '2023-10-15', changelog: 'Bug fixes and performance improvements' },
    ],
  },
  {
    id: 'senior-engineer-persona',
    name: 'Senior Engineer Persona',
    description:
      'A battle-tested senior engineer persona with 15+ years experience. Provides architectural guidance, mentorship, and pragmatic solutions.',
    author: 'alexchen',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alexchen',
    category: 'Personas',
    kind: 'Persona',
    tags: ['architecture', 'mentoring', 'best-practices', 'career'],
    version: '1.3.0',
    rating: 4.9,
    reviewCount: 89,
    downloads: 8930,
    updatedAt: '2024-01-10',
    compatibility: ['Cursor', 'Claude Code', 'Windsurf', 'VS Code', 'Custom'],
    verified: true,
    thumbnail: 'https://picsum.photos/seed/senior-engineer/400/250',
    readme: `# Senior Engineer Persona

Experienced software architect and mentor.

## Philosophy
- Pragmatism over perfection
- Code is read more than written
- Invest in developer experience`,
    dependencies: [],
    versions: [
      { version: '1.3.0', date: '2024-01-10', changelog: 'Added cloud architecture expertise' },
      { version: '1.2.0', date: '2023-11-01', changelog: 'Improved mentoring responses' },
    ],
  },
  {
    id: 'react-component-template',
    name: 'React Component Template Pack',
    description:
      'Production-ready React component templates with TypeScript, testing, Storybook, and accessibility built-in.',
    author: 'uidev',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=uidev',
    category: 'Templates',
    kind: 'Template',
    tags: ['react', 'typescript', 'storybook', 'testing', 'accessibility', 'ui'],
    version: '3.0.0',
    rating: 4.7,
    reviewCount: 203,
    downloads: 22100,
    updatedAt: '2024-01-20',
    compatibility: ['Cursor', 'VS Code', 'Windsurf'],
    verified: true,
    thumbnail: 'https://picsum.photos/seed/react-template/400/250',
    readme: `# React Component Template Pack

Complete component scaffolding for modern React apps.

## Includes
- Button, Input, Card, Modal, Dropdown
- TypeScript strict mode
- Jest + React Testing Library
- Storybook configuration
- WCAG AA compliance`,
    dependencies: ['@testing-library/react', 'storybook'],
    versions: [
      { version: '3.0.0', date: '2024-01-20', changelog: 'React 19 support, new hooks' },
      { version: '2.1.0', date: '2023-11-15', changelog: 'Added form components' },
    ],
  },
  {
    id: 'api-design-prompt-pack',
    name: 'API Design Prompt Pack',
    description:
      'Curated prompts for designing REST, GraphQL, and gRPC APIs. Covers versioning, error handling, pagination, and security.',
    author: 'apidesigner',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=apidesigner',
    category: 'Prompt Packs',
    kind: 'Prompt Pack',
    tags: ['api', 'rest', 'graphql', 'grpc', 'design', 'architecture'],
    version: '1.0.0',
    rating: 4.6,
    reviewCount: 56,
    downloads: 5420,
    updatedAt: '2024-01-05',
    compatibility: ['Cursor', 'Claude Code', 'Windsurf', 'VS Code'],
    verified: false,
    thumbnail: 'https://picsum.photos/seed/api-design/400/250',
    readme: `# API Design Prompt Pack

Professional API design guidance.

## Topics
- REST resource modeling
- GraphQL schema design
- gRPC service definition
- Authentication & authorization
- Rate limiting & pagination`,
    dependencies: [],
    versions: [{ version: '1.0.0', date: '2024-01-05', changelog: 'Initial release' }],
  },
  {
    id: 'clean-architecture-instructions',
    name: 'Clean Architecture Instructions',
    description:
      'AGENTS.md instruction files for implementing Clean Architecture in any language. Includes layer definitions, dependency rules, and testing strategies.',
    author: 'architect',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=architect',
    category: 'Instruction Files',
    kind: 'Instruction File',
    tags: ['clean-architecture', 'ddd', 'testing', 'layers', 'dependency-inversion'],
    version: '2.0.0',
    rating: 4.8,
    reviewCount: 112,
    downloads: 9800,
    updatedAt: '2024-01-12',
    compatibility: ['Cursor', 'Claude Code', 'Windsurf', 'VS Code', 'Custom'],
    verified: true,
    thumbnail: 'https://picsum.photos/seed/clean-arch/400/250',
    readme: `# Clean Architecture Instructions

Universal Clean Architecture patterns.

## Layers
- Entities (Enterprise Business Rules)
- Use Cases (Application Business Rules)
- Interface Adapters
- Frameworks & Drivers`,
    dependencies: [],
    versions: [
      { version: '2.0.0', date: '2024-01-12', changelog: 'Added DDD integration guide' },
      { version: '1.1.0', date: '2023-10-01', changelog: 'Multi-language examples' },
    ],
  },
  {
    id: 'ci-cd-workflow',
    name: 'CI/CD Pipeline Workflow',
    description:
      'Multi-stage CI/CD workflow with linting, testing, security scanning, and deployment. Supports GitHub Actions, GitLab CI, and Azure Pipelines.',
    author: 'devopspro',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devopspro',
    category: 'Workflows',
    kind: 'Workflow',
    tags: ['ci-cd', 'github-actions', 'gitlab', 'deployment', 'security', 'testing'],
    version: '1.5.0',
    rating: 4.5,
    reviewCount: 78,
    downloads: 6750,
    updatedAt: '2024-01-08',
    compatibility: ['Cursor', 'VS Code', 'Windsurf'],
    verified: true,
    thumbnail: 'https://picsum.photos/seed/ci-cd/400/250',
    readme: `# CI/CD Pipeline Workflow

Complete pipeline automation.

## Stages
1. Lint & Type Check
2. Unit Tests
3. Integration Tests
4. Security Scan (SAST/DAST)
5. Build & Package
6. Deploy to Staging
7. Deploy to Production`,
    dependencies: ['github-actions', 'sonarqube'],
    versions: [
      { version: '1.5.0', date: '2024-01-08', changelog: 'Added GitLab CI support' },
      { version: '1.4.0', date: '2023-12-10', changelog: 'Security scanning integration' },
    ],
  },
  {
    id: 'postgres-mcp-server',
    name: 'PostgreSQL MCP Server',
    description:
      'Model Context Protocol server for PostgreSQL databases. Provides read-only query access, schema inspection, and query optimization hints.',
    author: 'dbadmin',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dbadmin',
    category: 'MCP Servers',
    kind: 'MCP Server',
    tags: ['postgresql', 'database', 'sql', 'mcp', 'readonly'],
    version: '1.2.0',
    rating: 4.9,
    reviewCount: 45,
    downloads: 3210,
    updatedAt: '2024-01-18',
    compatibility: ['Claude Code', 'Cursor', 'Custom'],
    verified: true,
    thumbnail: 'https://picsum.photos/seed/postgres-mcp/400/250',
    readme: `# PostgreSQL MCP Server

Safe database access via MCP.

## Features
- Read-only query execution
- Schema introspection
- Query plan analysis
- Connection pooling`,
    dependencies: ['pg', '@modelcontextprotocol/sdk'],
    versions: [
      { version: '1.2.0', date: '2024-01-18', changelog: 'Added query optimization hints' },
      { version: '1.1.0', date: '2023-12-20', changelog: 'Connection pooling' },
    ],
  },
  {
    id: 'frontend-starter-collection',
    name: 'Frontend Starter Collection',
    description:
      'Complete starter kits for React, Vue, Svelte, and Solid. Includes routing, state management, styling, and deployment configs.',
    author: 'fullstackdev',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fullstackdev',
    category: 'Collections',
    kind: 'Collection',
    tags: ['starter', 'react', 'vue', 'svelte', 'solid', 'boilerplate'],
    version: '4.0.0',
    rating: 4.8,
    reviewCount: 167,
    downloads: 18900,
    updatedAt: '2024-01-22',
    compatibility: ['Cursor', 'VS Code', 'Windsurf'],
    verified: true,
    thumbnail: 'https://picsum.photos/seed/frontend-starter/400/250',
    readme: `# Frontend Starter Collection

Everything you need to start a modern frontend project.

## Frameworks
- React + TypeScript + Vite
- Vue 3 + TypeScript + Vite
- SvelteKit + TypeScript
- SolidJS + TypeScript`,
    dependencies: [],
    versions: [
      {
        version: '4.0.0',
        date: '2024-01-22',
        changelog: 'Added SolidJS starter, updated all deps',
      },
      { version: '3.2.0', date: '2023-11-01', changelog: 'SvelteKit 2.0 support' },
    ],
  },
  {
    id: 'security-audit-bundle',
    name: 'Security Audit Bundle',
    description:
      'Comprehensive security auditing tools: SAST rules, dependency scanning configs, secret detection patterns, and compliance checklists.',
    author: 'seceng',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seceng',
    category: 'Bundles',
    kind: 'Bundle',
    tags: ['security', 'sast', 'compliance', 'secrets', 'owasp', 'audit'],
    version: '2.1.0',
    rating: 4.7,
    reviewCount: 94,
    downloads: 7600,
    updatedAt: '2024-01-14',
    compatibility: ['Cursor', 'Claude Code', 'Windsurf', 'VS Code'],
    verified: true,
    thumbnail: 'https://picsum.photos/seed/security-audit/400/250',
    readme: `# Security Audit Bundle

Enterprise-grade security tooling.

## Includes
- ESLint security rules
- Semgrep rulesets
- TruffleHog patterns
- OWASP Top 10 checklist
- GDPR/CCPA compliance guide`,
    dependencies: ['eslint', 'semgrep', 'trufflehog'],
    versions: [
      { version: '2.1.0', date: '2024-01-14', changelog: 'Updated OWASP 2023 rules' },
      { version: '2.0.0', date: '2023-11-15', changelog: 'Added secret detection' },
    ],
  },
];

export function getAssetsByCategory(category: string): Asset[] {
  if (category === 'All') return assets;
  return assets.filter((a) => a.category === category);
}

export function getCategories(): string[] {
  return [
    'All',
    'Skills',
    'Personas',
    'Templates',
    'Prompt Packs',
    'Instruction Files',
    'Workflows',
    'MCP Servers',
    'Collections',
    'Bundles',
  ];
}

export function getAssetKinds(): string[] {
  return [
    'Skill',
    'Persona',
    'Template',
    'Prompt Pack',
    'Instruction File',
    'Workflow',
    'MCP Server',
    'Collection',
    'Bundle',
  ];
}

export function getAssetById(id: string): Asset | undefined {
  return assets.find((a) => a.id === id);
}

export const marketplaceCategories = [
  { id: 'skills', label: 'Skills', count: 842 },
  { id: 'personas', label: 'Personas', count: 521 },
  { id: 'templates', label: 'Templates', count: 312 },
  { id: 'prompt-packs', label: 'Prompt Packs', count: 654 },
  { id: 'instruction-files', label: 'Instruction Files', count: 289 },
  { id: 'workflows', label: 'Workflows', count: 445 },
  { id: 'mcp-servers', label: 'MCP Servers', count: 167 },
  { id: 'collections', label: 'Collections', count: 234 },
  { id: 'bundles', label: 'Bundles', count: 198 },
];

export const featuredAssets = [
  {
    id: 'code-review-assistant',
    title: 'Code Review Assistant',
    description:
      'AI-powered code review for PRs. Detects bugs, security issues, and style violations with inline comments.',
    category: 'skills',
    downloads: 15420,
    rating: 4.8,
    reviewCount: 127,
    tags: ['code-review', 'security', 'automation'],
    featured: true,
    verified: true,
  },
  {
    id: 'senior-engineer-persona',
    title: 'Senior Engineer Persona',
    description:
      '15+ years experience. Architectural guidance, mentoring, pragmatic solutions. Your virtual staff engineer.',
    category: 'personas',
    downloads: 8930,
    rating: 4.9,
    reviewCount: 89,
    tags: ['architecture', 'mentoring', 'best-practices'],
    featured: true,
    verified: true,
  },
  {
    id: 'react-component-template',
    title: 'React Component Template Pack',
    description:
      'Production-ready React components with TypeScript, Storybook, testing, and accessibility built-in.',
    category: 'templates',
    downloads: 22100,
    rating: 4.7,
    reviewCount: 203,
    tags: ['react', 'typescript', 'storybook', 'testing'],
    featured: true,
    verified: true,
  },
];

export const categoryIcons = {
  skills: 'Code',
  personas: 'User',
  templates: 'FileText',
  'prompt-packs': 'Package',
  'instruction-files': 'FileText',
  workflows: 'GitBranch',
  'mcp-servers': 'Server',
  collections: 'Layers',
  bundles: 'Boxes',
};
