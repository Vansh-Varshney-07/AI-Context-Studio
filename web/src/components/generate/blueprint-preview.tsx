"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Download, FileText, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EngineOutput } from "@/lib/engine";

interface BlueprintPreviewProps {
  output: EngineOutput | null;
  isGenerating: boolean;
  onDownload: () => void;
  onCopy: () => void;
  filename?: string;
}

export function BlueprintPreview({ output, isGenerating, onDownload, onCopy, filename }: BlueprintPreviewProps) {
  const [copied, setCopied] = useState(false);

  if (!output && !isGenerating) {
    return (
      <Card className="h-full flex flex-col">
        <div className="flex items-center justify-center h-full p-8 text-center">
          <FileText className="h-12 w-12 text-[var(--color-text-muted)] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[var(--color-text-secondary)]">No output yet</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Fill in the form fields to generate your file
          </p>
        </div>
      </Card>
    );
  }

  if (isGenerating && !output) {
    return (
      <Card className="h-full flex flex-col">
        <div className="flex items-center justify-center h-full p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[var(--color-text-secondary)]">Generating…</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Please wait while we create your file</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[var(--color-text-secondary)]" />
          <span className="font-mono text-sm text-[var(--color-text-primary)]">
            {filename || output?.filename || "output.md"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            disabled={isGenerating}
            aria-label="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span className="ml-1 text-xs">Copied!</span>
              </>
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            disabled={isGenerating}
            className="hidden sm:flex"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            disabled={isGenerating}
            className="flex sm:hidden"
            aria-label="Download"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed text-[var(--color-text-primary)] bg-[var(--color-bg-tertiary)] rounded-b-none">
        <pre className="whitespace-pre-wrap break-words">{output?.content || ""}</pre>
      </div>
    </Card>
  );
}