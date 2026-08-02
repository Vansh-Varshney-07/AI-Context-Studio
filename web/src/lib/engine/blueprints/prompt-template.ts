import type { EngineBlueprint, EngineFieldId } from "../types";
import { asString, asStringArray, bullets, labeledBullets, section } from "./shared";

/**
 * Prompt-Template blueprint.
 *
 * Produces a reusable prompt template with {{VARIABLE}} placeholders derived
 * from the structured context. The user must still fill the placeholders —
 * this blueprint only lays out the structure that maxes out reuse across
 * projects.
 */
export const promptTemplateBlueprint: EngineBlueprint = {
  kind: "prompt-template",
  label: "Prompt Template",
  description: "Reusable prompt template with {{VARIABLE}} placeholders.",
  filenameHint: "prompt-template",
  extension: "md",
  titleTemplate: (answers) => {
    const purpose = asString(answers, "purpose");
    return purpose ? `Prompt Template — ${purpose}` : "Prompt Template";
  },
  sections: [
    {
      id: "objective",
      heading: "Objective",
      consumes: ["purpose"] as EngineFieldId[],
      build: (answers) => {
        const purpose = asString(answers, "purpose");
        if (!purpose) return null;
        return section(
          "Objective",
          `Role: {{ROLE}}\nGoal: ${purpose}\nDeliverable: {{DELIVERABLE}}`,
        );
      },
    },
    {
      id: "context",
      heading: "Project Context",
      consumes: [
        "framework",
        "language",
        "projectType",
        "architecture",
        "deploymentTarget",
        "targetAI",
      ] as EngineFieldId[],
      build: (answers) => {
        const framework = asString(answers, "framework");
        const language = asString(answers, "language");
        const projectType = asString(answers, "projectType");
        const architecture = asString(answers, "architecture");
        const deploymentTarget = asString(answers, "deploymentTarget");
        const target = asString(answers, "targetAI");
        const items: string[] = [];
        if (target) items.push(`Target AI: ${target}`);
        if (projectType) items.push(`Project type: ${projectType}`);
        if (language) items.push(`Language: ${language}`);
        if (framework) items.push(`Framework: ${framework}`);
        if (architecture) items.push(`Architecture: ${architecture}`);
        if (deploymentTarget) items.push(`Deployment target: ${deploymentTarget}`);
        if (!items.length) return null;
        return section("Project Context", bullets(items));
      },
    },
    {
      id: "requirements",
      heading: "Requirements",
      consumes: ["codingStyle", "codingConventions", "testingFramework"] as EngineFieldId[],
      build: (answers) => {
        const style = asString(answers, "codingStyle");
        const conventions = asStringArray(answers, "codingConventions");
        const testing = asStringArray(answers, "testingFramework");
        const parts: string[] = [];
        if (style) parts.push(`- Coding style: ${style}`);
        if (conventions) parts.push(`${labeledBullets("Conventions", conventions)}`);
        if (testing) parts.push(`${labeledBullets("Testing requirements", testing)}`);
        if (!parts.length) return null;
        return section("Requirements", parts.join("\n"));
      },
    },
    {
      id: "instructions",
      heading: "Instructions",
      consumes: ["experienceLevel", "customInstructions"] as EngineFieldId[],
      build: (answers) => {
        const exp = asString(answers, "experienceLevel");
        const custom = asString(answers, "customInstructions");
        const parts: string[] = [];
        if (exp) parts.push(`- Address the explanation to a ${exp.toLowerCase()} developer.`);
        if (custom) parts.push(custom);
        if (!parts.length) return null;
        return section("Instructions", parts.join("\n"));
      },
    },
    {
      id: "output-format",
      heading: "Output Format",
      consumes: ["customInstructions"] as EngineFieldId[],
      build: (answers) => {
        const custom = asString(answers, "customInstructions");
        const fmt = `- Return only the deliverable — no preamble or explanation.
- Use Markdown formatting with fenced code blocks where appropriate.
- If committing multiple files, list each under its own \`### path/to/file\` heading.`;
        if (!custom) return section("Output Format", fmt);
        return section("Output Format", `${fmt}\n\n${custom}`);
      },
    },
  ],
};