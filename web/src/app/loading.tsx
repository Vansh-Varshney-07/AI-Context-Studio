import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-primary)]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--color-accent)]" aria-hidden="true" />
        <p className="text-sm text-[var(--color-text-secondary)]">Loading...</p>
      </div>
    </div>
  );
}
