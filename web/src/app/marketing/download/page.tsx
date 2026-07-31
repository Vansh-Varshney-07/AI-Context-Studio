import { type Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import { generateMetadata } from '@/lib/metadata';
import { DownloadPageClient } from '@/components/download/download-page-client';
import { getReleases, getLatestRelease, getSystemRequirements, getSourceCodeInfo } from '@/actions/downloads';

export const metadata: Metadata = generateMetadata({
  title: 'Download',
  description:
    'Download AI Context Studio for Windows, macOS, and Linux. Native desktop app built with Tauri — fast, secure, and lightweight. No Electron bloat.',
});

// Force dynamic rendering to avoid database queries during build
export const dynamic = 'force-dynamic';

export default async function DownloadPage() {
  const [releases, latestRelease, systemRequirements, sourceCode] = await Promise.all([
    getReleases(),
    getLatestRelease(),
    getSystemRequirements(),
    getSourceCodeInfo(),
  ]);

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <DownloadPageClient
        releases={releases}
        latestRelease={latestRelease}
        systemRequirements={systemRequirements}
        sourceCode={sourceCode}
      />
      <Footer />
    </main>
  );
}