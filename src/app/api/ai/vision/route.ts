import { NextRequest, NextResponse } from "next/server";
import { aiProviders } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const adapter = aiProviders.getVisionAdapter();

    if (!adapter.isConfigured()) {
      return NextResponse.json(
        {
          error: "Pending configuration: Open-weight vision model API key (HF_API_TOKEN) is not set in environment.",
          modelTarget: adapter.modelId,
          isConfigured: false,
        },
        { status: 503 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    let imageBuffer: Buffer;
    let mimeType = "image/jpeg";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "Missing image file in form data." }, { status: 400 });
      }

      if (file.size > 8 * 1024 * 1024) {
        return NextResponse.json({ error: "Image file exceeds maximum 8MB size limit." }, { status: 400 });
      }

      mimeType = file.type || "image/jpeg";
      const arrayBuffer = await file.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    } else {
      const body = await req.json();
      if (!body.imageData) {
        return NextResponse.json({ error: "Missing imageData in request body." }, { status: 400 });
      }
      mimeType = body.mimeType || "image/jpeg";
      const base64Data = body.imageData.replace(/^data:image\/\w+;base64,/, "");
      imageBuffer = Buffer.from(base64Data, "base64");
    }

    const results = await adapter.identifySpecies({
      imageData: imageBuffer,
      mimeType,
    });

    return NextResponse.json({ success: true, species: results });
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
