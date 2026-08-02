export const siteConfig = {
  name: 'AI Context Studio',
  tagline: 'Local-First AI Prompt Engineering Studio',
  description:
    'Build, customize, manage, and export AI instruction assets for multiple AI coding assistants. Generate system prompts, instruction files, personas, workflows, MCP configs and more.',
  url: 'https://ai-context-studio.vercel.app',
  ogImage: '/og-image.png',
  github: 'https://github.com/Vansh-Varshney-07/AI-Context-Studio',
  creator: '@aicontextstudio',
};

export const navigation = {
  main: [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/registry', label: 'Registry' },
    { href: '/community', label: 'Community' },
    { href: '/docs', label: 'Documentation' },
    { href: '/download', label: 'Download' },
    { href: '/roadmap', label: 'Roadmap' },
    { href: '/security', label: 'Security' },
    { href: '/about', label: 'About' },
  ],
  docs: [
    { href: '/docs/getting-started', label: 'Getting Started' },
    { href: '/docs/installation', label: 'Installation' },
    { href: '/docs/desktop', label: 'Desktop App' },
    { href: '/docs/marketplace', label: 'Marketplace' },
    { href: '/docs/registry', label: 'Registry' },
    { href: '/docs/mcp', label: 'MCP' },
    { href: '/docs/skills', label: 'Skills' },
    { href: '/docs/prompt-files', label: 'Prompt Files' },
    { href: '/docs/api-keys', label: 'API Keys' },
    { href: '/docs/security', label: 'Security' },
    { href: '/docs/developer-guide', label: 'Developer Guide' },
    { href: '/docs/architecture', label: 'Architecture' },
  ],
  footer: {
    product: [
      { href: '/products', label: 'Products' },
      { href: '/marketplace', label: 'Marketplace' },
      { href: '/registry', label: 'Registry' },
      { href: '/download', label: 'Download' },
      { href: '/roadmap', label: 'Roadmap' },
    ],
    resources: [
      { href: '/docs', label: 'Documentation' },
      { href: '/community', label: 'Community' },
      { href: '/security', label: 'Security' },
      { href: '/about', label: 'About' },
      { href: 'https://github.com/ai-context-studio', label: 'GitHub' },
    ],
    legal: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      { href: '/license', label: 'License (MIT)' },
    ],
    social: [
      { href: 'https://github.com/Vansh-Varshney-07/AI-Context-Studio', label: 'GitHub' },
    ],
  },
};

export const products = [
  {
    id: 'desktop',
    name: 'Desktop App',
    tagline: 'Native productivity workspace',
    description:
      'Tauri + Next.js desktop application for building, editing, and managing AI assets locally.',
    icon: 'Monitor',
    href: '/download',
    features: [
      'System prompts',
      'Instruction files',
      'Memories',
      'MCP config',
      'Workflows',
      'Export anywhere',
    ],
  },
  {
    id: 'hub',
    name: 'Online Hub',
    tagline: 'Cloud sync & collaboration',
    description:
      'Web-based dashboard for syncing assets across devices, team collaboration, and cloud backup.',
    icon: 'Globe',
    href: '/products#hub',
    features: [
      'Cross-device sync',
      'Team workspaces',
      'Shared collections',
      'Version history',
      'Access controls',
    ],
    comingSoon: true,
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    tagline: 'Discover & share assets',
    description:
      'Community-driven catalog of skills, personas, templates, prompt packs, workflows, and MCP servers.',
    icon: 'Store',
    href: '/marketplace',
    features: [
      'Skills',
      'Personas',
      'Templates',
      'Prompt packs',
      'Workflows',
      'MCP servers',
      'Collections',
    ],
  },
  {
    id: 'registry',
    name: 'Registry',
    tagline: 'Asset infrastructure',
    description:
      'Open specification for AI asset packaging, versioning, dependencies, and compatibility.',
    icon: 'Database',
    href: '/registry',
    features: [
      'Manifest schema',
      'Semantic versioning',
      'Dependency graph',
      'Compatibility matrix',
      'Checksums',
    ],
  },
  {
    id: 'community',
    name: 'Community',
    tagline: 'Open source ecosystem',
    description: 'Contributors, creators, and users building the future of AI tooling together.',
    icon: 'Users',
    href: '/community',
    features: ['Contributors', 'Creators', 'Discussions', 'Showcases', 'Events', 'Governance'],
  },
  {
    id: 'cloud',
    name: 'Future Cloud',
    tagline: 'Enterprise-ready platform',
    description: 'Managed hosting, SSO, audit logs, and compliance for teams and enterprises.',
    icon: 'Cloud',
    href: '/products#cloud',
    features: ['Managed hosting', 'SSO/SAML', 'Audit logs', 'Compliance', 'SLA', 'Support'],
    comingSoon: true,
  },
];

export const stats = [
  { label: 'Active Users', value: '12.5K+', prefix: '~' },
  { label: 'Assets Published', value: '8.2K+', prefix: '~' },
  { label: 'Downloads', value: '156K+', prefix: '~' },
  { label: 'GitHub Stars', value: '3.4K+', prefix: '~' },
  { label: 'Contributors', value: '240+', prefix: '~' },
  { label: 'Supported Targets', value: '10', prefix: '' },
];

export const features = [
  {
    icon: 'FileText',
    title: 'System Prompts',
    description: 'Craft and version system prompts with variables, conditionals, and blueprints.',
  },
  {
    icon: 'FileCode',
    title: 'Instruction Files',
    description: 'Write reusable .md instruction files with frontmatter and template syntax.',
  },
  {
    icon: 'Database',
    title: 'Memories & Context',
    description: 'Store persistent memories, code snippets, and reference docs for agents.',
  },
  {
    icon: 'Plug',
    title: 'MCP Servers',
    description: 'Configure and generate Model Context Protocol server configs for any client.',
  },
  {
    icon: 'GitBranch',
    title: 'Workflows',
    description: 'Chain prompts, tools, and agents into repeatable multi-step workflows.',
  },
  {
    icon: 'Package',
    title: 'Export Anywhere',
    description: 'One-click export to Cursor, Claude Code, Windsurf, VS Code, and custom formats.',
  },
];

export const downloadPlatforms = [
  {
    os: 'Windows',
    variants: [
      { label: 'NSIS Installer', arch: 'x64', size: '45 MB', ext: '.exe', checksum: 'sha256:...' },
      { label: 'Portable', arch: 'x64', size: '42 MB', ext: '.exe', checksum: 'sha256:...' },
    ],
    recommended: 'NSIS Installer',
  },
  {
    os: 'macOS',
    variants: [
      {
        label: 'Universal (Apple Silicon + Intel)',
        arch: 'universal',
        size: '52 MB',
        ext: '.dmg',
        checksum: 'sha256:...',
      },
      {
        label: 'Apple Silicon (ARM64)',
        arch: 'arm64',
        size: '48 MB',
        ext: '.dmg',
        checksum: 'sha256:...',
      },
    ],
    recommended: 'Universal DMG',
  },
  {
    os: 'Linux',
    variants: [
      { label: 'AppImage', arch: 'x64', size: '48 MB', ext: '.AppImage', checksum: 'sha256:...' },
      { label: 'Debian/Ubuntu', arch: 'x64', size: '44 MB', ext: '.deb', checksum: 'sha256:...' },
      {
        label: 'RPM (Fedora/RHEL)',
        arch: 'x64',
        size: '44 MB',
        ext: '.rpm',
        checksum: 'sha256:...',
      },
      { label: 'Tarball', arch: 'x64', size: '42 MB', ext: '.tar.gz', checksum: 'sha256:...' },
    ],
    recommended: 'AppImage',
  },
];

export const roadmapPhases = [
  {
    phase: 'Completed',
    status: 'completed',
    items: [
      {
        title: 'Desktop App v1.0',
        description:
          'Core workspace with system prompts, instruction files, memories, MCP, workflows',
        quarter: 'Q1 2024',
      },
      {
        title: 'Marketplace Frontend',
        description: 'Browse, search, filter assets with categories and compatibility badges',
        quarter: 'Q2 2024',
      },
      {
        title: 'Registry Specification',
        description: 'Manifest schema, versioning, dependencies, compatibility matrix',
        quarter: 'Q2 2024',
      },
      {
        title: 'Documentation Site',
        description: 'Full docs with Getting Started, Installation, Developer Guide, Architecture',
        quarter: 'Q2 2024',
      },
    ],
  },
  {
    phase: 'In Progress',
    status: 'in-progress',
    items: [
      {
        title: 'Online Hub (Sync)',
        description: 'Cross-device sync, team workspaces, shared collections, version history',
        quarter: 'Q3 2024',
      },
      {
        title: 'Plugin SDK',
        description: 'TypeScript SDK for building custom exporters, validators, and integrations',
        quarter: 'Q3 2024',
      },
      {
        title: 'AI Agent Orchestration',
        description: 'Multi-agent workflows with routing, memory sharing, and tool use',
        quarter: 'Q4 2024',
      },
      {
        title: 'Extension System',
        description: 'VS Code extension, Raycast extension, CLI tool',
        quarter: 'Q4 2024',
      },
    ],
  },
  {
    phase: 'Planned',
    status: 'planned',
    items: [
      {
        title: 'Teams & Enterprise',
        description: 'RBAC, SSO/SAML, audit logs, compliance, private marketplace',
        quarter: 'Q1 2025',
      },
      {
        title: 'Cloud Marketplace Hosting',
        description: 'Managed registry hosting with CDN, analytics, monetization',
        quarter: 'Q1 2025',
      },
      {
        title: 'Mobile Companion',
        description: 'iOS/Android app for viewing and managing assets on the go',
        quarter: 'Q2 2025',
      },
      {
        title: 'AI-Powered Asset Generation',
        description: 'Generate prompts, skills, workflows from natural language',
        quarter: 'Q2 2025',
      },
    ],
  },
  {
    phase: 'Future',
    status: 'future',
    items: [
      {
        title: 'Federated Registry',
        description: 'Decentralized asset discovery across multiple registries',
      },
      {
        title: 'Prompt Optimization Engine',
        description: 'Automatic prompt improvement via evaluation and iteration',
      },
      {
        title: 'Visual Workflow Builder',
        description: 'Drag-and-drop workflow construction with real-time preview',
      },
      {
        title: 'Marketplace Monetization',
        description: 'Paid assets, subscriptions, revenue sharing for creators',
      },
    ],
  },
];

export const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/Vansh-Varshney-07/AI-Context-Studio', icon: 'Github' },
];
