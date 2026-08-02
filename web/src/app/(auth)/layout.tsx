import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg-primary)] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2" aria-label="AI Context Studio Home">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-[var(--color-text-primary)]">AI Context Studio</span>
          </Link>
        </div>
        {children}
        <p className="mt-8 text-center text-xs text-[var(--color-text-muted)]">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-[var(--color-accent)] hover:underline">Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-[var(--color-accent)] hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
