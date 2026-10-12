import { NextResponse } from "next/server";
import { aiProviders } from "@/lib/ai";

export async function GET() {
  const status = aiProviders.getStatus();
  return NextResponse.json({
    status: "ok",
    providers: status,
    openWeightsChallenge: "Hacktoberfest 2026: Touch Grass",
  });
}
