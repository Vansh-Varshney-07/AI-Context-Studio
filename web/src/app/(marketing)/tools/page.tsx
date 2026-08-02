import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { ToolGrid } from "@/components/tools/tool-grid";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "AI Tools & Generators",
  description: "Explore all AI-powered generators and tools: instruction files, personas, workflows, MCP configs, and more.",
});

export default function ToolsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <ToolGrid />
      <Footer />
    </main>
  );
}