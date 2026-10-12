export type MissionDuration = 15 | 30 | 60;

export type MissionDifficulty = "easy" | "moderate" | "mindful";

export type MissionStatus = "suggested" | "active" | "completed" | "abandoned";

export interface MissionStep {
  id: string;
  instruction: string;
  completed: boolean;
  hint?: string;
}

export interface Mission {
  id: string;
  title: string;
  durationMinutes: MissionDuration;
  description: string;
  theme: "sensory" | "botany" | "mindfulness" | "birding" | "micro-adventure";
  difficulty: MissionDifficulty;
  status: MissionStatus;
  steps: MissionStep[];
  outdoorFocusTip: string;
  completedAt?: string;
  createdAt: string;
}

export type OrganismKingdom = "plant" | "fungi" | "animal" | "bird" | "insect";

export interface SpeciesSighting {
  id: string;
  kingdom: OrganismKingdom;
  commonName: string;
  scientificName: string;
  confidence: number; // 0 - 1.0
  notes?: string;
  imageUrl?: string;
  audioUrl?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  openWeightModelUsed: string; // e.g. "imageomics/bioclip" or "DBD-research-group/BirdNET"
  detectedAt: string;
}

export interface BirdAcousticClassification {
  id: string;
  species: string;
  scientificName: string;
  confidence: number;
  callType: "song" | "call" | "alarm" | "flight" | "drumming";
  frequencyRangeHz?: [number, number];
  modelUsed: string;
  recordedAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  durationSpentMinutes: number;
  weather?: string;
  sightingId?: string;
  sighting?: SpeciesSighting;
  missionId?: string;
  tags: string[];
  mediaUrls: string[];
  createdAt: string;
}

export interface UserStats {
  streakDays: number;
  totalMissionsCompleted: number;
  totalOutdoorMinutes: number;
  speciesDiscoveredCount: number;
  digitalBreakMinutesToday: number;
  levelTitle: string; // e.g. "Forest Scout", "Woodland Wanderer"
  levelProgress: number; // 0 - 100%
}

export interface ParkLocation {
  id: string;
  name: string;
  category: "urban_park" | "nature_reserve" | "botanical_garden" | "trailhead" | "wetland";
  distanceKm: number;
  address: string;
  latitude: number;
  longitude: number;
  amenities: string[];
  isOpenNow: boolean;
}
