export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string;
          streak_days: number;
          total_missions_completed: number;
          total_outdoor_minutes: number;
          species_discovered_count: number;
          level_title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username?: string;
          streak_days?: number;
          total_missions_completed?: number;
          total_outdoor_minutes?: number;
          species_discovered_count?: number;
          level_title?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          streak_days?: number;
          total_missions_completed?: number;
          total_outdoor_minutes?: number;
          species_discovered_count?: number;
          level_title?: string;
          updated_at?: string;
        };
      };
      missions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          duration_minutes: number;
          description: string;
          theme: string;
          difficulty: string;
          status: string;
          steps: Json;
          outdoor_focus_tip: string;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          duration_minutes: number;
          description: string;
          theme?: string;
          difficulty?: string;
          status?: string;
          steps: Json;
          outdoor_focus_tip?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          status?: string;
          steps?: Json;
          completed_at?: string | null;
        };
      };
      species_sightings: {
        Row: {
          id: string;
          user_id: string;
          kingdom: string;
          common_name: string;
          scientific_name: string;
          confidence: number;
          notes: string | null;
          image_url: string | null;
          audio_url: string | null;
          location_name: string | null;
          latitude: number | null;
          longitude: number | null;
          model_used: string;
          detected_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          kingdom: string;
          common_name: string;
          scientific_name: string;
          confidence: number;
          notes?: string | null;
          image_url?: string | null;
          audio_url?: string | null;
          location_name?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          model_used: string;
          detected_at?: string;
        };
        Update: {
          notes?: string | null;
          location_name?: string | null;
        };
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          duration_spent_minutes: number;
          weather: string | null;
          sighting_id: string | null;
          mission_id: string | null;
          tags: string[];
          media_urls: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          duration_spent_minutes?: number;
          weather?: string | null;
          sighting_id?: string | null;
          mission_id?: string | null;
          tags?: string[];
          media_urls?: string[];
          created_at?: string;
        };
        Update: {
          title?: string;
          content?: string;
          tags?: string[];
          media_urls?: string[];
        };
      };
    };
  };
}
