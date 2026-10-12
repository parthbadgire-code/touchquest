import { NextRequest, NextResponse } from "next/server";
import { aiProviders } from "@/lib/ai";
import { MissionGeneratorParams } from "@/lib/ai/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const duration = Number(body.durationMinutes);

    if (![15, 30, 60].includes(duration)) {
      return NextResponse.json(
        { error: "Invalid mission duration. Choose 15, 30, or 60 minutes." },
        { status: 400 }
      );
    }

    const adapter = aiProviders.getMissionAdapter();

    if (!adapter.isConfigured()) {
      return NextResponse.json(
        {
          error: "Pending configuration: Open-weight model API key (HF_API_TOKEN) is not set in environment.",
          modelTarget: adapter.modelId,
          isConfigured: false,
        },
        { status: 503 }
      );
    }

    const params: MissionGeneratorParams = {
      durationMinutes: duration as 15 | 30 | 60,
      terrain: body.terrain,
      weatherContext: body.weatherContext,
    };

    const mission = await adapter.generateMission(params);
    return NextResponse.json({ success: true, mission });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("timed out")
      ? 504
      : message.includes("Authentication failed")
      ? 401
      : message.includes("Rate limit")
      ? 429
      : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
