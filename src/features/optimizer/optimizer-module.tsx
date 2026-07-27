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
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Search,
  Filter,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tag } from "@/components/common/tag";
import { EmptyState } from "@/components/common/empty-state";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { moduleTransition } from "@/components/motion";
import { useToast } from "@/providers/toaster-provider";
import { downloadFile, copyToClipboard } from "@/utils";

import type { 
  OptimizationInput, 
  OptimizationResult, 
  OptimizationOptions, 
  PromptType, 
  TargetModel, 
  OptimizationType, 
  OptimizationMode 
} from "@/features/optimizer/types";
import { Optimizer } from "@/features/optimizer/services/optimizer";
import { MODEL_OPTIONS } from "@/features/optimizer/constants/models";
import { PromptEditor } from "./components/PromptEditor";
import { OptimizedView } from "./components/OptimizedView";
import { DiffView, ExplanationPanel } from "./components/DiffView";

const SUPPORTED_PROMPT_TYPES: { value: PromptType; label: string; description: string; icon: React.ReactNode }[] = [
  { value: "system-prompt", label: "System Prompts", description: "AI system instructions and role definitions", icon: <Clipboard className="size-3.5" /> },
  { value: "developer-prompt", label: "Developer Prompts", description: "Technical instructions for AI developers", icon: <FileText className="size-3.5" /> },
  { value: "user-prompt", label: "User Prompts", description: "End-user questions and requests", icon: <FileText className="size-3.5" /> },
  { value: "claude-prompt", label: "Claude Prompts", description: "Optimized for Anthropic Claude models", icon: <Sparkles className="size-3.5" /> },
  { value: "chatgpt-prompt", label: "ChatGPT Prompts", description: "Optimized for OpenAI GPT models", icon: <Sparkles className="size-3.5" /> },
  { value: "gemini-prompt", label: "Gemini Prompts", description: "Optimized for Google Gemini models", icon: <Sparkles className="size-3.5" /> },
  { value: "deepseek-prompt", label: "DeepSeek Prompts", description: "Optimized for DeepSeek models", icon: <Sparkles className="size-3.5" /> },
  { value: "codex-prompt", label: "Codex Prompts", description: "Optimized for Codex CLI", icon: <Zap className="size-3.5" /> },
  { value: "general-prompt", label: "General AI Prompts", description: "Generic prompt for any model", icon: <Clipboard className="size-3.5" /> },
  { value: "workflow-prompt", label: "Workflow Prompts", description: "Multi-step AI processes and pipelines", icon: <Zap className="size-3.5" /> },
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

export function OptimizerModule() {
  const [content, setContent] = React.useState("");
  const [promptType, setPromptType] = React.useState<PromptType>("general-prompt");
  const [targetModel, setTargetModel] = React.useState<TargetModel>("claude");
  const [optimizationTypes, setOptimizationTypes] = React.useState<OptimizationType[]>(["clarity", "conciseness", "context-expansion"]);
  const [mode, setMode] = React.useState<OptimizationMode>("general");
  const [result, setResult] = React.useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const [quickScore, setQuickScore] = React.useState<{ score: number; grade: string; criticalIssues: number } | null>(null);
  const [activeTab, setActiveTab] = React.useState("paste");
  const [showSettings, setShowSettings] = React.useState(false);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"comparison" | "explanation" | "optimized" | "original" | "summary">("comparison");
  const [selectedChangeId, setSelectedChangeId] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const detectPromptType = React.useCallback((text: string, filename?: string): PromptType | null => {
    const lowerText = text.toLowerCase();
    const lowerFilename = filename?.toLowerCase() || "";
    
    if (lowerFilename.includes("claude") || lowerFilename.includes("anthropic")) return "claude-prompt";
    if (lowerFilename.includes("gpt") || lowerFilename.includes("chatgpt") || lowerFilename.includes("openai")) return "chatgpt-prompt";
    if (lowerFilename.includes("gemini") || lowerFilename.includes("google")) return "gemini-prompt";
    if (lowerFilename.includes("deepseek")) return "deepseek-prompt";
    if (lowerFilename.includes("codex")) return "codex-prompt";
    if (lowerFilename.includes("workflow") || lowerFilename.includes("pipeline")) return "workflow-prompt";
    
    if (lowerText.includes("system prompt") || lowerText.includes("you are a") || lowerText.includes("role:")) return "system-prompt";
    if (lowerText.includes("workflow:") || lowerText.includes("steps:") || lowerText.includes("pipeline:")) return "workflow-prompt";
    
    return "general-prompt";
  }, []);

  const generateMarkdownReport = React.useCallback((data: OptimizationResult): string => {
    let md = `# Prompt Optimization Report\n\n`;
    md += `**Original Length:** ${data.metadata.originalLength} chars\n`;
    md += `**Optimized Length:** ${data.metadata.optimizedLength} chars\n`;
    md += `**Token Reduction:** ${data.summary.tokenReduction} (${data.summary.tokenReductionPercent.toFixed(1)}%)\n`;
    md += `**Changes:** ${data.summary.totalChanges} (${data.summary.majorChanges} major, ${data.summary.moderateChanges} moderate, ${data.summary.minorChanges} minor)\n\n`;
    md += `## Changes Applied\n\n`;
    for (const change of data.changes) {
      md += `### ${change.severity.toUpperCase()}: ${change.type}\n`;
      md += `**Explanation:** ${change.explanation}\n`;
      md += `**Why Changed:** ${change.whyChanged}\n`;
      md += `**Expected Improvement:** ${change.expectedImprovement}\n`;
      md += `**Reasoning Improvement:** ${change.estimatedReasoningImprovement}\n`;
      md += `**Token Savings:** ${change.estimatedTokenSavings}\n`;
      md += `**Response Quality:** ${change.estimatedResponseQuality}\n`;
      md += `**Confidence:** ${Math.round(change.confidence * 100)}%\n\n`;
      md += `**Original:**\n\`\`\`\n${change.originalText}\n\`\`\`\n\n`;
      md += `**Optimized:**\n\`\`\`\n${change.optimizedText}\n\`\`\`\n\n`;
    }
    md += `## Summary\n\n`;
    md += `${data.summary.keyImprovements.map(k => `- ${k}`).join("\n")}\n`;
    if (data.summary.remainingIssues.length > 0) {
      md += `\n## Remaining Issues\n\n`;
      md += `${data.summary.remainingIssues.map(r => `- ${r}`).join("\n")}\n`;
    }
    return md;
  }, []);

  const handleFileUpload = React.useCallback(async (file: File) => {
    const text = await file.text();
    setContent(text);
    const detectedType = detectPromptType(text, file.name);
    if (detectedType) setPromptType(detectedType);
    toast({ title: "File loaded", description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`, variant: "success" });
  }, [toast, detectPromptType]);

  const handleOptimize = React.useCallback(async () => {
    if (!content.trim()) {
      toast({ title: "No content", description: "Please paste a prompt or upload a file first", variant: "warning" });
      return;
    }

    setIsOptimizing(true);
    try {
      const options: OptimizationOptions = {
        promptType,
        targetModel,
        optimizationTypes,
        mode,
      };

      const optimizationResult = await Optimizer.optimize({
        content,
        promptType,
        targetModel,
        optimizationTypes,
        mode,
      });
      
      setResult(optimizationResult);
      setQuickScore(null);
    } catch (error) {
      toast({ title: "Optimization failed", description: error instanceof Error ? error.message : "Unknown error", variant: "danger" });
    } finally {
      setIsOptimizing(false);
    }
  }, [content, promptType, targetModel, optimizationTypes, mode, toast]);

  const handleQuickOptimize = React.useCallback(async () => {
    if (!content.trim()) return;
    try {
      const quickResult = await Optimizer.optimize({
        content,
        promptType,
        targetModel,
        optimizationTypes: ["clarity"],
        mode: "general",
      });
      setQuickScore({
        score: Math.max(0, 100 - quickResult.changes.length * 5),
        grade: quickResult.changes.length === 0 ? "A+" : quickResult.changes.length < 3 ? "A" : quickResult.changes.length < 5 ? "B" : "C",
        criticalIssues: quickResult.changes.filter(c => c.severity === "major").length,
      });
    } catch {
      // Ignore quick optimize errors
    }
  }, [content, promptType, targetModel]);

  const handleClear = React.useCallback(() => {
    setContent("");
    setResult(null);
    setQuickScore(null);
  }, []);

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const handleExport = React.useCallback(async (format: "json" | "md") => {
    if (!result) return;
    if (format === "json") {
      downloadFile(`optimization-report-${Date.now()}.json`, JSON.stringify(result, null, 2), "application/json");
    } else {
      const md = generateMarkdownReport(result);
      downloadFile(`optimization-report-${Date.now()}.md`, md, "text/markdown");
    }
    toast({ title: "Exported", description: `Report saved as ${format.toUpperCase()}`, variant: "success" });
  }, [result, toast, generateMarkdownReport]);

  const handleCopy = React.useCallback(async () => {
    if (!result) return;
    await copyToClipboard(JSON.stringify(result, null, 2));
    toast({ title: "Copied", description: "Optimization result copied to clipboard", variant: "success" });
  }, [result, toast]);

  const handleRegenerate = React.useCallback(async () => {
    if (!result) return;
    toast({ title: "Regenerating...", description: "Re-optimizing with current settings", variant: "default" });
    await handleOptimize();
  }, [result, handleOptimize, toast]);

  const handleViewOriginal = React.useCallback(() => {
    setViewMode("original");
  }, []);

  const handleViewOptimized = React.useCallback(() => {
    setViewMode("optimized");
  }, []);

  return (
    <motion.div
      variants={moduleTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid h-full grid-cols-[320px_1fr] overflow-hidden"
    >
      <PromptEditor
        content={content}
        onChange={setContent}
        promptType={promptType}
        onPromptTypeChange={setPromptType}
        isOptimizing={isOptimizing}
        onOptimize={handleOptimize}
        onQuickOptimize={handleQuickOptimize}
        onClear={handleClear}
        onImport={handleFileUpload}
        dragActive={dragActive}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        fileInputRef={fileInputRef}
        quickScore={quickScore}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex h-full flex-col overflow-hidden">
        {result ? (
          <OptimizedView
            result={result}
            onExport={handleExport}
            onCopy={handleCopy}
            onRegenerate={handleRegenerate}
            onViewOriginal={handleViewOriginal}
            onViewOptimized={handleViewOptimized}
          />
        ) : (
          <EmptyStateView />
        )}
      </div>
    </motion.div>
  );
}

function EmptyStateView() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <EmptyState
        icon={Zap}
        title="Ready to Optimize"
        description="Paste a prompt, upload a file, or select a generated asset to analyze and optimize it for quality, compatibility, and performance."
        action={
          <Button variant="primary" size="lg">
            <Zap className="mr-2 size-4" />
            Get Started
          </Button>
        }
      />
    </div>
  );
}

