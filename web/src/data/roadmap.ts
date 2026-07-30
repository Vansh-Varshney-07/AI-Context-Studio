export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "planned" | "future";
  quarter?: string;
  tags: string[];
  details?: string;
  links?: Array<{ label: string; href: string }>;
}

export interface RoadmapPhase {
  phase: string;
  status: "completed" | "in-progress" | "planned" | "future";
  items: RoadmapItem[];
}

export const roadmapPhases: RoadmapPhase[] = [
  {
    phase: "Completed",
    status: "completed",
    items: [
      {
        id: "desktop-v1",
        title: "Desktop App v1.0",
        description: "Core workspace with system prompts, instruction files, memories, MCP, workflows, and export to 10+ targets.",
        status: "completed",
        quarter: "Q1 2024",
        tags: ["Desktop", "Tauri", "Next.js", "React"],
        details: "Initial release with full workspace: dashboard, prompt library, system prompt engine, personas, skills, workflows, memories, MCP manager, asset validator, prompt optimizer, settings, and search.",
        links: [{ label: "Release Notes", href: "/changelog#v1.0.0" }],
      },
      {
        id: "marketplace-frontend",
        title: "Marketplace Frontend",
        description: "Browse, search, and filter assets with categories, compatibility badges, ratings, and install commands.",
        status: "completed",
        quarter: "Q2 2024",
        tags: ["Web", "Marketplace", "Search"],
        details: "Static marketplace browser with 10 categories, advanced filters (type, verified, compatibility, sort), asset detail pages with screenshots, version history, and one-click install commands.",
        links: [{ label: "Browse Marketplace", href: "/marketplace" }],
      },
      {
        id: "registry-spec",
        title: "Registry Specification",
        description: "Open specification for AI asset packaging: manifest schema, semantic versioning, dependencies, compatibility matrix, and checksums.",
        status: "completed",
        quarter: "Q2 2024",
        tags: ["Registry", "Schema", "Standards"],
        details: "Versioned manifest.json schema with asset metadata, dependencies, target compatibility, and integrity verification. Reference implementation in Rust (registry crate).",
        links: [{ label: "View Spec", href: "/registry" }, { label: "Rust Crate", href: "https://crates.io/crates/ai-context-studio-registry" }],
      },
      {
        id: "docs-site",
        title: "Documentation Site",
        description: "Complete documentation with Getting Started, Installation, Desktop, Marketplace, Registry, MCP, Skills, Prompt Files, API Keys, Security, Developer Guide, and Architecture.",
        status: "completed",
        quarter: "Q2 2024",
        tags: ["Docs", "Next.js", "MDX"],
        details: "Full documentation site with sidebar navigation, table of contents, code blocks with copy buttons, callouts, version badges, and search integration.",
        links: [{ label: "Read Docs", href: "/docs" }],
      },
    ],
  },
  {
    phase: "In Progress",
    status: "in-progress",
    items: [
      {
        id: "online-hub",
        title: "Online Hub (Sync & Collaboration)",
        description: "Cross-device sync, team workspaces, shared collections, version history, and access controls for cloud-backed asset management.",
        status: "in-progress",
        quarter: "Q3 2024",
        tags: ["Cloud", "Sync", "Teams", "PostgreSQL"],
        details: "End-to-end encrypted sync using client-side encryption. Team workspaces with role-based access. Conflict resolution for concurrent edits. Offline-first with background sync.",
        links: [{ label: "Track Progress", href: "https://github.com/ai-context-studio/hub" }],
      },
      {
        id: "plugin-sdk",
        title: "Plugin SDK",
        description: "TypeScript SDK for building custom exporters, validators, integrations, and UI extensions. Includes CLI scaffolding and publishing workflow.",
        status: "in-progress",
        quarter: "Q3 2024",
        tags: ["SDK", "TypeScript", "Plugin System", "CLI"],
        details: "Declarative plugin manifest, hook system for build/export/validate lifecycle, TypeScript types for all asset kinds, example plugins for Notion, Obsidian, and custom formats.",
        links: [{ label: "SDK Docs", href: "/docs/developer-guide#plugin-sdk" }],
      },
      {
        id: "ai-agents",
        title: "AI Agent Orchestration",
        description: "Multi-agent workflows with routing, memory sharing, tool use, and evaluation. Visual workflow builder with real-time preview.",
        status: "in-progress",
        quarter: "Q4 2024",
        tags: ["Agents", "Workflows", "Orchestration", "Evaluation"],
        details: "Agent graph definition with conditional routing, shared memory stores, tool calling with sandboxing, built-in evaluation harness, and A/B testing for prompts.",
        links: [{ label: "RFC", href: "https://github.com/ai-context-studio/rfcs" }],
      },
      {
        id: "extensions",
        title: "Extension System",
        description: "VS Code extension, Raycast extension, and CLI tool for seamless integration into existing developer workflows.",
        status: "in-progress",
        quarter: "Q4 2024",
        tags: ["VS Code", "Raycast", "CLI", "Extensions"],
        details: "VS Code: sidebar, command palette integration, inline actions. Raycast: quick search, install commands, asset preview. CLI: acs install, acs search, acs publish, acs validate.",
        links: [{ label: "VS Code Marketplace", href: "https://marketplace.visualstudio.com" }],
      },
    ],
  },
  {
    phase: "Planned",
    status: "planned",
    items: [
      {
        id: "teams-enterprise",
        title: "Teams & Enterprise",
        description: "RBAC, SSO/SAML, audit logs, compliance reporting, private marketplace, and dedicated support for organizations.",
        status: "planned",
        quarter: "Q1 2025",
        tags: ["Enterprise", "SSO", "RBAC", "Audit", "Compliance"],
        details: "SCIM provisioning, SOC 2 compliance, data residency options, custom branding, SLA-backed support, on-premise deployment option.",
        links: [{ label: "Enterprise Interest", href: "/contact?type=enterprise" }],
      },
      {
        id: "cloud-marketplace",
        title: "Cloud Marketplace Hosting",
        description: "Managed registry hosting with global CDN, analytics dashboard, monetization tools, and creator revenue sharing.",
        status: "planned",
        quarter: "Q1 2025",
        tags: ["Cloud", "Marketplace", "Analytics", "Monetization"],
        details: "Auto-scaling registry API, edge caching, download analytics, creator payouts, subscription billing, featured placement auction.",
        links: [{ label: "Early Access", href: "/contact?type=cloud-marketplace" }],
      },
      {
        id: "mobile-companion",
        title: "Mobile Companion App",
        description: "iOS and Android app for viewing, searching, and managing assets on the go. Offline sync with desktop.",
        status: "planned",
        quarter: "Q2 2025",
        tags: ["Mobile", "iOS", "Android", "React Native"],
        details: "React Native with Expo. Asset browser with offline cache, push notifications for updates, QR code install to desktop, markdown rendering.",
        links: [],
      },
      {
        id: "ai-asset-generation",
        title: "AI-Powered Asset Generation",
        description: "Generate prompts, skills, workflows, and instruction files from natural language descriptions. Iterative refinement with preview.",
        status: "planned",
        quarter: "Q2 2025",
        tags: ["AI", "Generation", "LLM", "Prompt Engineering"],
        details: "Multi-step generation pipeline: requirement analysis → draft → evaluate → refine. Supports all asset kinds. Integrates with marketplace for publishing.",
        links: [],
      },
    ],
  },
  {
    phase: "Future",
    status: "future",
    items: [
      {
        id: "federated-registry",
        title: "Federated Registry",
        description: "Decentralized asset discovery across multiple registries using ActivityPub or similar protocol. No single point of failure.",
        status: "future",
        tags: ["Federation", "Decentralized", "ActivityPub", "Protocol"],
        details: "Registry-to-registry replication, unified search across federation, trust scoring, content moderation, policy federation.",
        links: [],
      },
      {
        id: "prompt-optimizer",
        title: "Prompt Optimization Engine",
        description: "Automatic prompt improvement via evaluation, iteration, and A/B testing. Learns from usage patterns and feedback.",
        status: "future",
        tags: ["Optimization", "Evaluation", "ML", "A/B Testing"],
        details: "Bayesian optimization for prompt parameters, automatic test case generation, regression detection, cost/quality tradeoff analysis.",
        links: [],
      },
      {
        id: "visual-workflow",
        title: "Visual Workflow Builder",
        description: "Drag-and-drop workflow construction with real-time preview, node-based editing, and collaborative editing.",
        status: "future",
        tags: ["Visual", "Workflow", "Node Editor", "Collaboration"],
        details: "React Flow based editor, real-time collaboration via CRDTs, execution preview with mock data, version control for workflows.",
        links: [],
      },
      {
        id: "marketplace-monetization",
        title: "Marketplace Monetization",
        description: "Paid assets, subscriptions, revenue sharing for creators, featured placement, and enterprise licensing.",
        status: "future",
        tags: ["Monetization", "Payments", "Subscriptions", "Creator Economy"],
        details: "Stripe Connect for payouts, flexible pricing models, license management, DRM-free philosophy, transparent revenue splits (85/15).",
        links: [],
      },
    ],
  },
];

export const roadmapStats = {
  completed: roadmapPhases.find((p) => p.status === "completed")?.items.length || 0,
  inProgress: roadmapPhases.find((p) => p.status === "in-progress")?.items.length || 0,
  planned: roadmapPhases.find((p) => p.status === "planned")?.items.length || 0,
  future: roadmapPhases.find((p) => p.status === "future")?.items.length || 0,
  total: roadmapPhases.reduce((acc, p) => acc + p.items.length, 0),
};