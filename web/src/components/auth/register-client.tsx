"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, User, Github, AlertCircle, CheckCircle } from "lucide-react";

export function RegisterClient() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, username }),
      });

      if (res.ok) {
        setSuccess("Account created! Please check your email to verify your address.");
      } else {
        const data = await res.json();
        setError(data.message || data.error || "Registration failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGithub = async () => {
    setGithubLoading(true);
    const res = await fetch("/api/auth/sign-in/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: "github", callbackURL: "/dashboard" }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } else {
      setError("Failed to initiate GitHub sign-in");
      setGithubLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] text-center">Create account</h1>
      <p className="text-sm text-[var(--color-text-secondary)] text-center mt-2">Get started with AI Context Studio</p>

      {error && (
        <div className="flex items-center gap-2 p-3 mt-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 mt-4 rounded-lg border border-green-500/30 bg-green-500/10 text-green-600 text-sm">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" className="pl-9" disabled={loading} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username (optional)</Label>
          <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="johndoe" disabled={loading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="pl-9" disabled={loading} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="At least 8 characters" className="pl-9" disabled={loading} />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Create Account
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border)]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[var(--color-bg-secondary)] px-2 text-[var(--color-text-muted)]">Or continue with</span>
          </div>
        </div>
        <Button type="button" variant="outline" className="w-full mt-4" onClick={handleGithub} disabled={githubLoading}>
          {githubLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Github className="h-5 w-5 mr-2" />}
          GitHub
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--color-accent)] font-medium hover:underline">Sign In</Link>
      </p>
    </div>
  );
}
