import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Context Studio",
    template: "%s | AI Context Studio",
  },
  description:
    "Build, customize, manage, and export AI instruction assets for multiple AI coding assistants. Local-first, offline-first, no auth required.",
  keywords: [
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
  authors: [{ name: "AI Context Studio Team" }],
  creator: "AI Context Studio",
  publisher: "AI Context Studio",
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  metadataBase: new URL("https://ai-context-studio.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai-context-studio.vercel.app",
    siteName: "AI Context Studio",
    title: "AI Context Studio — Local-First AI Prompt Engineering Studio",
    description:
      "Build, customize, manage, and export AI instruction assets for multiple AI coding assistants. Local-first, offline-first, no auth required.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Context Studio — Local-First AI Prompt Engineering Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aicontextstudio",
    creator: "@aicontextstudio",
    title: "AI Context Studio",
    description:
      "Build, customize, manage, and export AI instruction assets for multiple AI coding assistants.",
    images: ["/og-image.png"],
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
  },
  icons: {
    icon: "/icons/icon-32x32.png",
    shortcut: "/icons/icon-16x16.png",
    apple: "/icons/icon-180x180.png",
  },
  manifest: "/manifest.json",
  themeColor: "#0f0f0f",
};

export const viewport: Viewport = {
  themeColor: "#0f0f0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full font-sans">
        {children}
      </body>
    </html>
  );
}