export interface DocSidebarItem {
  title: string;
  href: string;
  items?: DocSidebarItem[];
  badge?: string;
}

export interface DocCategory {
  id: string;
  title: string;
  description?: string;
  items: DocSidebarItem[];
}

export const docCategories: DocCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics and get up and running quickly",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Quick Start", href: "/docs/getting-started" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Core Concepts", href: "/docs/core-concepts" },
      { title: "Your First Asset", href: "/docs/first-asset" },
    ],
  },
  {
    id: "desktop",
    title: "Desktop App",
    description: "Master the desktop application features",
    items: [
      { title: "Overview", href: "/docs/desktop" },
      { title: "Workspace", href: "/docs/desktop/workspace" },
      { title: "Instruction Files", href: "/docs/desktop/instruction-files" },
      { title: "Prompt Library", href: "/docs/desktop/prompt-library" },
      { title: "Prompt Engine", href: "/docs/desktop/prompt-engine" },
      { title: "Personas", href: "/docs/desktop/personas" },
      { title: "Skills", href: "/docs/desktop/skills" },
      { title: "Workflows", href: "/docs/desktop/workflows" },
      { title: "Memories", href: "/docs/desktop/memories" },
      { title: "MCP Manager", href: "/docs/desktop/mcp" },
      { title: "Asset Validator", href: "/docs/desktop/validator" },
      { title: "Prompt Optimizer", href: "/docs/desktop/optimizer" },
      { title: "Settings", href: "/docs/desktop/settings" },
    ],
  },
  {
    id: "marketplace",
    title: "Marketplace",
    description: "Discover, install, and publish community assets",
    items: [
      { title: "Browsing Assets", href: "/docs/marketplace/browsing" },
      { title: "Installing Assets", href: "/docs/marketplace/installing" },
      { title: "Publishing Assets", href: "/docs/marketplace/publishing" },
      { title: "Asset Types", href: "/docs/marketplace/asset-types" },
      { title: "Versioning", href: "/docs/marketplace/versioning" },
      { title: "Compatibility", href: "/docs/marketplace/compatibility" },
    ],
  },
  {
    id: "registry",
    title: "Registry",
    description: "Asset packaging, versioning, and compatibility",
    items: [
      { title: "Asset Schema", href: "/docs/registry/schema" },
      { title: "Manifest Format", href: "/docs/registry/manifest" },
      { title: "Metadata Fields", href: "/docs/registry/metadata" },
      { title: "Dependencies", href: "/docs/registry/dependencies" },
      { title: "Validation", href: "/docs/registry/validation" },
    ],
  },
  {
    id: "mcp",
    title: "MCP (Model Context Protocol)",
    description: "Model Context Protocol integration and servers",
    items: [
      { title: "Introduction", href: "/docs/mcp" },
      { title: "Server Configuration", href: "/docs/mcp/server-config" },
      { title: "Client Setup", href: "/docs/mcp/client-setup" },
      { title: "Built-in Servers", href: "/docs/mcp/built-in" },
      { title: "Custom Servers", href: "/docs/mcp/custom" },
      { title: "Troubleshooting", href: "/docs/mcp/troubleshooting" },
    ],
},
  {
    id: "skills",
    title: "Skills & Prompt Files",
    description: "Build composable capabilities and reusable prompt files",
    items: [
      { title: "Skills Development", href: "/docs/skills/development" },
      { title: "Prompt Files", href: "/docs/prompt-files" },
    ],
  },
  {
    id: "api-keys",
    title: "API Keys & Security",
    description: "Manage provider credentials and security best practices",
    items: [
      { title: "API Keys Management", href: "/docs/api-keys" },
      { title: "Security Best Practices", href: "/docs/security" },
    ],
  },
  {
    id: "developer-guide",
    title: "Developer Guide",
    description: "Architecture, plugin SDK, and advanced development",
    items: [
      { title: "Developer Guide", href: "/docs/developer-guide" },
      { title: "Architecture", href: "/docs/architecture" },
      { title: "Plugin SDK", href: "/docs/plugin-sdk" },
    ],
  },
];

export const docSearchIndex = [
  { title: "Introduction", url: "/docs", content: "AI Context Studio is a local-first prompt engineering studio..." },
  { title: "Quick Start", url: "/docs/getting-started", content: "Get up and running in 5 minutes..." },
  { title: "Installation", url: "/docs/installation", content: "Download and install AI Context Studio on Windows, macOS, or Linux..." },
  { title: "Instruction Files", url: "/docs/desktop/instruction-files", content: "Create AGENTS.md and per-target agent instructions..." },
  { title: "Prompt Library", url: "/docs/desktop/prompt-library", content: "Browse, search, and use curated prompt templates..." },
  { title: "MCP Manager", url: "/docs/desktop/mcp", content: "Configure Model Context Protocol servers..." },
  { title: "Marketplace", url: "/docs/marketplace/browsing", content: "Discover and install community assets..." },
  { title: "Asset Schema", url: "/docs/registry/schema", content: "Understand the .acs asset package format..." },
  { title: "Security", url: "/docs/security", content: "Local-first philosophy, encryption, API key management..." },
];

export const quickLinks = [
  { label: "Download", href: "/download", icon: "Download" },
  { label: "Marketplace", href: "/marketplace", icon: "Package" },
  { label: "GitHub", href: "https://github.com/ai-context-studio", icon: "Github", external: true },
  { label: "Discord", href: "https://discord.gg/ai-context-studio", icon: "MessageCircle", external: true },
];

export function getCategory(id: string): DocCategory | undefined {
  return docCategories.find((c) => c.id === id);
}

export function getSidebarItems(categoryId: string): DocSidebarItem[] {
  const category = getCategory(categoryId);
  if (!category) return [];
  
  return category.items.map(item => ({
    ...item,
    // For pages with sub-items, we'd need nested structure
    // For now, return flat list
  }));
}