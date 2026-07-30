import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { WebProviders } from '@/providers/web-providers';
import { generateMetadata, generateViewport } from '@/lib/metadata';
import { Analytics } from '@/components/analytics';
import './globals.css';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = generateMetadata({
  title: 'AI Context Studio',
  description:
    'Build, customize, manage, and export AI instruction assets for multiple AI coding assistants. Local-first, offline-first, no auth required.',
});

export const viewport: Viewport = generateViewport();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full bg-[var(--color-bg-primary)] font-sans text-[var(--color-text-primary)]">
        <WebProviders>{children}</WebProviders>
        <Analytics />
      </body>
    </html>
  );
}
