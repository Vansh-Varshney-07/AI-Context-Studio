import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { OptimizeClient } from "@/components/tools/optimize-client";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Prompt Optimizer",
  description: "Optimize prompts with 16 engines (clarity, conciseness, CoT, token reduction, safety, etc.) with diff view and stats.",
});

export default function OptimizePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <OptimizeClient />
      <Footer />
    </main>
  );
}