import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getWorkflowBlueprints, renderWorkflowAction } from "@/actions/generate";

export async function GET() {
  try {
    const blueprints = await getWorkflowBlueprints();
    return NextResponse.json({ blueprints });
  } catch (error) {
    console.error("Workflow blueprints API error:", error);
    return NextResponse.json({ error: "Failed to fetch blueprints" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflowId, answers } = body;

    if (!workflowId || !answers) {
      return NextResponse.json({ error: "Missing required fields: workflowId, answers" }, { status: 400 });
    }

    const result = await renderWorkflowAction(workflowId, answers);

    if (!result) {
      return NextResponse.json({ error: "No content generated" }, { status: 400 });
    }

    return NextResponse.json({ content: result });
  } catch (error) {
    console.error("Workflow generation error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}