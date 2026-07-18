import type { EngineBlueprint, EngineFieldId } from "../types";
import { asString, asStringArray, bullets, labeledBullets, section } from "./shared";

/**
 * Instruction-File blueprint.
 *
 * Produces an agent instruction file (AGENTS.md / CLAUDE.md / .cursorrules
 * / system prompt) composed entirely from user-supplied structured answers
 * — no fabricated examples. Sections with no answer are omitted.
 */
const CONSUMES_IDENTITY: EngineFieldId[] = ["purpose", "targetAI"];
const CONSUMES_STACK = ["framework", "language", "architecture", "projectType", "deploymentTarget"] as EngineFieldId[];
const CONSUMES_QUALITY: EngineFieldId[] = [
  "codingStyle",
  "codingConventions",
  "testingFramework",
];
const CONSUMES_AUDIENCE: EngineFieldId[] = ["experienceLevel", "customInstructions"];

export const instructionFileBlueprint: EngineBlueprint = {
  kind: "instruction-file",
  label: "Instruction File",
  description: "Agent instructions like AGENTS.md / CLAUDE.md / .cursorrules.",
  filenameHint: "instruction-file",
  extension: "md",
  titleTemplate: (answers) => {
    const target = asString(answers, "targetAI");
    if (!target) return "Instruction File";
    return target.toLowerCase().includes("claude")
      ? "CLAUDE.md"
      : target.toLowerCase().includes("cursor")
        ? ".cursorrules"
        : target.toLowerCase().includes("agents.md")
          ? "AGENTS.md"
          : `${target} Instructions`;
  },
  sections: [
    {
      id: "overview",
      heading: "Overview",
      consumes: CONSUMES_IDENTITY,
      build: (answers) => {
        const target = asString(answers, "targetAI");
        const purpose = asString(answers, "purpose");
        if (!target && !purpose) return null;
        const lines: string[] = [];
        if (target) lines.push(`Target AI: ${target}`);
        if (purpose) lines.push(`Purpose: ${purpose}`);
        return section("Overview", bullets(lines));
      },
},
  {
    id: "tech-stack",
    heading: "Tech Stack",
    consumes: CONSUMES_STACK,
    build: (answers) => {
        const framework = asString(answers, "framework");
        const language = asString(answers, "language");
        const projectType = asString(answers, "projectType");
        const deploymentTarget = asString(answers, "deploymentTarget");
        const items: string[] = [];
        if (projectType) items.push(`Project type: ${projectType}`);
        if (language) items.push(`Language: ${language}`);
        if (framework) items.push(`Framework: ${framework}`);
        if (deploymentTarget) items.push(`Deployment target: ${deploymentTarget}`);
        if (!items.length) return null;
        return section("Tech Stack", bullets(items));
      },
    },
    {
      id: "architecture",
      heading: "Architecture",
      consumes: ["architecture"] as EngineFieldId[],
      build: (answers) => {
        const architecture = asString(answers, "architecture");
        if (!architecture) return null;
        return section("Architecture", `- Architecture pattern: ${architecture}`);
      },
    },
    {
      id: "quality",
      heading: "Quality & Standards",
      consumes: CONSUMES_QUALITY,
      build: (answers) => {
        const style = asString(answers, "codingStyle");
        const conventions = asStringArray(answers, "codingConventions");
        const testing = asStringArray(answers, "testingFramework");
        const parts: string[] = [];
        if (style) parts.push(`- Coding style: ${style}`);
        if (testing) parts.push(`${labeledBullets("Testing framework(s)", testing)}`);
        if (conventions) parts.push(`${labeledBullets("Conventions", conventions)}`);
        if (!parts.length) return null;
        return section("Quality & Standards", parts.join("\n"));
      },
    },
    {
      id: "audience",
      heading: "Audience",
      consumes: CONSUMES_AUDIENCE,
      build: (answers) => {
        const exp = asString(answers, "experienceLevel");
        const custom = asString(answers, "customInstructions");
        const parts: string[] = [];
        if (exp) parts.push(`- Audience experience: ${exp}`);
        if (custom) parts.push(custom);
        if (!parts.length) return null;
        return section("Audience & Custom Instructions", parts.join("\n"));
      },
    },
  ],
};
