import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { WorkflowsClient } from "@/components/tools/workflows-client";
import { SEED_WORKFLOWS } from "@/lib/engine";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Workflows Generator",
  description: "Browse 7 built-in workflow pipelines (feature development, bug fix, code review, refactoring, etc.) and render to YAML.",
});

export default function WorkflowsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <WorkflowsClient initialWorkflows={SEED_WORKFLOWS} />
      <Footer />
    </main>
  );
}