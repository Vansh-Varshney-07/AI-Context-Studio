export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  badge?: string;
}

export interface FooterSection {
  title: string;
  links: NavItem[];
}

export interface DownloadChecksum {
  platform: string;
  variant: string;
  sha256: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned' | 'future';
  category: string;
  targetQuarter?: string;
  tags: string[];
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  assetCount: number;
  verified: boolean;
  links?: {
    github?: string;
    twitter?: string;
    website?: string;
  };
}

export interface SearchResult {
  title: string;
  url: string;
  description: string;
  category: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}
