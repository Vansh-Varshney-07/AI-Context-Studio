"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({ code, language = "bash", filename, showLineNumbers = false, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className={cn("relative group rounded-lg overflow-hidden border border-[var(--color-border)]", className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          {filename && <span className="text-sm font-mono text-[var(--color-text-secondary)]">{filename}</span>}
          <span className="text-xs text-[var(--color-text-muted)] uppercase">{language}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleCopy} className="opacity-0 group-hover:opacity-100 transition-opacity">
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1 text-[var(--color-success)]" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>
      <div className="bg-[#1e1e2e] overflow-x-auto">
        <pre className="p-4 m-0 text-sm font-mono text-[#cdd6f4] leading-relaxed">
          {showLineNumbers ? (
            <div className="flex">
              <span className="select-none mr-4 text-[#6c7086] text-right" style={{ minWidth: "2rem" }}>
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </span>
              <code>
                {lines.map((line, i) => (
                  <div key={i}>{line || " "}</div>
                ))}
              </code>
            </div>
          ) : (
            <code>{code}</code>
          )}
        </pre>
      </div>
    </div>
  );
}