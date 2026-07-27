/**
 * Markdown/Instruction file validator.
 * Handles CLAUDE.md, AGENTS.md, GEMINI.md, Cursor Rules, etc.
 */

import type { ValidationInput, ValidationResult, ValidationFinding, ValidationCategory, AssetType, InputMethod } from "../types";
import { BaseValidator } from "./base";
import {
  extractHeadings,
  extractCodeBlocks,
  getRequiredSections,
  getRecommendedSections,
  hasSection,
  getSectionContent,
  checkHeadingHierarchy,
  checkDuplicateHeadings,
  calculateReadability,
  createFinding,
  normalizeLineEndings,
  countOccurrences,
} from "../utils/validation-helpers";
import { generateRecommendations } from "../services/validation-service";
import { calculateQualityScore, estimateAIPerformance, estimateTokenEfficiency } from "../services/scoring-engine";

export class MarkdownValidator extends BaseValidator {
  readonly id = "markdown-validator";
  readonly name = "Markdown Instruction Validator";
  readonly description = "Validates structure, completeness, and quality of markdown-based instruction files";
  readonly supportedTypes: ("instruction-file" | "prompt-template" | "system-prompt" | "user-prompt" | "skill" | "persona" | "workflow" | "mcp-configuration")[] = ["instruction-file", "prompt-template", "system-prompt", "user-prompt", "skill", "persona", "workflow", "mcp-configuration"];
  
  protected async performValidation(input: ValidationInput): Promise<ValidationResult> {
    const findings: ValidationFinding[] = [];
    const content = normalizeLineEndings(input.content);
    const lines = content.split("\n");
    const assetType = input.assetType ?? "instruction-file";
    
    // Run all validation checks
    findings.push(...this.validateStructure(content, lines));
    findings.push(...this.validateRequiredSections(content, assetType));
    findings.push(...this.validateFormatting(content, lines));
    findings.push(...this.validateReadability(content, lines));
    findings.push(...this.validatePromptQuality(content, lines, assetType));
    findings.push(...this.validateInstructionClarity(content, lines));
    findings.push(...this.validateRoleDefinition(content, lines));
    findings.push(...this.validateBestPractices(content, lines, assetType));
    
    // Add missing sections from findings
    const missingSections = this.extractMissingSections(findings);
    const improvementSuggestions = this.generateImprovementSuggestions(findings);
    const strengths = this.extractStrengths(findings, content);
    const weaknesses = this.extractWeaknesses(findings);
    
    // Calculate score
    const { calculateQualityScore } = await import("../services/scoring-engine");
    const score = calculateQualityScore(findings);
    
    return {
      assetType: assetType,
      valid: !findings.some(f => f.severity === "error"),
      score,
      findings,
      missingSections,
      improvementSuggestions,
      strengths,
      weaknesses,
      estimatedAIPerformance: estimateAIPerformance(score.overall, findings),
      estimatedTokenEfficiency: estimateTokenEfficiency(findings, content.length),
      recommendations: generateRecommendations({
        assetType: assetType,
        valid: !findings.some(f => f.severity === "error"),
        score,
        findings,
        missingSections,
        improvementSuggestions,
        strengths,
        weaknesses,
        metadata: {
          validatedAt: new Date().toISOString(),
          validatorVersion: "1.0.0",
          inputMethod: input.method ?? "paste",
          contentLength: content.length,
          lineCount: lines.length,
          sectionCount: extractHeadings(content).length,
          wordCount: content.split(/\s+/).filter(w => w.length > 0).length,
        },
        compatibility: [],
        recommendations: [],
        estimatedAIPerformance: "fair",
        estimatedTokenEfficiency: "medium",
      }),
      metadata: {
        validatedAt: new Date().toISOString(),
        validatorVersion: "1.0.0",
        inputMethod: input.method ?? "paste",
        contentLength: content.length,
        lineCount: lines.length,
        sectionCount: extractHeadings(content).length,
        wordCount: content.split(/\s+/).filter(w => w.length > 0).length,
      },
    };
  }
  
  private validateStructure(content: string, lines: string[]): ValidationFinding[] {
    const findings: ValidationFinding[] = [];
    
    // Check for heading hierarchy
    const headings = extractHeadings(content);
    if (headings.length === 0) {
      findings.push(this.createFinding({
        category: "structure",
        severity: "warning",
        title: "No headings found",
        description: "Document lacks structure",
        suggestion: "Add hierarchical headings (# ## ###) to organize content",
      }));
    } else {
      // Check heading hierarchy (no skipping levels)
      findings.push(...checkHeadingHierarchy(headings));
      
      // Check for duplicate headings
      findings.push(...checkDuplicateHeadings(headings));
      
      // Check for H1
      const hasH1 = headings.some(h => h.level === 1);
      if (!hasH1) {
        findings.push(this.createFinding({
          category: "structure",
          severity: "info",
          title: "No top-level heading",
          description: "No top-level heading (# ) found",
          suggestion: "Add a main title with # for better document identification",
        }));
      }
    }
    
    // Check for sections without content
    for (let i = 0; i < lines.length; i++) {
      if (lines[i]!.match(/^#{1,6}\s/)) {
        const nextContentIdx = lines.slice(i + 1).findIndex(l => l.trim() && !l.match(/^#{1,6}\s/));
        if (nextContentIdx === -1 || (nextContentIdx > 5 && i < lines.length - 1)) {
          const sectionTitle = lines[i]!.replace(/^#+\s/, "").trim();
          findings.push(this.createFinding({
            category: "missing-sections",
            severity: "warning",
            title: "Empty section",
            description: `Section "${sectionTitle}" appears to be empty or very short`,
            suggestion: "Add content to this section or remove if not needed",
            location: { line: i + 1, section: sectionTitle },
          }));
        }
      }
    }
    
    return findings;
  }
  
  private validateRequiredSections(content: string, assetType: string): ValidationFinding[] {
    const findings: ValidationFinding[] = [];
    const lowerContent = content.toLowerCase();
    
    const requiredSections: Record<string, { sections: string[]; alias?: Record<string, string[]> }> = {
      "instruction-file": {
        sections: ["role", "instructions", "tools", "examples", "constraints"],
        alias: {
          role: ["role", "persona", "identity", "you are"],
          instructions: ["instructions", "guidelines", "rules", "directives", "behavior"],
          tools: ["tools", "functions", "capabilities", "available tools"],
          examples: ["examples", "example", "sample", "demonstration"],
          constraints: ["constraints", "limitations", "restrictions", "boundaries", "do not"],
        },
      },
      "system-prompt": {
        sections: ["role", "instructions", "constraints", "output-format"],
        alias: {
          role: ["role", "persona", "identity", "you are", "system"],
          instructions: ["instructions", "guidelines", "behavior", "task"],
          constraints: ["constraints", "limitations", "restrictions", "do not", "never"],
          "output-format": ["output format", "format", "response format", "structure"],
        },
      },
      "skill": {
        sections: ["name", "description", "parameters", "examples"],
        alias: {
          name: ["name", "title"],
          description: ["description", "purpose", "what"],
          parameters: ["parameters", "inputs", "arguments", "config"],
          examples: ["examples", "example", "usage", "sample"],
        },
      },
      "persona": {
        sections: ["name", "description", "traits", "background", "communication-style"],
        alias: {
          name: ["name", "title"],
          description: ["description", "overview", "summary"],
          traits: ["traits", "characteristics", "personality", "attributes"],
          background: ["background", "history", "context", "backstory"],
          "communication-style": ["communication style", "tone", "voice", "style", "manner"],
        },
      },
      "workflow": {
        sections: ["name", "description", "steps", "triggers", "inputs", "outputs"],
        alias: {
          name: ["name", "title"],
          description: ["description", "purpose", "overview"],
          steps: ["steps", "stages", "phases", "tasks", "sequence"],
          triggers: ["triggers", "trigger", "when", "events"],
          inputs: ["inputs", "input", "parameters", "arguments"],
          outputs: ["outputs", "output", "results", "deliverables"],
        },
      },
      "mcp-configuration": {
        sections: ["servers", "transports", "authentication", "capabilities"],
        alias: {
          servers: ["servers", "mcp servers", "server"],
          transports: ["transports", "transport", "stdio", "http", "sse"],
          authentication: ["authentication", "auth", "credentials", "api key"],
          capabilities: ["capabilities", "tools", "resources", "prompts"],
        },
      },
    };
    
    const config = requiredSections[assetType] ?? requiredSections["instruction-file"]!;
    
    for (const section of config.sections) {
      const aliases = config.alias?.[section] || [section];
      const found = aliases.some(alias => lowerContent.includes(alias.toLowerCase()));
      
      if (!found) {
        findings.push(this.createFinding({
          category: "required-sections",
          severity: "error",
          title: "Missing required section",
          description: `Missing required section: ${section}`,
          suggestion: `Add a "${section}" section${aliases.length > 1 ? ` (or ${aliases.slice(1).join(", ")})` : ""}`,
        }));
      }
    }
    
    return findings;
  }
  
  private validateFormatting(content: string, lines: string[]): ValidationFinding[] {
    const findings: ValidationFinding[] = [];
    
    // Check for trailing whitespace
    lines.forEach((line, idx) => {
      if (line.endsWith(" ") || line.endsWith("\t")) {
        findings.push(this.createFinding({
          category: "formatting",
          severity: "info",
          title: "Trailing whitespace",
          description: `Trailing whitespace on line ${idx + 1}`,
          suggestion: "Remove trailing whitespace",
          location: { line: idx + 1 },
        }));
      }
    });
    
    // Check for mixed tabs/spaces
    const hasTabs = lines.some(l => l.startsWith("\t"));
    const hasSpaces = lines.some(l => l.startsWith("  "));
    if (hasTabs && hasSpaces) {
      findings.push(this.createFinding({
        category: "formatting",
        severity: "warning",
        title: "Mixed tabs and spaces",
        description: "Mixed tabs and spaces for indentation",
        suggestion: "Use consistent indentation (spaces recommended)",
      }));
    }
    
    // Check for consistent list markers
    const listMarkers = new Set<string>();
    lines.forEach(line => {
      const match = line.match(/^(\s*)([-*+]|\d+\.)\s/);
      if (match && match[2]) listMarkers.add(match[2]);
    });
    if (listMarkers.size > 2) {
      findings.push(this.createFinding({
        category: "formatting",
        severity: "info",
        title: "Inconsistent list markers",
        description: `Multiple list marker styles used: ${Array.from(listMarkers).join(", ")}`,
        suggestion: "Use consistent list markers (e.g., only - or *)",
      }));
    }
    
    // Check for very long lines
    const longLines = lines.filter(l => l.length > 120);
    if (longLines.length > 5) {
      findings.push(this.createFinding({
        category: "formatting",
        severity: "warning",
        title: "Long lines",
        description: `${longLines.length} lines exceed 120 characters`,
        suggestion: "Break long lines for better readability",
      }));
    }
    
    return findings;
  }
  
  private validateReadability(content: string, lines: string[]): ValidationFinding[] {
    const findings: ValidationFinding[] = [];
    const metrics = calculateReadability(content);
    
    if (metrics.avgWordsPerSentence > 25) {
      findings.push(this.createFinding({
        category: "readability",
        severity: "warning",
        title: "Long sentences",
        description: `Average sentence length is ${metrics.avgWordsPerSentence.toFixed(1)} words (recommended: <20)`,
        suggestion: "Break long sentences into shorter ones for clarity",
      }));
    }
    
    if (metrics.avgSyllablesPerWord > 2.5) {
      findings.push(this.createFinding({
        category: "readability",
        severity: "info",
        title: "Complex vocabulary",
        description: `Average syllables per word is ${metrics.avgSyllablesPerWord.toFixed(1)}`,
        suggestion: "Consider simpler vocabulary where possible",
      }));
    }
    
    // Check for passive voice (rough approximation)
    const passivePatterns = /\b(was|were|been|being|is|are|am)\s+\w+ed\b/gi;
    const passiveCount = (content.match(passivePatterns) || []).length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (passiveCount > sentences.length * 0.2) {
      findings.push(this.createFinding({
        category: "readability",
        severity: "info",
        title: "High passive voice usage",
        description: `High passive voice usage (${passiveCount} instances)`,
        suggestion: "Prefer active voice for clearer instructions",
      }));
    }
    
    return findings;
  }
  
  private validatePromptQuality(content: string, lines: string[], assetType: string): ValidationFinding[] {
    const findings: ValidationFinding[] = [];
    const lowerContent = content.toLowerCase();
    
    // Check for examples
    const hasExamples = /example|sample|demonstration|for instance/i.test(content);
    if (!hasExamples && ["system-prompt", "user-prompt", "skill"].includes(assetType)) {
      findings.push(this.createFinding({
        category: "prompt-quality",
        severity: "warning",
        title: "No examples provided",
        description: "No examples provided",
        suggestion: "Add concrete examples to demonstrate expected behavior",
      }));
    }
    
    // Check for output format specification
    const hasOutputFormat = /output format|response format|format:|structure:/i.test(content);
    if (!hasOutputFormat && ["system-prompt", "skill", "workflow"].includes(assetType)) {
      findings.push(this.createFinding({
        category: "prompt-quality",
        severity: "warning",
        title: "Output format not specified",
        description: "Output format not specified",
        suggestion: "Define expected output structure/format for consistent results",
      }));
    }
    
    // Check for constraints/boundaries
    const hasConstraints = /constraint|limitation|restriction|boundary|do not|never|must not|avoid/i.test(content);
    if (!hasConstraints) {
      findings.push(this.createFinding({
        category: "prompt-quality",
        severity: "info",
        title: "No explicit constraints",
        description: "No explicit constraints or boundaries defined",
        suggestion: "Add constraints to prevent unwanted behaviors",
      }));
    }
    
    // Check for few-shot examples
    const exampleBlocks = (content.match(/```/g) || []).length / 2;
    if (exampleBlocks > 0 && exampleBlocks < 2 && ["system-prompt", "skill"].includes(assetType)) {
      findings.push(this.createFinding({
        category: "prompt-quality",
        severity: "info",
        title: "Few code examples",
        description: "Only one code example provided",
        suggestion: "Consider adding 2-3 diverse examples for better few-shot learning",
      }));
    }
    
    return findings;
  }
  
  private validateInstructionClarity(content: string, lines: string[]): ValidationFinding[] {
    const findings: ValidationFinding[] = [];
    const lowerContent = content.toLowerCase();
    
    // Check for vague language
    const vagueTerms = ["appropriate", "suitable", "relevant", "as needed", "when necessary", "etc", "and so on"];
    vagueTerms.forEach(term => {
      if (lowerContent.includes(term)) {
        findings.push(this.createFinding({
          category: "instruction-clarity",
          severity: "info",
          title: "Vague language",
          description: `Vague term "${term}" used`,
          suggestion: `Replace "${term}" with specific criteria or conditions`,
        }));
      }
    });
    
    // Check for conditional instructions without clear conditions
    const conditionalPatterns = /if\s+.+?(then|,)\s*(do|should|must)/gi;
    const conditionals = content.match(conditionalPatterns) || [];
    conditionals.forEach(match => {
      if (!match.includes("when") && !match.includes("unless") && !match.includes("provided")) {
        findings.push(this.createFinding({
          category: "instruction-clarity",
          severity: "info",
          title: "Implicit condition",
          description: `Conditional instruction could be more explicit: "${match.substring(0, 80)}..."`,
          suggestion: "Use explicit conditions: 'When X happens, do Y'",
        }));
      }
    });
    
    // Check for imperative mood
    const imperativeCount = (content.match(/\b(must|should|will|shall|do not|never|always)\b/gi) || []).length;
    const totalSentences = content.split(/[.!?]+/).filter(s => s.trim()).length;
    if (totalSentences > 0 && imperativeCount / totalSentences < 0.3) {
      findings.push(this.createFinding({
        category: "instruction-clarity",
        severity: "info",
        title: "Low imperative language",
        description: "Low use of imperative language for instructions",
        suggestion: "Use clear imperative verbs (must, should, do not) for actionable guidance",
      }));
    }
    
    return findings;
  }
  
  private validateRoleDefinition(content: string, lines: string[]): ValidationFinding[] {
    const findings: ValidationFinding[] = [];
    const lowerContent = content.toLowerCase();
    
    // Check for explicit role definition
    const rolePatterns = [
      /you are (an?|the) /i,
      /role:\s*/i,
      /persona:\s*/i,
      /identity:\s*/i,
      /act as (an?|the) /i,
      /behave as (an?|the) /i,
    ];
    
    const hasRole = rolePatterns.some(p => p.test(content));
    
    if (!hasRole) {
      findings.push(this.createFinding({
        category: "role-definition",
        severity: "error",
        title: "No role definition",
        description: "No explicit role/persona definition found",
        suggestion: "Start with 'You are a [role] who...' or add a 'Role' section",
      }));
    } else if (!/you are (an?|the) [^.]{10,}/i.test(content)) {
      findings.push(this.createFinding({
        category: "role-definition",
        severity: "warning",
        title: "Brief role definition",
        description: "Role definition is too brief",
        suggestion: "Expand role definition with expertise, approach, and communication style",
      }));
    }
    
    // Check for expertise/domain
    if (hasRole && !/(expert|specialist|professional|experienced|knowledgeable)/i.test(content)) {
      findings.push(this.createFinding({
        category: "role-definition",
        severity: "info",
        title: "Missing expertise level",
        description: "Role lacks expertise level indication",
        suggestion: "Specify expertise level (e.g., 'senior expert', 'specialist in X')",
      }));
    }
    
    return findings;
  }
  
  private validateBestPractices(content: string, lines: string[], assetType: string): ValidationFinding[] {
    const findings: ValidationFinding[] = [];
    const lowerContent = content.toLowerCase();
    
    // Tool usage
    if (["instruction-file", "system-prompt", "skill", "workflow"].includes(assetType)) {
      const hasTools = /tool|function|api|capability|available/i.test(content);
      if (!hasTools) {
        findings.push(this.createFinding({
          category: "tool-usage",
          severity: "info",
          title: "No tool references",
          description: "No tool/capability references found",
          suggestion: "Document available tools and how to use them",
        }));
      }
    }
    
    // Error handling
    const hasErrorHandling = /error|exception|fail|retry|fallback|graceful/i.test(content);
    if (!hasErrorHandling && ["skill", "workflow", "system-prompt"].includes(assetType)) {
      findings.push(this.createFinding({
        category: "error-handling",
        severity: "warning",
        title: "No error handling",
        description: "No error handling guidance provided",
        suggestion: "Add instructions for handling errors, retries, and fallbacks",
      }));
    }
    
    // Security
    const hasSecurity = /security|sanitize|validate|permission|access|auth|credential|secret|safe/i.test(content);
    if (!hasSecurity && ["instruction-file", "system-prompt", "mcp-configuration"].includes(assetType)) {
      findings.push(this.createFinding({
        category: "security-recommendations",
        severity: "info",
        title: "No security considerations",
        description: "No security considerations mentioned",
        suggestion: "Add security best practices relevant to this asset",
      }));
    }
    
    // Performance
    const hasPerformance = /performance|optimize|efficient|cache|latency|speed|memory/i.test(content);
    if (!hasPerformance && ["skill", "workflow", "system-prompt"].includes(assetType)) {
      findings.push(this.createFinding({
        category: "performance-guidance",
        severity: "info",
        title: "No performance guidance",
        description: "No performance considerations mentioned",
        suggestion: "Add performance guidance or optimization hints",
      }));
    }
    
    // Coding standards
    const hasCodingStandards = /style|convention|naming|format|lint|standard/i.test(content);
    if (!hasCodingStandards && ["instruction-file", "system-prompt", "workflow"].includes(assetType)) {
      findings.push(this.createFinding({
        category: "coding-standards",
        severity: "info",
        title: "No coding standards",
        description: "No coding standards/conventions referenced",
        suggestion: "Reference or include coding standards for consistency",
      }));
    }
    
    // Testing instructions
    const hasTesting = /test|spec|verify|validate|assert|coverage/i.test(content);
    if (!hasTesting && ["workflow", "skill", "system-prompt"].includes(assetType)) {
      findings.push(this.createFinding({
        category: "testing-instructions",
        severity: "info",
        title: "No testing instructions",
        description: "No testing/validation instructions provided",
        suggestion: "Add how to test or verify the output works correctly",
      }));
    }
    
    // Architecture description
    const hasArchitecture = /architecture|design|structure|component|module|system/i.test(content);
    if (!hasArchitecture && ["workflow", "system-prompt"].includes(assetType)) {
      findings.push(this.createFinding({
        category: "architecture-description",
        severity: "info",
        title: "No architecture context",
        description: "No architecture/design context provided",
        suggestion: "Add high-level architecture or design overview",
      }));
    }
    
    // Memory strategy
    const hasMemory = /memory|context|state|persist|remember|recall|history/i.test(content);
    if (!hasMemory && ["system-prompt", "persona", "workflow"].includes(assetType)) {
      findings.push(this.createFinding({
        category: "memory-strategy",
        severity: "info",
        title: "No memory strategy",
        description: "No memory/context strategy defined",
        suggestion: "Define how context/memory should be managed across interactions",
      }));
    }
    
    // Workflow completeness
    const hasWorkflowSteps = /step|stage|phase|task|sequence/i.test(content);
    if (!hasWorkflowSteps && assetType === "workflow") {
      findings.push(this.createFinding({
        category: "workflow-completeness",
        severity: "error",
        title: "No workflow steps",
        description: "Workflow has no defined steps",
        suggestion: "Define clear steps with triggers, conditions, and outputs",
      }));
    }
    
    // Consistency
    const headings = content.match(/^#{1,6}\s.+/gm) || [];
    if (headings.length > 1) {
      const levels = headings.map(h => h.match(/^#+/)?.[0].length || 0);
      const firstLevel = levels[0]!;
      const consistent = levels.every(l => l === firstLevel || l === firstLevel + 1);
      if (!consistent) {
        findings.push(this.createFinding({
          category: "consistency",
          severity: "warning",
          title: "Inconsistent heading structure",
          description: "Inconsistent heading hierarchy",
          suggestion: "Use consistent heading hierarchy",
        }));
      }
    }
    
    return findings;
  }
  
  private extractMissingSections(findings: ValidationFinding[]): string[] {
    const missing = new Set<string>();
    findings.forEach(f => {
      if (f.category === "required-sections" || f.category === "missing-sections") {
        const match = f.description.match(/section: (.+)|"(.+)"/);
        if (match) missing.add(match[1]! || match[2]!);
      }
    });
    return Array.from(missing);
  }
  
  private generateImprovementSuggestions(findings: ValidationFinding[]): string[] {
    const suggestions = new Set<string>();
    findings.forEach(f => {
      if (f.suggestion && f.severity !== "success") {
        suggestions.add(f.suggestion);
      }
    });
    return Array.from(suggestions).slice(0, 10);
  }
  
  private extractStrengths(findings: ValidationFinding[], content: string): string[] {
    const strengths: string[] = [];
    
    if (content.includes("example") && (content.match(/```/g) || []).length >= 4) {
      strengths.push("Well-documented with multiple code examples");
    }
    if ((content.match(/^#{1,6}\s.+/gm) || []).length >= 5) {
      strengths.push("Well-structured with clear section hierarchy");
    }
    if (content.toLowerCase().includes("you are") && content.length > 500) {
      strengths.push("Clear role definition with detailed persona");
    }
    if ((content.match(/constraint|must not|do not|never|avoid/gi) || []).length >= 3) {
      strengths.push("Strong guardrails and constraints defined");
    }
    if ((content.match(/tool|function|api|capability/gi) || []).length >= 3) {
      strengths.push("Good tool/capability documentation");
    }
    if ((content.match(/error|exception|retry|fallback/gi) || []).length >= 2) {
      strengths.push("Error handling and resilience addressed");
    }
    if ((content.match(/security|sanitize|validate|permission/gi) || []).length >= 2) {
      strengths.push("Security considerations included");
    }
    
    return strengths;
  }
  
  private extractWeaknesses(findings: ValidationFinding[]): string[] {
    const weaknesses = new Set<string>();
    findings
      .filter(f => f.severity === "error" || f.severity === "warning")
      .forEach(f => {
        weaknesses.add(f.title || f.description.substring(0, 80));
      });
    return Array.from(weaknesses).slice(0, 8);
  }
}

