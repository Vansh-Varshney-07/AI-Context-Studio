import {
  Boxes,
  Cloud,
  Database,
  FileText,
  FolderTree,
  GitBranch,
  Globe,
  type LucideIcon,
  MemoryStick,
  Package,
  Plug,
  Search,
  Sparkles,
  Terminal,
  Wand2,
} from "lucide-react";

import type { MCPCategory, MCPCategoryId } from "../types";

/**
 * Canonical MCP category catalog. To add a new category:
 *   1. append its id to `MCPCategoryId` in `types/mcp.types.ts`
 *   2. append its metadata entry here
 * UI (filter rail, dashboard stats) reads exclusively from this array.
 */
export const MCP_CATEGORIES: readonly MCPCategory[] = [
  {
    id: "filesystem",
    label: "Filesystem",
    description: "File & directory access MCP servers",
    icon: FolderTree,
  },
  {
    id: "git",
    label: "Git & GitHub",
    description: "Source control, pull requests, issues",
    icon: GitBranch,
  },
  {
    id: "database",
    label: "Database",
    description: "SQL, PostgreSQL, MySQL, SQLite, Supabase, Firebase",
    icon: Database,
  },
  {
    id: "cloud",
    label: "Cloud",
    description: "AWS, Azure, GCP, Docker, Kubernetes",
    icon: Cloud,
  },
  {
    id: "terminal",
    label: "Terminal",
    description: "Shell access & process execution",
    icon: Terminal,
  },
  {
    id: "browser",
    label: "Browser Automation",
    description: "Playwright, Puppeteer, Chrome",
    icon: Globe,
  },
  {
    id: "search",
    label: "Web Search",
    description: "Brave, Tavily, SerpAPI",
    icon: Search,
  },
  {
    id: "docs",
    label: "Documentation",
    description: "Context7, DeepWiki, knowledge retrieval",
    icon: FileText,
  },
  {
    id: "memory",
    label: "Memory",
    description: "Sequential thinking, knowledge graphs",
    icon: MemoryStick,
  },
  {
    id: "notion",
    label: "Notion & Obsidian",
    description: "Note-taking & knowledge bases",
    icon: Boxes,
  },
  {
    id: "vector-db",
    label: "Vector Database",
    description: "Pinecone, Qdrant, Weaviate, Chroma",
    icon: Package,
  },
  {
    id: "ai-providers",
    label: "AI Providers",
    description: "OpenAI, Anthropic, Gemini, OpenRouter, NVIDIA, Ollama",
    icon: Sparkles,
  },
  {
    id: "utilities",
    label: "Utilities",
    description: "Slack, Discord, Email, Calendar, watchers",
    icon: Plug,
  },
  {
    id: "custom",
    label: "Custom MCP Servers",
    description: "User-defined or community MCP servers",
    icon: Wand2,
  },
] as const;

/**
 * O(1) lookup by category id.
 */
export const MCP_CATEGORY_MAP: Record<MCPCategoryId, MCPCategory> =
  Object.fromEntries(
    MCP_CATEGORIES.map((category) => [category.id, category]),
  ) as Record<MCPCategoryId, MCPCategory>;

/**
 * Exported for components that just need a LucideIcon by id.
 */
export function getCategoryIcon(id: MCPCategoryId): LucideIcon {
  return MCP_CATEGORY_MAP[id]?.icon ?? Boxes;
}

