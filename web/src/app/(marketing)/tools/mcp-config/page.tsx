import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { MCPConfigClient } from "@/components/tools/mcp-config-client";
import { MCP_CLIENTS } from "@/lib/engine";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "MCP Config Generator",
  description: "Build MCP server configurations for 11 AI clients (Claude Desktop, Cursor, OpenCode, Continue, etc.) with validation.",
});

export default function MCPConfigPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <MCPConfigClient initialClients={MCP_CLIENTS} />
      <Footer />
    </main>
  );
}