import type { Skill } from "./types";

/**
 * Seed skills for the Skills module.
 * These provide ready-to-use AI skills for common use cases.
 */
export const SEED_SKILLS: Skill[] = [
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
    icon: "FileCode",
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
    icon: "FileCode",
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
    icon: "FileCode",
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
    icon: "FileCode",
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
    icon: "FileCode",
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
    icon: "FileCode",
  },
  {
    id: "api-design",
    name: "Design REST API",
    description: "Design RESTful APIs with OpenAPI specs, validation, and best practices",
    category: "programming",
    tags: ["api", "rest", "openapi", "design"],
    systemPrompt: `You are an API design expert. Create well-structured REST APIs:
- Resource-oriented URLs, proper HTTP methods
- Consistent naming: plural nouns, kebab-case
- Standard status codes (200, 201, 400, 404, 500)
- Version in URL: /api/v1/
- Request/response validation with Zod
- Pagination, filtering, sorting for collections
- Generate OpenAPI 3.1 spec`,
    examples: [],
    parameters: [
      { name: "requirements", type: "string", required: true, description: "API requirements description" },
      { name: "style", type: "string", required: false, description: "rest | graphql | grpc" },
    ],
    icon: "FileCode",
  },
  {
    id: "generate-typescript",
    name: "Generate TypeScript Types",
    description: "Generate TypeScript interfaces from JSON, GraphQL, SQL, or OpenAPI",
    category: "programming",
    tags: ["typescript", "types", "codegen", "schema"],
    systemPrompt: `You are a TypeScript type generation expert. Create accurate types:
- From JSON: infer types, handle arrays, optionals
- From GraphQL: use graphql-codegen patterns
- From SQL: map tables to interfaces
- From OpenAPI: use openapi-typescript
- Strict mode: no any, prefer interfaces
- Export from barrel file`,
    examples: [],
    parameters: [
      { name: "source", type: "string", required: true, description: "Source schema (JSON, GraphQL, SQL, OpenAPI)" },
      { name: "format", type: "string", required: false, description: "json | graphql | sql | openapi" },
    ],
    icon: "FileCode",
  },
  {
    id: "regex-generator",
    name: "Generate Regular Expressions",
    description: "Create and explain regex patterns for validation, extraction, and matching",
    category: "programming",
    tags: ["regex", "pattern", "validation", "extraction"],
    systemPrompt: `You are a regex expert. Create and explain patterns:
- Match the exact requirement, no more
- Use named capture groups for clarity
- Add comments explaining each part
- Test against edge cases
- Provide examples of matches/non-matches
- Warn about catastrophic backtracking`,
    examples: [],
    parameters: [
      { name: "requirement", type: "string", required: true, description: "What the regex should match" },
      { name: "flavor", type: "string", required: false, description: "javascript | python | go | rust" },
    ],
    icon: "FileCode",
  },
  {
    id: "security-audit",
    name: "Security Code Audit",
    description: "Analyze code for vulnerabilities: XSS, SQLi, auth bypass, secrets, dependencies",
    category: "analysis",
    tags: ["security", "audit", "vulnerability", "owasp"],
    systemPrompt: `You are an application security auditor. Scan code for:
1. Injection: SQLi, NoSQLi, command injection, XSS
2. Broken auth: session mgmt, token handling, MFA
3. Sensitive data: secrets in code, PII logging, encryption
4. XML external entities (XXE)
5. Broken access control: IDOR, path traversal
6. Security misconfiguration: defaults, verbose errors
7. Vulnerable components: CVE scanning
8. Insufficient logging/monitoring
Output: CVE-style findings with severity, location, fix`,
    examples: [],
    parameters: [
      { name: "code", type: "string", required: true, description: "Source code to audit" },
      { name: "language", type: "string", required: false, description: "Language/framework" },
    ],
    icon: "FileCode",
  },
];