import type { EngineBlueprint, EngineFieldId } from "../types";
import { asString, asStringArray, bullets, labeledBullets, section } from "./shared";

/**
 * Workflow blueprint.
 *
 * Produces a declarative pipeline document enumerating ordered steps. We
 * intentionally leave `${N}` and `when:` blocks unbound — the structured
 * inputs only describe context, ordering, and constraints.
 */
export const workflowBlueprint: EngineBlueprint = {
  kind: "workflow",
  label: "Workflow Definition",
  description: "Sequential pipeline of steps over the structured context.",
  filenameHint: "workflow",
  extension: "yml",
  titleTemplate: (answers) => {
    const purpose = asString(answers, "purpose");
    return purpose ? `Workflow — ${purpose}` : "Workflow";
  },
  sections: [
    {
      id: "meta",
      heading: "Meta",
      consumes: ["purpose", "targetAI", "experienceLevel"] as EngineFieldId[],
      build: (answers) => {
        const purpose = asString(answers, "purpose");
        const target = asString(answers, "targetAI");
        const exp = asString(answers, "experienceLevel");
        const lines: string[] = [];
        if (target) lines.push(`owner: "${target}"`);
        if (exp) lines.push(`audience: "${exp}"`);
        if (purpose) lines.push(`goal: "${purpose}"`);
        if (!lines.length) return null;
        return section("Meta", "```yaml\n" + lines.join("\n") + "\n```");
      },
    },
    {
      id: "context",
      heading: "Context Inputs",
      consumes: [
        "framework",
        "language",
        "projectType",
        "architecture",
        "deploymentTarget",
      ] as EngineFieldId[],
      build: (answers) => {
        const framework = asString(answers, "framework");
        const language = asString(answers, "language");
        const projectType = asString(answers, "projectType");
        const architecture = asString(answers, "architecture");
        const deploymentTarget = asString(answers, "deploymentTarget");
        const items: string[] = [];
        if (projectType) items.push(`projectType: "${projectType}"`);
        if (language) items.push(`language: "${language}"`);
        if (framework) items.push(`framework: "${framework}"`);
        if (architecture) items.push(`architecture: "${architecture}"`);
        if (deploymentTarget) items.push(`deploymentTarget: "${deploymentTarget}"`);
        if (!items.length) return null;
        return section(
          "Context Inputs",
          "```yaml\n" + items.join("\n") + "\n```",
        );
      },
    },
    {
      id: "steps",
      heading: "Steps",
      consumes: ["codingStyle", "codingConventions", "testingFramework"] as EngineFieldId[],
      build: (answers) => {
        const style = asString(answers, "codingStyle");
        const conventions = asStringArray(answers, "codingConventions");
        const testing = asStringArray(answers, "testingFramework");
        const steps: string[] = [];
        let idx = 0;
        if (style) steps.push(`- id: step-${idx++}\n  label: "Apply ${style} style"`);
        if (conventions)
          steps.push(
            `- id: step-${idx++}\n  label: "Verify conventions"\n  checklist:\n` +
              conventions.map((c) => `    - ${c}`).join("\n"),
          );
        if (testing)
          steps.push(
            `- id: step-${idx++}\n  label: "Run tests"\n  frameworks:\n` +
              testing.map((t) => `    - ${t}`).join("\n"),
          );
        if (!steps.length) return null;
        const body = `steps:\n${steps.join("\n")}`;
        return section("Steps", "```yaml\n" + body + "\n```");
      },
    },
    {
      id: "guardrails",
      heading: "Guardrails",
      consumes: ["customInstructions"] as EngineFieldId[],
      build: (answers) => {
        const custom = asString(answers, "customInstructions");
        if (!custom) return null;
        const items = custom.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        if (!items.length) return null;
        const body = `${labeledBullets("Guardrails", items)}`;
        return section("Guardrails", body);
      },
    },
    {
      id: "success",
      heading: "Success Criteria",
      consumes: ["testingFramework"] as EngineFieldId[],
      build: (answers) => {
        const testing = asStringArray(answers, "testingFramework");
        if (!testing) return null;
        return section(
          "Success Criteria",
          `${labeledBullets("All required tests must pass", testing)}`,
        );
      },
    },
  ],
};

