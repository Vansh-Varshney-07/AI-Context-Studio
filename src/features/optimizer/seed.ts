"use client";

import type { OptimizationPreset, OptimizationType, OptimizationMode, TargetModel, PromptType } from "./types";

/**
 * Seed optimization presets for the Optimizer module.
 */
export const SEED_OPTIMIZATION_PRESETS: OptimizationPreset[] = [
  {
    id: "clarity-conciseness",
    name: "Clarity + Conciseness",
    description: "Improve readability and reduce verbosity while preserving meaning",
    icon: "FileText",
    options: {
      optimizationTypes: ["clarity", "conciseness"],
      targetModel: "claude",
      mode: "general",
    },
  },
  {
    id: "coding-optimizer",
    name: "Code Generation Optimizer",
    description: "Optimize prompts for code generation tasks",
    icon: "Zap",
    options: {
      optimizationTypes: ["clarity", "output-formatting", "constraint-improvement", "chain-of-thought"],
      targetModel: "claude",
      mode: "coding",
    },
  },
  {
    id: "research-analyst",
    name: "Research & Analysis",
    description: "Optimize for deep research, fact-finding, and synthesis tasks",
    icon: "Brain",
    options: {
      optimizationTypes: ["context-expansion", "reasoning-enhancement", "chain-of-thought", "few-shot-preparation"],
      targetModel: "claude",
      mode: "research",
    },
  },
  {
    id: "cost-reduction",
    name: "Token Cost Reduction",
    description: "Minimize token usage while maintaining quality",
    icon: "Zap",
    options: {
      optimizationTypes: ["token-reduction", "conciseness", "constraint-improvement"],
      targetModel: "claude",
      mode: "general",
    },
  },
  {
    id: "safety-hardening",
    name: "Safety & Guardrails",
    description: "Add safety constraints and reduce harmful outputs",
    icon: "Shield",
    options: {
      optimizationTypes: ["safety", "constraint-improvement", "role-definition"],
      targetModel: "claude",
      mode: "general",
    },
  },
  {
    id: "workflow-completeness",
    name: "Workflow Completeness",
    description: "Ensure multi-step workflows are complete and executable",
    icon: "Zap",
    options: {
      optimizationTypes: ["workflow-completeness", "context-expansion", "output-formatting"],
      targetModel: "claude",
      mode: "general",
    },
  },
];

export const OPTIMIZATION_TYPE_INFO: Record<OptimizationType, { label: string; description: string }> = {
  clarity: { label: "Clarity", description: "Improve readability and remove ambiguity" },
  conciseness: { label: "Conciseness", description: "Reduce length while preserving meaning" },
  "context-expansion": { label: "Context Expansion", description: "Add relevant background information" },
  "role-definition": { label: "Role Definition", description: "Define clear persona and boundaries" },
  "constraint-improvement": { label: "Constraints", description: "Add guardrails and boundaries" },
  "output-formatting": { label: "Output Formatting", description: "Specify response structure" },
  "chain-of-thought": { label: "Chain of Thought", description: "Add step-by-step reasoning" },
  "reasoning-enhancement": { label: "Reasoning", description: "Improve logical structure" },
  "few-shot-preparation": { label: "Few-Shot", description: "Add examples for better performance" },
  "prompt-engineering": { label: "Prompt Engineering", description: "Apply best practices patterns" },
  "tool-usage": { label: "Tool Usage", description: "Optimize function calling" },
  "memory-usage": { label: "Memory Strategy", description: "Optimize context management" },
  "token-reduction": { label: "Token Reduction", description: "Minimize token usage" },
  "performance-optimization": { label: "Performance", description: "Optimize for speed" },
  "cost-optimization": { label: "Cost Optimization", description: "Reduce API costs" },
  safety: { label: "Safety", description: "Add safety guardrails" },
  "workflow-completeness": { label: "Workflow", description: "Complete multi-step workflows" },
};

export const MODE_INFO: Record<OptimizationMode, { label: string; description: string }> = {
  general: { label: "General", description: "Balanced optimization for any use case" },
  coding: { label: "Coding", description: "Optimize for code generation and debugging" },
  research: { label: "Research", description: "Optimize for analysis and fact-finding" },
  writing: { label: "Writing", description: "Optimize for creative and technical writing" },
  education: { label: "Education", description: "Optimize for teaching and learning" },
  architecture: { label: "Architecture", description: "Optimize for system design" },
  debugging: { label: "Debugging", description: "Optimize for error analysis" },
  agent: { label: "Agent", description: "Optimize for autonomous agents" },
  frontend: { label: "Frontend", description: "Optimize for UI development" },
  backend: { label: "Backend", description: "Optimize for server-side development" },
  fullstack: { label: "Full Stack", description: "Optimize for end-to-end development" },
};
