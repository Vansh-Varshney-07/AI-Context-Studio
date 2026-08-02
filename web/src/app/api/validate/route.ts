import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { validateServer, validateCollection, validateImportedJson } from "@/lib/engine";
import type { InstalledMCPServer } from "@/lib/engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, type, servers } = body;

    // If servers array provided, validate collection
    if (servers && Array.isArray(servers)) {
      const report = validateCollection(servers as InstalledMCPServer[]);
      return NextResponse.json(report);
    }

    // If raw JSON provided for import validation
    if (typeof content === "string" && !type) {
      const result = validateImportedJson(content);
      return NextResponse.json(result);
    }

    // Single content validation (placeholder - would need type-specific validator)
    return NextResponse.json({
      ok: true,
      message: "Validation endpoint ready. Provide servers array for collection validation or raw JSON for import validation.",
    });
  } catch (error) {
    console.error("Validate API error:", error);
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Validator API - POST with { servers: InstalledMCPServer[] } for collection validation, or { content: string } for JSON import validation.",
  });
}