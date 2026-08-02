"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Users,
  Package,
  FileText,
  Box,
  Download,
  Mail,
  AlertTriangle,
  TrendingUp,
  UserPlus,
  PackagePlus,
  Clock,
  Eye,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: React.ReactNode;
  iconColor: string;
  trend?: "up" | "down" | "neutral";
}

function StatCard({ title, value, change, icon, iconColor, trend = "neutral" }: StatCardProps) {
  return (
    <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-muted)] mb-1">{title}</p>
          <p className="text-3xl font-bold text-[var(--color-text-primary)]">{value}</p>
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 mt-2 text-sm", trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-[var(--color-text-muted)]")}>
              <TrendingUp className={cn("h-4 w-4", trend === "down" && "rotate-180")} />
              <span>{change >= 0 ? "+" : ""}{change}%</span>
              <span className="text-[var(--color-text-muted)]">vs last period</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", iconColor)}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface DashboardStatsProps {
  initialStats?: {
    totalUsers: number;
    totalAssets: number;
    totalPosts: number;
    totalBlogPosts: number;
    totalRegistryPackages: number;
    totalDownloads: number;
    totalNewsletterSubscribers: number;
    pendingAssets: number;
    reportedContent: number;
    recentUsers?: Array<{
      id: string;
      name: string | null;
      email: string;
      username: string | null;
      role: string;
      createdAt: string;
      lastLoginAt: string | null;
    }>;
  } | null;
}

export function DashboardStats({ initialStats }: DashboardStatsProps) {
  const [stats, setStats] = useState<DashboardStatsProps["initialStats"]>(initialStats);
  const [loading, setLoading] = useState(!initialStats);

  useEffect(() => {
    if (!initialStats) {
      fetchStats();
    }
  }, [initialStats]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/users?action=stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !initialStats) {
    return null; // Skeleton handled by parent
  }

  const data = stats || {
    totalUsers: 0,
    totalAssets: 0,
    totalPosts: 0,
    totalBlogPosts: 0,
    totalRegistryPackages: 0,
    totalDownloads: 0,
    totalNewsletterSubscribers: 0,
    pendingAssets: 0,
    reportedContent: 0,
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={data.totalUsers.toLocaleString()}
        icon={<Users className="h-6 w-6" />}
        iconColor="bg-blue-500/20 text-blue-500"
      />
      <StatCard
        title="Total Assets"
        value={data.totalAssets.toLocaleString()}
        icon={<Package className="h-6 w-6" />}
        iconColor="bg-purple-500/20 text-purple-500"
      />
      <StatCard
        title="Total Downloads"
        value={data.totalDownloads.toLocaleString()}
        icon={<Download className="h-6 w-6" />}
        iconColor="bg-green-500/20 text-green-500"
      />
      <StatCard
        title="Newsletter Subscribers"
        value={data.totalNewsletterSubscribers.toLocaleString()}
        icon={<Mail className="h-6 w-6" />}
        iconColor="bg-orange-500/20 text-orange-500"
      />
    </div>
  );
}

interface RecentUsersProps {
  initialUsers?: Array<{ id: string; name: string | null; email: string; username: string | null; role: string; createdAt: string; lastLoginAt: string | null }>;
}

export function RecentUsers({ initialUsers }: RecentUsersProps) {
  const [users, setUsers] = useState<Array<{ id: string; name: string | null; email: string; username: string | null; role: string; createdAt: string; lastLoginAt: string | null }> | null>(initialUsers ?? null);
  const [loading, setLoading] = useState(!initialUsers);

  useEffect(() => {
    if (!initialUsers) {
      fetchUsers();
    }
  }, [initialUsers]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users?action=stats");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.recentUsers || []);
      }
    } catch (error) {
      console.error("Failed to fetch recent users:", error);
    } finally {
      setLoading(false);
    }
  };

  const roleColors: Record<string, string> = {
    OWNER: "bg-purple-500/20 text-purple-500",
    ADMIN: "bg-red-500/20 text-red-500",
    MODERATOR: "bg-blue-500/20 text-blue-500",
    USER: "bg-gray-500/20 text-gray-500",
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading && !initialUsers) {
    return null;
  }

  const userList = users || [];

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden">
      <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
        <h3 className="font-semibold text-[var(--color-text-primary)]">Recent Users</h3>
        <a href="/admin/users" className="text-sm text-[var(--color-accent)] hover:underline">View all</a>
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {userList.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-text-muted)]">
            No users yet
          </div>
        ) : (
          userList.map((user) => (
            <div key={user.id} className="p-4 flex items-center gap-4 hover:bg-[var(--color-bg-tertiary)]/50 transition-colors">
              <div className="h-10 w-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-[var(--color-accent)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-[var(--color-text-primary)] truncate">
                    {user.name || user.username || "Unnamed"}
                  </p>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      roleColors[user.role] || roleColors.USER
                    )}
                  >
                    {user.role}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] truncate">{user.email}</p>
              </div>
              <div className="text-right text-sm text-[var(--color-text-muted)] hidden sm:block">
                <p>Joined: {formatDate(user.createdAt)}</p>
                {user.lastLoginAt && <p>Last login: {formatDate(user.lastLoginAt)}</p>}
              </div>
              <a
                href={`/admin/users?action=user&userId=${user.id}`}
                className="p-2 rounded hover:bg-[var(--color-bg-tertiary)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                aria-label={`View ${user.name || user.email}`}
              >
                <Eye className="h-4 w-4" />
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}