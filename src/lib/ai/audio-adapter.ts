import { BirdAcousticClassification } from "@/types";
import { IBirdAcousticAdapter, AudioBirdClassifierParams } from "./types";

/**
 * Open-Weight BirdCall Acoustic Adapter
 * Connects to dedicated bioacoustic bird classification endpoints (e.g. Cornell BirdNET container or Gradio Space).
 * Note: Hugging Face Inference Providers currently does NOT support audio-classification on serverless tiers.
 * A dedicated endpoint URL must be provided in HF_AUDIO_ENDPOINT.
 */
export class OpenWeightsAudioAdapter implements IBirdAcousticAdapter {
  readonly providerName = "custom_open_weights" as const;
  readonly modelId: string;
  private apiKey?: string;
  private endpointUrl?: string;

  constructor(
    modelId: string = process.env.HF_AUDIO_MODEL || "Cornell-BirdNET",
    apiKey: string | undefined = process.env.HF_API_TOKEN,
    endpointUrl?: string
  ) {
    this.modelId = modelId;
    this.apiKey = apiKey;
    this.endpointUrl = endpointUrl || process.env.HF_AUDIO_ENDPOINT;
  }

  isConfigured(): boolean {
    return Boolean(
      this.endpointUrl &&
      this.endpointUrl.trim().length > 0 &&
      !this.endpointUrl.includes("your-dedicated") &&
      this.apiKey &&
      this.apiKey.trim().length > 0 &&
      !this.apiKey.includes("your_") &&
      !this.apiKey.includes("your-")
    );
  }

  async classifyAudio(params: AudioBirdClassifierParams): Promise<BirdAcousticClassification[]> {
    if (!this.isConfigured()) {
      if (!this.endpointUrl) {
        throw new Error(
          `[TouchQuest BirdCall Adapter] Unsupported Modality on Serverless Router: ` +
          `Hugging Face Inference Providers and major serverless platforms do not currently support ` +
          `specialized bioacoustic audio classification on free tiers. ` +
          `To enable live bird call classification, set HF_AUDIO_ENDPOINT in .env.local pointing to a ` +
          `dedicated BirdNET container or Hugging Face Space endpoint.`
        );
      }
      throw new Error(
        `[TouchQuest BirdCall Adapter] Open-weight audio model endpoint is pending configuration. ` +
        `Set HF_API_TOKEN in your environment.`
      );
    }

    try {
      const audioBuffer =
        typeof params.audioData === "string"
          ? Buffer.from(params.audioData.replace(/^data:audio\/\w+;base64,/, ""), "base64")
          : params.audioData;

      const response = await fetch(this.endpointUrl!, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": params.mimeType || "audio/wav",
        },
        body: new Uint8Array(audioBuffer),
        signal: AbortSignal.timeout(25000), // 25s timeout for audio processing
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401 || response.status === 403) {
          throw new Error("Authentication failed on audio classification endpoint.");
        }
        if (response.status === 404) {
          throw new Error(`Audio endpoint '${this.endpointUrl}' returned 404 Not Found.`);
        }
        if (response.status === 429) {
          throw new Error("Rate limit exceeded on audio classifier endpoint.");
        }
        throw new Error(`Audio classification endpoint error (HTTP ${response.status}): ${errorText}`);
      }

      const results = await response.json();
      if (!Array.isArray(results)) {
        if (results && results.predictions && Array.isArray(results.predictions)) {
          return results.predictions;
        }
        if (results && results.error) {
          throw new Error(`Acoustic classifier error: ${results.error}`);
        }
        throw new Error("Unexpected response format from audio classification endpoint.");
      }

      return results.slice(0, 3).map((item, index) => {
        const rawLabel = String(item.label || item.species || "Aves sp.");
        const match = rawLabel.match(/^(.*?)(?:\s*\((.*?)\))?$/);
        const scientific = match?.[2] ? match[1].trim() : rawLabel;
        const common = match?.[2] ? match[2].trim() : rawLabel;

        return {
          id: `bird-${Date.now()}-${index}`,
          species: common,
          scientificName: scientific,
          confidence: Math.round((Number(item.score || item.confidence) || 0) * 100) / 100,
          callType: "song",
          modelUsed: this.modelId,
          recordedAt: new Date().toISOString(),
        };
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "TimeoutError") {
        throw new Error(`Audio classification timed out after 25 seconds on ${this.modelId}.`);
      }
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`BirdCall classification failed: ${message}`);
    }
  }
}
