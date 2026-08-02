import { NextRequest, NextResponse } from "next/server";
import { getClientProvider, getRegisteredClientIds } from "@/lib/engine";
import type { InstalledMCPServer } from "@/lib/engine";

export async function GET() {
  try {
    const clientIds = getRegisteredClientIds();
    const clients = clientIds.map((id) => {
      const provider = getClientProvider(id);
      return {
        id: provider.id,
        label: provider.label,
        configFilename: provider.configFilename,
        supportsRemoteTransport: provider.supportsRemoteTransport,
      };
    });
    return NextResponse.json({ clients });
  } catch (error) {
    console.error("MCP config clients API error:", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { servers, clientId } = body;

    if (!servers || !Array.isArray(servers)) {
      return NextResponse.json({ error: "Missing required field: servers array" }, { status: 400 });
    }

    if (!clientId) {
      return NextResponse.json({ error: "Missing required field: clientId" }, { status: 400 });
    }

    const provider = getClientProvider(clientId);
    const config = provider.buildConfig(servers as InstalledMCPServer[]);

    return NextResponse.json({
      config,
      filename: provider.configFilename,
    });
  } catch (error) {
    console.error("MCP config generation error:", error);
    return NextResponse.json({ error: "Config generation failed" }, { status: 500 });
  }
}