import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { InstructionFilesClient } from "@/components/tools/instruction-files-client";
import { AGENT_INSTRUCTION_TARGETS, GENERATOR_QUESTIONS } from "@/lib/engine";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Instruction Files Generator",
  description: "Generate AGENTS.md, CLAUDE.md, .cursorrules, and 9 other target formats with per-target dynamic questions.",
});

export default async function InstructionFilesPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <InstructionFilesClient
        initialTargets={AGENT_INSTRUCTION_TARGETS}
        initialQuestions={GENERATOR_QUESTIONS}
      />
      <Footer />
    </main>
  );
}