export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: NavItem[];
}

export const mainNav: NavItem[] = [
  { label: "Products", href: "/products" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Registry", href: "/registry" },
  { label: "Community", href: "/community" },
  { label: "Docs", href: "/docs" },
  { label: "Download", href: "/download" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Security", href: "/security" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
];

export const ctaButtons = {
  primary: { label: "Download Free", href: "/download" },
  secondary: {
    label: "View on GitHub",
    href: "https://github.com/Vansh-Varshney-07/AI-Context-Studio",
    external: true,
  },
};

export const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/Vansh-Varshney-07/AI-Context-Studio",
    icon: "Github",
    component: "Github",
  },
  { label: "RSS", href: "/rss.xml", icon: "Rss", component: "Rss" },
];

export const footerSections: FooterSection[] = [
  {
    title: "Products",
    links: [
      { label: "Desktop App", href: "/products#desktop" },
      { label: "Online Hub", href: "/products#hub" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Registry", href: "/registry" },
      { label: "Community", href: "/community" },
      { label: "Cloud (Future)", href: "/products#cloud" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/docs/api" },
      { label: "Marketplace SDK", href: "/docs/marketplace-sdk" },
      { label: "Contributing", href: "/community#contribute" },
      { label: "GitHub", href: "https://github.com/Vansh-Varshney-07/AI-Context-Studio", external: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Download", href: "/download" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Security", href: "/security" },
      { label: "Changelog", href: "/changelog" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Mission", href: "/about#mission" },
      { label: "Philosophy", href: "/about#philosophy" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "License", href: "/license" },
      { label: "Security Policy", href: "/security" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
];

export const features = [
  {
    icon: "FileText",
    title: "System Prompts",
    desc: "Craft and version system prompts with variables, conditionals, and blueprints.",
  },
  {
    icon: "FileCode",
    title: "Instruction Files",
    desc: "Write reusable .md instruction files with frontmatter and template syntax.",
  },
  {
    icon: "Database",
    title: "Memories & Context",
    desc: "Store persistent memories, code snippets, and reference docs for agents.",
  },
  {
    icon: "Plug",
    title: "MCP Servers",
    desc: "Configure and generate Model Context Protocol server configs for any client.",
  },
  {
    icon: "GitBranch",
    title: "Workflows",
    desc: "Chain prompts, tools, and agents into repeatable multi-step workflows.",
  },
  {
    icon: "Package",
    title: "Export Anywhere",
    desc: "One-click export to Cursor, Claude Code, Windsurf, VS Code, and custom formats.",
  },
];

export const products = [
  {
    id: "desktop",
    name: "Desktop App",
    tagline: "Native productivity workspace",
    description:
      "Tauri + Next.js desktop application for building, editing, and managing AI assets locally.",
    icon: "Monitor",
    href: "/download",
    features: [
      "System prompts",
      "Instruction files",
      "Memories",
      "MCP config",
      "Workflows",
      "Export anywhere",
    ],
  },
  {
    id: "hub",
    name: "Online Hub",
    tagline: "Cloud sync & collaboration",
    description:
      "Web-based dashboard for syncing assets across devices, team collaboration, and cloud backup.",
    icon: "Globe",
    href: "/products#hub",
    features: [
      "Cross-device sync",
      "Team workspaces",
      "Shared collections",
      "Version history",
      "Access controls",
    ],
    comingSoon: true,
  },
  {
    id: "marketplace",
    name: "Marketplace",
    tagline: "Discover & share assets",
    description:
      "Community-driven catalog of skills, personas, templates, prompt packs, workflows, and MCP servers.",
    icon: "Store",
    href: "/marketplace",
    features: [
      "Skills",
      "Personas",
      "Templates",
      "Prompt packs",
      "Workflows",
      "MCP servers",
      "Collections",
    ],
  },
  {
    id: "registry",
    name: "Registry",
    tagline: "Asset infrastructure",
    description:
      "Open specification for AI asset packaging, versioning, dependencies, and compatibility.",
    icon: "Database",
    href: "/registry",
    features: [
      "Manifest schema",
      "Semantic versioning",
      "Dependency graph",
      "Compatibility matrix",
      "Checksums",
    ],
  },
  {
    id: "community",
    name: "Community",
    tagline: "Open source ecosystem",
    description: "Contributors, creators, and users building the future of AI tooling together.",
    icon: "Users",
    href: "/community",
    features: ["Contributors", "Creators", "Discussions", "Showcases", "Events", "Governance"],
  },
  {
    id: "cloud",
    name: "Future Cloud",
    tagline: "Enterprise-ready platform",
    description: "Managed hosting, SSO, audit logs, and compliance for teams and enterprises.",
    icon: "Cloud",
    href: "/products#cloud",
    features: ["Managed hosting", "SSO/SAML", "Audit logs", "Compliance", "SLA", "Support"],
    comingSoon: true,
  },
];