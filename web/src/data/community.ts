export interface CommunityStat {
  label: string;
  value: string;
  change?: string;
  icon: string;
  description: string;
}

export interface Creator {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  assetsCount: number;
  assets: number;
  totalDownloads: number;
  stars: number;
  verified: boolean;
  github?: string;
  twitter?: string;
  website?: string;
}

export interface Contributor {
  username: string;
  avatar: string;
  contributions: number;
  role: string;
}

export const communityStats: CommunityStat[] = [
  {
    label: 'Contributors',
    value: '247',
    change: '+12 this month',
    icon: 'Users',
    description: 'Active developers building with us',
  },
  {
    label: 'Assets Published',
    value: '3,420',
    change: '+89 this week',
    icon: 'Package',
    description: 'Skills, personas, templates & more',
  },
  {
    label: 'Discord Members',
    value: '4.2K',
    change: '+234 this month',
    icon: 'MessageCircle',
    description: 'Growing community of AI developers',
  },
  {
    label: 'GitHub Stars',
    value: '4.2K',
    change: '+156 this month',
    icon: 'Star',
    description: 'Open source appreciation',
  },
  {
    label: 'Discussions',
    value: '1,180',
    change: '+45 this week',
    icon: 'GitBranch',
    description: 'Questions, ideas, and showcases',
  },
  {
    label: 'Countries',
    value: '67',
    change: '+3 this quarter',
    icon: 'Globe',
    description: 'Global developer representation',
  },
];

export const featuredCreators: Creator[] = [
  {
    name: 'Sarah Chen',
    username: 'sarahchen',
    avatar: 'https://github.com/sarahchen.png',
    bio: 'Staff Engineer at Stripe. Building tools for developer productivity. Author of 12 marketplace assets.',
    assetsCount: 12,
    assets: 12,
    totalDownloads: 89_400,
    stars: 12_400,
    verified: true,
    github: 'https://github.com/sarahchen',
    twitter: 'https://twitter.com/sarahchen_dev',
  },
  {
    name: 'Marcus Johnson',
    username: 'marcusj',
    avatar: 'https://github.com/marcusjohnson.png',
    bio: "Open source maintainer. Creator of the popular 'Code Review Assistant' and 'Senior Engineer Persona' skills.",
    assetsCount: 8,
    assets: 8,
    totalDownloads: 67_200,
    stars: 8_900,
    verified: true,
    github: 'https://github.com/marcusjohnson',
    website: 'https://marcusjohnson.dev',
  },
  {
    name: 'Frontend Collective',
    username: 'frontend-collective',
    avatar: 'https://github.com/frontend-collective.png',
    bio: 'Team of frontend architects publishing React, Vue, and Svelte templates and component libraries.',
    assetsCount: 15,
    assets: 15,
    totalDownloads: 156_000,
    stars: 23_100,
    verified: true,
    github: 'https://github.com/frontend-collective',
    twitter: 'https://twitter.com/frontendcoll',
  },
  {
    name: 'Data Science Team',
    username: 'datascience-team',
    avatar: 'https://github.com/datascience-team.png',
    bio: 'ML engineers sharing prompt packs for pandas, scikit-learn, PyTorch, and data visualization.',
    assetsCount: 6,
    assets: 6,
    totalDownloads: 45_300,
    stars: 5_200,
    verified: true,
    github: 'https://github.com/datascience-team',
  },
  {
    name: 'DevOps Engineers',
    username: 'devops-engineers',
    avatar: 'https://github.com/devops-engineers.png',
    bio: 'Infrastructure specialists publishing CI/CD workflows, Kubernetes configs, and MCP servers for cloud tools.',
    assetsCount: 9,
    assets: 9,
    totalDownloads: 38_700,
    stars: 11_300,
    verified: true,
    github: 'https://github.com/devops-engineers',
  },
];

export const recentContributors: Contributor[] = [
  {
    username: 'alexkim-dev',
    avatar: 'https://github.com/alexkim-dev.png',
    contributions: 47,
    role: 'Core',
  },
  {
    username: 'priya-sharma',
    avatar: 'https://github.com/priya-sharma.png',
    contributions: 32,
    role: 'Core',
  },
  {
    username: 'carlos-mendoza',
    avatar: 'https://github.com/carlos-mendoza.png',
    contributions: 28,
    role: 'Contributor',
  },
  {
    username: 'lisa-wang',
    avatar: 'https://github.com/lisa-wang.png',
    contributions: 24,
    role: 'Contributor',
  },
  {
    username: 'james-taylor',
    avatar: 'https://github.com/james-taylor.png',
    contributions: 19,
    role: 'Contributor',
  },
  {
    username: 'emily-rodriguez',
    avatar: 'https://github.com/emily-rodriguez.png',
    contributions: 16,
    role: 'Contributor',
  },
  {
    username: 'david-park',
    avatar: 'https://github.com/david-park.png',
    contributions: 14,
    role: 'Contributor',
  },
  {
    username: 'anna-volkov',
    avatar: 'https://github.com/anna-volkov.png',
    contributions: 12,
    role: 'Contributor',
  },
  {
    username: 'omar-hassan',
    avatar: 'https://github.com/omar-hassan.png',
    contributions: 11,
    role: 'Contributor',
  },
  {
    username: 'sofia-andersen',
    avatar: 'https://github.com/sofia-andersen.png',
    contributions: 9,
    role: 'Contributor',
  },
];

export const communityLinks = [
  {
    label: 'Discord Community',
    href: 'https://discord.gg/ai-context-studio',
    description: 'Chat with developers, get help, share assets',
    icon: 'MessageCircle',
  },
  {
    label: 'GitHub Discussions',
    href: 'https://github.com/ai-context-studio/ai-context-studio/discussions',
    description: 'Ask questions, propose ideas, show off work',
    icon: 'GitBranch',
  },
  {
    label: 'Contributing Guide',
    href: '/community#contribute',
    description: 'How to contribute code, assets, docs, or translations',
    icon: 'BookOpen',
  },
  {
    label: 'Code of Conduct',
    href: '/community#conduct',
    description: 'Our community standards and enforcement',
    icon: 'Shield',
  },
  {
    label: 'Asset Showcase',
    href: '/community#showcase',
    description: 'Community projects built with AI Context Studio',
    icon: 'LayoutDashboard',
  },
  {
    label: 'Meetups & Events',
    href: '/community#events',
    description: 'Virtual and in-person community gatherings',
    icon: 'Calendar',
  },
];

export const howToContribute = [
  {
    step: 1,
    title: 'Join Discord',
    description: 'Introduce yourself in #introductions and find collaborators',
  },
  {
    step: 2,
    title: 'Pick an Issue',
    description: "Browse 'good first issue' labels on GitHub or propose a new asset",
  },
  {
    step: 3,
    title: 'Fork & Clone',
    description: 'Fork the repo, create a branch, make your changes',
  },
  {
    step: 4,
    title: 'Test Locally',
    description: 'Run the desktop app and verify your changes work',
  },
  { step: 5, title: 'Open PR', description: 'Submit a pull request with a clear description' },
  {
    step: 6,
    title: 'Review & Merge',
    description: 'Address feedback, get approval, and celebrate!',
  },
];

export const governance = {
  coreTeam: ['alexkim-dev', 'priya-sharma', 'carlos-mendoza', 'lisa-wang'],
  maintainers: [
    'alexkim-dev',
    'priya-sharma',
    'carlos-mendoza',
    'lisa-wang',
    'james-taylor',
    'emily-rodriguez',
  ],
  RFCProcess: 'Major changes go through RFC (Request for Comments) process on GitHub Discussions',
  releaseCycle: 'Monthly minor releases, quarterly major releases, security patches as needed',
};
