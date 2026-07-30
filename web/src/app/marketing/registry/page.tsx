import { type Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { RegistryPageContent } from "@/components/registry/registry-page";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Registry",
  description: "Open specification for AI asset packaging: manifest schema, semantic versioning, dependencies, compatibility matrix, and checksums.",
});

export default function RegistryPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <RegistryPageContent />
      <Footer />
    </main>
  );
}