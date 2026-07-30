'use client';

import { useState } from 'react';
import { Copy, Check, Terminal, Monitor, Command, TerminalSquare, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = 'bash',
  filename,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="group relative">
      <div className="flex items-center justify-between rounded-t-lg border-b border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-4 py-2">
        <div className="flex items-center gap-2">
          {filename && (
            <span className="font-mono text-sm text-[var(--color-text-secondary)]">{filename}</span>
          )}
          <span className="text-xs text-[var(--color-text-muted)] capitalize">{language}</span>
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

      <div className="overflow-x-auto rounded-b-lg border border-t-0 bg-[var(--color-bg-primary)]">
        <pre className="line-height-relaxed m-0 p-4 font-mono text-sm text-[var(--color-text-primary)]">
          {showLineNumbers && (
            <span className="mr-4 text-[var(--color-text-muted)] select-none">
              {lines.map((_, i) => (
                <span key={i} className="block">
                  {i + 1}
                </span>
              ))}
            </span>
          )}
          <code className={`language-${language}`}>
            {lines.map((line, i) => (
              <span key={i} className="block">
                {line}
                {i < lines.length - 1 && '\n'}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

interface OSCommandProps {
  windows?: string;
  macos?: string;
  linux?: string;
  description?: string;
}

export function OSCommand({ windows, macos, linux, description }: OSCommandProps) {
  const [activeTab, setActiveTab] = useState<'windows' | 'macos' | 'linux'>('windows');

  const commands = [
    { id: 'windows', label: 'Windows', icon: Monitor, command: windows },
    { id: 'macos', label: 'macOS', icon: Command, command: macos },
    { id: 'linux', label: 'Linux', icon: TerminalSquare, command: linux },
  ].filter((tab) => tab.command);

  return (
    <div className="space-y-4">
      {description && <p className="text-sm text-[var(--color-text-secondary)]">{description}</p>}
      <div className="flex border-b border-[var(--color-border)]" role="tablist">
        {commands.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id as 'windows' | 'macos' | 'linux')}
            className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            <tab.icon className="h-4 w-4" aria-hidden="true" />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="relative" role="tabpanel">
        {commands.map(
          (tab) =>
            tab.command && (
              <CodeBlock
                key={tab.id}
                code={tab.command}
                language="bash"
                filename={
                  tab.id === 'windows'
                    ? 'install.bat'
                    : tab.id === 'macos'
                      ? 'install.sh'
                      : 'install.sh'
                }
              />
            )
        )}
      </div>
    </div>
  );
}

interface CalloutProps {
  type: 'note' | 'tip' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type, title, children }: CalloutProps) {
  const styles = {
    note: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100',
    tip: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-100',
    warning:
      'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-100',
    danger:
      'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-100',
  };

  const icons = {
    note: <FileText className="h-5 w-5" />,
    tip: <Terminal className="h-5 w-5" />,
    warning: <span>⚠</span>,
    danger: <span>🚫</span>,
  };

  const defaultTitles = {
    note: 'Note',
    tip: 'Tip',
    warning: 'Warning',
    danger: 'Danger',
  };

  return (
    <div className={cn('rounded-lg border p-4', styles[type])}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 text-lg">{icons[type]}</div>
        <div className="flex-1">
          {title ||
            (defaultTitles[type] && (
              <p className="mb-1 font-semibold">{title || defaultTitles[type]}</p>
            ))}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}

interface VersionBadgeProps {
  version: string;
  status?: 'stable' | 'beta' | 'alpha' | 'deprecated';
}

export function VersionBadge({ version, status = 'stable' }: VersionBadgeProps) {
  const styles = {
    stable: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    beta: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    alpha: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    deprecated: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      v{version}
      {status !== 'stable' && <span className="ml-1 text-[10px] uppercase">{status}</span>}
    </span>
  );
}
