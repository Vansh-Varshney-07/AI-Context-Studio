"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Upload, 
  Clipboard, 
  Zap, 
  Shield, 
  Brain, 
  Download, 
  Copy, 
  RefreshCw, 
  Settings, 
  X, 
  Sparkles,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@utils";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { ScrollArea } from "@components/ui/scroll-area";
import { Tag } from "@components/common/tag";
import { EmptyState } from "@components/common/empty-state";
import { Switch } from "@components/ui/switch";
import { Separator } from "@components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/ui/tooltip";
import { moduleTransition } from "@components/motion";
import { useToast } from "@providers/toaster-provider";
import { downloadFile, copyToClipboard } from "@utils";

import type { PromptType, TargetModel, OptimizationType, OptimizationMode } from "@/features/optimizer/types";
import { Optimizer } from "@/features/optimizer/services/optimizer";

const SUPPORTED_PROMPT_TYPES: { value: PromptType; label: string; description: string; icon: React.ReactNode }[] = [
  { value: "system-prompt", label: "System Prompt", description: "AI system instructions and role definitions", icon: <Clipboard className="size-3.5" /> },
  { value: "developer-prompt", label: "Developer Prompt", description: "Technical instructions for AI developers", icon: <FileText className="size-3.5" /> },
  { value: "user-prompt", label: "User Prompt", description: "End-user questions and requests", icon: <FileText className="size-3.5" /> },
  { value: "claude-prompt", label: "Claude Prompt", description: "Optimized for Anthropic Claude models", icon: <Sparkles className="size-3.5" /> },
  { value: "chatgpt-prompt", label: "ChatGPT Prompt", description: "Optimized for OpenAI GPT models", icon: <Sparkles className="size-3.5" /> },
  { value: "gemini-prompt", label: "Gemini Prompt", description: "Optimized for Google Gemini models", icon: <Sparkles className="size-3.5" /> },
  { value: "deepseek-prompt", label: "DeepSeek Prompt", description: "Optimized for DeepSeek models", icon: <Sparkles className="size-3.5" /> },
  { value: "codex-prompt", label: "Codex Prompt", description: "Optimized for Codex CLI", icon: <Zap className="size-3.5" /> },
  { value: "general-prompt", label: "General AI Prompt", description: "Generic prompt for any model", icon: <Clipboard className="size-3.5" /> },
  { value: "workflow-prompt", label: "Workflow Prompt", description: "Multi-step AI processes and pipelines", icon: <Zap className="size-3.5" /> },
];

const OPTIMIZATION_TYPES: { value: OptimizationType; label: string; description: string; icon: React.ReactNode }[] = [
  { value: "clarity", label: "Clarity", description: "Improve readability and remove ambiguity", icon: <FileText className="size-3.5" /> },
  { value: "conciseness", label: "Conciseness", description: "Reduce length while preserving meaning", icon: <Zap className="size-3.5" /> },
  { value: "context-expansion", label: "Context Expansion", description: "Add relevant background information", icon: <Clipboard className="size-3.5" /> },
  { value: "role-definition", label: "Role Definition", description: "Define clear persona and boundaries", icon: <FileText className="size-3.5" /> },
  { value: "constraint-improvement", label: "Constraints", description: "Add guardrails and boundaries", icon: <FileText className="size-3.5" /> },
  { value: "output-formatting", label: "Output Formatting", description: "Specify response structure", icon: <Clipboard className="size-3.5" /> },
  { value: "chain-of-thought", label: "Chain of Thought", description: "Add step-by-step reasoning", icon: <Zap className="size-3.5" /> },
  { value: "reasoning-enhancement", label: "Reasoning", description: "Improve logical structure", icon: <Zap className="size-3.5" /> },
  { value: "few-shot-preparation", label: "Few-Shot", description: "Add examples for better performance", icon: <FileText className="size-3.5" /> },
  { value: "prompt-engineering", label: "Prompt Engineering", description: "Apply best practices patterns", icon: <Sparkles className="size-3.5" /> },
  { value: "tool-usage", label: "Tool Usage", description: "Optimize function calling", icon: <Zap className="size-3.5" /> },
  { value: "memory-usage", label: "Memory Strategy", description: "Optimize context management", icon: <Clipboard className="size-3.5" /> },
  { value: "token-reduction", label: "Token Reduction", description: "Minimize token usage", icon: <Zap className="size-3.5" /> },
  { value: "performance-optimization", label: "Performance", description: "Optimize for speed", icon: <Zap className="size-3.5" /> },
  { value: "cost-optimization", label: "Cost Optimization", description: "Reduce API costs", icon: <Zap className="size-3.5" /> },
  { value: "safety", label: "Safety", description: "Add safety guardrails", icon: <FileText className="size-3.5" /> },
  { value: "workflow-completeness", label: "Workflow", description: "Complete multi-step workflows", icon: <Zap className="size-3.5" /> },
];

const OPTIMIZATION_MODES: { value: OptimizationMode; label: string; description: string }[] = [
  { value: "general", label: "General", description: "Balanced optimization for any use case" },
  { value: "coding", label: "Coding", description: "Optimize for code generation and debugging" },
  { value: "research", label: "Research", description: "Optimize for analysis and fact-finding" },
  { value: "writing", label: "Writing", description: "Optimize for creative and technical writing" },
  { value: "education", label: "Education", description: "Optimize for teaching and learning" },
  { value: "architecture", label: "Architecture", description: "Optimize for system design" },
  { value: "debugging", label: "Debugging", description: "Optimize for error analysis" },
  { value: "agent", label: "Agent", description: "Optimize for autonomous agents" },
  { value: "frontend", label: "Frontend", description: "Optimize for UI development" },
  { value: "backend", label: "Backend", description: "Optimize for server-side development" },
  { value: "fullstack", label: "Full Stack", description: "Optimize for end-to-end development" },
];

interface PromptEditorProps {
  content: string;
  onChange: (content: string) => void;
  promptType: PromptType;
  onPromptTypeChange: (type: PromptType) => void;
  isOptimizing: boolean;
  onOptimize: () => void;
  onQuickOptimize: () => void;
  onClear: () => void;
  onImport: (file: File) => void;
  dragActive: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  quickScore: { score: number; grade: string; criticalIssues: number } | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function PromptEditor({
  content,
  onChange,
  promptType,
  onPromptTypeChange,
  isOptimizing,
  onOptimize,
  onQuickOptimize,
  onClear,
  onImport,
  dragActive,
  onDragOver,
  onDragLeave,
  onDrop,
  fileInputRef,
  quickScore,
  activeTab,
  setActiveTab,
}: PromptEditorProps) {
  const [showSettings, setShowSettings] = React.useState(false);
  const { toast } = useToast();

  const handleFileSelect = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImport(file);
  }, [onImport]);

  return (
    <div className="flex h-full flex-col border-r border-border bg-bg-secondary">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-text-primary">Prompt Optimizer</h1>
            <p className="text-xs text-text-muted">Improve prompts with intelligent optimization</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="size-4" />
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b border-border px-4 py-3 bg-bg-tertiary">
          <div className="space-y-3">
            <div>
              <Label className="mb-1.5 text-xs font-medium text-text-secondary">Prompt Type</Label>
              <Select value={promptType} onValueChange={onPromptTypeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Auto-detect" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_PROMPT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        {type.icon}
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">{type.label}</span>
                          <span className="text-[10px] text-text-muted">{type.description}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-1.5 text-xs font-medium text-text-secondary">Optimization Types</Label>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-auto">
                {OPTIMIZATION_TYPES.map((type) => (
                  <label key={type.value} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="size-3.5 rounded border-border text-accent" />
                    <span className="text-xs text-text-secondary">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-1.5 text-xs font-medium text-text-secondary">Mode</Label>
              <Select value="general" onValueChange={() => {}}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="General" />
                </SelectTrigger>
                <SelectContent>
                  {OPTIMIZATION_MODES.map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">{mode.label}</span>
                        <span className="text-[10px] text-text-muted">{mode.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Switch checked={false} onCheckedChange={() => {}} id="preserve-original" />
              <Label htmlFor="preserve-original" className="text-xs text-text-secondary cursor-pointer">
                Preserve original structure
              </Label>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 border-b border-border bg-bg-secondary">
            <TabsTrigger value="paste">Paste Prompt</TabsTrigger>
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>

          <TabsContent value="paste" className="flex-1 flex flex-col p-3">
            <Label className="mb-2 text-xs font-medium text-text-secondary">
              Paste your prompt, system prompt, template, workflow, or any AI asset
            </Label>
            <textarea
              value={content}
              onChange={(e) => onChange(e.target.value)}
              onKeyUp={onQuickOptimize}
              placeholder="Paste your prompt, system prompt, template, workflow, or any AI asset here..."
              className="flex-1 resize-none rounded-lg border border-border bg-cream px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:border-focus disabled:opacity-50"
              rows={12}
              spellCheck={false}
            />
            <div className="flex items-center justify-between mt-2 text-xs text-text-muted">
              <span>
                {content.split("\n").length} lines · {content.split(/\s+/).filter(Boolean).length} words · {content.length} chars
              </span>
              {quickScore && (
                <span className="flex items-center gap-1">
                  <span className={cn(
                    "font-mono",
                    quickScore.criticalIssues > 0 ? "text-error" :
                    quickScore.score >= 75 ? "text-success" :
                    quickScore.score >= 50 ? "text-warning" : "text-error"
                  )}>
                    {quickScore.score}/100 ({quickScore.grade})
                  </span>
                  {quickScore.criticalIssues > 0 && (
                    <span className="text-error">⚠ {quickScore.criticalIssues} critical</span>
                  )}
                </span>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                onClick={onOptimize}
                disabled={!content.trim() || isOptimizing}
                className="flex-1"
                size="lg"
              >
                {isOptimizing ? (
                  <>
                    <svg className="mr-2 size-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 size-4" />
                    Optimize Prompt
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={onClear} disabled={isOptimizing}>
                <X className="mr-2 size-4" />
                Clear
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="flex-1 flex flex-col p-3">
            <div
              className={cn(
                "flex-1 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors",
                dragActive
                  ? "border-accent bg-accent/5"
                  : "border-border bg-bg-secondary"
              )}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <Upload className="size-12 text-text-muted" />
              <p className="mt-3 text-center text-sm font-medium text-text-primary">
                {dragActive ? "Drop file here" : "Drag & drop a file here"}
              </p>
              <p className="text-center text-xs text-text-muted mt-1">
                Supports .md, .txt, .json, .yaml, .yml (max 10MB)
              </p>
              <Button variant="outline" className="mt-4" onClick={() => fileInputRef.current?.click()}>
                Select File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.txt,.json,.yaml,.yml"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          </TabsContent>

          <TabsContent value="import" className="flex-1 flex flex-col p-3">
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={FileText}
                title="Import from Other Modules"
                description="Import prompts generated from Prompt Engine, Workflows, Skills, or other modules."
                action={
                  <Button variant="outline" size="sm" onClick={() => {}}>
                    Browse Generated
                  </Button>
                }
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Actions */}
      {content.trim() && !isOptimizing && (
        <div className="border-t border-border px-4 py-3 bg-bg-secondary">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={onQuickOptimize}>
              <Zap className="mr-1.5 size-3.5" />
              Quick Check
            </Button>
            <Button variant="outline" size="sm" onClick={() => {}}>
              <RefreshCw className="mr-1.5 size-3.5" />
              Re-optimize
            </Button>
            <Button variant="outline" size="sm" onClick={() => {}}>
              <Copy className="mr-1.5 size-3.5" />
              Copy Prompt
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

