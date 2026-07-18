import type {
  AgentInstructionTarget,
  AgentInstructionTargetInfo,
} from "@/types/domain";

/**
 * Static registry of all supported agent instruction targets.
 * Phase 4 hierarchy: Instruction Files > Agent Instructions > target > content.
 * Order is canonical and matches the spec.
 */
export const AGENT_INSTRUCTION_TARGETS: readonly AgentInstructionTargetInfo[] = [
  {
    id: "claude",
    label: "Claude",
    filename: "CLAUDE.md",
    description:
      "Anthropic's Claude Code assistant. Project-level instructions loaded alongside context.",
  },
  {
    id: "cursor",
    label: "Cursor",
    filename: ".cursorrules",
    description:
      "Cursor editor rules file. Drives how the embedded AI behaves for your repo.",
  },
  {
    id: "copilot",
    label: "Copilot",
    filename: ".github/copilot-instructions.md",
    description:
      "GitHub Copilot custom instructions for repository-level guidance.",
  },
  {
    id: "gemini",
    label: "Gemini",
    filename: "GEMINI.md",
    description:
      "Google Gemini Code Assist project memory and guidelines file.",
  },
  {
    id: "codex",
    label: "Codex",
    filename: "AGENTS.md",
    description:
      "OpenAI Codex CLI agent instructions in a shared AGENTS.md file.",
  },
  {
    id: "opencode",
    label: "OpenCode",
    filename: "opencode.md",
    description:
      "OpenCode configuration and instructions file for opencode agents.",
  },
  {
    id: "continue",
    label: "Continue",
    filename: ".continuerules.json",
    description:
      "Continue.dev configuration bundling custom instructions and models.",
  },
  {
    id: "roo",
    label: "Roo",
    filename: ".roo/rules",
    description:
      "Roo Code custom mode rules and operational boundaries file.",
  },
  {
    id: "general",
    label: "General",
    filename: "AGENTS.md",
    description:
      "Cross-agent generic AGENTS.md instructions usable by any tool.",
  },
] as const;

/**
 * Lookup map keyed by target id — O(1) access for renderers/selectors.
 */
export const AGENT_INSTRUCTION_TARGET_MAP: Record<
  AgentInstructionTarget,
  AgentInstructionTargetInfo
> = Object.fromEntries(
  AGENT_INSTRUCTION_TARGETS.map((target) => [target.id, target]),
) as Record<AgentInstructionTarget, AgentInstructionTargetInfo>;
