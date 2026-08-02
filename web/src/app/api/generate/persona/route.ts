import { NextRequest, NextResponse } from "next/server";
import { getPersonaBlueprints, renderPersonaAction } from "@/actions/generate";

export async function GET() {
  try {
    const blueprints = await getPersonaBlueprints();
    return NextResponse.json({ blueprints });
  } catch (error) {
    console.error("Persona blueprints API error:", error);
    return NextResponse.json({ error: "Failed to fetch blueprints" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kind, answers } = body;

    if (!kind || !answers) {
      return NextResponse.json({ error: "Missing required fields: kind, answers" }, { status: 400 });
    }

    const result = await renderPersonaAction(kind, answers);

    if (!result) {
      return NextResponse.json({ error: "No content generated" }, { status: 400 });
    }

    return NextResponse.json({ content: result });
  } catch (error) {
    console.error("Persona generation error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}