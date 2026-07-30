import type { Metadata, Viewport } from "next";

export const siteConfig = {
  name: "AI Context Studio",
  description:
    "Build, customize, manage, and export AI instruction assets for multiple AI coding assistants. Local-first, offline-first, no auth required.",
  url: "https://ai-context-studio.vercel.app",
  ogImage: "/og-image.svg",
  github: "https://github.com/ai-context-studio",
  discord: "https://discord.gg/ai-context-studio",
  twitter: "https://twitter.com/aicontextstudio",
  creator: "@aicontextstudio",
};

export function generateMetadata(overrides: Partial<Metadata> = {}): Metadata {
  const title = overrides.title
    ? typeof overrides.title === "string"
      ? `${overrides.title} | ${siteConfig.name}`
      : overrides.title
    : { default: siteConfig.name, template: `%s | ${siteConfig.name}` };

  return {
    ...overrides,
    title,
    description: overrides.description || siteConfig.description,
    keywords: overrides.keywords || [
      "AI",
      "prompt engineering",
      "prompt templates",
      "system prompts",
      "AI assistants",
      "developer tools",
      "local-first",
      "offline-first",
      "Tauri",
      "Next.js",
    ],
    authors: overrides.authors || [{ name: "AI Context Studio Team" }],
    creator: siteConfig.creator,
    publisher: siteConfig.name,
    formatDetection: {
      telephone: false,
      address: false,
      email: false,
    },
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: siteConfig.name,
      description: siteConfig.description,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — Local-First AI Prompt Engineering Studio`,
        },
      ],
      ...overrides.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.creator,
      creator: siteConfig.creator,
      title: siteConfig.name,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
      ...overrides.twitter,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
      ...(overrides.robots as object),
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      shortcut: "/favicon.svg",
      apple: "/icons/apple.svg",
      ...(overrides.icons as object),
    },
    manifest: "/manifest.json",
  };
}

export function generateViewport(overrides: Partial<Viewport> = {}): Viewport {
  return {
    themeColor: "#3B82F6",
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    ...overrides,
  };
}

export function generateStructuredData(data: Record<string, unknown>): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    ...data,
  });
}

export const organizationSchema = generateStructuredData({
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/icons/icon-512x512.png`,
  sameAs: [siteConfig.github, siteConfig.twitter, siteConfig.discord],
  description: siteConfig.description,
});

export const websiteSchema = generateStructuredData({
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteConfig.url}/marketplace?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export const softwareApplicationSchema = generateStructuredData({
  "@type": "SoftwareApplication",
  name: "AI Context Studio",
  applicationCategory: "DeveloperApplication",
  operatingSystem: ["Windows", "macOS", "Linux"],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  description: siteConfig.description,
  url: siteConfig.url,
  author: {
    "@type": "Organization",
    name: "AI Context Studio Team",
  },
});