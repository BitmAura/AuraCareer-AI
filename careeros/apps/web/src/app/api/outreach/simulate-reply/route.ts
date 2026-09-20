import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeRecruiterResponse } from "@/lib/outreach/sentiment-analyzer";

const SimulateReplySchema = z.object({
  replyText: z.string().min(5),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parsed = SimulateReplySchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid reply payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { replyText } = parsed.data;
    const result = analyzeRecruiterResponse(replyText);

    return NextResponse.json({
      success: true,
      analysis: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to analyze recruiter reply", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
