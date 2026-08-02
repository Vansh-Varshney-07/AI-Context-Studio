"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Target, Users, Shield, Zap, Save, X } from "lucide-react";
import { AdminLayoutShell as AdminLayout } from "../layout";

interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string | null;
  enabled: boolean;
  rollout: number;
  targeting: {
    users?: string[];
    roles?: ("USER" | "MODERATOR" | "ADMIN" | "OWNER")[];
    groups?: string[];
  } | null;
  createdAt: string;
  updatedAt: string;
}

const ROLES = ["USER", "MODERATOR", "ADMIN", "OWNER"] as const;

export default function AdminFeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"enabled" | "disabled" | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<{
    key: string;
    name: string;
    description: string;
    enabled: boolean;
    rollout: number;
    targeting: { users: string[]; roles: ("USER" | "MODERATOR" | "ADMIN" | "OWNER")[]; groups: string[] };
  }>({
    key: "",
    name: "",
    description: "",
    enabled: false,
    rollout: 0,
    targeting: { users: [] as string[], roles: [] as ("USER" | "MODERATOR" | "ADMIN" | "OWNER")[], groups: [] as string[] },
  });

  const fetchFlags = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/feature-flags");
      if (res.ok) {
        const data = await res.json();
        setFlags(data);
      }
    } catch (error) {
      console.error("Failed to fetch feature flags:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const handleOpenDialog = (flag?: FeatureFlag) => {
    if (flag) {
      setEditingFlag(flag);
      setFormData({
        key: flag.key,
        name: flag.name,
        description: flag.description || "",
        enabled: flag.enabled,
        rollout: flag.rollout,
        targeting: {
          users: (flag.targeting as { users?: string[] })?.users ?? [],
          roles: (flag.targeting as { roles?: ("USER" | "MODERATOR" | "ADMIN" | "OWNER")[] })?.roles ?? [],
          groups: (flag.targeting as { groups?: string[] })?.groups ?? [],
        },
      });
    } else {
      setEditingFlag(null);
      setFormData({
        key: "",
        name: "",
        description: "",
        enabled: false,
        rollout: 0,
        targeting: { users: [], roles: [], groups: [] },
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...formData };
      const url = editingFlag ? `/api/admin/feature-flags?id=${editingFlag.id}` : "/api/admin/feature-flags";
      const method = editingFlag ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setDialogOpen(false);
        fetchFlags();
      }
    } catch (error) {
      console.error("Failed to save feature flag:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this feature flag?")) return;
    try {
      await fetch(`/api/admin/feature-flags?id=${id}`, { method: "DELETE" });
      fetchFlags();
    } catch (error) {
      console.error("Failed to delete feature flag:", error);
    }
  };

  const handleToggle = async (flag: FeatureFlag) => {
    try {
      await fetch(`/api/admin/feature-flags?id=${flag.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !flag.enabled }),
      });
      fetchFlags();
    } catch (error) {
      console.error("Failed to toggle feature flag:", error);
    }
  };

  const filteredFlags = flags.filter((f) => {
    if (activeTab === "enabled") return f.enabled;
    if (activeTab === "disabled") return !f.enabled;
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Feature Flags</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">Control feature rollouts and targeting</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            New Feature Flag
          </Button>
        </header>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "enabled" | "disabled" | "all")} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="enabled">Enabled</TabsTrigger>
            <TabsTrigger value="disabled">Disabled</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value="enabled" className="mt-4">
            <FeatureFlagsTable flags={filteredFlags} loading={loading} onEdit={handleOpenDialog} onDelete={handleDelete} onToggle={handleToggle} />
          </TabsContent>
          <TabsContent value="disabled" className="mt-4">
            <FeatureFlagsTable flags={filteredFlags} loading={loading} onEdit={handleOpenDialog} onDelete={handleDelete} onToggle={handleToggle} />
          </TabsContent>
          <TabsContent value="all" className="mt-4">
            <FeatureFlagsTable flags={filteredFlags} loading={loading} onEdit={handleOpenDialog} onDelete={handleDelete} onToggle={handleToggle} />
          </TabsContent>
        </Tabs>

        {/* Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFlag ? "Edit Feature Flag" : "New Feature Flag"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="key">Key (unique identifier)</Label>
                  <Input id="key" value={formData.key} onChange={(e) => setFormData({ ...formData, key: e.target.value })} required placeholder="feature.new-dashboard" disabled={!!editingFlag} />
                  <p className="text-xs text-[var(--color-text-muted)]">Cannot be changed after creation</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="New Dashboard" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="What does this flag control?" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="enabled">Enabled</Label>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="enabled"
                        checked={formData.enabled}
                        onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                      />
                      <Label htmlFor="enabled" className="mb-0">Enable this feature</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rollout">Rollout %</Label>
                    <Input id="rollout" type="number" value={formData.rollout} onChange={(e) => setFormData({ ...formData, rollout: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })} min="0" max="100" />
                    <p className="text-xs text-[var(--color-text-muted)]">Percentage of users (0-100)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Targeting</Label>
                  <div className="space-y-4 p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)]">
                    <div className="space-y-2">
                      <Label>Roles</Label>
                      <div className="flex flex-wrap gap-2">
                        {ROLES.map((role) => (
                          <label key={role} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={formData.targeting.roles?.includes(role as any) || false}
                              onChange={(e) => setFormData({ ...formData, targeting: { ...formData.targeting, roles: e.target.checked ? [...(formData.targeting.roles || []), role] : (formData.targeting.roles || []).filter((r) => r !== role) } })}
                            />
                            <span className="text-sm">{role}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="targetUsers">User IDs (comma-separated)</Label>
                      <Input
                        id="targetUsers"
                        value={formData.targeting.users?.join(", ") || ""}
                        onChange={(e) => setFormData({ ...formData, targeting: { ...formData.targeting, users: e.target.value.split(",").map((u) => u.trim()).filter(Boolean) } })}
                        placeholder="user1, user2, user3"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="targetGroups">Groups (comma-separated)</Label>
                      <Input
                        id="targetGroups"
                        value={formData.targeting.groups?.join(", ") || ""}
                        onChange={(e) => setFormData({ ...formData, targeting: { ...formData.targeting, groups: e.target.value.split(",").map((g) => g.trim()).filter(Boolean) } })}
                        placeholder="beta-testers, enterprise"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  {editingFlag ? "Save Changes" : "Create Feature Flag"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

function FeatureFlagsTable({
  flags,
  loading,
  onEdit,
  onDelete,
  onToggle,
}: {
  flags: FeatureFlag[];
  loading: boolean;
  onEdit: (flag: FeatureFlag) => void;
  onDelete: (id: string) => void;
  onToggle: (flag: FeatureFlag) => void;
}) {
  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)] mx-auto mb-4" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-48">Key</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead className="hidden lg:table-cell">Status</TableHead>
            <TableHead className="hidden lg:table-cell">Rollout</TableHead>
            <TableHead className="hidden lg:table-cell">Targeting</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-32 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flags.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-[var(--color-text-muted)]">
                No feature flags
              </TableCell>
            </TableRow>
          ) : (
            flags.map((flag) => (
              <TableRow key={flag.id} className="hover:bg-[var(--color-bg-tertiary)]/50">
                <TableCell>
                  <code className="font-mono text-sm text-[var(--color-text-primary)]">{flag.key}</code>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-[var(--color-text-primary)]">{flag.name}</p>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <p className="text-sm text-[var(--color-text-muted)] truncate max-w-xs">{flag.description || "—"}</p>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge variant={flag.enabled ? "default" : "secondary"}>
                    {flag.enabled ? <ToggleRight className="h-4 w-4 mr-1" /> : <ToggleLeft className="h-4 w-4 mr-1" />}
                    {flag.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--color-accent)] rounded-full transition-all" style={{ width: `${flag.rollout}%` }} />
                    </div>
                    <span className="text-sm font-mono text-[var(--color-text-primary)] w-12">{flag.rollout}%</span>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {flag.targeting?.roles?.length && (
                      <Badge variant="outline" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        {flag.targeting.roles.join(", ")}
                      </Badge>
                    )}
                    {flag.targeting?.users?.length && (
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {flag.targeting.users.length} users
                      </Badge>
                    )}
                    {flag.targeting?.groups?.length && (
                      <Badge variant="outline" className="text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        {flag.targeting.groups.join(", ")}
                      </Badge>
                    )}
                    {!flag.targeting?.roles?.length && !flag.targeting?.users?.length && !flag.targeting?.groups?.length && (
                      <span className="text-xs text-[var(--color-text-muted)]">Everyone</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-[var(--color-text-secondary)]">{new Date(flag.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onToggle(flag)}>
                      {flag.enabled ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(flag)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(flag.id)} className="text-red-500 hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}