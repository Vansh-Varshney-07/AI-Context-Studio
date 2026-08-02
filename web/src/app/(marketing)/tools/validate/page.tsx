import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { ValidateClient } from "@/components/tools/validate-client";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Asset Validator",
  description: "Validate AI assets with quality scoring, AI performance estimates, token efficiency, and compatibility matrix.",
});

export default function ValidatePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <ValidateClient />
      <Footer />
    </main>
  );
}