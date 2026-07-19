/**
 * Utility functions for validation.
 */

import type { ValidationFinding, ValidationCategory, Severity, InstructionTarget } from "@/features/validator/types";

/**
 * Generate a unique ID for findings.
 */
export function generateFindingId(): string {
  return `finding_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a standardized validation finding.
 */
export function createFinding(
  category: ValidationCategory,
  severity: Severity,
  title: string,
  description: string,
  options: {
    line?: number;
    column?: number;
    snippet?: string;
    suggestion?: string;
    autoFixable?: boolean;
  } = {}
): ValidationFinding {
  return {
    id: generateFindingId(),
    category,
    severity,
    title,
    description,
    location: options.line ? { line: options.line, column: options.column, snippet: options.snippet } : undefined,
    suggestion: options.suggestion,
    autoFixable: options.autoFixable ?? false,
  };
}

/**
 * Count occurrences of a substring in a string.
 */
export function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let position = 0;
  while ((position = haystack.indexOf(needle, position)) !== -1) {
    count++;
    position += needle.length;
  }
  return count;
}

/**
 * Extract markdown headings with their levels.
 */
export interface MarkdownHeading {
  level: number;
  text: string;
  line: number;
  raw: string;
}

export function extractHeadings(content: string): MarkdownHeading[] {
  const headings: MarkdownHeading[] = [];
  const lines = content.split("\n");
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      headings.push({
        level: match[1]!.length,
        text: match[2]!.trim(),
        line: i + 1,
        raw: line,
      });
    }
  }
  
  return headings;
}

/**
 * Extract code blocks from markdown.
 */
export interface CodeBlock {
  language: string;
  content: string;
  line: number;
}

export function extractCodeBlocks(content: string): CodeBlock[] {
  const blocks: CodeBlock[] = [];
  const lines = content.split("\n");
  let inBlock = false;
  let currentBlock: CodeBlock | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const startMatch = line.match(/^```(\w*)/);
    
    if (startMatch && !inBlock) {
      inBlock = true;
      currentBlock = {
        language: startMatch[1] || "text",
        content: "",
        line: i + 1,
      };
    } else if (line.trim() === "```" && inBlock && currentBlock) {
      inBlock = false;
      blocks.push(currentBlock);
      currentBlock = null;
    } else if (inBlock && currentBlock) {
      currentBlock.content += (currentBlock.content ? "\n" : "") + line;
    }
  }
  
  return blocks;
}

/**
 * Calculate readability metrics.
 */
export interface ReadabilityMetrics {
  fleschKincaidGrade: number;
  fleschReadingEase: number;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
}

export function calculateReadability(text: string): ReadabilityMetrics {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
  
  const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
  const avgSyllablesPerWord = syllables / Math.max(words.length, 1);
  
  // Flesch-Kincaid Grade Level
  const fleschKincaidGrade = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
  // Flesch Reading Ease
  const fleschReadingEase = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
  
  return {
    fleschKincaidGrade: Math.max(0, Math.round(fleschKincaidGrade * 10) / 10),
    fleschReadingEase: Math.max(0, Math.min(100, Math.round(fleschReadingEase * 10) / 10)),
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 10) / 10,
  };
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return 1;
  
  let count = 0;
  const vowels = "aeiouy";
  let prevWasVowel = false;
  
  for (const char of word) {
    const isVowel = vowels.includes(char);
    if (isVowel && !prevWasVowel) count++;
    prevWasVowel = isVowel;
  }
  
  // Adjust for silent e
  if (word.endsWith("e") && count > 1) count--;
  
  return Math.max(1, count);
}

/**
 * Check if content has a specific section (heading).
 */
export function hasSection(content: string, sectionTitle: string, minLevel = 1, maxLevel = 3): boolean {
  const headings = extractHeadings(content);
  const normalizedTitle = sectionTitle.toLowerCase();
  
  return headings.some(h => 
    h.level >= minLevel && h.level <= maxLevel && h.text.toLowerCase().includes(normalizedTitle)
  );
}

/**
 * Find a section and return its content until the next same or higher level heading.
 */
export function getSectionContent(content: string, sectionTitle: string): string | null {
  const lines = content.split("\n");
  const normalizedTitle = sectionTitle.toLowerCase();
  let startLine = -1;
  let startLevel = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1]!.length;
      const text = match[2]!.trim().toLowerCase();
      
      if (text.includes(normalizedTitle)) {
        if (startLine === -1) {
          startLine = i;
          startLevel = level;
        } else if (level <= startLevel) {
          // Found next section at same or higher level
          return lines.slice(startLine + 1, i).join("\n").trim();
        }
      } else if (startLine !== -1 && level <= startLevel) {
        // Found next section at same or higher level
        return lines.slice(startLine + 1, i).join("\n").trim();
      }
    }
  }
  
  if (startLine !== -1) {
    return lines.slice(startLine + 1).join("\n").trim();
  }
  
  return null;
}

/**
 * Get required sections for an instruction target.
 */
export function getRequiredSections(target: InstructionTarget): string[] {
  const baseSections = [
    "Role Definition",
    "Instructions",
    "Tools",
    "Examples",
  ];
  
  const targetSpecific: Record<InstructionTarget, string[]> = {
    "CLAUDE.md": ["Role Definition", "Instructions", "Tools", "Examples", "Context"],
    "AGENTS.md": ["Role Definition", "Instructions", "Tools", "Examples", "Architecture", "Testing"],
    "GEMINI.md": ["Role Definition", "Instructions", "Tools", "Examples", "Context", "Safety"],
    "Copilot Instructions": ["Role Definition", "Instructions", "Examples", "Code Style"],
    "Cursor Rules": ["Role Definition", "Instructions", "Patterns", "Examples"],
    "README.md": ["Overview", "Installation", "Usage", "Configuration", "Contributing"],
    "CONTEXT.md": ["Project Context", "Architecture", "Key Decisions", "Dependencies"],
    "MEMORY.md": ["Memory Structure", "Retention Rules", "Retrieval Patterns", "Update Triggers"],
    "PERSONA.md": ["Role Definition", "Traits", "Behaviors", "Communication Style", "Examples"],
    "WORKFLOW.md": ["Overview", "Steps", "Triggers", "Conditions", "Error Handling", "Examples"],
    "STYLEGUIDE.md": ["Principles", "Naming Conventions", "Formatting", "Patterns", "Anti-patterns"],
    "SYSTEM.md": ["System Overview", "Architecture", "Components", "Data Flow", "Interfaces"],
  };
  
  return targetSpecific[target] || baseSections;
}

/**
 * Get recommended sections for an asset type.
 */
export function getRecommendedSections(assetType: string): string[] {
  const recommendations: Record<string, string[]> = {
    "instruction-file": [
      "Role Definition",
      "Goals & Objectives",
      "Instructions",
      "Tools & Permissions",
      "Context & Background",
      "Examples",
      "Constraints & Guardrails",
      "Output Format",
      "Error Handling",
      "Testing & Validation",
    ],
    "prompt-template": [
      "Role",
      "Task Description",
      "Context",
      "Instructions",
      "Examples",
      "Output Format",
      "Constraints",
    ],
    "system-prompt": [
      "Role Definition",
      "Core Instructions",
      "Behavioral Guidelines",
      "Tool Usage",
      "Output Format",
      "Error Handling",
      "Examples",
    ],
    "skill": [
      "Name & Description",
      "When to Use",
      "Input Parameters",
      "Step-by-Step Instructions",
      "Output Format",
      "Examples",
      "Error Handling",
      "Variations",
    ],
    "persona": [
      "Name & Identity",
      "Role & Expertise",
      "Personality Traits",
      "Communication Style",
      "Knowledge Boundaries",
      "Behavioral Guidelines",
      "Example Interactions",
    ],
    "workflow": [
      "Overview",
      "Trigger Conditions",
      "Steps",
      "Decision Points",
      "Error Handling",
      "Rollback Procedures",
      "Monitoring",
      "Examples",
    ],
    "mcp-configuration": [
      "Server Definition",
      "Transport",
      "Authentication",
      "Capabilities",
      "Environment Variables",
      "Examples",
    ],
  };
  
  return recommendations[assetType] || [];
}

/**
 * Normalize line endings.
 */
export function normalizeLineEndings(content: string): string {
  return content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

/**
 * Trim trailing whitespace from each line.
 */
export function trimTrailingWhitespace(content: string): string {
  return content.split("\n").map(line => line.replace(/\s+$/, "")).join("\n");
}

/**
 * Check for consistent heading hierarchy.
 */
export function checkHeadingHierarchy(headings: MarkdownHeading[]): ValidationFinding[] {
  const findings: ValidationFinding[] = [];
  
  for (let i = 1; i < headings.length; i++) {
    const prev = headings[i - 1]!;
    const curr = headings[i]!;
    
    if (curr.level > prev.level + 1) {
      findings.push(createFinding(
        "structure",
        "warning",
        "Heading hierarchy skipped",
        `Heading level ${curr.level} follows level ${prev.level}, skipping intermediate levels`,
        { line: curr.line, snippet: curr.raw, suggestion: `Consider adding level ${prev.level + 1} heading before this` }
      ));
    }
  }
  
  return findings;
}

/**
 * Check for duplicate headings.
 */
export function checkDuplicateHeadings(headings: MarkdownHeading[]): ValidationFinding[] {
  const findings: ValidationFinding[] = [];
  const seen = new Map<string, MarkdownHeading[]>();
  
  for (const heading of headings) {
    const key = heading.text.toLowerCase();
    if (!seen.has(key)) seen.set(key, []);
    seen.get(key)!.push(heading);
  }
  
  for (const [text, occurrences] of seen.entries()) {
    if (occurrences.length > 1) {
      for (const occ of occurrences) {
        findings.push(createFinding(
          "structure",
          "warning",
          "Duplicate heading",
          `Heading "${text}" appears ${occurrences.length} times`,
          { line: occ.line, snippet: occ.raw, suggestion: "Use unique, descriptive headings" }
        ));
      }
    }
  }
  
  return findings;
}

/**
 * Score a value against thresholds (0-100).
 */
export function scoreAgainstThresholds(
  value: number,
  thresholds: { excellent: number; good: number; fair: number; poor: number },
  higherIsBetter = true
): number {
  if (higherIsBetter) {
    if (value >= thresholds.excellent) return 100;
    if (value >= thresholds.good) return 85;
    if (value >= thresholds.fair) return 70;
    if (value >= thresholds.poor) return 50;
    return 25;
  } else {
    if (value <= thresholds.excellent) return 100;
    if (value <= thresholds.good) return 85;
    if (value <= thresholds.fair) return 70;
    if (value <= thresholds.poor) return 50;
    return 25;
  }
}

/**
 * Calculate weighted average score.
 */
export function calculateWeightedScore(scores: { score: number; weight: number }[]): number {
  const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);
  if (totalWeight === 0) return 0;
  
  const weightedSum = scores.reduce((sum, s) => sum + s.score * s.weight, 0);
  return Math.round(weightedSum / totalWeight);
}

/**
 * Convert numeric score to letter grade.
 */
export function scoreToGrade(score: number): QualityScore["grade"] {
  if (score >= 97) return "A+";
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 65) return "D";
  return "F";
}

import type { QualityScore } from "@/features/validator/types";