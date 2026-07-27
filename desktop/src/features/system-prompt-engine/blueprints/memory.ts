import type { EngineBlueprint, EngineFieldId } from "../types";
import { asString, asStringArray, bullets, labeledBullets, section } from "./shared";

/**
 * Memory blueprint.
 *
 * Produces a long-running memory block (e.g. `memory.md`) for assistants
 * that support persistent context. Mirrors the context-file but with an
 * explicit "recalled facts" + "current focus" structure.
 */
export const memoryBlueprint: EngineBlueprint = {
  kind: "memory",
  label: "Memory Block",
  description: "Persistent memory block for long-running AI sessions.",
  filenameHint: "memory",
  extension: "md",
  titleTemplate: (answers) => {
    const projectType = asString(answers, "projectType");
    return projectType ? `Memory — ${projectType}` : "Memory";
  },
  sections: [
    {
      id: "project",
      heading: "Project Identity",
      consumes: ["purpose", "targetAI", "projectType"] as EngineFieldId[],
      build: (answers) => {
        const purpose = asString(answers, "purpose");
        const target = asString(answers, "targetAI");
        const projectType = asString(answers, "projectType");
        const items: string[] = [];
        if (target) items.push(`Owner AI: ${target}`);
        if (projectType) items.push(`Project type: ${projectType}`);
        if (purpose) items.push(`Purpose: ${purpose}`);
        if (!items.length) return null;
        return section("Project Identity", bullets(items));
      },
    },
    {
      id: "stack",
      heading: "Stack Snapshot",
      consumes: ["language", "framework", "architecture"] as EngineFieldId[],
      build: (answers) => {
        const language = asString(answers, "language");
        const framework = asString(answers, "framework");
        const architecture = asString(answers, "architecture");
        const items: string[] = [];
        if (language) items.push(`Language: ${language}`);
        if (framework) items.push(`Framework: ${framework}`);
        if (architecture) items.push(`Architecture: ${architecture}`);
        if (!items.length) return null;
        return section("Stack Snapshot", bullets(items));
      },
    },
    {
      id: "facts",
      heading: "Recalled Conventions",
      consumes: ["codingStyle", "codingConventions", "testingFramework"] as EngineFieldId[],
      build: (answers) => {
        const style = asString(answers, "codingStyle");
        const conventions = asStringArray(answers, "codingConventions");
        const testing = asStringArray(answers, "testingFramework");
        const parts: string[] = [];
        if (style) parts.push(`- Coding style: ${style}`);
        if (conventions) parts.push(`${labeledBullets("Conventions", conventions)}`);
        if (testing) parts.push(`${labeledBullets("Testing", testing)}`);
        if (!parts.length) return null;
        return section("Recalled Conventions", parts.join("\n"));
      },
    },
    {
      id: "deployment",
      heading: "Deployment Posture",
      consumes: ["deploymentTarget", "experienceLevel"] as EngineFieldId[],
      build: (answers) => {
        const dep = asString(answers, "deploymentTarget");
        const exp = asString(answers, "experienceLevel");
        const items: string[] = [];
        if (dep) items.push(`Deployment target: ${dep}`);
        if (exp) items.push(`Audience: ${exp}`);
        if (!items.length) return null;
        return section("Deployment Posture", bullets(items));
      },
    },
    {
      id: "current-focus",
      heading: "Current Focus",
      consumes: ["customInstructions"] as EngineFieldId[],
      build: (answers) => {
        const custom = asString(answers, "customInstructions");
        if (!custom) return null;
        return section("Current Focus", custom);
      },
    },
  ],
};

