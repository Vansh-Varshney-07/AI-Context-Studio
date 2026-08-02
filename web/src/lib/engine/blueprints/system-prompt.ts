import type { EngineBlueprint, EngineFieldId } from "../types";
import { asString, asStringArray, bullets, labeledBullets, section } from "./shared";

/**
 * System-Prompt blueprint.
 *
 * Produces a role / role-behavior / context / constraints artifact usable
 * as the system message for chat assistants or subagents. Sections that
 * have no answer are silently omitted — no fabrication.
 */
const CONSUMES_IDENTITY: EngineFieldId[] = ["purpose", "targetAI"];
const CONSUMES_CONTEXT: EngineFieldId[] = [
  "projectType",
  "framework",
  "language",
  "architecture",
  "deploymentTarget",
  "experienceLevel",
];
const CONSUMES_BEHAVIOR: EngineFieldId[] = ["codingConventions", "codingStyle"];
const CONSUMES_CONSTRAINTS: EngineFieldId[] = ["customInstructions"];

export const systemPromptBlueprint: EngineBlueprint = {
  kind: "system-prompt",
  label: "System Prompt",
  description: "Role / context / constraints preamble for an AI assistant.",
  filenameHint: "system-prompt",
  extension: "md",
  titleTemplate: (answers) => {
    const target = asString(answers, "targetAI");
    return target ? `System Prompt — ${target}` : "System Prompt";
  },
  sections: [
    {
      id: "role",
      heading: "Role",
      consumes: CONSUMES_IDENTITY,
      build: (answers) => {
        const purpose = asString(answers, "purpose");
        const target = asString(answers, "targetAI");
        if (!purpose && !target) return null;
        const parts: string[] = [];
        if (target) parts.push(`You are an expert AI pairing assistant operating under the ${target} contract.`);
        if (purpose) parts.push(`Your purpose: ${purpose}`);
        return section("Role", parts.join("\n"));
      },
    },
    {
      id: "context",
      heading: "Context",
      consumes: CONSUMES_CONTEXT,
      build: (answers) => {
        const projectType = asString(answers, "projectType");
        const framework = asString(answers, "framework");
        const language = asString(answers, "language");
        const architecture = asString(answers, "architecture");
        const deploymentTarget = asString(answers, "deploymentTarget");
        const experienceLevel = asString(answers, "experienceLevel");
        const lines: string[] = [];
        if (projectType) lines.push(`- Project type: ${projectType}`);
        if (framework) lines.push(`- Framework: ${framework}`);
        if (language) lines.push(`- Language: ${language}`);
        if (architecture) lines.push(`- Architecture: ${architecture}`);
        if (deploymentTarget) lines.push(`- Deployment target: ${deploymentTarget}`);
        if (experienceLevel) lines.push(`- Audience: ${experienceLevel}`);
        if (!lines.length) return null;
        return section("Context", bullets(lines.map((l) => l.replace(/^- /, ""))));
      },
    },
    {
      id: "behavior",
      heading: "Behavior",
      consumes: CONSUMES_BEHAVIOR,
      build: (answers) => {
        const conventions = asStringArray(answers, "codingConventions");
        const style = asString(answers, "codingStyle");
        const parts: string[] = [];
        const items: string[] = [];
        if (style) items.push(`Adopt a ${style.toLowerCase()} coding style unless instructed otherwise.`);
        if (conventions) items.push(...conventions);
        if (!items.length) return null;
        parts.push(bullets(items));
        return section("Behavior", parts.join("\n"));
      },
    },
    {
      id: "constraints",
      heading: "Constraints",
      consumes: CONSUMES_CONSTRAINTS,
      build: (answers) => {
        const custom = asString(answers, "customInstructions");
        if (!custom) return null;
        return section("Constraints", custom);
      },
    },
    {
      id: "guardrails",
      heading: "Guardrails",
      consumes: ["testingFramework"] as EngineFieldId[],
      build: (answers) => {
        const testing = asStringArray(answers, "testingFramework");
        if (!testing) return null;
        return section(
          "Guardrails",
          `${labeledBullets("Required testing framework(s)", testing)}`,
        );
      },
    },
  ],
};