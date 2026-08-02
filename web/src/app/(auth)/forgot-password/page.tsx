import type { Metadata } from "next";
import { Suspense } from "react";
import { ForgotPasswordClient } from "@/components/auth/forgot-password-client";

export const metadata: Metadata = {
  title: "Forgot Password | AI Context Studio",
  description: "Reset your AI Context Studio account password",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 shadow-sm"><div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" /></div>}>
      <ForgotPasswordClient />
    </Suspense>
  );
}
