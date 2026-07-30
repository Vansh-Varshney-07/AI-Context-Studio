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
  { label: 'Products', href: '/products' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Registry', href: '/registry' },
  { label: 'Community', href: '/community' },
  { label: 'Docs', href: '/docs' },
  { label: 'Download', href: '/download' },
  { label: 'Roadmap', href: '/roadmap' },
  { label: 'Security', href: '/security' },
  { label: 'About', href: '/about' },
];

export const ctaButtons = {
  primary: { label: 'Download Free', href: '/download' },
  secondary: {
    label: 'View on GitHub',
    href: 'https://github.com/ai-context-studio',
    external: true,
  },
};

export const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/ai-context-studio',
    icon: 'Github',
    component: 'Github',
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/aicontextstudio',
    icon: 'Twitter',
    component: 'Twitter',
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/ai-context-studio',
    icon: 'MessageCircle',
    component: 'MessageCircle',
  },
  { label: 'RSS', href: '/rss.xml', icon: 'Rss', component: 'Rss' },
];

export const footerSections: FooterSection[] = [
  {
    title: 'Products',
    links: [
      { label: 'Desktop App', href: '/products#desktop' },
      { label: 'Online Hub', href: '/products#hub' },
      { label: 'Marketplace', href: '/marketplace' },
      { label: 'Registry', href: '/registry' },
      { label: 'Community', href: '/community' },
      { label: 'Cloud (Future)', href: '/products#cloud' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/docs/api' },
      { label: 'Marketplace SDK', href: '/docs/marketplace-sdk' },
      { label: 'Contributing', href: '/community#contribute' },
      { label: 'GitHub', href: 'https://github.com/ai-context-studio', external: true },
      { label: 'Discord', href: 'https://discord.gg/ai-context-studio', external: true },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Download', href: '/download' },
      { label: 'Roadmap', href: '/roadmap' },
      { label: 'Security', href: '/security' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Blog', href: '/blog' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Mission', href: '/about#mission' },
      { label: 'Philosophy', href: '/about#philosophy' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'License', href: '/license' },
      { label: 'Security Policy', href: '/security' },
      { label: 'Cookies', href: '/cookies' },
    ],
  },
];
