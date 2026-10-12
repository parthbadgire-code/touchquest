import { Mission } from "@/types";
import { IMissionGeneratorAdapter, MissionGeneratorParams } from "./types";

/**
 * Open-Weight Mission Generator Adapter
 * Supports Groq Cloud (ultra-fast, free-tier open weights: llama-3.1-8b-instant)
 * and Hugging Face Router v1 (Qwen/Qwen2.5-7B-Instruct).
 */
export class OpenWeightsMissionAdapter implements IMissionGeneratorAdapter {
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
      this.modelId = modelId || process.env.GROQ_MISSION_MODEL || "qwen/qwen3.8-27b";
      this.apiKey = apiKey || groqKey;
      this.endpointUrl =
        endpointUrl ||
        process.env.GROQ_CHAT_ENDPOINT ||
        "https://api.groq.com/openai/v1/chat/completions";
    } else {
      this.providerName = "huggingface";
      this.modelId = modelId || process.env.HF_MISSION_MODEL || "Qwen/Qwen2.5-7B-Instruct";
      this.apiKey = apiKey || hfToken;
      this.endpointUrl =
        endpointUrl ||
        process.env.HF_CHAT_ENDPOINT ||
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

  async generateMission(params: MissionGeneratorParams): Promise<Mission> {
    if (!this.isConfigured()) {
      throw new Error(
        `[TouchQuest Mission Adapter] No open-weight inference provider configured. ` +
        `Add GROQ_API_KEY (free at console.groq.com) or HF_API_TOKEN to .env.local. Target model: ${this.modelId}.`
      );
    }

    const systemPrompt = `You are TouchQuest's outdoor nature mission generator for the "Touch Grass" open-source AI challenge.
Your goal is to encourage real-world presence, sensory grounding, biodiversity discovery, and micro-adventures away from screens.
Generate a focused, actionable outdoor quest suitable for exactly ${params.durationMinutes} minutes.
You MUST reply strictly with valid JSON only (no markdown code blocks, no preamble, no commentary).
JSON structure:
{
  "title": "Short poetic title (max 6 words)",
  "description": "Inspiring 2-sentence mission brief",
  "theme": "sensory",
  "steps": [
    { "instruction": "Clear physical action", "hint": "Sensory observation tip" }
  ],
  "outdoorFocusTip": "One sentence grounding reminder (e.g., look up at the tree canopy, feel the bark texture)"
}`;

    const userPrompt = `Terrain: ${params.terrain || "park or neighborhood green space"}.
Duration: ${params.durationMinutes} minutes.
Weather: ${params.weatherContext || "mild daytime"}.
Generate an engaging, safe outdoor quest now.`;

    try {
      const requestBody: Record<string, unknown> = {
        model: this.modelId,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 650,
        temperature: 0.7,
      };

      // Groq supports strict json_object mode
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
        signal: AbortSignal.timeout(20000), // 20s timeout
      });

      if (!response.ok) {
        const errorText = await response.text();
        const keyName = this.providerName === "groq" ? "GROQ_API_KEY" : "HF_API_TOKEN";
        if (response.status === 401 || response.status === 403) {
          throw new Error(`Authentication failed on ${this.providerName}: ${keyName} is invalid or has expired.`);
        }
        if (response.status === 404) {
          throw new Error(`Model '${this.modelId}' is not deployed or not found on ${this.endpointUrl}.`);
        }
        if (response.status === 429) {
          throw new Error(`Rate limit reached on ${this.providerName}. Please retry in a few moments.`);
        }
        throw new Error(`${this.providerName} provider error (HTTP ${response.status}): ${errorText}`);
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
        throw new Error(`Unrecognized response structure from ${this.providerName} endpoint.`);
      }

      // Extract JSON payload safely
      const jsonMatch = outputText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Could not parse structured mission JSON from open-weight model output.");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        id: `mission-${Date.now()}`,
        title: parsed.title || `${params.durationMinutes}-Min Nature Walk`,
        durationMinutes: params.durationMinutes,
        description: parsed.description || "Step outside and observe local biodiversity.",
        theme: parsed.theme || "sensory",
        difficulty: params.durationMinutes === 15 ? "easy" : params.durationMinutes === 30 ? "moderate" : "mindful",
        status: "active",
        steps: (parsed.steps || []).map((step: { instruction: string; hint?: string }, index: number) => ({
          id: `step-${index + 1}`,
          instruction: step.instruction,
          completed: false,
          hint: step.hint,
        })),
        outdoorFocusTip: parsed.outdoorFocusTip || "Put your phone in your pocket between milestones.",
        createdAt: new Date().toISOString(),
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "TimeoutError") {
        throw new Error(`Mission generation timed out after 20 seconds on ${this.modelId} (${this.providerName}).`);
      }
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to generate mission via ${this.providerName} (${this.modelId}): ${message}`);
    }
  }
}
