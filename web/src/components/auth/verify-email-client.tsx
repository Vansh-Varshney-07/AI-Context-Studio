"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, AlertCircle, CheckCircle, MailWarning } from "lucide-react";

function VerifyEmailClientInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [token, setToken] = useState<string | null>(searchParams.get("token"));

  // Auto-verify if token is in URL
  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (!urlToken) return;

    const verify = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: urlToken }),
        });

        if (res.ok) {
          setSuccess(true);
          setTimeout(() => router.push("/dashboard"), 2000);
        } else {
          const data = await res.json();
          setError(data.message || data.error || "Verification failed. The link may have expired.");
          setApiError(true);
        }
      } catch {
        setError("Network error. Please try again.");
        setApiError(true);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [searchParams, router]);

  const handleResend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    setResending(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/send-verification-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.message || data.error || "Failed to resend verification email");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  // If token from URL is present - show verifying/loading state
  if (token && loading) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 shadow-sm text-center">
        <Loader2 className="h-12 w-12 text-[var(--color-accent)] mx-auto mb-4 animate-spin" />
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Verifying email</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">Please wait...</p>
      </div>
    );
  }

  // If verification succeeded
  if (success) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 shadow-sm text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Email verified!</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">Redirecting you to the dashboard...</p>
        <Link href="/dashboard" className="mt-6 inline-block">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    );
  }

  // If verification failed - show form to resend
  if (token && apiError) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 shadow-sm">
        <div className="text-center">
          <MailWarning className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Verification failed</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2">{error}</p>
        </div>

        <form onSubmit={handleResend} className="mt-6 space-y-4">
          <p className="text-center text-sm text-[var(--color-text-secondary)] mb-2">Enter your email to resend verification:</p>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
              <Input id="email" type="email" name="email" required placeholder="you@example.com" className="pl-9" disabled={resending} />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={resending}>
            {resending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
            Resend Verification Email
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
          <Link href="/login" className="text-[var(--color-accent)] font-medium hover:underline">Back to Sign In</Link>
        </p>
      </div>
    );
  }

  // Default: show check your inbox form
  if (!token) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 shadow-sm text-center">
        <Mail className="h-12 w-12 text-[var(--color-accent)] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Verify your email</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">
          A verification email will be sent after registration. Click the link in the email to verify your account.
        </p>
        <p className="text-sm text-[var(--color-text-secondary)] mt-4">
          Didn't receive an email? Enter your address below to resend.
        </p>

        <form onSubmit={handleResend} className="mt-6 space-y-4 text-left">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
              <Input id="email" type="email" name="email" required placeholder="you@example.com" className="pl-9" disabled={resending} />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={resending}>
            {resending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
            Resend Verification Email
          </Button>
        </form>

        <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
          <Link href="/register" className="text-[var(--color-accent)] font-medium hover:underline">Create a new account</Link>
        </p>
      </div>
    );
  }

  // Fallback
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 shadow-sm text-center">
      <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Check your email</h1>
      <p className="text-sm text-[var(--color-text-secondary)] mt-2">
        A verification link has been sent to your inbox.
      </p>
    </div>
  );
}

export function VerifyEmailClient() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 shadow-sm text-center">
          <Loader2 className="h-8 w-8 text-[var(--color-accent)] mx-auto animate-spin" />
        </div>
      }
    >
      <VerifyEmailClientInner />
    </Suspense>
  );
}
