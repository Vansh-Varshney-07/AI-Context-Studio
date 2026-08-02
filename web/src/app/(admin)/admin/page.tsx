import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminLayoutShell as AdminLayout } from "./layout";
import { DashboardStats, RecentUsers } from "@/components/admin/dashboard-stats";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
  description: "AI Context Studio Admin Dashboard",
};

async function getStats() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/admin/users?action=stats`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  } catch {
    return null;
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Dashboard</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Overview of your platform</p>
        </header>

        <Suspense fallback={<DashboardStatsSkeleton />}>
          <DashboardStats initialStats={stats} />
        </Suspense>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Recent Users</h2>
          <Suspense fallback={<RecentUsersSkeleton />}>
            <RecentUsers initialUsers={stats?.recentUsers} />
          </Suspense>
        </section>
      </div>
    </AdminLayout>
  );
}

function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] animate-pulse">
          <div className="h-4 w-1/4 bg-[var(--color-bg-tertiary)] rounded mb-4" />
          <div className="h-8 w-1/2 bg-[var(--color-bg-tertiary)] rounded" />
        </div>
      ))}
    </div>
  );
}

function RecentUsersSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden">
      <div className="p-4 border-b border-[var(--color-border)]">
        <div className="h-5 w-1/4 bg-[var(--color-bg-tertiary)] rounded animate-pulse" />
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-[var(--color-bg-tertiary)]" />
            <div className="flex-1">
              <div className="h-4 w-1/3 bg-[var(--color-bg-tertiary)] rounded mb-2" />
              <div className="h-3 w-1/4 bg-[var(--color-bg-tertiary)] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}