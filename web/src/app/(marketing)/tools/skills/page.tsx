import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { SkillsClient } from "@/components/tools/skills-client";
import { SEED_SKILLS } from "@/lib/engine";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Skills Explorer",
  description: "Explore 12 atomic AI skills across programming, writing, analysis, devops categories with full prompts and parameters.",
});

export default function SkillsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <SkillsClient initialSkills={SEED_SKILLS} />
      <Footer />
    </main>
  );
}