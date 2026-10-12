import { Mission, SpeciesSighting, BirdAcousticClassification } from "@/types";

export interface AIProviderConfig {
  providerName: "groq" | "huggingface" | "together" | "replicate" | "custom_open_weights";
  modelId: string;
  isAvailable: boolean;
  statusMessage?: string;
}

export interface MissionGeneratorParams {
  durationMinutes: 15 | 30 | 60;
  terrain?: "urban_park" | "forest_trail" | "backyard" | "riverbank" | "general";
  weatherContext?: string;
  userLevel?: string;
}

export interface VisionScannerParams {
  imageData: Buffer | string; // Base64 or buffer
  mimeType: string;
  latitude?: number;
  longitude?: number;
}

export interface AudioBirdClassifierParams {
  audioData: Buffer | string; // Base64 or audio buffer
  mimeType: string;
  sampleRate?: number;
  latitude?: number;
  longitude?: number;
}

/**
 * Adapter interface for outdoor mission generation using open-weight LLMs
 */
export interface IMissionGeneratorAdapter {
  readonly providerName: "groq" | "huggingface" | "custom_open_weights";
  readonly modelId: string;
  generateMission(params: MissionGeneratorParams): Promise<Mission>;
  isConfigured(): boolean;
}

/**
 * Adapter interface for plant/nature visual identification using open-weight vision models
 */
export interface IVisionScannerAdapter {
  readonly providerName: "groq" | "huggingface" | "custom_open_weights";
  readonly modelId: string;
  identifySpecies(params: VisionScannerParams): Promise<SpeciesSighting[]>;
  isConfigured(): boolean;
}

/**
 * Adapter interface for bird acoustic classification using open-weight bioacoustic models
 */
export interface IBirdAcousticAdapter {
  readonly providerName: "custom_open_weights" | "huggingface";
  readonly modelId: string;
  classifyAudio(params: AudioBirdClassifierParams): Promise<BirdAcousticClassification[]>;
  isConfigured(): boolean;
}
