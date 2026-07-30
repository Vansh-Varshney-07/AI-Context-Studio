import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg-primary)] px-6 text-center">
      <p className="text-8xl font-bold text-[var(--color-accent)]">404</p>
      <h1 className="mt-4 text-3xl font-bold text-[var(--color-text-primary)]">
        Page Not Found
      </h1>
      <p className="mt-2 max-w-md text-[var(--color-text-secondary)]">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button size="lg">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </Link>
        <Link href="/docs">
          <Button size="lg" variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Browse Docs
          </Button>
        </Link>
      </div>
    </div>
  );
}
