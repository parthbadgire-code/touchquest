"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  BookOpen,
  Calendar,
  Sparkles,
  Camera,
  Volume2,
  Plus,
  Trash2,
  Clock,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Trees,
  Search,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface JournalRecord {
  id: string;
  title: string;
  content: string;
  durationMinutes: number;
  weather: string;
  speciesIdentified?: string;
  tags: string[];
  createdAt: string;
  hasPhoto?: boolean;
  hasAudio?: boolean;
}

const LOCAL_STORAGE_JOURNAL_KEY = "touchquest_field_journal_entries";

const DEFAULT_ENTRIES: JournalRecord[] = [
  {
    id: "entry-1",
    title: "Silver Birch Bark & Lichen Colony",
    content:
      "Took a 15-minute micro break away from all screens. Found a flourishing patch of crustose lichen on the north-facing bark of a mature silver birch. Noticed how crisp the autumn air smelled.",
    durationMinutes: 15,
    weather: "Crisp, 16°C • Clear Sky",
    tags: ["Botany", "Micro-Quest", "Lichen"],
    speciesIdentified: "Betula pendula (Silver Birch)",
    hasPhoto: true,
    hasAudio: false,
    createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
  },
  {
    id: "entry-2",
    title: "Evening Woodpecker Resonance in Oak Grove",
    content:
      "Heard a rhythmic rapid tapping through the maple canopy. Recorded 8 seconds of resonance on a dead pine snag. BirdCall classifier picked up Hairy Woodpecker.",
    durationMinutes: 30,
    weather: "Dusk, 14°C • Light Breeze",
    tags: ["Bioacoustics", "Birding", "Twilight"],
    speciesIdentified: "Dryobates villosus (Hairy Woodpecker)",
    hasPhoto: false,
    hasAudio: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 26).toISOString(),
  },
  {
    id: "entry-3",
    title: "Pine Needle Texture & Canopy Shadow Grounding",
    content:
      "Walked barefoot along a dry forest perimeter. The soft bed of fallen needles dampened all city traffic sounds. Observed cedar waxwings flitting between berry bushes.",
    durationMinutes: 60,
    weather: "Morning, 18°C • Overcast",
    tags: ["Sensory", "Mindful", "Canopy"],
    speciesIdentified: "Bombycilla cedrorum (Cedar Waxwing)",
    hasPhoto: false,
    hasAudio: false,
    createdAt: new Date(Date.now() - 3600 * 1000 * 52).toISOString(),
  },
];

export function JournalView() {
  const { user, isSupabaseReady } = useAuth();
  const [entries, setEntries] = useState<JournalRecord[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newDuration, setNewDuration] = useState<number>(15);
  const [newWeather, setNewWeather] = useState("Mild & Breezy, 18°C");
  const [newSpecies, setNewSpecies] = useState("");
  const [newTagInput, setNewTagInput] = useState("Botany, Sensory");

  // Load entries from localStorage or Supabase
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_JOURNAL_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
        return;
      } catch (err) {
        console.error("Failed to parse local entries:", err);
      }
    }
    // Seed initial entries
    setEntries(DEFAULT_ENTRIES);
    localStorage.setItem(LOCAL_STORAGE_JOURNAL_KEY, JSON.stringify(DEFAULT_ENTRIES));
  }, []);

  const saveEntriesLocally = (updated: JournalRecord[]) => {
    setEntries(updated);
    localStorage.setItem(LOCAL_STORAGE_JOURNAL_KEY, JSON.stringify(updated));
  };

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tags = newTagInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    const newRecord: JournalRecord = {
      id: `journal-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      durationMinutes: newDuration,
      weather: newWeather.trim(),
      speciesIdentified: newSpecies.trim() || undefined,
      tags: tags.length > 0 ? tags : ["Field Observation"],
      createdAt: new Date().toISOString(),
      hasPhoto: Boolean(newSpecies),
      hasAudio: false,
    };

    const updated = [newRecord, ...entries];
    saveEntriesLocally(updated);

    // If Supabase is connected and user is logged in, sync to database
    if (isSupabaseReady && supabase && user && !user.isGuest) {
      try {
        await (supabase as any).from("journal_entries").insert({
          user_id: user.id,
          title: newRecord.title,
          content: newRecord.content,
          duration_spent_minutes: newRecord.durationMinutes,
          weather: newRecord.weather,
          tags: newRecord.tags,
        });
      } catch (err) {
        console.warn("Could not sync journal entry to Supabase:", err);
      }
    }

    // Reset Form
    setNewTitle("");
    setNewContent("");
    setNewSpecies("");
    setIsAdding(false);
  };

  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    saveEntriesLocally(updated);
  };

  // Stats calculation
  const totalMinutes = entries.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const totalSightings = entries.filter((e) => Boolean(e.speciesIdentified)).length;

  // Filtered entries
  const allTags = ["All", ...Array.from(new Set(entries.flatMap((e) => e.tags)))];

  const filtered = entries.filter((entry) => {
    const matchesTag = selectedTag === "All" || entry.tags.includes(selectedTag);
    const matchesSearch =
      searchQuery === "" ||
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.speciesIdentified &&
        entry.speciesIdentified.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTag && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Stats Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card variant="default" className="p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-900 text-cream-50 shadow-sm">
            <BookOpen className="h-5 w-5 text-forest-300" />
          </div>
          <div>
            <span className="text-xs text-forest-700 font-medium">Recorded Notes</span>
            <h4 className="font-serif text-xl font-bold text-forest-950">
              {entries.length} Entries
            </h4>
          </div>
        </Card>

        <Card variant="default" className="p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-earth-900 text-cream-50 shadow-sm">
            <Clock className="h-5 w-5 text-earth-300" />
          </div>
          <div>
            <span className="text-xs text-earth-800 font-medium">Time Away from Screens</span>
            <h4 className="font-serif text-xl font-bold text-earth-950">
              {totalMinutes} Minutes
            </h4>
          </div>
        </Card>

        <Card variant="default" className="p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage-800 text-cream-50 shadow-sm">
            <Trees className="h-5 w-5 text-sage-300" />
          </div>
          <div>
            <span className="text-xs text-sage-800 font-medium">Species Identified</span>
            <h4 className="font-serif text-xl font-bold text-sage-950">
              {totalSightings} Taxa
            </h4>
          </div>
        </Card>
      </div>

      {/* Main Journal Feed Card */}
      <Card variant="default" className="p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-xl font-bold text-forest-950 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-forest-600" /> Field Observations
            </h3>
            <p className="text-xs text-forest-800/80 mt-1">
              Encrypted reflections, botanical findings, and bioacoustic encounters.
            </p>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 text-xs shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAdding ? "Cancel Entry" : "Log Observation"}</span>
          </Button>
        </div>

        {/* New Entry Form Drawer */}
        {isAdding && (
          <form
            onSubmit={handleCreateEntry}
            className="rounded-2xl border border-forest-300 bg-forest-50/70 p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="flex items-center justify-between border-b border-forest-200/70 pb-3">
              <h4 className="font-serif text-sm font-bold text-forest-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-forest-600" /> New Field Note
              </h4>
              <Badge variant="sage" size="sm">Local & Cloud Sync</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-forest-900">Observation Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Douglas Fir Resin Scent along Ridge Trail"
                  className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3.5 py-2 text-xs text-forest-950 focus:border-forest-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-forest-900">Species Observed (Optional)</label>
                <input
                  type="text"
                  value={newSpecies}
                  onChange={(e) => setNewSpecies(e.target.value)}
                  placeholder="e.g. Pseudotsuga menziesii (Douglas Fir)"
                  className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3.5 py-2 text-xs text-forest-950 focus:border-forest-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-forest-900">Reflective Description</label>
              <textarea
                required
                rows={3}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="What did your senses pick up? Notice textures, air temperature, wind sound, ground dampness..."
                className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3.5 py-2 text-xs text-forest-950 focus:border-forest-600 focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-forest-900">Offline Duration</label>
                <select
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                  className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2 text-xs text-forest-950 focus:border-forest-600 focus:outline-none"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-forest-900">Weather & Temperature</label>
                <input
                  type="text"
                  value={newWeather}
                  onChange={(e) => setNewWeather(e.target.value)}
                  placeholder="e.g. Crisp, 16°C • Clear"
                  className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3.5 py-2 text-xs text-forest-950 focus:border-forest-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-forest-900">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="Botany, Sensory, River"
                  className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3.5 py-2 text-xs text-forest-950 focus:border-forest-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="font-bold">
                Save to Journal
              </Button>
            </div>
          </form>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {allTags.slice(0, 5).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  selectedTag === tag
                    ? "bg-forest-900 text-cream-50"
                    : "bg-cream-200/80 text-forest-800 hover:bg-cream-300"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-forest-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes or species..."
              className="w-full rounded-xl border border-cream-300 bg-cream-100/90 pl-8 pr-3 py-1.5 text-xs text-forest-950 focus:border-forest-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Entries List */}
        <div className="space-y-3 pt-1">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-cream-300 p-8 text-center space-y-2">
              <p className="font-serif text-sm font-bold text-forest-950">
                No observations match your filter
              </p>
              <p className="text-xs text-forest-800/70">
                Click "Log Observation" above to capture a new moment in nature.
              </p>
            </div>
          ) : (
            filtered.map((entry) => (
              <div
                key={entry.id}
                className="group rounded-xl border border-cream-300 bg-cream-50/90 p-4 sm:p-5 space-y-3 hover:border-forest-400 transition-all shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <h4 className="font-serif text-base font-bold text-forest-950">
                      {entry.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-forest-700 font-medium mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-forest-600" />
                        {new Date(entry.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span>•</span>
                      <span>{entry.weather}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-start">
                    {entry.hasPhoto && (
                      <span className="flex items-center gap-1 rounded-md bg-forest-100 px-2 py-0.5 text-[10px] font-bold text-forest-900">
                        <Camera className="w-3 h-3" /> Photo
                      </span>
                    )}
                    {entry.hasAudio && (
                      <span className="flex items-center gap-1 rounded-md bg-earth-100 px-2 py-0.5 text-[10px] font-bold text-earth-900">
                        <Volume2 className="w-3 h-3" /> Audio
                      </span>
                    )}
                    <span className="rounded-md bg-cream-200 px-2 py-0.5 text-[10px] font-bold text-forest-900">
                      {entry.durationMinutes}m offline
                    </span>

                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-forest-400 hover:text-red-600 transition-all ml-1"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-forest-900/90 leading-relaxed font-sans">
                  {entry.content}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-cream-200 pt-2.5 text-[11px]">
                  {entry.speciesIdentified ? (
                    <span className="font-serif italic text-forest-800 font-medium">
                      🌿 {entry.speciesIdentified}
                    </span>
                  ) : (
                    <span className="text-forest-600 text-[10px]">Sensory observation</span>
                  )}

                  <div className="flex items-center gap-1">
                    {entry.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="rounded bg-cream-200/90 px-2 py-0.5 text-[10px] text-forest-800 font-semibold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
