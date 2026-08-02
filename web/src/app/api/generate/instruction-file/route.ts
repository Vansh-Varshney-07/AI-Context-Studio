import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { generateInstructionFileAction, getQuestionsForTargetAction } from "@/actions/generate";

export async function GET() {
  try {
    const { AGENT_INSTRUCTION_TARGETS } = await import("@/lib/engine");
    return NextResponse.json({ targets: AGENT_INSTRUCTION_TARGETS });
  } catch (error) {
    console.error("Instruction file targets API error:", error);
    return NextResponse.json({ error: "Failed to fetch targets" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { target, answers } = body;

    if (!target || !answers) {
      return NextResponse.json({ error: "Missing required fields: target, answers" }, { status: 400 });
    }

    const questions = await getQuestionsForTargetAction(target);
    const result = await generateInstructionFileAction(target, answers);

    return NextResponse.json({ ...result, questions });
  } catch (error) {
    console.error("Instruction file generation error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}