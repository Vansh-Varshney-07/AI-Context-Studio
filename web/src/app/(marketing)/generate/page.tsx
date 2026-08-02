import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { GenerateClient } from "@/components/generate/generate-client";
import { getBlueprints, getFields } from "@/actions/generate";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Generate AI Files",
  description: "Create system prompts, instruction files, prompt templates, and more using structured forms or AI enhancement.",
});

export default async function GeneratePage() {
  const [blueprints, fields] = await Promise.all([getBlueprints(), getFields()]);

  // Transform blueprints to serializable format for client
  const serializableBlueprints = blueprints.map((bp) => ({
    kind: bp.kind,
    label: bp.label,
    description: bp.description,
    filenameHint: bp.filenameHint,
    extension: bp.extension,
    // Note: titleTemplate and sections.build are functions - not serializable
    // Client will import the engine directly for generation
    sections: bp.sections.map((s) => ({
      id: s.id,
      heading: s.heading,
      consumes: s.consumes,
    })),
  }));

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <GenerateClient initialBlueprints={serializableBlueprints} initialFields={fields} />
      <Footer />
    </main>
  );
}