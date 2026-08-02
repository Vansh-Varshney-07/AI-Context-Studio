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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Edit2, Trash2, Megaphone, AlertTriangle, Info, Shield, Calendar, Link2, X, Save, Clock } from "lucide-react";
import { AdminLayoutShell as AdminLayout } from "../layout";

type AnnouncementType = "INFO" | "WARNING" | "MAINTENANCE" | "RELEASE" | "SECURITY" | "FEATURE";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  priority: number;
  isGlobal: boolean;
  targetRoles: ("USER" | "MODERATOR" | "ADMIN" | "OWNER")[];
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  actionUrl: string | null;
  actionLabel: string | null;
  createdAt: string;
  updatedAt: string;
}

const TYPE_COLORS: Record<AnnouncementType, string> = {
  INFO: "bg-blue-500/20 text-blue-500",
  WARNING: "bg-yellow-500/20 text-yellow-500",
  MAINTENANCE: "bg-orange-500/20 text-orange-500",
  RELEASE: "bg-green-500/20 text-green-500",
  SECURITY: "bg-red-500/20 text-red-500",
  FEATURE: "bg-purple-500/20 text-purple-500",
};

const TYPE_ICONS: Record<AnnouncementType, React.ReactNode> = {
  INFO: <Info className="h-4 w-4" />,
  WARNING: <AlertTriangle className="h-4 w-4" />,
  MAINTENANCE: <Clock className="h-4 w-4" />,
  RELEASE: <Megaphone className="h-4 w-4" />,
  SECURITY: <Shield className="h-4 w-4" />,
  FEATURE: <Link2 className="h-4 w-4" />,
};

const ROLES: ("USER" | "MODERATOR" | "ADMIN" | "OWNER")[] = ["USER", "MODERATOR", "ADMIN", "OWNER"];

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "all">("active");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "INFO" as AnnouncementType,
    priority: 0,
    isGlobal: true,
    targetRoles: ROLES,
    startsAt: "",
    endsAt: "",
    actionUrl: "",
    actionLabel: "",
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/announcements");
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleOpenDialog = (announcement?: Announcement) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setFormData({
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        priority: announcement.priority,
        isGlobal: announcement.isGlobal,
        targetRoles: announcement.targetRoles,
        startsAt: announcement.startsAt ? new Date(announcement.startsAt).toISOString().slice(0, 16) : "",
        endsAt: announcement.endsAt ? new Date(announcement.endsAt).toISOString().slice(0, 16) : "",
        actionUrl: announcement.actionUrl || "",
        actionLabel: announcement.actionLabel || "",
      });
    } else {
      setEditingAnnouncement(null);
      setFormData({
        title: "",
        content: "",
        type: "INFO",
        priority: 0,
        isGlobal: true,
        targetRoles: ROLES,
        startsAt: "",
        endsAt: "",
        actionUrl: "",
        actionLabel: "",
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        targetRoles: formData.isGlobal ? ROLES : formData.targetRoles,
        startsAt: formData.startsAt ? new Date(formData.startsAt).toISOString() : undefined,
        endsAt: formData.endsAt ? new Date(formData.endsAt).toISOString() : undefined,
      };

      const url = editingAnnouncement
        ? `/api/admin/announcements?id=${editingAnnouncement.id}`
        : "/api/admin/announcements";
      const method = editingAnnouncement ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setDialogOpen(false);
        fetchAnnouncements();
      }
    } catch (error) {
      console.error("Failed to save announcement:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      await fetch(`/api/admin/announcements?id=${id}`, { method: "DELETE" });
      fetchAnnouncements();
    } catch (error) {
      console.error("Failed to delete announcement:", error);
    }
  };

  const toggleRole = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role as any)
        ? prev.targetRoles.filter((r) => r !== role)
        : [...prev.targetRoles, role as any],
    }));
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const filteredAnnouncements = announcements.filter((a) =>
    activeTab === "active" ? a.isActive : true
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Announcements</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">Create and manage platform-wide announcements</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </Button>
        </header>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "active" | "all")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            <AnnouncementsTable
              announcements={filteredAnnouncements}
              loading={loading}
              onEdit={handleOpenDialog}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="all" className="mt-4">
            <AnnouncementsTable
              announcements={announcements}
              loading={loading}
              onEdit={handleOpenDialog}
              onDelete={handleDelete}
            />
          </TabsContent>
        </Tabs>

        {/* Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAnnouncement ? "Edit Announcement" : "New Announcement"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required placeholder="Announcement title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content (Markdown supported)</Label>
                  <Textarea id="content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required rows={6} placeholder="Announcement content..." />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as AnnouncementType })}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {(["INFO", "WARNING", "MAINTENANCE", "RELEASE", "SECURITY", "FEATURE"] as AnnouncementType[]).map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Input id="priority" type="number" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })} min="0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isGlobal"
                      checked={formData.isGlobal}
                      onChange={(e) => setFormData({ ...formData, isGlobal: e.target.checked })}
                    />
                    <Label htmlFor="isGlobal">Global (all roles)</Label>
                  </div>
                  {!formData.isGlobal && (
                    <div className="space-y-2 ml-6">
                      <Label>Target Roles</Label>
                      <div className="flex flex-wrap gap-2">
                        {ROLES.map((role) => (
                          <label key={role} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={formData.targetRoles.includes(role as any)}
                              onChange={() => toggleRole(role)}
                            />
                            <span className="text-sm">{role}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startsAt">Starts At</Label>
                    <Input id="startsAt" type="datetime-local" value={formData.startsAt} onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endsAt">Ends At</Label>
                    <Input id="endsAt" type="datetime-local" value={formData.endsAt} onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="actionUrl">Action URL</Label>
                    <Input id="actionUrl" value={formData.actionUrl} onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })} placeholder="https://example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="actionLabel">Action Label</Label>
                    <Input id="actionLabel" value={formData.actionLabel} onChange={(e) => setFormData({ ...formData, actionLabel: e.target.value })} placeholder="Learn More" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  {editingAnnouncement ? "Save Changes" : "Create Announcement"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

function AnnouncementsTable({
  announcements,
  loading,
  onEdit,
  onDelete,
}: {
  announcements: Announcement[];
  loading: boolean;
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: string) => void;
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
            <TableHead>Announcement</TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead className="hidden lg:table-cell">Priority</TableHead>
            <TableHead className="hidden lg:table-cell">Scope</TableHead>
            <TableHead className="hidden lg:table-cell">Schedule</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-32 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {announcements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-[var(--color-text-muted)]">
                No announcements
              </TableCell>
            </TableRow>
          ) : (
            announcements.map((announcement) => (
              <TableRow key={announcement.id} className="hover:bg-[var(--color-bg-tertiary)]/50">
                <TableCell>
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">{announcement.title}</p>
                    <p className="text-xs text-[var(--color-text-muted)] truncate max-w-xs">{announcement.content.slice(0, 80)}...</p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge className={TYPE_COLORS[announcement.type]} variant="outline">
                    <span className="flex items-center gap-1">{TYPE_ICONS[announcement.type]} {announcement.type}</span>
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="font-mono text-[var(--color-text-primary)]">{announcement.priority}</span>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {announcement.isGlobal ? (
                    <Badge variant="secondary">Global</Badge>
                  ) : (
                    <Badge variant="outline">{announcement.targetRoles.join(", ")}</Badge>
                  )}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    <p>Starts: {formatDate(announcement.startsAt)}</p>
                    <p>Ends: {formatDate(announcement.endsAt)}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={announcement.isActive ? "default" : "secondary"}>
                    {announcement.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(announcement)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(announcement.id)} className="text-red-500 hover:bg-red-500/10">
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

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}