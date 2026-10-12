import { OpenWeightsMissionAdapter } from "./mission-adapter";
import { OpenWeightsVisionAdapter } from "./vision-adapter";
import { OpenWeightsAudioAdapter } from "./audio-adapter";
import {
  IMissionGeneratorAdapter,
  IVisionScannerAdapter,
  IBirdAcousticAdapter,
  AIProviderConfig,
} from "./types";

/**
 * AI Provider Registry for TouchQuest
 * Encapsulates model instantiation, status checking, and adapter resolution.
 */
class AIProviderRegistry {
  private missionAdapter: IMissionGeneratorAdapter;
  private visionAdapter: IVisionScannerAdapter;
  private audioAdapter: IBirdAcousticAdapter;

  constructor() {
    this.missionAdapter = new OpenWeightsMissionAdapter();
    this.visionAdapter = new OpenWeightsVisionAdapter();
    this.audioAdapter = new OpenWeightsAudioAdapter();
  }

  getMissionAdapter(): IMissionGeneratorAdapter {
    return this.missionAdapter;
  }

  getVisionAdapter(): IVisionScannerAdapter {
    return this.visionAdapter;
  }

  getAudioAdapter(): IBirdAcousticAdapter {
    return this.audioAdapter;
  }

  getStatus(): Record<string, AIProviderConfig> {
    return {
      missions: {
        providerName: this.missionAdapter.providerName,
        modelId: this.missionAdapter.modelId,
        isAvailable: this.missionAdapter.isConfigured(),
        statusMessage: this.missionAdapter.isConfigured()
          ? `Ready for outdoor mission generation via ${this.missionAdapter.providerName} (${this.missionAdapter.modelId})`
          : "Pending GROQ_API_KEY or HF_API_TOKEN environment configuration",
      },
      vision: {
        providerName: this.visionAdapter.providerName,
        modelId: this.visionAdapter.modelId,
        isAvailable: this.visionAdapter.isConfigured(),
        statusMessage: this.visionAdapter.isConfigured()
          ? `Ready for botanical & wildlife classification via ${this.visionAdapter.providerName} (${this.visionAdapter.modelId})`
          : "Pending GROQ_API_KEY or HF_API_TOKEN environment configuration",
      },
      audio: {
        providerName: this.audioAdapter.providerName,
        modelId: this.audioAdapter.modelId,
        isAvailable: this.audioAdapter.isConfigured(),
        statusMessage: this.audioAdapter.isConfigured()
          ? "Ready for bioacoustic bird classification on dedicated endpoint"
          : "Pending dedicated bioacoustics endpoint in HF_AUDIO_ENDPOINT (unsupported on free router tiers)",
      },
    };
  }
}

export const aiProviders = new AIProviderRegistry();
export * from "./types";
export * from "./mission-adapter";
export * from "./vision-adapter";
export * from "./audio-adapter";
