import { NextResponse } from "next/server";
import { aiProviders } from "@/lib/ai";

export async function GET() {
  const status = aiProviders.getStatus();
  return NextResponse.json({
    status: "ok",
    providers: status,
    platform: "TouchQuest Open Nature AI",
  });
}
