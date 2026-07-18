import type { Workflow, WorkflowStep, WorkflowId } from "./types";

/**
 * Seed workflows for quick start
 */
const SEED_WORKFLOWS: Workflow[] = [
  {
    id: "code-review",
    name: "Code Review Pipeline",
    description: "Automated code review with security, style, and architecture checks",
    version: 1,
    steps: [
      {
        id: "lint",
        type: "skill",
        name: "Lint & Format",
        description: "Run linter and formatter on changed files",
        skillId: "lint-format",
        skillConfig: { fix: true },
      },
      {
        id: "security",
        type: "skill",
        name: "Security Scan",
        description: "Run static analysis for security vulnerabilities",
        skillId: "security-scan",
        dependsOn: ["lint"],
      },
      {
        id: "tests",
        type: "skill",
        name: "Run Tests",
        description: "Execute unit and integration tests",
        skillId: "run-tests",
        dependsOn: ["lint"],
      },
      {
        id: "review",
        type: "approval",
        name: "Human Review",
        description: "Code owner reviews changes",
        approvers: ["code-owners"],
        dependsOn: ["security", "tests"],
      },
      {
        id: "merge",
        type: "skill",
        name: "Auto Merge",
        description: "Merge PR after all checks pass",
        skillId: "auto-merge",
        dependsOn: ["review"],
      },
    ],
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      tags: ["code-review", "automation", "ci/cd"],
      isCustom: false,
    },
  },
  {
    id: "feature-development",
    name: "Feature Development",
    description: "End-to-end feature development from spec to deployment",
    version: 1,
    steps: [
      {
        id: "spec",
        type: "skill",
        name: "Generate Spec",
        description: "Create technical specification from requirements",
        skillId: "generate-spec",
      },
      {
        id: "design",
        type: "approval",
        name: "Design Review",
        description: "Team reviews technical design",
        approvers: ["tech-lead", "architect"],
        dependsOn: ["spec"],
      },
      {
        id: "implement",
        type: "parallel",
        name: "Implementation",
        description: "Develop frontend and backend in parallel",
        branches: [
          [
            {
              id: "backend",
              type: "skill",
              name: "Backend Implementation",
              skillId: "backend-dev",
            },
            {
              id: "backend-tests",
              type: "skill",
              name: "Backend Tests",
              skillId: "write-tests",
              dependsOn: ["backend"],
            },
          ],
          [
            {
              id: "frontend",
              type: "skill",
              name: "Frontend Implementation",
              skillId: "frontend-dev",
            },
            {
              id: "frontend-tests",
              type: "skill",
              name: "Frontend Tests",
              skillId: "write-tests",
              dependsOn: ["frontend"],
            },
          ],
        ],
        dependsOn: ["design"],
      },
      {
        id: "integration",
        type: "skill",
        name: "Integration Testing",
        description: "Run integration tests across services",
        skillId: "integration-tests",
        dependsOn: ["implement"],
      },
      {
        id: "deploy-staging",
        type: "skill",
        name: "Deploy to Staging",
        skillId: "deploy-staging",
        dependsOn: ["integration"],
      },
      {
        id: "qa",
        type: "approval",
        name: "QA Sign-off",
        description: "Quality assurance review",
        approvers: ["qa-lead"],
        dependsOn: ["deploy-staging"],
      },
      {
        id: "deploy-prod",
        type: "skill",
        name: "Production Deployment",
        skillId: "deploy-prod",
        dependsOn: ["qa"],
      },
    ],
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      tags: ["feature", "development", "full-stack"],
      isCustom: false,
    },
  },
  {
    id: "bug-fix",
    name: "Bug Fix Pipeline",
    description: "Rapid bug fix workflow with regression testing",
    version: 1,
    steps: [
      {
        id: "reproduce",
        type: "skill",
        name: "Reproduce Bug",
        description: "Create failing test case for the bug",
        skillId: "write-test",
      },
      {
        id: "fix",
        type: "skill",
        name: "Implement Fix",
        description: "Implement minimal fix for the bug",
        skillId: "refactor",
        dependsOn: ["reproduce"],
      },
      {
        id: "regression",
        type: "skill",
        name: "Regression Tests",
        description: "Run full test suite to check for regressions",
        skillId: "run-tests",
        dependsOn: ["fix"],
      },
      {
        id: "deploy",
        type: "skill",
        name: "Hotfix Deploy",
        description: "Deploy hotfix to production",
        skillId: "deploy-hotfix",
        dependsOn: ["regression"],
      },
    ],
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      tags: ["bug-fix", "hotfix", "rapid"],
      isCustom: false,
    },
  },
  {
    id: "refactoring",
    name: "Refactoring Pipeline",
    description: "Safe refactoring with incremental validation",
    version: 1,
    steps: [
      {
        id: "analyze",
        type: "skill",
        name: "Code Analysis",
        description: "Analyze code for refactoring opportunities",
        skillId: "code-analysis",
      },
      {
        id: "plan",
        type: "approval",
        name: "Refactor Plan Review",
        description: "Team reviews refactoring plan",
        approvers: ["tech-lead"],
        dependsOn: ["analyze"],
      },
      {
        id: "refactor",
        type: "loop",
        name: "Incremental Refactoring",
        description: "Refactor in small increments with validation",
        loopCondition: "more_refactoring_needed",
        loopBody: [
          {
            id: "refactor-step",
            type: "skill",
            name: "Apply Refactor",
            skillId: "refactor",
          },
          {
            id: "validate",
            type: "skill",
            name: "Run Tests",
            skillId: "run-tests",
            dependsOn: ["refactor-step"],
          },
        ],
        dependsOn: ["plan"],
      },
      {
        id: "verify",
        type: "skill",
        name: "Final Validation",
        description: "Full test suite and manual verification",
        skillId: "run-tests",
        dependsOn: ["refactor"],
      },
    ],
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      tags: ["refactoring", "technical-debt", "maintenance"],
      isCustom: false,
    },
  },
  {
    id: "documentation",
    name: "Documentation Pipeline",
    description: "Generate and maintain documentation from code",
    version: 1,
    steps: [
      {
        id: "extract",
        type: "skill",
        name: "Extract API Specs",
        description: "Generate OpenAPI specs from code",
        skillId: "generate-docs",
      },
      {
        id: "generate",
        type: "parallel",
        name: "Generate Docs",
        branches: [
          [
            {
              id: "api-docs",
              type: "skill",
              name: "API Reference",
              skillId: "generate-api-docs",
            },
          ],
          [
            {
              id: "guides",
              type: "skill",
              name: "User Guides",
              skillId: "write-docs",
            },
          ],
          [
            {
              id: "readme",
              type: "skill",
              name: "README Updates",
              skillId: "update-readme",
            },
          ],
        ],
      },
      {
        id: "review",
        type: "approval",
        name: "Docs Review",
        approvers: ["tech-writer"],
        dependsOn: ["generate"],
      },
      {
        id: "publish",
        type: "skill",
        name: "Publish Docs",
        skillId: "publish-docs",
        dependsOn: ["review"],
      },
    ],
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      tags: ["documentation", "api", "technical-writing"],
      isCustom: false,
    },
  },
  {
    id: "deployment",
    name: "Deployment Pipeline",
    description: "Multi-environment deployment with validation gates",
    version: 1,
    steps: [
      {
        id: "build",
        type: "skill",
        name: "Build Artifacts",
        skillId: "build",
      },
      {
        id: "test",
        type: "skill",
        name: "Full Test Suite",
        skillId: "run-tests",
        dependsOn: ["build"],
      },
      {
        id: "security",
        type: "skill",
        name: "Security Scan",
        skillId: "security-scan",
        dependsOn: ["build"],
      },
      {
        id: "deploy-dev",
        type: "skill",
        name: "Deploy to Dev",
        skillId: "deploy-dev",
        dependsOn: ["test", "security"],
      },
      {
        id: "smoke-dev",
        type: "skill",
        name: "Smoke Tests Dev",
        skillId: "smoke-tests",
        dependsOn: ["deploy-dev"],
      },
      {
        id: "approval-staging",
        type: "approval",
        name: "Staging Approval",
        approvers: ["release-manager"],
        dependsOn: ["smoke-dev"],
      },
      {
        id: "deploy-staging",
        type: "skill",
        name: "Deploy Staging",
        skillId: "deploy-staging",
        dependsOn: ["approval-staging"],
      },
      {
        id: "e2e-staging",
        type: "skill",
        name: "E2E Tests Staging",
        skillId: "e2e-tests",
        dependsOn: ["deploy-staging"],
      },
      {
        id: "approval-prod",
        type: "approval",
        name: "Production Approval",
        approvers: ["cto", "release-manager"],
        dependsOn: ["e2e-staging"],
      },
      {
        id: "deploy-prod",
        type: "skill",
        name: "Deploy Production",
        skillId: "deploy-prod",
        dependsOn: ["approval-prod"],
      },
      {
        id: "monitor",
        type: "skill",
        name: "Post-Deploy Monitoring",
        skillId: "monitor",
        dependsOn: ["deploy-prod"],
      },
    ],
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      tags: ["deployment", "ci/cd", "release"],
      isCustom: false,
    },
  },
];

/**
 * Blueprint definitions for workflow generation
 */
export const WORKFLOW_BLUEPRINTS: any[] = [
  // Similar blueprints could be defined here
];

/**
 * Render a workflow blueprint from answers
 */
export function renderWorkflowBlueprint(kind: string, answers: any): string | null {
  // Implementation would go here
  return null;
}

/**
 * Enhance workflow with AI
 */
export async function enhanceWorkflowWithAI(kind: string, answers: any): Promise<string | null> {
  // Implementation would call AI provider
  return null;
}

export { SEED_WORKFLOWS };