import { SpeciesSighting } from "@/types";
import { IVisionScannerAdapter, VisionScannerParams } from "./types";

/**
 * Open-Weight Nature Scanner Adapter
 * Supports Groq Cloud multimodal vision (llama-3.2-11b-vision-preview)
 * and Hugging Face Router v1 (Qwen/Qwen2.5-VL-72B-Instruct).
 * Accurately classifies flora, fungi, and natural specimens without proprietary lock-in.
 */
export class OpenWeightsVisionAdapter implements IVisionScannerAdapter {
  readonly providerName: "groq" | "huggingface" | "custom_open_weights";
  readonly modelId: string;
  private apiKey?: string;
  private endpointUrl: string;

  constructor(
    modelId?: string,
    apiKey?: string,
    endpointUrl?: string
  ) {
    const groqKey = process.env.GROQ_API_KEY?.trim();
    const hfToken = process.env.HF_API_TOKEN?.trim();

    const isGroqActive = Boolean(
      (apiKey && apiKey.startsWith("gsk_")) ||
      (groqKey && groqKey.length > 0 && !groqKey.includes("your-") && !groqKey.includes("your_"))
    );

    if (isGroqActive) {
      this.providerName = "groq";
      this.modelId = modelId || process.env.GROQ_VISION_MODEL || "qwen/qwen3.8-27b";
      this.apiKey = apiKey || groqKey;
      this.endpointUrl =
        endpointUrl ||
        process.env.GROQ_VISION_ENDPOINT ||
        "https://api.groq.com/openai/v1/chat/completions";
    } else {
      this.providerName = "huggingface";
      this.modelId = modelId || process.env.HF_VISION_MODEL || "Qwen/Qwen2.5-VL-72B-Instruct";
      this.apiKey = apiKey || hfToken;
      this.endpointUrl =
        endpointUrl ||
        process.env.HF_VISION_ENDPOINT ||
        "https://router.huggingface.co/v1/chat/completions";
    }
  }

  isConfigured(): boolean {
    return Boolean(
      this.apiKey &&
      this.apiKey.trim().length > 0 &&
      !this.apiKey.includes("your_") &&
      !this.apiKey.includes("your-")
    );
  }

  async identifySpecies(params: VisionScannerParams): Promise<SpeciesSighting[]> {
    if (!this.isConfigured()) {
      throw new Error(
        `[TouchQuest Vision Adapter] No open-weight vision provider configured. ` +
        `Add GROQ_API_KEY (free at console.groq.com) or HF_API_TOKEN to .env.local. Target model: ${this.modelId}.`
      );
    }

    // Convert image buffer to base64 data URL
    let base64Data: string;
    if (typeof params.imageData === "string") {
      base64Data = params.imageData.startsWith("data:")
        ? params.imageData
        : `data:${params.mimeType || "image/jpeg"};base64,${params.imageData}`;
    } else {
      base64Data = `data:${params.mimeType || "image/jpeg"};base64,${params.imageData.toString("base64")}`;
    }

    const systemPrompt = `You are an expert botanical taxonomist and naturalist for TouchQuest ("Touch Grass" open-source challenge).
Analyze the provided image of a wild plant, tree, fungus, or natural specimen.
Classify the likely organism.
Respond strictly in valid JSON format only (no markdown, no preamble, no backticks):
{
  "commonName": "Common english name",
  "scientificName": "Genus species (in italics format)",
  "kingdom": "plant" | "fungi" | "animal" | "insect",
  "confidence": 0.85,
  "notes": "1-sentence identifying field characteristic (e.g. leaf arrangement, petal count, or habitat)"
}`;

    const userPrompt = "Identify this botanical or natural specimen from the image. Provide exact taxonomy.";

    try {
      const requestBody: Record<string, unknown> = {
        model: this.modelId,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt },
              {
                type: "image_url",
                image_url: { url: base64Data },
              },
            ],
          },
        ],
        max_tokens: 350,
        temperature: 0.2,
      };

      if (this.providerName === "groq") {
        requestBody.response_format = { type: "json_object" };
      }

      const response = await fetch(this.endpointUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(25000), // 25s timeout for vision models
      });

      if (!response.ok) {
        const errorText = await response.text();
        const keyName = this.providerName === "groq" ? "GROQ_API_KEY" : "HF_API_TOKEN";
        if (response.status === 401 || response.status === 403) {
          throw new Error(`Authentication failed on ${this.providerName}: ${keyName} is invalid or lacks permissions.`);
        }
        if (response.status === 404) {
          throw new Error(
            `Vision model '${this.modelId}' is not found on ${this.endpointUrl}. ` +
            `Verify model name for ${this.providerName}.`
          );
        }
        if (response.status === 429) {
          throw new Error(`Rate limit exceeded on ${this.providerName} vision provider. Please try again shortly.`);
        }
        throw new Error(`${this.providerName} vision provider error (HTTP ${response.status}): ${errorText}`);
      }

      const rawResult = await response.json();
      let outputText = "";

      if (rawResult.choices && rawResult.choices[0]?.message?.content) {
        outputText = rawResult.choices[0].message.content;
      } else if (Array.isArray(rawResult)) {
        outputText = rawResult[0]?.generated_text || "";
      } else if (rawResult.generated_text) {
        outputText = rawResult.generated_text;
      } else {
        throw new Error(`Unexpected response structure from ${this.providerName} vision endpoint.`);
      }

      // Extract JSON payload safely
      const jsonMatch = outputText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Could not parse structured taxonomy JSON from vision model output.");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return [
        {
          id: `sighting-${Date.now()}-0`,
          kingdom: (parsed.kingdom as "plant" | "fungi" | "animal" | "insect") || "plant",
          commonName: parsed.commonName || "Identified Flora",
          scientificName: parsed.scientificName || "Plantae sp.",
          confidence: typeof parsed.confidence === "number" ? Math.min(Math.max(parsed.confidence, 0.1), 0.99) : 0.88,
          notes: parsed.notes || "Specimen observed via TouchQuest nature scanner.",
          latitude: params.latitude,
          longitude: params.longitude,
          openWeightModelUsed: `${this.modelId} (${this.providerName})`,
          detectedAt: new Date().toISOString(),
        },
      ];
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "TimeoutError") {
        throw new Error(`Vision identification timed out after 25 seconds on ${this.modelId} (${this.providerName}).`);
      }
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Vision identification failed on ${this.modelId} (${this.providerName}): ${message}`);
    }
  }
}
