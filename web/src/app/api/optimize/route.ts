import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { Optimizer } from "@/lib/optimizer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, promptType, targetModel, optimizationTypes, mode } = body;

    if (!content) {
      return NextResponse.json({ error: "Missing required field: content" }, { status: 400 });
    }

    const result = await Optimizer.optimize({
      content,
      promptType: promptType ?? "general-prompt",
      targetModel: targetModel ?? "claude",
      optimizationTypes: optimizationTypes ?? ["clarity"],
      mode: mode ?? "general",
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Optimize API error:", error);
    return NextResponse.json({ error: "Optimization failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const engines = Optimizer.getEngines();
    return NextResponse.json({
      engines: engines.map((e) => ({
        id: e.id,
        name: e.name,
        description: e.description,
        supportedTypes: e.supportedTypes,
      })),
    });
  } catch (error) {
    console.error("Optimize engines API error:", error);
    return NextResponse.json({ error: "Failed to fetch engines" }, { status: 500 });
  }
}