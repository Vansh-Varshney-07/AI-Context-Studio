import type { PersonaAnswers, PersonaBlueprint, PersonaBlueprintSection } from "./types";

/**
 * Blueprint sections for persona generation
 */
export const PERSONA_BLUEPRINTS: PersonaBlueprint[] = [
  {
    kind: "system-prompt",
    label: "System Prompt",
    description: "Core system prompt for AI assistants",
    filenameHint: "persona-system-prompt",
    extension: "md",
    titleTemplate: (a) => `System Prompt — ${a.name}`,
    sections: [
      {
        id: "identity",
        heading: "Identity",
        consumes: ["name", "title", "avatar"],
        build: (a) => a.name ? `You are ${a.name}, ${a.title}. ${a.avatar || ""}` : null,
      },
      {
        id: "purpose",
        heading: "Purpose",
        consumes: ["description"],
        build: (a) => a.description ? `Your purpose: ${a.description}` : null,
      },
      {
        id: "system-prompt",
        heading: "Core Instructions",
        consumes: ["systemPrompt"],
        build: (a) => {
          const val = a.systemPrompt;
          return typeof val === "string" && val ? val : null;
        },
      },
      {
        id: "expertise",
        heading: "Areas of Expertise",
        consumes: ["expertise"],
        build: (a) => {
          const val = a.expertise;
          return typeof val === "string" && val ? `Expertise: ${val}` : null;
        },
      },
      {
        id: "communication",
        heading: "Communication Style",
        consumes: ["communicationStyle", "traits"],
        build: (a) => {
          const parts = [];
          const style = a.communicationStyle;
          if (typeof style === "string" && style) parts.push(style);
          if (a.traits) {
            const traitStr = Object.entries(a.traits).map(([k, v]) => `${k}: ${v}/10`).join(", ");
            parts.push(`Traits: ${traitStr}`);
          }
          return parts.length ? parts.join("\n") : null;
        },
      },
      {
        id: "examples",
        heading: "Example Interactions",
        consumes: ["exampleInteractions"],
        build: (a) => {
          const ex = a.exampleInteractions;
          if (!ex || (typeof ex === "string" && ex.trim() === "")) return null;
          const arr = typeof ex === "string"
            ? ex.split("\n").filter(Boolean).map(line => {
                const [user, assistant] = line.split("|").map(s => s.trim());
                return { user, assistant, context: "" };
              })
            : (Array.isArray(ex) ? ex : []);
          return arr.map((ex, i) => {
            const user = typeof ex === "object" && ex !== null && "user" in ex ? ex.user : "";
            const assistant = typeof ex === "object" && ex !== null && "assistant" in ex ? ex.assistant : "";
            const context = typeof ex === "object" && ex !== null && "context" in ex ? ex.context : "";
            return `### Example ${i + 1}\n**User**: ${user}\n**Assistant**: ${assistant}${context ? `\n*Context: ${context}*` : ""}`;
          }).join("\n\n");
        },
      },
    ],
  },
  {
    kind: "instruction-file",
    label: "Instruction File",
    description: "AGENTS.md / CLAUDE.md style instruction file",
    filenameHint: "persona-instructions",
    extension: "md",
    titleTemplate: (a) => `Instructions — ${a.name}`,
    sections: [
      {
        id: "overview",
        heading: "Overview",
        consumes: ["name", "title", "description"],
        build: (a) => {
          const parts = [];
          if (a.name) parts.push(`# ${a.name}`);
          if (a.title) parts.push(`**Role**: ${a.title}`);
          if (a.description) parts.push(`**Purpose**: ${a.description}`);
          return parts.length ? parts.join("\n\n") : null;
        },
      },
      {
        id: "instructions",
        heading: "Instructions",
        consumes: ["systemPrompt"],
        build: (a) => {
          const val = a.systemPrompt;
          return typeof val === "string" && val ? val : null;
        },
      },
      {
        id: "expertise",
        heading: "Expertise",
        consumes: ["expertise"],
        build: (a) => {
          const val = a.expertise;
          return typeof val === "string" && val ? `## Expertise\n${val.split(",").map(e => `- ${e.trim()}`).join("\n")}` : null;
        },
      },
      {
        id: "style",
        heading: "Communication Style",
        consumes: ["communicationStyle", "traits"],
        build: (a) => {
          const parts = [];
          if (a.communicationStyle) parts.push(a.communicationStyle);
          if (a.traits) {
            parts.push("\n**Traits (0-10):**");
            for (const [k, v] of Object.entries(a.traits)) {
              parts.push(`- ${k}: ${v}/10`);
            }
          }
          return parts.length ? parts.join("\n") : null;
        },
      },
    ],
  },
];

/**
 * Render a persona blueprint from answers
 */
export function renderPersonaBlueprint(kind: "system-prompt" | "instruction-file", answers: PersonaAnswers): string | null {
  const blueprint = PERSONA_BLUEPRINTS.find(b => b.kind === kind);
  if (!blueprint) return null;

  const sections = blueprint.sections
    .map(section => {
      const content = section.build(answers);
      if (!content) return null;
      return `## ${section.heading}\n\n${content}`;
    })
    .filter(Boolean)
    .join("\n\n");

  if (!sections) return null;

  const title = blueprint.titleTemplate(answers);
  return `# ${title}\n\n${sections}\n\n<!-- Generated by AI Context Studio — Personas Module -->`;
}