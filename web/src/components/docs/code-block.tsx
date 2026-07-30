'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = 'bash',
  filename,
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border border-[var(--color-border)]',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-4 py-2">
        <div className="flex items-center gap-2">
          {filename && (
            <span className="font-mono text-sm text-[var(--color-text-secondary)]">{filename}</span>
          )}
          <span className="text-xs text-[var(--color-text-muted)] uppercase">{language}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="opacity-0 transition-opacity group-hover:opacity-100"
        >
          {copied ? (
            <>
              <Check className="mr-1 h-4 w-4 text-[var(--color-success)]" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-1 h-4 w-4" />
              Copy
            </>
          )}
        </Button>
      </div>
      <div className="overflow-x-auto bg-[#1e1e2e]">
        <pre className="m-0 p-4 font-mono text-sm leading-relaxed text-[#cdd6f4]">
          {showLineNumbers ? (
            <div className="flex">
              <span
                className="mr-4 text-right text-[#6c7086] select-none"
                style={{ minWidth: '2rem' }}
              >
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </span>
              <code>
                {lines.map((line, i) => (
                  <div key={i}>{line || ' '}</div>
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
