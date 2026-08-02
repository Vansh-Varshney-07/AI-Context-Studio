export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: NavItem[];
}

export interface MarketplaceDropdownItem {
  label: string;
  href: string;
  kind?: string; // for filtering
  highlighted?: boolean;
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
  { label: "Tools", href: "/tools" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
];

export const marketplaceDropdown: MarketplaceDropdownItem[] = [
  { label: "All Assets", href: "/marketplace" },
  { label: "Skills", href: "/marketplace?kind=skill", kind: "skill" },
  { label: "Personas", href: "/marketplace?kind=persona", kind: "persona" },
  { label: "Templates", href: "/marketplace?kind=template", kind: "template" },
  { label: "Prompt Packs", href: "/marketplace?kind=prompt_pack", kind: "prompt_pack" },
  { label: "Instruction Files", href: "/marketplace?kind=instruction_file", kind: "instruction_file" },
  { label: "Workflows", href: "/marketplace?kind=workflow", kind: "workflow" },
  { label: "MCP Servers", href: "/marketplace?kind=mcp_server", kind: "mcp_server" },
  { label: "Collections", href: "/marketplace?kind=collection", kind: "collection" },
  { label: "Bundles", href: "/marketplace?kind=bundle", kind: "bundle" },
  { label: "⚡ Generate File", href: "/generate", highlighted: true },
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