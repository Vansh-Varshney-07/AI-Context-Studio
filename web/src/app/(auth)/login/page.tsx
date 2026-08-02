import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginClient } from "@/components/auth/login-client";

export const metadata: Metadata = {
  title: "Sign In | AI Context Studio",
  description: "Sign in to your AI Context Studio account",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 shadow-sm"><div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" /></div>}>
      <LoginClient />
    </Suspense>
  );
}
