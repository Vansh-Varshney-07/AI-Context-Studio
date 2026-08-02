"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Search, ChevronDown, ChevronUp, MoreVertical, Shield, User, UserCheck, Ban, Loader2 } from "lucide-react";
import { AdminLayoutShell as AdminLayout } from "../layout";

const ROLES = ["USER", "MODERATOR", "ADMIN", "OWNER"] as const;
type Role = typeof ROLES[number];

interface User {
  id: string;
  name: string | null;
  email: string;
  username: string | null;
  avatar: string | null;
  role: Role;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  _count: {
    assets: number;
    posts: number;
    followers: number;
    following: number;
  };
}

interface UsersResponse {
  users: User[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        action: "users",
        page: page.toString(),
        limit: "50",
      });
      if (search) params.set("search", search);
      if (roleFilter !== "all") params.set("role", roleFilter);

      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data: UsersResponse = await res.json();
        setUsers(data.users);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users?action=update-role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      }
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBan = async (userId: string) => {
    if (!confirm("Ban this user? This will reset their role to USER.")) return;
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users?action=ban`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: "USER" } : u)));
      }
    } catch (error) {
      console.error("Failed to ban user:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const roleColors: Record<Role, string> = {
    OWNER: "bg-purple-500/20 text-purple-500",
    ADMIN: "bg-red-500/20 text-red-500",
    MODERATOR: "bg-blue-500/20 text-blue-500",
    USER: "bg-gray-500/20 text-gray-500",
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Users</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">Manage user accounts and roles</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--color-text-muted)]">{totalCount} users</span>
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <Input
              placeholder="Search name, email, username..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
              onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
            />
          </div>
          <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v as Role | "all"); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {ROLES.map((role) => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)] mx-auto mb-4" />
              <p className="text-[var(--color-text-muted)]">Loading users...</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden md:table-cell">Email Verified</TableHead>
                    <TableHead className="hidden lg:table-cell">Assets</TableHead>
                    <TableHead className="hidden lg:table-cell">Posts</TableHead>
                    <TableHead className="hidden lg:table-cell">Joined</TableHead>
                    <TableHead className="hidden lg:table-cell">Last Login</TableHead>
                    <TableHead className="w-48 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-[var(--color-text-muted)]">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-[var(--color-bg-tertiary)]/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center">
                              {user.avatar ? (
                                <img src={user.avatar} alt="" className="h-8 w-8 rounded-full" />
                              ) : (
                                <User className="h-5 w-5 text-[var(--color-accent)]" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-[var(--color-text-primary)] truncate max-w-xs">
                                {user.name || user.username || "Unnamed"}
                              </p>
                              <p className="text-xs text-[var(--color-text-muted)] truncate max-w-xs">@{user.username || "no-username"}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("cursor-pointer", roleColors[user.role])} variant="outline">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {user.emailVerified ? (
                            <span className="flex items-center gap-1 text-green-500">
                              <UserCheck className="h-4 w-4" />
                              Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-yellow-500">
                              <Shield className="h-4 w-4" />
                              Pending
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{user._count.assets}</TableCell>
                        <TableCell className="hidden lg:table-cell">{user._count.posts}</TableCell>
                        <TableCell className="hidden lg:table-cell">{formatDate(user.createdAt)}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {user.lastLoginAt ? formatDate(user.lastLoginAt) : "Never"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Select
                              value={user.role}
                              onValueChange={(v) => handleRoleChange(user.id, v as Role)}
                              disabled={actionLoading === user.id}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent side="bottom" align="end">
                                {ROLES.map((role) => (
                                  <SelectItem key={role} value={role}>{role}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleBan(user.id)}
                              disabled={actionLoading === user.id || user.role === "OWNER"}
                              className="text-red-500 hover:bg-red-500/10"
                              aria-label="Ban user"
                            >
                              {actionLoading === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Ban className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <div className="border-t border-[var(--color-border)] p-4">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    showFirstLast
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}