import { NextRequest, NextResponse } from "next/server";
import { aiProviders } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const adapter = aiProviders.getAudioAdapter();

    if (!adapter.isConfigured()) {
      return NextResponse.json(
        {
          error:
            "Pending configuration: Hosted inference for bioacoustic audio classification is not available on free serverless router tiers. " +
            "To enable live bird species classification, configure HF_AUDIO_ENDPOINT in .env.local with a dedicated BirdNET container or Space URL.",
          modelTarget: adapter.modelId,
          isConfigured: false,
        },
        { status: 503 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    let audioBuffer: Buffer;
    let mimeType = "audio/wav";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "Missing audio file in form data." }, { status: 400 });
      }

      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "Audio file exceeds maximum 10MB size limit." }, { status: 400 });
      }

      mimeType = file.type || "audio/wav";
      const arrayBuffer = await file.arrayBuffer();
      audioBuffer = Buffer.from(arrayBuffer);
    } else {
      const body = await req.json();
      if (!body.audioData) {
        return NextResponse.json({ error: "Missing audioData in request body." }, { status: 400 });
      }
      mimeType = body.mimeType || "audio/wav";
      const base64Data = body.audioData.replace(/^data:audio\/\w+;base64,/, "");
      audioBuffer = Buffer.from(base64Data, "base64");
    }

    const results = await adapter.classifyAudio({
      audioData: audioBuffer,
      mimeType,
    });

    return NextResponse.json({ success: true, classifications: results });
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
