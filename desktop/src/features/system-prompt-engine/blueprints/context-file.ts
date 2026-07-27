import type { EngineBlueprint, EngineFieldId } from "../types";
import { asString, asStringArray, bullets, labeledBullets, section } from "./shared";

/**
 * Context-File blueprint.
 *
 * Produces a repository-attached context file (e.g. `docs/context.md`)
 * describing the project's structured context for AI tools to ingest.
 */
export const contextFileBlueprint: EngineBlueprint = {
  kind: "context-file",
  label: "Context File",
  description: "Repo-attached context file consumable by AI assistants.",
  filenameHint: "context",
  extension: "md",
  titleTemplate: (answers) => {
    const projectType = asString(answers, "projectType");
    return projectType ? `Context — ${projectType} project` : "Context";
  },
  sections: [
    {
      id: "purpose",
      heading: "Purpose",
      consumes: ["purpose"] as EngineFieldId[],
      build: (answers) => {
        const purpose = asString(answers, "purpose");
        if (!purpose) return null;
        return section("Purpose", purpose);
      },
    },
    {
      id: "tech-stack",
      heading: "Tech Stack",
      consumes: ["language", "framework", "deploymentTarget"] as EngineFieldId[],
      build: (answers) => {
        const language = asString(answers, "language");
        const framework = asString(answers, "framework");
        const deploymentTarget = asString(answers, "deploymentTarget");
        const items: string[] = [];
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
      consumes: ["architecture", "projectType"] as EngineFieldId[],
      build: (answers) => {
        const architecture = asString(answers, "architecture");
        const projectType = asString(answers, "projectType");
        const items: string[] = [];
        if (architecture) items.push(`Pattern: ${architecture}`);
        if (projectType) items.push(`Project type: ${projectType}`);
        if (!items.length) return null;
        return section("Architecture", bullets(items));
      },
    },
    {
      id: "conventions",
      heading: "Conventions",
      consumes: ["codingStyle", "codingConventions"] as EngineFieldId[],
      build: (answers) => {
        const style = asString(answers, "codingStyle");
        const conventions = asStringArray(answers, "codingConventions");
        const parts: string[] = [];
        if (style) parts.push(`- Coding style: ${style}`);
        if (conventions) parts.push(`${labeledBullets("Conventions", conventions)}`);
        if (!parts.length) return null;
        return section("Conventions", parts.join("\n"));
      },
    },
    {
      id: "testing",
      heading: "Testing",
      consumes: ["testingFramework"] as EngineFieldId[],
      build: (answers) => {
        const testing = asStringArray(answers, "testingFramework");
        if (!testing) return null;
        return section("Testing", `${labeledBullets("Frameworks", testing)}`);
      },
    },
    {
      id: "custom",
      heading: "Additional Context",
      consumes: ["customInstructions"] as EngineFieldId[],
      build: (answers) => {
        const custom = asString(answers, "customInstructions");
        if (!custom) return null;
        return section("Additional Context", custom);
      },
    },
  ],
};

