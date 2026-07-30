export interface StatItem {
  label: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  description?: string;
  icon?: string;
}

export const animatedStats: StatItem[] = [
  {
    label: "Developers",
    value: 12_000,
    suffix: "+",
    description: "Active users worldwide",
    icon: "Users",
  },
  {
    label: "Assets Published",
    value: 3_500,
    suffix: "+",
    description: "Skills, prompts, workflows & more",
    icon: "Package",
  },
  {
    label: "Downloads",
    value: 85_000,
    suffix: "+",
    description: "Cross-platform installations",
    icon: "Download",
  },
  {
    label: "GitHub Stars",
    value: 4_200,
    suffix: "+",
    description: "Open source community",
    icon: "Star",
  },
];

export const heroStats = [
  { label: "Local-First", value: "100%", description: "Your data never leaves your machine" },
  { label: "Offline Ready", value: "✓", description: "Full functionality without internet" },
  { label: "Open Source", value: "MIT", description: "Transparent, auditable, extensible" },
  { label: "Platforms", value: "3", description: "Windows, macOS, Linux native apps" },
];