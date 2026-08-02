import { NextRequest, NextResponse } from "next/server";
import {
  getBlueprints,
  getFields,
  generateLocally,
  generateWithAI,
  getDefaultAnswers,
} from "@/actions/generate";

export async function GET() {
  try {
    const [blueprints, fields] = await Promise.all([getBlueprints(), getFields()]);

    return NextResponse.json({
      blueprints: blueprints.map((b) => ({
        kind: b.kind,
        label: b.label,
        description: b.description,
        filenameHint: b.filenameHint,
        extension: b.extension,
      })),
      fields,
    });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json({ error: "Failed to fetch generate config" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kind, answers, useAI, provider } = body;

    if (!kind || !answers) {
      return NextResponse.json({ error: "Missing required fields: kind, answers" }, { status: 400 });
    }

    let result;
    if (useAI && provider) {
      result = await generateWithAI(kind, answers, provider);
    } else {
      result = await generateLocally(kind, answers);
    }

    if (!result) {
      return NextResponse.json({ error: "No content generated - please fill in required fields" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}