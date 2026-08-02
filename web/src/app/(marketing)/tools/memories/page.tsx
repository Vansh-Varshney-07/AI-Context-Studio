import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { MemoriesClient } from "@/components/tools/memories-client";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Memories Manager",
  description: "Manage memory blocks (context, knowledge, decisions, standards, references) and render to markdown.",
});

export default function MemoriesPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <MemoriesClient />
      <Footer />
    </main>
  );
}