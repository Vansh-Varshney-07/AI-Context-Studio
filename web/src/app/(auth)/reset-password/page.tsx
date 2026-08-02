import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordClient } from "@/components/auth/reset-password-client";

export const metadata: Metadata = {
  title: "Reset Password | AI Context Studio",
  description: "Set a new password for your account",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 shadow-sm"><div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" /></div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
