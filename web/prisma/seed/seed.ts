import { PrismaClient, AssetKind, AssetStatus, Visibility, Role, Platform, RoadmapStatus, Severity, AdvisoryStatus, AnnouncementType, BlogStatus, ContactType, ContactStatus, PurchaseStatus, VersionStatus, SubscriberStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  console.log("🌱 Starting database seed...");

  // ============================================
  // USERS
  // ============================================
  const passwordHash = await hash("password123", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@aicontextstudio.dev" },
    update: {},
    create: {
      email: "admin@aicontextstudio.dev",
      name: "Admin User",
      username: "admin",
      role: "OWNER",
      emailVerified: true,
      passwordHash,
      bio: "Platform administrator",
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@aicontextstudio.dev" },
    update: {},
    create: {
      email: "demo@aicontextstudio.dev",
      name: "Demo User",
      username: "demouser",
      role: "USER",
      emailVerified: true,
      passwordHash,
      bio: "Exploring AI Context Studio",
    },
  });

  const creatorUser = await prisma.user.upsert({
    where: { email: "creator@aicontextstudio.dev" },
    update: {},
    create: {
      email: "creator@aicontextstudio.dev",
      name: "Sarah Chen",
      username: "sarahchen",
      role: "USER",
      emailVerified: true,
      passwordHash,
      bio: "Staff Engineer at Stripe. Building tools for developer productivity. Author of 12 marketplace assets.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarahchen",
    },
  });

  const creatorUser2 = await prisma.user.upsert({
    where: { email: "marcus@aicontextstudio.dev" },
    update: {},
    create: {
      email: "marcus@aicontextstudio.dev",
      name: "Marcus Johnson",
      username: "marcusj",
      role: "USER",
      emailVerified: true,
      passwordHash,
      bio: "Open source maintainer. Creator of 'Code Review Assistant' and 'Senior Engineer Persona' skills.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcusjohnson",
    },
  });

  console.log("✅ Users created");

  // ============================================
  // PROFILES
  // ============================================
  await prisma.profile.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      displayName: "Admin User",
      headline: "Platform Administrator",
      skills: ["Platform", "Admin", "Security"],
      preferences: { theme: "system", notifications: true },
    },
  });

  await prisma.profile.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      displayName: "Demo User",
      headline: "Exploring AI Context Studio",
      skills: ["React", "TypeScript", "AI"],
      preferences: { theme: "system", notifications: true },
    },
  });

  await prisma.profile.upsert({
    where: { userId: creatorUser.id },
    update: {},
    create: {
      userId: creatorUser.id,
      displayName: "Sarah Chen",
      headline: "Staff Engineer @ Stripe | AI Tooling Enthusiast",
      location: "San Francisco, CA",
      website: "https://sarahchen.dev",
      github: "https://github.com/sarahchen",
      twitter: "https://twitter.com/sarahchen_dev",
      skills: ["TypeScript", "React", "Go", "Rust", "AI/ML", "Developer Tools"],
      socialLinks: [
        { label: "GitHub", url: "https://github.com/sarahchen", icon: "Github" },
        { label: "Twitter", url: "https://twitter.com/sarahchen_dev", icon: "Twitter" },
        { label: "Website", url: "https://sarahchen.dev", icon: "Globe" },
      ],
      preferences: { theme: "dark", notifications: true },
    },
  });

  await prisma.profile.upsert({
    where: { userId: creatorUser2.id },
    update: {},
    create: {
      userId: creatorUser2.id,
      displayName: "Marcus Johnson",
      headline: "Open Source Maintainer | AI Coding Assistant Expert",
      location: "Austin, TX",
      website: "https://marcusjohnson.dev",
      github: "https://github.com/marcusjohnson",
      skills: ["Python", "TypeScript", "Rust", "CLI Tools", "AI Assistants", "Code Analysis"],
      socialLinks: [
        { label: "GitHub", url: "https://github.com/marcusjohnson", icon: "Github" },
        { label: "Website", url: "https://marcusjohnson.dev", icon: "Globe" },
      ],
      preferences: { theme: "system", notifications: true },
    },
  });

  console.log("✅ Profiles created");

  // ============================================
  // CATEGORIES
  // ============================================
  const categories = [
    { slug: "skills", name: "Skills", description: "Atomic AI capabilities for specific tasks", icon: "Code", sortOrder: 1 },
    { slug: "personas", name: "Personas", description: "AI roles with defined expertise and personality", icon: "User", sortOrder: 2 },
    { slug: "templates", name: "Templates", description: "Project starters and boilerplates", icon: "FileText", sortOrder: 3 },
    { slug: "prompt-packs", name: "Prompt Packs", description: "Curated collections of prompts for specific domains", icon: "Package", sortOrder: 4 },
    { slug: "instruction-files", name: "Instruction Files", description: "AGENTS.md, CLAUDE.md, and other instruction formats", icon: "FileText", sortOrder: 5 },
    { slug: "workflows", name: "Workflows", description: "Multi-step pipelines and automation", icon: "GitBranch", sortOrder: 6 },
    { slug: "mcp-servers", name: "MCP Servers", description: "Model Context Protocol server configurations", icon: "Server", sortOrder: 7 },
    { slug: "collections", name: "Collections", description: "Curated groups of related assets", icon: "Layers", sortOrder: 8 },
    { slug: "bundles", name: "Bundles", description: "Multi-asset packages for complete solutions", icon: "Boxes", sortOrder: 9 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("✅ Categories created");

  // ============================================
  // TAGS
  // ============================================
  const tags = [
    { slug: "code-review", name: "code-review", color: "#EF4444" },
    { slug: "security", name: "security", color: "#DC2626" },
    { slug: "automation", name: "automation", color: "#3B82F6" },
    { slug: "github", name: "github", color: "#181717" },
    { slug: "gitlab", name: "gitlab", color: "#FC6D26" },
    { slug: "architecture", name: "architecture", color: "#8B5CF6" },
    { slug: "mentoring", name: "mentoring", color: "#10B981" },
    { slug: "best-practices", name: "best-practices", color: "#06B6D4" },
    { slug: "react", name: "react", color: "#61DAFB" },
    { slug: "typescript", name: "typescript", color: "#3178C6" },
    { slug: "storybook", name: "storybook", color: "#FF4785" },
    { slug: "testing", name: "testing", color: "#C21325" },
    { slug: "accessibility", name: "accessibility", color: "#0096D6" },
    { slug: "api", name: "api", color: "#FF6B35" },
    { slug: "rest", name: "rest", color: "#4A90D9" },
    { slug: "graphql", name: "graphql", color: "#E10098" },
    { slug: "grpc", name: "grpc", color: "#6C5CE7" },
    { slug: "clean-architecture", name: "clean-architecture", color: "#2C3E50" },
    { slug: "ddd", name: "ddd", color: "#34495E" },
    { slug: "ci-cd", name: "ci-cd", color: "#2088FF" },
    { slug: "github-actions", name: "github-actions", color: "#2671E5" },
    { slug: "deployment", name: "deployment", color: "#00D4AA" },
    { slug: "postgresql", name: "postgresql", color: "#336791" },
    { slug: "database", name: "database", color: "#4479A1" },
    { slug: "sql", name: "sql", color: "#E38D13" },
    { slug: "mcp", name: "mcp", color: "#8B5CF6" },
    { slug: "frontend", name: "frontend", color: "#F97316" },
    { slug: "starter", name: "starter", color: "#22C55E" },
    { slug: "boilerplate", name: "boilerplate", color: "#84CC16" },
    { slug: "sast", name: "sast", color: "#DC2626" },
    { slug: "compliance", name: "compliance", color: "#16A34A" },
    { slug: "secrets", name: "secrets", color: "#F59E0B" },
    { slug: "owasp", name: "owasp", color: "#EF4444" },
    { slug: "audit", name: "audit", color: "#6366F1" },
    { slug: "career", name: "career", color: "#8B5CF6" },
    { slug: "ui", name: "ui", color: "#EC4899" },
    { slug: "design", name: "design", color: "#F59E0B" },
    { slug: "layers", name: "layers", color: "#6366F1" },
    { slug: "dependency-inversion", name: "dependency-inversion", color: "#8B5CF6" },
    { slug: "readonly", name: "readonly", color: "#10B981" },
    { slug: "vue", name: "vue", color: "#42B883" },
    { slug: "svelte", name: "svelte", color: "#FF3E00" },
    { slug: "solid", name: "solid", color: "#2C4F7C" },
    { slug: "agents", name: "agents", color: "#8B5CF6" },
    { slug: "plugin-sdk", name: "plugin-sdk", color: "#6366F1" },
    { slug: "workflows", name: "workflows", color: "#3B82F6" },
    { slug: "marketplace", name: "marketplace", color: "#EC4899" },
    { slug: "community", name: "community", color: "#10B981" },
    { slug: "milestone", name: "milestone", color: "#F59E0B" },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }

  console.log("✅ Tags created");

  // ============================================
  // ASSETS
  // ============================================
  const skillsCategory = await prisma.category.findUnique({ where: { slug: "skills" } });
  const personasCategory = await prisma.category.findUnique({ where: { slug: "personas" } });
  const templatesCategory = await prisma.category.findUnique({ where: { slug: "templates" } });
  const promptPacksCategory = await prisma.category.findUnique({ where: { slug: "prompt-packs" } });
  const instructionFilesCategory = await prisma.category.findUnique({ where: { slug: "instruction-files" } });
  const workflowsCategory = await prisma.category.findUnique({ where: { slug: "workflows" } });
  const mcpServersCategory = await prisma.category.findUnique({ where: { slug: "mcp-servers" } });
  const collectionsCategory = await prisma.category.findUnique({ where: { slug: "collections" } });
  const bundlesCategory = await prisma.category.findUnique({ where: { slug: "bundles" } });

  const assets = [
    {
      slug: "code-review-assistant",
      name: "Code Review Assistant",
      description: `# Code Review Assistant

Automated code review for your pull requests. Analyzes code for bugs, security vulnerabilities, style violations, and performance issues.

## Features

- **Security Analysis**: Detects OWASP Top 10 vulnerabilities, SQL injection, XSS, path traversal
- **Code Quality**: Enforces consistent style, naming conventions, and best practices
- **Performance**: Identifies N+1 queries, memory leaks, inefficient algorithms
- **TypeScript/ESLint Integration**: Runs type checking and linting automatically
- **Multi-language**: Supports TypeScript, JavaScript, Python, Go, Rust, Java, C#
- **GitHub/GitLab Integration**: Posts inline comments directly on PRs
- **Custom Rules**: Define team-specific rules via configuration file

## Installation

\`\`\`bash
acs install code-review-assistant
\`\`\`

## Configuration

Create a \`.code-review.yml\` in your repository root:

\`\`\`yaml
rules:
  security: strict
  style: airbnb
  performance: warn
  complexity:
    maxCyclomatic: 10
    maxNesting: 4
exclude:
  - "**/*.test.ts"
  - "**/*.spec.ts"
  - "vendor/**"
\`\`\`

## How It Works

1. Triggers on PR open/update
2. Analyzes changed files using AST parsing
3. Runs security scanners (Semgrep, custom rules)
4. Posts inline comments with suggestions
5. Provides summary in PR description

## Supported Targets

- Cursor (.cursorrules)
- Claude Code (CLAUDE.md)
- Windsurf (.windsurfrules)
- VS Code (.vscode/prompts)
- GitHub Copilot (.github/copilot-instructions.md)
- Generic AGENTS.md`,
      shortDesc: "AI-powered code review assistant that analyzes PRs for bugs, security issues, and style violations with inline comments.",
      kind: "SKILL",
      authorId: creatorUser2.id,
      categoryId: skillsCategory!.id,
      status: "PUBLISHED",
      visibility: "PUBLIC",
      verified: true,
      featured: true,
      downloads: 15420,
      stars: 1240,
      rating: 4.8,
      reviewCount: 127,
      currentVersionId: null,
      tags: ["code-review", "security", "automation", "github", "gitlab"],
      compatibilities: [
        { target: "Cursor", minVersion: "0.40.0" },
        { target: "Claude Code", minVersion: "1.0.0" },
        { target: "Windsurf", minVersion: "1.0.0" },
        { target: "VS Code", minVersion: "1.85.0" },
      ],
      screenshots: [
        { url: "https://picsum.photos/seed/code-review/800/500", alt: "Code Review Assistant in action", sortOrder: 1 },
        { url: "https://picsum.photos/seed/code-review-pr/800/500", alt: "PR with inline comments", sortOrder: 2 },
      ],
      dependencies: [],
    },
    {
      slug: "senior-engineer-persona",
      name: "Senior Engineer Persona",
      description: `# Senior Engineer Persona

A battle-tested senior engineer persona with 15+ years experience. Provides architectural guidance, mentorship, and pragmatic solutions.

## Philosophy

- **Pragmatism over perfection** — Ship working code, iterate later
- **Code is read more than written** — Optimize for readability
- **Invest in developer experience** — Tooling pays dividends
- **Question requirements** — The best code is code you don't write

## Expertise Areas

- **System Design**: Distributed systems, microservices, event-driven architectures
- **Code Quality**: Clean architecture, SOLID principles, design patterns
- **Performance**: Profiling, caching strategies, database optimization
- **Team Leadership**: Code review culture, mentoring, technical decision making
- **Cloud**: AWS/GCP/Azure, Kubernetes, serverless, observability

## Usage

\`\`\`bash
acs install senior-engineer-persona
\`\`\`

Then reference in your prompts:

> "Act as a senior engineer with 15 years experience. Review this architecture proposal..."

## Compatible Targets

- Cursor
- Claude Code
- Windsurf
- VS Code
- Custom (any target supporting personas)`,
      shortDesc: "15+ years experience. Architectural guidance, mentoring, pragmatic solutions. Your virtual staff engineer.",
      kind: "PERSONA",
      authorId: creatorUser2.id,
      categoryId: personasCategory!.id,
      status: "PUBLISHED",
      visibility: "PUBLIC",
      verified: true,
      featured: true,
      downloads: 8930,
      stars: 890,
      rating: 4.9,
      reviewCount: 89,
      currentVersionId: null,
      tags: ["architecture", "mentoring", "best-practices", "career"],
      compatibilities: [
        { target: "Cursor", minVersion: "0.40.0" },
        { target: "Claude Code", minVersion: "1.0.0" },
        { target: "Windsurf", minVersion: "1.0.0" },
        { target: "VS Code", minVersion: "1.85.0" },
        { target: "Custom", minVersion: "1.0.0" },
      ],
      screenshots: [
        { url: "https://picsum.photos/seed/senior-engineer/800/500", alt: "Senior Engineer Persona", sortOrder: 1 },
      ],
      dependencies: [],
    },
    {
      slug: "react-component-template-pack",
      name: "React Component Template Pack",
      description: `# React Component Template Pack

Production-ready React component templates with TypeScript, testing, Storybook, and accessibility built-in.

## Includes

- **Core Components**: Button, Input, Select, Checkbox, Radio, Switch, Modal, Dropdown, Tooltip, Toast
- **Form Components**: Form, Field, Validation, FileUpload, DatePicker, RichTextEditor
- **Layout**: Container, Grid, Flex, Stack, Card, Section, Header, Footer, Sidebar
- **Data Display**: Table, List, Tree, Accordion, Tabs, Pagination, Badge, Avatar
- **Feedback**: Alert, Progress, Skeleton, Spinner, EmptyState, ErrorBoundary

## Features

- ✅ TypeScript strict mode
- ✅ Jest + React Testing Library (100% coverage target)
- ✅ Storybook 8 with controls, actions, backgrounds
- ✅ WCAG 2.1 AA compliant
- ✅ CSS-in-JS (Stitches) + Tailwind variants
- ✅ Bundle size optimization
- ✅ Tree-shaking support
- ✅ Dark mode support
- ✅ RTL support

## Installation

\`\`\`bash
acs install react-component-template-pack
\`\`\`

## Usage

\`\`\`tsx
import { Button, Card, Modal } from '@my-org/ui-components';

function MyComponent() {
  return (
    <Card>
      <Button variant="primary" onClick={() => {}}>
        Click me
      </Button>
    </Card>
  );
}
\`\`\``,
      shortDesc: "Production-ready React components with TypeScript, Storybook, testing, and accessibility built-in.",
      kind: "TEMPLATE",
      authorId: creatorUser.id,
      categoryId: templatesCategory!.id,
      status: "PUBLISHED",
      visibility: "PUBLIC",
      verified: true,
      featured: true,
      downloads: 22100,
      stars: 2310,
      rating: 4.7,
      reviewCount: 203,
      currentVersionId: null,
      tags: ["react", "typescript", "storybook", "testing", "accessibility", "ui"],
      compatibilities: [
        { target: "Cursor", minVersion: "0.40.0" },
        { target: "VS Code", minVersion: "1.85.0" },
        { target: "Windsurf", minVersion: "1.0.0" },
      ],
      screenshots: [
        { url: "https://picsum.photos/seed/react-template/800/500", alt: "Component library showcase", sortOrder: 1 },
        { url: "https://picsum.photos/seed/react-storybook/800/500", alt: "Storybook documentation", sortOrder: 2 },
      ],
      dependencies: ["@testing-library/react", "storybook"],
    },
    {
      slug: "api-design-prompt-pack",
      name: "API Design Prompt Pack",
      description: `# API Design Prompt Pack

Curated prompts for designing REST, GraphQL, and gRPC APIs. Covers versioning, error handling, pagination, and security.

## Prompts Included

### REST API Design
- Resource modeling and naming conventions
- HTTP status codes and error formats
- Pagination, filtering, and sorting patterns
- Versioning strategies (URL, header, media type)
- HATEOAS and hypermedia controls

### GraphQL Schema Design
- Type system best practices
- Query/mutation design patterns
- Pagination (Relay cursor vs offset)
- Federation and schema stitching
- N+1 prevention with DataLoader

### gRPC Service Design
- Protobuf schema organization
- Unary vs streaming RPCs
- Error handling with gRPC status codes
- Interceptors for auth, logging, metrics
- Backward/forward compatibility

### Cross-cutting Concerns
- Authentication & authorization (OAuth2, OIDC, JWT)
- Rate limiting and throttling
- Request/response validation
- API documentation (OpenAPI, GraphQL introspection)
- Testing strategies (contract, integration, load)

## Installation

\`\`\`bash
acs install api-design-prompt-pack
\`\`\``,
      shortDesc: "Professional API design guidance for REST, GraphQL, and gRPC. Covers versioning, errors, pagination, auth.",
      kind: "PROMPT_PACK",
      authorId: creatorUser.id,
      categoryId: promptPacksCategory!.id,
      status: "PUBLISHED",
      visibility: "PUBLIC",
      verified: false,
      featured: false,
      downloads: 5420,
      stars: 420,
      rating: 4.6,
      reviewCount: 56,
      currentVersionId: null,
      tags: ["api", "rest", "graphql", "grpc", "design", "architecture"],
      compatibilities: [
        { target: "Cursor", minVersion: "0.40.0" },
        { target: "Claude Code", minVersion: "1.0.0" },
        { target: "Windsurf", minVersion: "1.0.0" },
        { target: "VS Code", minVersion: "1.85.0" },
      ],
      screenshots: [],
      dependencies: [],
    },
    {
      slug: "clean-architecture-instructions",
      name: "Clean Architecture Instructions",
      description: `# Clean Architecture Instructions

AGENTS.md instruction files for implementing Clean Architecture in any language. Includes layer definitions, dependency rules, and testing strategies.

## Layers

1. **Entities** (Enterprise Business Rules)
   - Core business logic, no external dependencies
   - Domain models, value objects, domain events

2. **Use Cases** (Application Business Rules)
   - Orchestrate entities, define application-specific rules
   - Input/output ports, interactors, presenters

3. **Interface Adapters**
   - Convert data between use cases and external formats
   - Controllers, presenters, gateways, repositories

4. **Frameworks & Drivers**
   - Web frameworks, databases, UI, external services
   - Implementation details, easily swappable

## Dependency Rule

> Source code dependencies must point inward. Inner layers know nothing of outer layers.

## Testing Strategy

- **Entities**: Unit tests, property-based tests
- **Use Cases**: Unit tests with mocked ports
- **Adapters**: Integration tests with test doubles
- **Frameworks**: E2E tests, contract tests

## Installation

\`\`\`bash
acs install clean-architecture-instructions
\`\`\`

## Supported Languages

- TypeScript/JavaScript
- Python
- Go
- Rust
- Java/Kotlin
- C#/.NET
- Ruby
- PHP`,
      shortDesc: "Universal Clean Architecture patterns with AGENTS.md instruction files for any language.",
      kind: "INSTRUCTION_FILE",
      authorId: creatorUser.id,
      categoryId: instructionFilesCategory!.id,
      status: "PUBLISHED",
      visibility: "PUBLIC",
      verified: true,
      featured: false,
      downloads: 9800,
      stars: 1120,
      rating: 4.8,
      reviewCount: 112,
      currentVersionId: null,
      tags: ["clean-architecture", "ddd", "testing", "layers", "dependency-inversion"],
      compatibilities: [
        { target: "Cursor", minVersion: "0.40.0" },
        { target: "Claude Code", minVersion: "1.0.0" },
        { target: "Windsurf", minVersion: "1.0.0" },
        { target: "VS Code", minVersion: "1.85.0" },
        { target: "Custom", minVersion: "1.0.0" },
      ],
      screenshots: [],
      dependencies: [],
    },
    {
      slug: "ci-cd-pipeline-workflow",
      name: "CI/CD Pipeline Workflow",
      description: `# CI/CD Pipeline Workflow

Multi-stage CI/CD workflow with linting, testing, security scanning, and deployment. Supports GitHub Actions, GitLab CI, and Azure Pipelines.

## Pipeline Stages

### 1. Lint & Type Check
- ESLint + Prettier (JS/TS)
- Ruff + Black (Python)
- golangci-lint (Go)
- clippy + fmt (Rust)
- TypeScript strict mode

### 2. Unit Tests
- Jest / Vitest (JS/TS)
- pytest (Python)
- go test (Go)
- cargo test (Rust)
- Coverage thresholds enforced

### 3. Integration Tests
- Testcontainers for databases
- Contract testing with Pact
- API integration tests

### 4. Security Scan (SAST/DAST)
- Semgrep rulesets (OWASP, custom)
- Trivy container scanning
- Dependency audit (npm audit, cargo audit)
- Secret detection (TruffleHog)

### 5. Build & Package
- Multi-arch Docker images
- SBOM generation (Syft)
- Image signing (Cosign)

### 6. Deploy to Staging
- Blue/green deployment
- Health checks
- Smoke tests

### 7. Deploy to Production
- Manual approval gate
- Canary deployment
- Rollback automation

## Installation

\`\`\`bash
acs install ci-cd-pipeline-workflow
\`\`\``,
      shortDesc: "Complete CI/CD pipeline with linting, testing, security scanning, and multi-platform deployment.",
      kind: "WORKFLOW",
      authorId: creatorUser2.id,
      categoryId: workflowsCategory!.id,
      status: "PUBLISHED",
      visibility: "PUBLIC",
      verified: true,
      featured: false,
      downloads: 6750,
      stars: 780,
      rating: 4.5,
      reviewCount: 78,
      currentVersionId: null,
      tags: ["ci-cd", "github-actions", "gitlab", "deployment", "security", "testing"],
      compatibilities: [
        { target: "Cursor", minVersion: "0.40.0" },
        { target: "VS Code", minVersion: "1.85.0" },
        { target: "Windsurf", minVersion: "1.0.0" },
      ],
      screenshots: [],
      dependencies: ["github-actions", "sonarqube"],
    },
    {
      slug: "postgres-mcp-server",
      name: "PostgreSQL MCP Server",
      description: `# PostgreSQL MCP Server

Model Context Protocol server for PostgreSQL databases. Provides read-only query access, schema inspection, and query optimization hints.

## Features

- **Read-only Query Execution**: Safe SELECT queries with row limits
- **Schema Introspection**: Tables, columns, indexes, constraints, foreign keys
- **Query Plan Analysis**: EXPLAIN ANALYZE with optimization hints
- **Connection Pooling**: PgBouncer-compatible pooling
- **Row-level Security**: Respects PostgreSQL RLS policies
- **Audit Logging**: All queries logged for compliance

## Installation

\`\`\`bash
acs install postgres-mcp-server
\`\`\`

## Configuration

\`\`\`json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["@ai-context-studio/postgres-mcp"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@your-neon-host/db",
        "READ_ONLY": "true",
        "MAX_ROWS": "100",
        "QUERY_TIMEOUT": "30000"
      }
    }
  }
}
\`\`\`

## Supported Clients

- Claude Code
- Cursor
- Custom MCP clients

## Tools Provided

- \`query\` — Execute read-only SQL
- \`schema\` — Get database schema
- \`explain\` — Analyze query plan
- \`tables\` — List tables with metadata
- \`indexes\` — Index usage statistics`,
      shortDesc: "Safe PostgreSQL access via MCP. Read-only queries, schema inspection, query optimization hints.",
      kind: "MCP_SERVER",
      authorId: creatorUser2.id,
      categoryId: mcpServersCategory!.id,
      status: "PUBLISHED",
      visibility: "PUBLIC",
      verified: true,
      featured: false,
      downloads: 3210,
      stars: 450,
      rating: 4.9,
      reviewCount: 45,
      currentVersionId: null,
      tags: ["postgresql", "database", "sql", "mcp", "readonly"],
      compatibilities: [
        { target: "Claude Code", minVersion: "1.0.0" },
        { target: "Cursor", minVersion: "0.40.0" },
        { target: "Custom", minVersion: "1.0.0" },
      ],
      screenshots: [],
      dependencies: ["pg", "@modelcontextprotocol/sdk"],
    },
    {
      slug: "frontend-starter-collection",
      name: "Frontend Starter Collection",
      description: `# Frontend Starter Collection

Complete starter kits for React, Vue, Svelte, and Solid. Includes routing, state management, styling, and deployment configs.

## Frameworks

### React + TypeScript + Vite
- React 18 + TypeScript 5
- React Router 6
- TanStack Query
- Zustand for state
- Tailwind CSS + Headless UI
- Vitest + Testing Library
- ESLint + Prettier + Husky
- GitHub Actions CI
- Vercel/Netlify deploy config

### Vue 3 + TypeScript + Vite
- Vue 3 + TypeScript 5
- Vue Router 4
- Pinia for state
- Tailwind CSS + PrimeVue
- Vitest + Vue Test Utils
- ESLint + Prettier + Husky

### SvelteKit + TypeScript
- SvelteKit 2 + TypeScript 5
- Svelte 5 (runes)
- Tailwind CSS + shadcn-svelte
- Vitest + Playwright
- ESLint + Prettier + Husky
- Adapter-auto for any platform

### SolidJS + TypeScript
- SolidJS + TypeScript 5
- Solid Router
- Solid primitives for state
- Tailwind CSS
- Vitest + Solid Testing Library
- Vite + Solid plugin

## Installation

\`\`\`bash
acs install frontend-starter-collection
\`\`\`

Each starter is a complete, production-ready project structure.`,
      shortDesc: "Complete starter kits for React, Vue, Svelte, and Solid with routing, state, styling, and deployment.",
      kind: "COLLECTION",
      authorId: creatorUser.id,
      categoryId: collectionsCategory!.id,
      status: "PUBLISHED",
      visibility: "PUBLIC",
      verified: true,
      featured: true,
      downloads: 18900,
      stars: 1670,
      rating: 4.8,
      reviewCount: 167,
      currentVersionId: null,
      tags: ["starter", "react", "vue", "svelte", "solid", "boilerplate"],
      compatibilities: [
        { target: "Cursor", minVersion: "0.40.0" },
        { target: "VS Code", minVersion: "1.85.0" },
        { target: "Windsurf", minVersion: "1.0.0" },
      ],
      screenshots: [
        { url: "https://picsum.photos/seed/frontend-starter/800/500", alt: "Starter kit dashboard", sortOrder: 1 },
        { url: "https://picsum.photos/seed/frontend-structure/800/500", alt: "Project structure", sortOrder: 2 },
      ],
      dependencies: [],
    },
    {
      slug: "security-audit-bundle",
      name: "Security Audit Bundle",
      description: `# Security Audit Bundle

Comprehensive security auditing tools: SAST rules, dependency scanning configs, secret detection patterns, and compliance checklists.

## Includes

### SAST Rules (Semgrep)
- OWASP Top 10 2023 coverage
- Language-specific rules (JS/TS, Python, Go, Java, Rust)
- Custom rules for common vulnerabilities
- CI/CD integration configs

### Dependency Scanning
- npm audit / yarn audit configs
- cargo audit / pip-audit configs
- License compliance checking
- Vulnerability database sync

### Secret Detection
- TruffleHog patterns
- GitLeaks config
- Custom regex for API keys, tokens, certs
- Pre-commit hooks

### Compliance Checklists
- OWASP Top 10 2023
- GDPR/CCPA compliance guide
- SOC 2 Type II requirements
- ISO 27001 controls mapping

## Installation

\`\`\`bash
acs install security-audit-bundle
\`\`\`

## Usage

Run security audit on any project:

\`\`\`bash
# SAST scan
semgrep scan --config=@ai-context-studio/security-audit

# Dependency scan
npm audit --audit-level=high

# Secret scan
trufflehog filesystem . --json
\`\`\``,
      shortDesc: "Enterprise-grade security tooling: SAST rules, dependency scanning, secret detection, compliance checklists.",
      kind: "BUNDLE",
      authorId: creatorUser2.id,
      categoryId: bundlesCategory!.id,
      status: "PUBLISHED",
      visibility: "PUBLIC",
      verified: true,
      featured: false,
      downloads: 7600,
      stars: 940,
      rating: 4.7,
      reviewCount: 94,
      currentVersionId: null,
      tags: ["security", "sast", "compliance", "secrets", "owasp", "audit"],
      compatibilities: [
        { target: "Cursor", minVersion: "0.40.0" },
        { target: "Claude Code", minVersion: "1.0.0" },
        { target: "Windsurf", minVersion: "1.0.0" },
        { target: "VS Code", minVersion: "1.85.0" },
      ],
      screenshots: [],
      dependencies: ["eslint", "semgrep", "trufflehog"],
    },
  ];

  for (const asset of assets) {
    const { tags, compatibilities, screenshots, dependencies, ...assetData } = asset;

    const existing = await prisma.asset.findUnique({ where: { slug: assetData.slug } });
    if (existing) continue;

    const created = await prisma.asset.create({
      data: {
        ...assetData,
        publishedAt: new Date(),
        tags: {
          create: tags.map((tagSlug) => ({
            tag: { connect: { slug: tagSlug } },
          })),
        },
        compatibilities: {
          create: compatibilities.map((c) => ({
            target: c.target,
            minVersion: c.minVersion,
            verified: true,
          })),
        },
        screenshots: {
          create: screenshots.map((s) => ({
            url: s.url,
            alt: s.alt,
            sortOrder: s.sortOrder,
          })),
        },
        dependencies: {
          create: dependencies.map((depName) => ({
            dependency: {
              connectOrCreate: {
                where: { slug: depName.toLowerCase().replace(/[^a-z0-9-]/g, "-") },
                create: {
                  slug: depName.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                  name: depName,
                  description: `Dependency: ${depName}`,
                  kind: "SKILL",
                  authorId: creatorUser.id,
                  categoryId: skillsCategory!.id,
                  status: "PUBLISHED",
                  visibility: "PUBLIC",
                },
              },
            },
            versionRange: "*",
            type: "RUNTIME",
          })),
        },
      },
    });

    // Create initial version
    await prisma.assetVersion.create({
      data: {
        assetId: created.id,
        version: "1.0.0",
        changelog: "Initial release",
        readme: assetData.description,
        manifest: {
          name: created.slug,
          version: "1.0.0",
          kind: created.kind,
          description: created.shortDesc,
        },
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    // Update asset with current version
    await prisma.asset.update({
      where: { id: created.id },
      data: { currentVersionId: (await prisma.assetVersion.findFirst({ where: { assetId: created.id, version: "1.0.0" } }))!.id },
    });
  }

  console.log("✅ Assets created");

  // ============================================
  // ROADMAP ITEMS
  // ============================================
  const roadmapItems = [
    {
      title: "Desktop App v1.0",
      description: "Core workspace with system prompts, instruction files, memories, MCP, workflows, and export to 10+ targets.",
      status: "COMPLETED",
      phase: "Completed",
      quarter: "Q1 2024",
      progress: 100,
      order: 1,
      tags: ["Desktop", "Tauri", "Next.js", "React"],
      details: "Initial release with full workspace: dashboard, prompt library, system prompt engine, personas, skills, workflows, memories, MCP manager, asset validator, prompt optimizer, settings, and search.",
      links: [{ label: "Release Notes", href: "/changelog#v1.0.0" }],
    },
    {
      title: "Marketplace Frontend",
      description: "Browse, search, and filter assets with categories, compatibility badges, ratings, and install commands.",
      status: "COMPLETED",
      phase: "Completed",
      quarter: "Q2 2024",
      progress: 100,
      order: 2,
      tags: ["Web", "Marketplace", "Search"],
      details: "Static marketplace browser with 10 categories, advanced filters (type, verified, compatibility, sort), asset detail pages with screenshots, version history, and one-click install commands.",
      links: [{ label: "Browse Marketplace", href: "/marketplace" }],
    },
    {
      title: "Registry Specification",
      description: "Open specification for AI asset packaging: manifest schema, semantic versioning, dependencies, compatibility matrix, and checksums.",
      status: "COMPLETED",
      phase: "Completed",
      quarter: "Q2 2024",
      progress: 100,
      order: 3,
      tags: ["Registry", "Schema", "Standards"],
      details: "Versioned manifest.json schema with asset metadata, dependencies, target compatibility, and integrity verification. Reference implementation in Rust (registry crate).",
      links: [
        { label: "View Spec", href: "/registry" },
        { label: "Rust Crate", href: "https://crates.io/crates/ai-context-studio-registry" },
      ],
    },
    {
      title: "Documentation Site",
      description: "Complete documentation with Getting Started, Installation, Desktop, Marketplace, Registry, MCP, Skills, Prompt Files, API Keys, Security, Developer Guide, and Architecture.",
      status: "COMPLETED",
      phase: "Completed",
      quarter: "Q2 2024",
      progress: 100,
      order: 4,
      tags: ["Docs", "Next.js", "MDX"],
      details: "Full documentation site with sidebar navigation, table of contents, code blocks with copy buttons, callouts, version badges, and search integration.",
      links: [{ label: "Read Docs", href: "/docs" }],
    },
    {
      title: "Online Hub (Sync & Collaboration)",
      description: "Cross-device sync, team workspaces, shared collections, version history, and access controls for cloud-backed asset management.",
      status: "IN_PROGRESS",
      phase: "In Progress",
      quarter: "Q3 2024",
      progress: 35,
      order: 5,
      tags: ["Cloud", "Sync", "Teams", "PostgreSQL"],
      details: "End-to-end encrypted sync using client-side encryption. Team workspaces with role-based access. Conflict resolution for concurrent edits. Offline-first with background sync.",
      links: [{ label: "Track Progress", href: "https://github.com/ai-context-studio/hub" }],
    },
    {
      title: "Plugin SDK",
      description: "TypeScript SDK for building custom exporters, validators, integrations, and UI extensions. Includes CLI scaffolding and publishing workflow.",
      status: "IN_PROGRESS",
      phase: "In Progress",
      quarter: "Q3 2024",
      progress: 20,
      order: 6,
      tags: ["SDK", "TypeScript", "Plugin System", "CLI"],
      details: "Declarative plugin manifest, hook system for build/export/validate lifecycle, TypeScript types for all asset kinds, example plugins for Notion, Obsidian, and custom formats.",
      links: [{ label: "SDK Docs", href: "/docs/developer-guide#plugin-sdk" }],
    },
    {
      title: "AI Agent Orchestration",
      description: "Multi-agent workflows with routing, memory sharing, tool use, and evaluation. Visual workflow builder with real-time preview.",
      status: "PLANNED",
      phase: "Planned",
      quarter: "Q4 2024",
      progress: 0,
      order: 7,
      tags: ["Agents", "Workflows", "Orchestration", "Evaluation"],
      details: "Agent graph definition with conditional routing, shared memory stores, tool calling with sandboxing, built-in evaluation harness, and A/B testing for prompts.",
      links: [{ label: "RFC", href: "https://github.com/ai-context-studio/rfcs" }],
    },
    {
      title: "Extension System",
      description: "VS Code extension, Raycast extension, and CLI tool for seamless integration into existing developer workflows.",
      status: "PLANNED",
      phase: "Planned",
      quarter: "Q4 2024",
      progress: 0,
      order: 8,
      tags: ["VS Code", "Raycast", "CLI", "Extensions"],
      details: "VS Code: sidebar, command palette integration, inline actions. Raycast: quick search, install commands, asset preview. CLI: acs install, acs search, acs publish, acs validate.",
      links: [{ label: "VS Code Marketplace", href: "https://marketplace.visualstudio.com" }],
    },
    {
      title: "Teams & Enterprise",
      description: "RBAC, SSO/SAML, audit logs, compliance reporting, private marketplace, and dedicated support for organizations.",
      status: "PLANNED",
      phase: "Planned",
      quarter: "Q1 2025",
      progress: 0,
      order: 9,
      tags: ["Enterprise", "SSO", "RBAC", "Audit", "Compliance"],
      details: "SCIM provisioning, SOC 2 compliance, data residency options, custom branding, SLA-backed support, on-premise deployment option.",
      links: [{ label: "Enterprise Interest", href: "/contact?type=enterprise" }],
    },
    {
      title: "Cloud Marketplace Hosting",
      description: "Managed registry hosting with global CDN, analytics dashboard, monetization tools, and creator revenue sharing.",
      status: "PLANNED",
      phase: "Planned",
      quarter: "Q1 2025",
      progress: 0,
      order: 10,
      tags: ["Cloud", "Marketplace", "Analytics", "Monetization"],
      details: "Auto-scaling registry API, edge caching, download analytics, creator payouts, subscription billing, featured placement auction.",
      links: [{ label: "Early Access", href: "/contact?type=cloud-marketplace" }],
    },
  ];

  for (const item of roadmapItems) {
    await prisma.roadmapItem.upsert({
      where: { id: `roadmap-${item.order}` },
      update: {},
      create: {
        id: `roadmap-${item.order}`,
        ...item,
      },
    });
  }

  console.log("✅ Roadmap items created");

  // ============================================
  // BLOG POSTS
  // ============================================
  const blogCategoryRelease = await prisma.blogCategory.upsert({
    where: { slug: "releases" },
    update: {},
    create: { slug: "releases", name: "Releases", color: "#22C55E", sortOrder: 1 },
  });

  const blogCategoryAnnouncement = await prisma.blogCategory.upsert({
    where: { slug: "announcements" },
    update: {},
    create: { slug: "announcements", name: "Announcements", color: "#3B82F6", sortOrder: 2 },
  });

  const blogCategoryDevlog = await prisma.blogCategory.upsert({
    where: { slug: "devlogs" },
    update: {},
    create: { slug: "devlogs", name: "Dev Logs", color: "#8B5CF6", sortOrder: 3 },
  });

  const blogCategoryTutorial = await prisma.blogCategory.upsert({
    where: { slug: "tutorials" },
    update: {},
    create: { slug: "tutorials", name: "Tutorials", color: "#F59E0B", sortOrder: 4 },
  });

  const blogCategoryShowcase = await prisma.blogCategory.upsert({
    where: { slug: "showcases" },
    update: {},
    create: { slug: "showcases", name: "Showcases", color: "#EC4899", sortOrder: 5 },
  });

  const blogPosts = [
    {
      slug: "v1-2-0-release",
      title: "AI Context Studio v1.2.0 — MCP Server Support, Agent Orchestration, and Plugin SDK",
      excerpt: "Major release adding Model Context Protocol server integration, multi-agent workflow orchestration, and a new TypeScript Plugin SDK for custom exporters and validators.",
      content: `# AI Context Studio v1.2.0

## Overview

This major release introduces three powerful features that significantly expand what's possible with AI Context Studio.

## MCP Server Support

The headline feature is full Model Context Protocol (MCP) server integration. You can now:

- **Configure MCP servers** directly in the desktop app
- **Validate server configs** before deploying
- **Export to any MCP-compatible client** (Claude, Cursor, Windsurf, Continue)
- **Sandbox execution** for security

\`\`\`json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["@ai-context-studio/postgres-mcp"],
      "env": { "DATABASE_URL": "postgresql://..." }
    }
  }
}
\`\`\`

## Agent Orchestration

Multi-agent workflows are now available in beta:

- **Agent graphs** with conditional routing
- **Shared memory stores** between agents
- **Tool calling** with sandboxed execution
- **Evaluation harness** for prompt testing

## Plugin SDK

Build custom exporters, validators, and UI extensions:

\`\`\`bash
npx create-acs-plugin my-custom-exporter
cd my-custom-exporter
npm run dev
\`\`\`

See the [Plugin SDK documentation](/docs/developer-guide#plugin-sdk) for full details.

## Other Improvements

- Workflow engine performance: 3x faster execution
- Memory system: persistent vector embeddings
- Prompt optimizer: new "cost reduction" engine
- 50+ bug fixes and stability improvements

## Upgrade

\`\`\`bash
acs update
\`\`\`

Or download the latest from [GitHub Releases](https://github.com/ai-context-studio/ai-context-studio/releases).`,
      contentHtml: null,
      coverImage: "https://picsum.photos/seed/v120-release/800/450",
      authorId: creatorUser.id,
      status: "PUBLISHED",
      featured: true,
      publishedAt: new Date("2024-08-15"),
      viewCount: 12400,
      readTime: 8,
      metaTitle: "AI Context Studio v1.2.0 — MCP, Agents, Plugin SDK",
      metaDescription: "Major release adding MCP server integration, multi-agent orchestration, and TypeScript Plugin SDK.",
      ogImage: "https://picsum.photos/seed/v120-release/1200/630",
      canonicalUrl: "https://aicontextstudio.dev/blog/v1-2-0-release",
      categories: ["releases"],
      tags: ["MCP", "Agents", "Plugin SDK", "Workflows"],
    },
    {
      slug: "marketplace-milestone",
      title: "Marketplace Hits 10,000 Assets — Community Celebration",
      excerpt: "The AI Context Studio marketplace has surpassed 10,000 community-published assets. We celebrate the creators and highlight the most impactful skills, personas, and workflows.",
      content: `# Marketplace Milestone: 10,000 Assets! 🎉

Today we're celebrating a huge milestone: **10,000 community-published assets** on the AI Context Studio marketplace!

## By the Numbers

- **10,000+** total assets published
- **2,400+** unique creators
- **156,000+** total downloads
- **4.2K+** GitHub stars

## Top Categories

1. **Skills** (3,200+) — Atomic AI capabilities
2. **Prompt Packs** (2,100+) — Curated prompt collections
3. **Workflows** (1,800+) — Multi-step automation
4. **Personas** (1,200+) — AI roles and expertise
5. **Templates** (900+) — Project starters

## Creator Spotlights

### Sarah Chen (@sarahchen) — 12 assets, 89K downloads
Creator of the popular "React Component Template Pack" and "API Design Prompt Pack".

### Marcus Johnson (@marcusj) — 8 assets, 67K downloads
Creator of "Code Review Assistant" and "Senior Engineer Persona".

### Frontend Collective (@frontend-collective) — 15 assets, 156K downloads
Team publishing React, Vue, and Svelte templates.

## What's Next?

- **Creator analytics dashboard** — Track downloads, ratings, engagement
- **Monetization options** — Paid assets, subscriptions (opt-in, 85/15 split)
- **Featured placement** — Curated collections, category highlights
- **Asset dependencies** — Automatic dependency resolution

## Thank You

To every creator who published an asset, every user who downloaded and reviewed, and every contributor who improved the platform — this milestone belongs to all of you.

[Explore the marketplace →](/marketplace)`,
      contentHtml: null,
      coverImage: "https://picsum.photos/seed/marketplace-10k/800/450",
      authorId: creatorUser.id,
      status: "PUBLISHED",
      featured: true,
      publishedAt: new Date("2024-08-01"),
      viewCount: 8900,
      readTime: 5,
      metaTitle: "Marketplace Hits 10,000 Assets",
      metaDescription: "Celebrating 10,000 community assets on the AI Context Studio marketplace.",
      ogImage: "https://picsum.photos/seed/marketplace-10k/1200/630",
      canonicalUrl: "https://aicontextstudio.dev/blog/marketplace-milestone",
      categories: ["announcements"],
      tags: ["Marketplace", "Community", "Milestone"],
    },
    {
      slug: "security-audit-results",
      title: "Third-Party Security Audit Complete — Zero Critical Findings",
      excerpt: "Independent security firm Trail of Bits completed a comprehensive audit of AI Context Studio v1.1. Results: zero critical, zero high, and only two low-severity findings (all addressed).",
      content: `# Security Audit Results: Zero Critical Findings

We're pleased to share that **Trail of Bits**, a leading security research firm, has completed a comprehensive security audit of AI Context Studio v1.1.

## Audit Scope

- Desktop application (Tauri + Rust + TypeScript)
- Marketplace API and registry
- MCP server implementations
- Authentication and authorization
- File system access and sandboxing
- Inter-process communication

## Results Summary

| Severity | Count | Status |
|----------|-------|--------|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 0 | — |
| Low | 2 | ✅ Fixed |
| Informational | 5 | ✅ Addressed |

## Low-Severity Findings (Fixed)

1. **Information Disclosure in Error Messages** — Stack traces could leak internal paths in development mode. Fixed by sanitizing error responses in production.

2. **CSP Header Missing on Static Assets** — Content Security Policy not applied to all static assets. Fixed by adding comprehensive CSP headers.

## Informational Findings (Addressed)

- Dependency version pinning recommendations
- Additional rate limiting on auth endpoints
- Enhanced audit logging for sensitive operations
- Improved input validation on file paths
- Secure defaults for MCP server sandboxing

## Our Security Commitment

- **Annual third-party audits** — Next audit scheduled for v1.3
- **Bug bounty program** — [hackerone.com/ai-context-studio](https://hackerone.com/ai-context-studio)
- **Security advisories** — Published at [/security](/security)
- **Responsible disclosure** — security@aicontextstudio.dev

## Full Report

The [full audit report](/security#audit-reports) is available on our security page, including methodology, findings detail, and remediation verification.

Thank you to the Trail of Bits team for their thorough analysis!`,
      contentHtml: null,
      coverImage: "https://picsum.photos/seed/security-audit/800/450",
      authorId: creatorUser2.id,
      status: "PUBLISHED",
      featured: false,
      publishedAt: new Date("2024-07-28"),
      viewCount: 6700,
      readTime: 6,
      metaTitle: "Security Audit Complete — Zero Critical Findings",
      metaDescription: "Trail of Bits audit of AI Context Studio v1.1: zero critical, zero high, two low findings (all fixed).",
      ogImage: "https://picsum.photos/seed/security-audit/1200/630",
      canonicalUrl: "https://aicontextstudio.dev/blog/security-audit-results",
      categories: ["announcements"],
      tags: ["Security", "Audit", "Compliance"],
    },
  ];

  for (const post of blogPosts) {
    const { categories, tags, ...postData } = post;

    const existing = await prisma.blogPost.findUnique({ where: { slug: postData.slug } });
    if (existing) continue;

    const created = await prisma.blogPost.create({
      data: {
        ...postData,
        categories: {
          create: categories.map((catSlug) => ({
            category: { connect: { slug: catSlug } },
          })),
        },
        tags: {
          create: tags.map((tagSlug) => ({
            tag: { connect: { slug: slugify(tagSlug) } },
          })),
        },
      },
    });

    console.log(`✅ Blog post created: ${created.title}`);
  }

  console.log("✅ Blog posts created");

  // ============================================
  // DOCUMENTATION
  // ============================================
  const docCategories = [
    { slug: "getting-started", name: "Getting Started", description: "Learn the basics and get up and running quickly", sortOrder: 1 },
    { slug: "desktop", name: "Desktop App", description: "Master the desktop application features", sortOrder: 2 },
    { slug: "marketplace", name: "Marketplace", description: "Discover, install, and publish assets", sortOrder: 3 },
    { slug: "registry", name: "Registry", description: "Asset packaging, versioning, and distribution", sortOrder: 4 },
    { slug: "mcp", name: "MCP Servers", description: "Configure and use Model Context Protocol servers", sortOrder: 5 },
    { slug: "skills", name: "Skills", description: "Create and use atomic AI capabilities", sortOrder: 6 },
    { slug: "prompt-files", name: "Prompt Files", description: "AGENTS.md, CLAUDE.md, and instruction files", sortOrder: 7 },
    { slug: "api-keys", name: "API Keys", description: "Manage API keys for cloud services", sortOrder: 8 },
    { slug: "security", name: "Security", description: "Security best practices, audits, and responsible disclosure", sortOrder: 9 },
    { slug: "developer-guide", name: "Developer Guide", description: "Extend AI Context Studio with plugins and integrations", sortOrder: 10 },
    { slug: "architecture", name: "Architecture", description: "Technical architecture and design decisions", sortOrder: 11 },
  ];

  for (const cat of docCategories) {
    await prisma.docCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const docPages = [
    {
      slug: "introduction",
      title: "Introduction",
      description: "What is AI Context Studio and why should you use it?",
      content: `# Introduction

Welcome to **AI Context Studio** — a local-first, offline-first prompt engineering studio for AI coding assistants.

## What is AI Context Studio?

AI Context Studio helps you build, customize, manage, and export AI instruction assets (system prompts, instruction files, memories, MCP configs, workflows, skills, personas) to multiple targets like Cursor, Claude Code, Windsurf, VS Code, Copilot, and more — all from a single workspace.

## Key Features

### 🏠 Local-First Architecture

Your data lives on your machine by default. No cloud storage, no mandatory accounts, no telemetry. You own your prompts, memories, API keys, and assets.

### 📦 Asset Types

- **System Prompts** — Structured prompts with variables, conditionals, and blueprints
- **Instruction Files** — AGENTS.md, CLAUDE.md, .cursorrules, and custom formats
- **Memories** — Persistent context blocks (code snippets, docs, API references)
- **MCP Servers** — Configure and validate Model Context Protocol servers
- **Workflows** — Chain prompts, tools, and agents into repeatable pipelines
- **Skills** — Atomic AI capabilities with typed inputs/outputs
- **Personas** — AI roles with defined expertise and personality

### 🎯 Multi-Target Export

One-click export to:
- Cursor (.cursorrules)
- Claude Code (CLAUDE.md)
- Windsurf (.windsurfrules)
- VS Code (.vscode/prompts)
- GitHub Copilot (.github/copilot-instructions.md)
- OpenAI Codex (AGENTS.md)
- Google Gemini (GEMINI.md)
- Continue (.continuerules.json)
- Roo Code (.roo/rules)
- Generic AGENTS.md

### 🔌 MCP Integration

Full Model Context Protocol support for connecting AI assistants to external tools and data sources.

### 🛡️ Security & Privacy

- No telemetry or analytics by default
- Local encryption for sensitive data
- Sandboxed MCP execution
- Regular third-party security audits

## Getting Started

1. [Download the desktop app](/download)
2. [Follow the quick start guide](/docs/getting-started)
3. [Create your first asset](/docs/first-asset)
4. [Explore the marketplace](/marketplace)

## Community

- [Discord](https://discord.gg/ai-context-studio) — Chat with developers
- [GitHub Discussions](https://github.com/ai-context-studio/ai-context-studio/discussions) — Questions, ideas, showcases
- [Contributing Guide](/community#contribute) — How to contribute

## License

MIT License — Free for personal and commercial use.`,
      contentHtml: null,
      categoryId: (await prisma.docCategory.findUnique({ where: { slug: "getting-started" } }))!.id,
      sortOrder: 1,
      isPublished: true,
      version: "1.2",
    },
    {
      slug: "getting-started",
      title: "Quick Start",
      description: "Get up and running in 5 minutes",
      content: `# Quick Start

Get AI Context Studio running in 5 minutes.

## 1. Download & Install

| Platform | Download |
|----------|----------|
| Windows | [NSIS Installer](https://github.com/ai-context-studio/releases/latest/download/ai-context-studio-setup.exe) / [Portable](https://github.com/ai-context-studio/releases/latest/download/ai-context-studio-portable.exe) |
| macOS | [Universal DMG](https://github.com/ai-context-studio/releases/latest/download/ai-context-studio-universal.dmg) |
| Linux | [AppImage](https://github.com/ai-context-studio/releases/latest/download/ai-context-studio.AppImage) / [DEB](https://github.com/ai-context-studio/releases/latest/download/ai-context-studio.deb) / [RPM](https://github.com/ai-context-studio/releases/latest/download/ai-context-studio.rpm) |

Verify checksums on the [download page](/download).

## 2. Launch & Welcome

Open the app. You'll see the welcome screen with:
- **Quick Start** — Guided setup
- **Open Workspace** — Existing projects
- **Marketplace** — Browse assets

Click **Quick Start**.

## 3. Configure Targets

Select which AI assistants you use:
- ☑️ Cursor
- ☑️ Claude Code
- ☑️ Windsurf
- ☐ VS Code
- ☐ GitHub Copilot
- ...and more

The app detects installed editors automatically.

## 4. Create Your First Asset

Let's create a **Skill** — an atomic AI capability.

1. Click **Skills** in the sidebar
2. Click **New Skill**
3. Fill in:
- **Name**: \`code-reviewer\`
    - **Description**: Reviews code for bugs and style
    - **Input**: Code snippet (string)
    - **Output**: Review comments (structured)
4. Write the prompt in the editor
5. Click **Save**

## 5. Export to Your Editor

1. Select your skill
2. Click **Export**
3. Choose targets (Cursor, Claude Code, etc.)
4. Click **Export All**

The app generates the appropriate config files in your project.

## 6. Test It

Open a file in Cursor, type \`// @code-reviewer\`, and watch the AI review your code!

## Next Steps

- [Explore the marketplace](/marketplace) for ready-made assets
- [Learn about instruction files](/docs/prompt-files)
- [Set up MCP servers](/docs/mcp)
- [Build a workflow](/docs/workflows)

## Troubleshooting

- **Export not working?** Check file permissions in target directories
- **App won't start?** See [installation troubleshooting](/docs/installation#troubleshooting)
- **Need help?** Join [Discord](https://discord.gg/ai-context-studio)`,
      contentHtml: null,
      categoryId: (await prisma.docCategory.findUnique({ where: { slug: "getting-started" } }))!.id,
      sortOrder: 2,
      isPublished: true,
      version: "1.2",
    },
    {
      slug: "installation",
      title: "Installation",
      description: "Detailed installation instructions for all platforms",
      content: `# Installation

Detailed installation guide for Windows, macOS, and Linux.

## System Requirements

| Platform | Minimum Version |
|----------|-----------------|
| Windows | Windows 10 1903+ (64-bit) |
| macOS | macOS 12+ (Monterey) — Universal binary supports Intel & Apple Silicon |
| Linux | glibc 2.31+, GTK 3.24+, WebKit2GTK 2.38+ |

## Windows

### NSIS Installer (Recommended)

1. Download \`ai-context-studio-setup.exe\`
2. Run the installer
3. Follow the setup wizard
4. Launch from Start Menu

### Portable Version

1. Download \`ai-context-studio-portable.exe\`
2. Place in desired folder
3. Run directly — no installation needed
4. All data stored in same folder

### Verify Checksum

\`\`\`powershell
certutil -hashfile ai-context-studio-setup.exe SHA256
\`\`\`

Compare with checksum on [releases page](https://github.com/ai-context-studio/releases).

## macOS

### Universal DMG (Recommended)

1. Download \`ai-context-studio-universal.dmg\`
2. Open DMG
3. Drag to Applications folder
4. Launch from Applications or Spotlight

### First Run (Gatekeeper)

If you see "app is damaged" or "unidentified developer":

\`\`\`bash
xattr -d com.apple.quarantine /Applications/AI\ Context\ Studio.app
\`\`\`

Or right-click → Open → Open.

Our releases are notarized by Apple.

### Verify Checksum

\`\`\`bash
shasum -a 256 ai-context-studio-universal.dmg
\`\`\`

### Verify Notarization

\`\`\`bash
spctl -a -v /Applications/AI\ Context\ Studio.app
\`\`\`

## Linux

### AppImage (Universal)

1. Download \`ai-context-studio.AppImage\`
2. Make executable: \`chmod +x ai-context-studio.AppImage\`
3. Run: \`./ai-context-studio.AppImage\`

Requires FUSE: \`sudo apt install fuse libfuse2\` (Debian/Ubuntu) or \`sudo dnf install fuse\` (Fedora).

### DEB Package (Debian/Ubuntu)

\`\`\`bash
sudo dpkg -i ai-context-studio.deb
sudo apt-get install -f
\`\`\`

### RPM Package (Fedora/RHEL/openSUSE)

\`\`\`bash
sudo rpm -i ai-context-studio.rpm
\`\`\`

### Tarball

\`\`\`bash
tar -xzf ai-context-studio.tar.gz
./ai-context-studio
\`\`\`

### Verify Checksum

\`\`\`bash
sha256sum ai-context-studio.AppImage
\`\`\`

### GPG Signature Verification

\`\`\`bash
gpg --verify ai-context-studio.AppImage.sig ai-context-studio.AppImage
\`\`\`

## Building from Source

\`\`\`bash
git clone https://github.com/ai-context-studio/ai-context-studio.git
cd ai-context-studio/desktop
npm install
npm run build
npm run tauri build
\`\`\`

Requirements: Node.js 20+, Rust 1.77+, system dependencies.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| macOS "app is damaged" | \`xattr -d com.apple.quarantine\` |
| Linux AppImage fails | Install FUSE: \`sudo apt install fuse libfuse2\` |
| Windows SmartScreen | Click "More info" → "Run anyway" |
| Export to Cursor fails | Check \`~/.cursor/rules/\` permissions |

See [FAQ](/faq#installation) for more.`,
      contentHtml: null,
      categoryId: (await prisma.docCategory.findUnique({ where: { slug: "getting-started" } }))!.id,
      sortOrder: 3,
      isPublished: true,
      version: "1.2",
    },
  ];

  for (const page of docPages) {
    const existing = await prisma.docPage.findUnique({ where: { slug: page.slug } });
    if (existing) continue;

    await prisma.docPage.create({
      data: page,
    });
    console.log(`✅ Doc page created: ${page.title}`);
  }

  console.log("✅ Documentation created");

  // ============================================
  // RELEASES
  // ============================================
  const releases = [
    {
      version: "1.2.0",
      title: "v1.2.0 — MCP Servers, Agent Orchestration, Plugin SDK",
      description: `## Highlights

### MCP Server Support
Full Model Context Protocol integration. Configure, validate, and export MCP servers for any compatible client.

### Agent Orchestration (Beta)
Multi-agent workflows with routing, shared memory, tool use, and evaluation harness.

### Plugin SDK
TypeScript SDK for custom exporters, validators, and UI extensions.

## Other Improvements

- Workflow engine: 3x performance improvement
- Memory system: persistent vector embeddings
- Prompt optimizer: new cost reduction engine
- 50+ bug fixes

## Assets

| Platform | File | Size | SHA256 |
|----------|------|------|--------|
| Windows | ai-context-studio-1.2.0-x64-setup.exe | 48 MB | \`sha256:...\` |
| Windows | ai-context-studio-1.2.0-x64-portable.exe | 45 MB | \`sha256:...\` |
| macOS | ai-context-studio-1.2.0-universal.dmg | 55 MB | \`sha256:...\` |
| macOS | ai-context-studio-1.2.0-arm64.dmg | 51 MB | \`sha256:...\` |
| Linux | ai-context-studio-1.2.0-x64.AppImage | 51 MB | \`sha256:...\` |
| Linux | ai-context-studio-1.2.0-x64.deb | 47 MB | \`sha256:...\` |
| Linux | ai-context-studio-1.2.0-x64.rpm | 47 MB | \`sha256:...\` |
| Source | ai-context-studio-1.2.0-source.tar.gz | 42 MB | \`sha256:...\` `,
      isPrerelease: false,
      isDraft: false,
      publishedAt: new Date("2024-08-15"),
      assets: [
        { platform: "WINDOWS_X64", arch: "x64", filename: "ai-context-studio-1.2.0-x64-setup.exe", size: 48_000_000, checksum: "sha256:a1b2c3d4e5f6...", url: "https://github.com/ai-context-studio/releases/download/v1.2.0/ai-context-studio-1.2.0-x64-setup.exe", signature: "sig", isRecommended: true },
        { platform: "WINDOWS_X64", arch: "x64", filename: "ai-context-studio-1.2.0-x64-portable.exe", size: 45_000_000, checksum: "sha256:f6e5d4c3b2a1...", url: "https://github.com/ai-context-studio/releases/download/v1.2.0/ai-context-studio-1.2.0-x64-portable.exe", signature: "sig", isRecommended: false },
        { platform: "MACOS_UNIVERSAL", arch: "universal", filename: "ai-context-studio-1.2.0-universal.dmg", size: 55_000_000, checksum: "sha256:b2c3d4e5f6a1...", url: "https://github.com/ai-context-studio/releases/download/v1.2.0/ai-context-studio-1.2.0-universal.dmg", signature: "sig", isRecommended: true },
        { platform: "MACOS_ARM64", arch: "arm64", filename: "ai-context-studio-1.2.0-arm64.dmg", size: 51_000_000, checksum: "sha256:c3d4e5f6a1b2...", url: "https://github.com/ai-context-studio/releases/download/v1.2.0/ai-context-studio-1.2.0-arm64.dmg", signature: "sig", isRecommended: false },
        { platform: "LINUX_X64", arch: "x64", filename: "ai-context-studio-1.2.0-x64.AppImage", size: 51_000_000, checksum: "sha256:d4e5f6a1b2c3...", url: "https://github.com/ai-context-studio/releases/download/v1.2.0/ai-context-studio-1.2.0-x64.AppImage", signature: "sig", isRecommended: true },
        { platform: "LINUX_X64", arch: "x64", filename: "ai-context-studio-1.2.0-x64.deb", size: 47_000_000, checksum: "sha256:e5f6a1b2c3d4...", url: "https://github.com/ai-context-studio/releases/download/v1.2.0/ai-context-studio-1.2.0-x64.deb", signature: "sig", isRecommended: false },
        { platform: "LINUX_X64", arch: "x64", filename: "ai-context-studio-1.2.0-x64.rpm", size: 47_000_000, checksum: "sha256:f6a1b2c3d4e5...", url: "https://github.com/ai-context-studio/releases/download/v1.2.0/ai-context-studio-1.2.0-x64.rpm", signature: "sig", isRecommended: false },
        { platform: "SOURCE_CODE", arch: "source", filename: "ai-context-studio-1.2.0-source.tar.gz", size: 42_000_000, checksum: "sha256:a1b2c3d4e5f6...", url: "https://github.com/ai-context-studio/releases/download/v1.2.0/ai-context-studio-1.2.0-source.tar.gz", signature: "sig", isRecommended: false },
      ],
    },
    {
      version: "1.1.0",
      title: "v1.1.0 — Workflow Engine, Memory System, Prompt Optimizer",
      description: `## Highlights

### Visual Workflow Builder
Drag-and-drop workflow construction with real-time preview.

### Persistent Agent Memories
Memories now persist across sessions with vector embeddings for semantic search.

### AI-Powered Prompt Optimization
Automatic prompt improvement via evaluation, iteration, and A/B testing.

### Improved MCP Manager
Better validation, sandboxing, and cross-editor config export.

## Assets

| Platform | File | Size | SHA256 |
|----------|------|------|--------|
| Windows | ai-context-studio-1.1.0-x64-setup.exe | 46 MB | \`sha256:...\` |
| macOS | ai-context-studio-1.1.0-universal.dmg | 52 MB | \`sha256:...\` |
| Linux | ai-context-studio-1.1.0-x64.AppImage | 49 MB | \`sha256:...\` `,
      isPrerelease: false,
      isDraft: false,
      publishedAt: new Date("2024-06-15"),
      assets: [
        { platform: "WINDOWS_X64", arch: "x64", filename: "ai-context-studio-1.1.0-x64-setup.exe", size: 46_000_000, checksum: "sha256:a1b2c3d4e5f6...", url: "https://github.com/ai-context-studio/releases/download/v1.1.0/ai-context-studio-1.1.0-x64-setup.exe", signature: "sig", isRecommended: true },
        { platform: "MACOS_UNIVERSAL", arch: "universal", filename: "ai-context-studio-1.1.0-universal.dmg", size: 52_000_000, checksum: "sha256:b2c3d4e5f6a1...", url: "https://github.com/ai-context-studio/releases/download/v1.1.0/ai-context-studio-1.1.0-universal.dmg", signature: "sig", isRecommended: true },
        { platform: "LINUX_X64", arch: "x64", filename: "ai-context-studio-1.1.0-x64.AppImage", size: 49_000_000, checksum: "sha256:c3d4e5f6a1b2...", url: "https://github.com/ai-context-studio/releases/download/v1.1.0/ai-context-studio-1.1.0-x64.AppImage", signature: "sig", isRecommended: true },
      ],
    },
    {
      version: "1.0.0",
      title: "v1.0.0 — Initial Stable Release",
      description: `## Highlights

### Complete Workspace
Dashboard, Prompt Library, Prompt Engine, Personas, Skills, Workflows, Memories, MCP Manager.

### Asset Validator & Prompt Optimizer
Built-in validation and AI-powered optimization.

### Export to 10+ Targets
Cursor, Claude Code, Windsurf, VS Code, Copilot, Codex, Continue, Roo, OpenCode, Generic.

### Marketplace Browser
300+ community assets.

### Local-First, Offline-Capable, No Telemetry
Your data never leaves your machine.

## Assets

| Platform | File | Size | SHA256 |
|----------|------|------|--------|
| Windows | ai-context-studio-1.0.0-x64-setup.exe | 45 MB | \`sha256:a1b2c3d4e5f6...\` |
| macOS | ai-context-studio-1.0.0-universal.dmg | 52 MB | \`sha256:b2c3d4e5f6a1...\` |
| Linux | ai-context-studio-1.0.0-x64.AppImage | 48 MB | \`sha256:c3d4e5f6a1b2...\` `,
      isPrerelease: false,
      isDraft: false,
      publishedAt: new Date("2024-02-15"),
      assets: [
        { platform: "WINDOWS_X64", arch: "x64", filename: "ai-context-studio-1.0.0-x64-setup.exe", size: 45_000_000, checksum: "sha256:a1b2c3d4e5f6...", url: "https://github.com/ai-context-studio/releases/download/v1.0.0/ai-context-studio-1.0.0-x64-setup.exe", signature: "sig", isRecommended: true },
        { platform: "MACOS_UNIVERSAL", arch: "universal", filename: "ai-context-studio-1.0.0-universal.dmg", size: 52_000_000, checksum: "sha256:b2c3d4e5f6a1...", url: "https://github.com/ai-context-studio/releases/download/v1.0.0/ai-context-studio-1.0.0-universal.dmg", signature: "sig", isRecommended: true },
        { platform: "LINUX_X64", arch: "x64", filename: "ai-context-studio-1.0.0-x64.AppImage", size: 48_000_000, checksum: "sha256:c3d4e5f6a1b2...", url: "https://github.com/ai-context-studio/releases/download/v1.0.0/ai-context-studio-1.0.0-x64.AppImage", signature: "sig", isRecommended: true },
      ],
    },
  ];

  for (const release of releases) {
    const { assets, ...releaseData } = release;
    const existing = await prisma.release.findUnique({ where: { version: releaseData.version } });
    if (existing) continue;

    const created = await prisma.release.create({
      data: {
        ...releaseData,
        assets: { create: assets },
      },
    });
    console.log(`✅ Release created: ${created.version}`);
  }

  console.log("✅ Releases created");

  // ============================================
  // SECURITY ADVISORIES
  // ============================================
  const advisories = [
    {
      cveId: "CVE-2024-1234",
      ghsaId: "GHSA-xxxx-xxxx-xxxx",
      title: "Path Traversal in Asset Import",
      description: "A path traversal vulnerability in the asset import functionality could allow overwriting arbitrary files on the system when importing a maliciously crafted .acs package.",
      severity: "HIGH",
      cvssScore: 7.5,
      cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:H/A:N",
      affectedVersions: ["< 1.1.1"],
      patchedVersions: [">= 1.1.1"],
      status: "PUBLISHED",
      publishedAt: new Date("2024-05-20"),
      references: [
        { type: "FIX", url: "https://github.com/ai-context-studio/ai-context-studio/pull/1234" },
        { type: "ADVISORY", url: "https://github.com/ai-context-studio/ai-context-studio/security/advisories/GHSA-xxxx-xxxx-xxxx" },
      ],
    },
    {
      cveId: "CVE-2024-5678",
      ghsaId: "GHSA-yyyy-yyyy-yyyy",
      title: "XSS in Marketplace Asset Description",
      description: "Stored XSS via asset description field when rendered without proper sanitization in the marketplace detail page.",
      severity: "MEDIUM",
      cvssScore: 5.4,
      cvssVector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:L/I:L/A:N",
      affectedVersions: ["< 1.0.5"],
      patchedVersions: [">= 1.0.5"],
      status: "PUBLISHED",
      publishedAt: new Date("2024-03-10"),
      references: [
        { type: "FIX", url: "https://github.com/ai-context-studio/ai-context-studio/pull/987" },
      ],
    },
  ];

  for (const adv of advisories) {
    const existing = await prisma.securityAdvisory.findUnique({ where: { cveId: adv.cveId } });
    if (existing) continue;

    await prisma.securityAdvisory.create({
      data: adv,
    });
    console.log(`✅ Security advisory created: ${adv.cveId}`);
  }

  console.log("✅ Security advisories created");

  // ============================================
  // AUDIT REPORTS
  // ============================================
  await prisma.auditReport.upsert({
    where: { id: "audit-2024-q2" },
    update: {},
    create: {
      id: "audit-2024-q2",
      title: "Q2 2024 Security Audit — Trail of Bits",
      description: "Comprehensive security assessment of AI Context Studio v1.1 including desktop application, marketplace API, and MCP server implementations.",
      auditor: "Trail of Bits",
      reportUrl: "https://github.com/ai-context-studio/security-audits/blob/main/2024-q2-trailofbits.pdf",
      findings: [
        { severity: "LOW", title: "Information Disclosure in Error Messages", description: "Stack traces could leak internal paths in development mode.", status: "FIXED" },
        { severity: "LOW", title: "CSP Header Missing on Static Assets", description: "Content Security Policy not applied to all static assets.", status: "FIXED" },
        { severity: "INFO", title: "Dependency Version Pinning", description: "Recommend pinning all dependencies to exact versions.", status: "ADDRESSED" },
        { severity: "INFO", title: "Rate Limiting on Auth Endpoints", description: "Additional rate limiting recommended for login/registration.", status: "ADDRESSED" },
        { severity: "INFO", title: "Enhanced Audit Logging", description: "More detailed audit logging for sensitive operations.", status: "ADDRESSED" },
        { severity: "INFO", title: "Input Validation on File Paths", description: "Stricter validation for file path inputs.", status: "ADDRESSED" },
        { severity: "INFO", title: "MCP Server Sandboxing Defaults", description: "More secure defaults for MCP server execution sandbox.", status: "ADDRESSED" },
      ],
      publishedAt: new Date("2024-07-28"),
    },
  });

  console.log("✅ Audit report created");

  // ============================================
  // FEATURE FLAGS
  // ============================================
  const flags = [
    { key: "marketplace_purchase", name: "Marketplace Purchases", description: "Enable paid asset purchases via Stripe", enabled: false, rollout: 0 },
    { key: "cloud_sync", name: "Cloud Sync", description: "Enable cross-device sync (beta)", enabled: false, rollout: 5 },
    { key: "agent_orchestration", name: "Agent Orchestration", description: "Enable multi-agent workflows (beta)", enabled: true, rollout: 25 },
    { key: "plugin_sdk", name: "Plugin SDK", description: "Enable plugin development SDK", enabled: true, rollout: 100 },
    { key: "mcp_marketplace", name: "MCP Marketplace", description: "Browse and install MCP servers from marketplace", enabled: true, rollout: 100 },
    { key: "analytics_dashboard", name: "Creator Analytics", description: "Analytics dashboard for asset creators", enabled: false, rollout: 0 },
    { key: "enterprise_sso", name: "Enterprise SSO", description: "SAML/OIDC SSO for enterprise customers", enabled: false, rollout: 0 },
  ];

  for (const flag of flags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: {},
      create: flag,
    });
  }

  console.log("✅ Feature flags created");

  // ============================================
  // SEO PAGES
  // ============================================
  const seoPages = [
    { path: "/", title: "AI Context Studio", description: "Build, customize, manage, and export AI instruction assets for multiple AI coding assistants. Local-first, offline-first, no auth required.", ogTitle: "AI Context Studio", ogDescription: "Local-first prompt engineering studio for AI coding assistants.", ogImage: "https://aicontextstudio.dev/og-home.png", twitterCard: "summary_large_image", robots: "index, follow" },
    { path: "/marketplace", title: "Marketplace — AI Context Studio", description: "Discover, install, and publish community AI assets — skills, personas, templates, prompt packs, workflows, and MCP servers.", ogTitle: "Marketplace — AI Context Studio", ogDescription: "Browse 10,000+ community AI assets.", ogImage: "https://aicontextstudio.dev/og-marketplace.png", twitterCard: "summary_large_image", robots: "index, follow" },
    { path: "/download", title: "Download — AI Context Studio", description: "Download AI Context Studio for Windows, macOS, and Linux. Native installers, portable versions, and source code.", ogTitle: "Download — AI Context Studio", ogDescription: "Native apps for Windows, macOS, and Linux.", ogImage: "https://aicontextstudio.dev/og-download.png", twitterCard: "summary_large_image", robots: "index, follow" },
    { path: "/docs", title: "Documentation — AI Context Studio", description: "Complete documentation for AI Context Studio. Getting Started, Desktop App, Marketplace, Registry, MCP, Skills, Prompt Files, API Keys, Security, Developer Guide, Architecture.", ogTitle: "Documentation — AI Context Studio", ogDescription: "Full documentation with guides, API reference, and examples.", ogImage: "https://aicontextstudio.dev/og-docs.png", twitterCard: "summary_large_image", robots: "index, follow" },
    { path: "/blog", title: "Blog & Updates — AI Context Studio", description: "Latest news, release notes, announcements, development logs, tutorials, and community showcases from AI Context Studio.", ogTitle: "Blog & Updates — AI Context Studio", ogDescription: "Release notes, announcements, tutorials, and showcases.", ogImage: "https://aicontextstudio.dev/og-blog.png", twitterCard: "summary_large_image", robots: "index, follow" },
    { path: "/security", title: "Security — AI Context Studio", description: "Security policy, responsible disclosure, CVE history, audit reports, and security best practices for AI Context Studio.", ogTitle: "Security — AI Context Studio", ogDescription: "Security policy, audits, and responsible disclosure.", ogImage: "https://aicontextstudio.dev/og-security.png", twitterCard: "summary_large_image", robots: "index, follow" },
    { path: "/roadmap", title: "Roadmap — AI Context Studio", description: "Transparent roadmap with completed, in-progress, planned, and future features. Vote on priorities and track progress.", ogTitle: "Roadmap — AI Context Studio", ogDescription: "Public roadmap with community voting.", ogImage: "https://aicontextstudio.dev/og-roadmap.png", twitterCard: "summary_large_image", robots: "index, follow" },
    { path: "/community", title: "Community — AI Context Studio", description: "Join the AI Context Studio community. Discord, GitHub Discussions, contributors, creators, showcases, and events.", ogTitle: "Community — AI Context Studio", ogDescription: "Discord, GitHub, contributors, and showcases.", ogImage: "https://aicontextstudio.dev/og-community.png", twitterCard: "summary_large_image", robots: "index, follow" },
    { path: "/registry", title: "Registry — AI Context Studio", description: "Open specification for AI asset packaging, versioning, dependencies, and compatibility. Reference implementation in Rust.", ogTitle: "Registry — AI Context Studio", ogDescription: "Asset packaging specification and reference implementation.", ogImage: "https://aicontextstudio.dev/og-registry.png", twitterCard: "summary_large_image", robots: "index, follow" },
    { path: "/products", title: "Products — AI Context Studio", description: "Desktop App, Online Hub (coming soon), Marketplace, Registry, Community, and Future Cloud platform.", ogTitle: "Products — AI Context Studio", ogDescription: "Desktop App, Marketplace, Registry, and more.", ogImage: "https://aicontextstudio.dev/og-products.png", twitterCard: "summary_large_image", robots: "index, follow" },
    { path: "/faq", title: "FAQ — AI Context Studio", description: "Frequently asked questions about AI Context Studio. General, Installation, Usage, Marketplace, Development, Troubleshooting.", ogTitle: "FAQ — AI Context Studio", ogDescription: "Answers to common questions.", ogImage: "https://aicontextstudio.dev/og-faq.png", twitterCard: "summary_large_image", robots: "index, follow" },
  ];

  for (const page of seoPages) {
    await prisma.seoPage.upsert({
      where: { path: page.path },
      update: {},
      create: page,
    });
  }

  console.log("✅ SEO pages created");

  // ============================================
  // NEWSLETTER
  // ============================================
  // Just ensure table exists - subscribers will come from the newsletter form

  console.log("✅ Database seed completed successfully!");
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    🎉 SEED COMPLETE 🎉                       ║
╠══════════════════════════════════════════════════════════════╣
║  Users:          3 (admin, demo, 2 creators)                ║
║  Categories:     9                                           ║
║  Tags:           30                                          ║
║  Assets:         8 (skills, personas, templates, etc.)      ║
║  Blog Posts:     3                                           ║
║  Doc Categories: 11                                          ║
║  Doc Pages:      3                                           ║
║  Releases:       3 (v1.0.0, v1.1.0, v1.2.0)                 ║
║  Roadmap Items:  10                                          ║
║  Security Advis: 2                                           ║
║  Audit Reports:  1                                           ║
║  Feature Flags:  7                                           ║
║  SEO Pages:      11                                          ║
╚══════════════════════════════════════════════════════════════╝

Test accounts:
  admin@aicontextstudio.dev / password123 (OWNER)
  demo@aicontextstudio.dev / password123 (USER)
  creator@aicontextstudio.dev / password123 (USER)
  marcus@aicontextstudio.dev / password123 (USER)
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });