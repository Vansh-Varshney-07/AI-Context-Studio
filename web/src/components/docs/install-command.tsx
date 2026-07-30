'use client';

import { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InstallCommandProps {
  command: string;
  label?: string;
  className?: string;
}

export function InstallCommand({ command, label = 'Install', className }: InstallCommandProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[#1e1e2e] p-3',
        className
      )}
    >
      <Terminal className="h-4 w-4 flex-shrink-0 text-[#6c7086]" aria-hidden="true" />
      <code className="flex-1 overflow-x-auto font-mono text-sm whitespace-nowrap text-[#cdd6f4]">
        {command}
      </code>
      <button
        onClick={handleCopy}
        className="flex-shrink-0 rounded-md p-1.5 text-[#6c7086] transition-colors hover:bg-[#313244] hover:text-[#cdd6f4]"
        aria-label={copied ? 'Copied' : `Copy ${label} command`}
      >
        {copied ? <Check className="h-4 w-4 text-[#a6e3a1]" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}
