import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailClient } from "@/components/auth/verify-email-client";

export const metadata: Metadata = {
  title: "Verify Email | AI Context Studio",
  description: "Verify your email address",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 shadow-sm"><div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" /></div>}>
      <VerifyEmailClient />
    </Suspense>
  );
}
