import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { PersonasClient } from "@/components/tools/personas-client";
import { SEED_PERSONAS } from "@/lib/engine";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Personas Generator",
  description: "Browse 10 built-in AI personas (code reviewer, architect, devops, security, etc.) and render them to system prompts or instruction files.",
});

export default function PersonasPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <PersonasClient initialPersonas={SEED_PERSONAS} />
      <Footer />
    </main>
  );
}