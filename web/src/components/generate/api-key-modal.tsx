"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PROVIDERS = [
  { id: "openai", label: "OpenAI", models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"] },
  { id: "claude", label: "Anthropic Claude", models: ["claude-3-5-sonnet-20241022", "claude-3-opus-20240229", "claude-3-haiku-20240307"] },
  { id: "gemini", label: "Google Gemini", models: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.0-pro"] },
  { id: "deepseek", label: "DeepSeek", models: ["deepseek-chat", "deepseek-coder"] },
  { id: "openrouter", label: "OpenRouter", models: ["auto"] },
  { id: "nvidia", label: "NVIDIA NIM", models: ["auto"] },
  { id: "ollama", label: "Local Ollama", models: ["llama3.1", "codellama", "mistral", "qwen2.5"] },
] as const;

type ProviderId = (typeof PROVIDERS)[number]["id"];

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (provider: { provider: string; apiKey: string; model?: string }) => void;
  currentProvider?: string;
}

export function ApiKeyModal({ open, onClose, onSubmit, currentProvider }: ApiKeyModalProps) {
  const [provider, setProvider] = useState<string>(currentProvider || "openai");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProvider = PROVIDERS.find((p) => p.id === provider);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError("API key is required");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({ provider, apiKey: apiKey.trim(), model: model || undefined });
    } catch {
      setError("Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <Card className="w-full max-w-md animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">API Key for AI Generation</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--color-bg-secondary)] transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-[var(--color-text-muted)]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider" className="text-sm font-medium">Provider</Label>
            <Select value={provider} onValueChange={setProvider} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProvider && (
            <div className="space-y-2">
              <Label htmlFor="model" className="text-sm font-medium">Model (optional)</Label>
              <Select value={model} onValueChange={setModel} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model (defaults to provider default)" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProvider.models.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-sm font-medium">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isSubmitting}
              required
              autoComplete="off"
              autoFocus
            />
            <p className="text-xs text-[var(--color-text-muted)]">
              Your API key is used only for this generation request and is not stored.
            </p>
          </div>

          {error && (
            <p className="text-sm text-[var(--color-error)]" role="alert">{error}</p>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting || !apiKey.trim()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                "Generate with AI"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}