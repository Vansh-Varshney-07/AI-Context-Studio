"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Edit2, Trash2, Code2, Search } from "lucide-react";
import { AdminLayoutShell as AdminLayout } from "../layout";

interface Template {
  id: string;
  key: string;
  name: string;
  description: string | null;
  category: string;
  targetId: string | null;
  content: string;
  constraints: string | null;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
  createdAt: string;
}

const CATEGORIES = [
  "system-prompt",
  "instruction-file",
  "persona",
  "workflow",
  "memory",
  "context-file",
  "generic",
];

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    key: "",
    name: "",
    description: "",
    category: "system-prompt",
    targetId: "",
    content: "",
    constraints: "",
    isActive: true,
    isDefault: false,
    sortOrder: 0,
  });

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== "all") {
        params.set("category", categoryFilter);
        const result = await fetch(`/api/admin/templates?${params}`);
        if (result.ok) {
          const data = await result.json();
          setTemplates(data);
        }
      } else {
        const result = await fetch(`/api/admin/templates`);
        if (result.ok) {
          const data = await result.json();
          setTemplates(data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleOpenDialog = (template?: Template) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        key: template.key,
        name: template.name,
        description: template.description || "",
        category: template.category,
        targetId: template.targetId || "",
        content: template.content,
        constraints: template.constraints || "",
        isActive: template.isActive,
        isDefault: template.isDefault,
        sortOrder: template.sortOrder,
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        key: "",
        name: "",
        description: "",
        category: "system-prompt",
        targetId: "",
        content: "",
        constraints: "",
        isActive: true,
        isDefault: false,
        sortOrder: 0,
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
        targetId: formData.targetId || undefined,
        constraints: formData.constraints || undefined,
        description: formData.description || undefined,
      };

      const url = editingTemplate ? `/api/admin/templates?id=${editingTemplate.id}` : "/api/admin/templates";
      const method = editingTemplate ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setDialogOpen(false);
        fetchTemplates();
      }
    } catch (error) {
      console.error("Failed to save template:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template? This cannot be undone.")) return;
    setDeleteLoading(id);
    try {
      await fetch(`/api/admin/templates?id=${id}`, { method: "DELETE" });
      fetchTemplates();
    } catch (error) {
      console.error("Failed to delete template:", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.key.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">AI Templates</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">Manage SystemPromptTemplate entries for AI generation</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </header>

        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <Input placeholder="Search name or key..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)] mx-auto mb-4" />
              <p className="text-[var(--color-text-muted)]">Loading templates...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-64">Template</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Target</TableHead>
                  <TableHead className="hidden lg:table-cell">Order</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-[var(--color-text-muted)]">
                      <Code2 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>No templates found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTemplates.map((template) => (
                    <TableRow key={template.id} className="hover:bg-[var(--color-bg-tertiary)]/50">
                      <TableCell>
                        <p className="font-medium text-[var(--color-text-primary)]">{template.name}</p>
                        <p className="text-xs text-[var(--color-text-muted)] font-mono">{template.key}</p>
                        {template.description && (
                          <p className="text-xs text-[var(--color-text-muted)] truncate max-w-xs mt-1">{template.description}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{template.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge className={template.isActive ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-500"} variant="outline">
                            {template.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {template.isDefault && <Badge className="bg-purple-500/20 text-purple-500 text-xs" variant="outline">Default</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {template.targetId ? <span className="font-mono text-xs">{template.targetId}</span> : <span className="text-[var(--color-text-muted)]">—</span>}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{template.sortOrder}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(template.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(template)} aria-label="Edit template">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(template.id)}
                            disabled={deleteLoading === template.id}
                            className="text-red-500 hover:bg-red-500/10"
                            aria-label="Delete template"
                          >
                            {deleteLoading === template.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "Edit Template" : "New Template"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="key">Key (unique identifier) *</Label>
                <Input id="key" value={formData.key} onChange={(e) => setFormData({ ...formData, key: e.target.value })} required placeholder="e.g., cursor-default-optimization" disabled={!!editingTemplate} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="Display name" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetId">Target ID (optional)</Label>
                  <Input id="targetId" value={formData.targetId} onChange={(e) => setFormData({ ...formData, targetId: e.target.value })} placeholder="e.g., cursor, claude-code" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} placeholder="What this template does..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Prompt Content *</Label>
                <Textarea id="content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required rows={10} className="font-mono text-sm" placeholder="The system prompt or template content..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="constraints">Constraints</Label>
                <Textarea id="constraints" value={formData.constraints} onChange={(e) => setFormData({ ...formData, constraints: e.target.value })} rows={3} placeholder="Rules and constraints for the template..." />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input id="sortOrder" type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="flex items-center gap-6 pt-7">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="rounded" />
                    <span className="text-sm">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isDefault} onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })} className="rounded" />
                    <span className="text-sm">Default</span>
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                {editingTemplate ? "Save Changes" : "Create Template"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
