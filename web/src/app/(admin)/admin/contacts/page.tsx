"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Mail, Search, Eye, Send, Clock } from "lucide-react";
import { AdminLayoutShell as AdminLayout } from "../layout";

type ContactStatus = "NEW" | "IN_PROGRESS" | "WAITING_USER" | "RESOLVED" | "CLOSED";
type ContactType = "GENERAL" | "SUPPORT" | "BUG_REPORT" | "FEATURE_REQUEST" | "SECURITY" | "PARTNERSHIP" | "PRESS" | "ENTERPRISE";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: ContactType;
  status: ContactStatus;
  assignedTo: string | null;
  response: string | null;
  respondedAt: string | null;
  createdAt: string;
  user: { id: string; name: string | null; username: string | null; email: string } | null;
}

interface ContactResponse {
  messages: ContactMessage[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

const STATUS_COLORS: Record<ContactStatus, string> = {
  NEW: "bg-blue-500/20 text-blue-500",
  IN_PROGRESS: "bg-yellow-500/20 text-yellow-500",
  WAITING_USER: "bg-orange-500/20 text-orange-500",
  RESOLVED: "bg-green-500/20 text-green-500",
  CLOSED: "bg-gray-500/20 text-gray-500",
};

const TYPE_LABELS: Record<ContactType, string> = {
  GENERAL: "General",
  SUPPORT: "Support",
  BUG_REPORT: "Bug Report",
  FEATURE_REQUEST: "Feature Request",
  SECURITY: "Security",
  PARTNERSHIP: "Partnership",
  PRESS: "Press",
  ENTERPRISE: "Enterprise",
};

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ContactType | "all">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "50" });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (typeFilter !== "all") params.set("type", typeFilter);

      const res = await fetch(`/api/admin/contacts?${params}`);
      if (res.ok) {
        const data: ContactResponse = await res.json();
        setMessages(data.messages);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
      }
    } catch (error) {
      console.error("Failed to fetch contact messages:", error);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, typeFilter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleUpdateStatus = async (id: string, status: ContactStatus) => {
    try {
      await fetch(`/api/admin/contacts?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchMessages();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setReplyText("");
    setDialogOpen(true);
    if (message.status === "NEW") {
      handleUpdateStatus(message.id, "IN_PROGRESS");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Contact Messages</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">Manage user inquiries and support requests</p>
          </div>
          <span className="text-sm text-[var(--color-text-muted)]">{totalCount} messages</span>
        </header>

        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as ContactStatus | "all"); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="WAITING_USER">Waiting User</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v as ContactType | "all"); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)] mx-auto mb-4" />
              <p className="text-[var(--color-text-muted)]">Loading messages...</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48">From</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-[var(--color-text-muted)]">
                        <Mail className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p>No messages found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    messages.map((message) => (
                      <TableRow key={message.id} className="hover:bg-[var(--color-bg-tertiary)]/50">
                        <TableCell>
                          <p className="font-medium text-[var(--color-text-primary)] truncate">{message.name}</p>
                          <p className="text-xs text-[var(--color-text-muted)] truncate">{message.email}</p>
                        </TableCell>
                        <TableCell>
                          {message.user && <Badge variant="secondary" className="mb-1 text-xs">User</Badge>}
                          <p className="font-medium truncate max-w-xs">{message.subject}</p>
                          <p className="text-xs text-[var(--color-text-muted)] truncate max-w-xs">{message.message.slice(0, 60)}...</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{TYPE_LABELS[message.type]}</Badge>
                        </TableCell>
                        <TableCell>
                          <Select value={message.status} onValueChange={(v) => handleUpdateStatus(message.id, v as ContactStatus)}>
                            <SelectTrigger className="w-32 h-8 text-xs">
                              <Badge className={STATUS_COLORS[message.status]} variant="outline">{message.status.replace("_", " ")}</Badge>
                            </SelectTrigger>
                            <SelectContent>
                              {(["NEW", "IN_PROGRESS", "WAITING_USER", "RESOLVED", "CLOSED"] as ContactStatus[]).map((s) => (
                                <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{formatDate(message.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewMessage(message)} aria-label="View message">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <div className="border-t border-[var(--color-border)] p-4">
                  <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} showFirstLast />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Message Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contact Message</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">From</p>
                  <p className="font-medium">{selectedMessage.name}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{selectedMessage.email}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Date</p>
                  <p className="text-sm">{formatDate(selectedMessage.createdAt)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Subject</p>
                <p className="font-medium">{selectedMessage.subject}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Type</p>
                  <Badge variant="outline" className="mt-1">{TYPE_LABELS[selectedMessage.type]}</Badge>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Status</p>
                  <Badge className={STATUS_COLORS[selectedMessage.status]} variant="outline" >{selectedMessage.status.replace("_", " ")}</Badge>
                </div>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Message</p>
                <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)]">
                  <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              {selectedMessage.response && (
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">Previous Response</p>
                  <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                    <p className="text-sm whitespace-pre-wrap">{selectedMessage.response}</p>
                    {selectedMessage.respondedAt && (
                      <p className="text-xs text-[var(--color-text-muted)] mt-2">
                        Replied: {formatDate(selectedMessage.respondedAt)}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--color-text-secondary)]">Reply / Response</label>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={5}
                  placeholder="Type your response..."
                />
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setDialogOpen(false)}>Close</Button>
                <Button
                  onClick={() => {
                    if (!replyText.trim()) return;
                    setSendingReply(true);
                    handleUpdateStatus(selectedMessage.id, "RESOLVED");
                    setSendingReply(false);
                    setDialogOpen(false);
                  }}
                  disabled={sendingReply || !replyText.trim()}
                >
                  {sendingReply ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Send & Resolve
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
