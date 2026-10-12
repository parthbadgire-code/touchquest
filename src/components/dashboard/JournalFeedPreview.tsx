import React from "react";
import Link from "next/link";
import { BookOpen, Calendar, Tag, Sparkles, ArrowRight, Camera, Volume2, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function JournalFeedPreview() {
  const sampleEntries = [
    {
      id: "j-1",
      title: "Silver Birch Bark & Lichen Colony",
      content:
        "Took a 15-minute micro break. Found a flourishing patch of crustose lichen on the north-facing bark of a mature silver birch. Noticed how crisp the wind smelled.",
      durationMinutes: 15,
      weather: "Crisp, 16°C • Clear Sky",
      tags: ["Botany", "Micro-Quest", "Lichen"],
      hasPhoto: true,
      hasAudio: false,
      speciesIdentified: "Betula pendula (Silver Birch)",
      date: "Today, 3:45 PM",
    },
    {
      id: "j-2",
      title: "Evening Woodpecker Drumming in the Oak Grove",
      content:
        "Heard a rhythmic rapid tapping through the maple canopy. Recorded 8 seconds of resonance on a dead pine snag. BirdCall classifier picked up Hairy Woodpecker.",
      durationMinutes: 30,
      weather: "Dusk, 14°C • Light Breeze",
      tags: ["Bioacoustics", "Birding", "Twilight"],
      hasPhoto: false,
      hasAudio: true,
      speciesIdentified: "Dryobates villosus (Hairy Woodpecker)",
      date: "Yesterday, 6:10 PM",
    },
  ];

  return (
    <Card variant="default" className="p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl font-bold text-forest-950 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-forest-600" /> Nature Journal Preview
            </h3>
            <Badge variant="neutral" size="sm">Field Notebook</Badge>
          </div>
          <p className="text-xs text-forest-800/80 mt-1">
            Permanent record of your outdoor encounters, species observations, and sensory grounding.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-cream-100 px-3 py-1.5 text-xs font-semibold text-forest-900 hover:bg-cream-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Note</span>
          </Link>

          <Link
            href="/journal"
            className="inline-flex items-center gap-1 text-xs font-bold text-forest-900 hover:text-forest-700 transition-colors"
          >
            <span>All Entries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Demo status tag */}
      <div className="flex items-center justify-between rounded-lg bg-cream-200/60 px-3 py-1.5 text-[11px] text-forest-800">
        <span>Showing field observation schema preview (Supabase database integration ready)</span>
        <Badge variant="sage" size="sm">PostgreSQL + RLS</Badge>
      </div>

      {/* Entries List */}
      <div className="space-y-3">
        {sampleEntries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-xl border border-cream-300 bg-cream-50/90 p-4 space-y-2.5 hover:border-forest-300/80 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
              <div>
                <h4 className="font-serif text-sm font-bold text-forest-950">
                  {entry.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-forest-700 font-medium mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-forest-600" /> {entry.date}
                  </span>
                  <span>•</span>
                  <span>{entry.weather}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 mt-1 sm:mt-0">
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
              </div>
            </div>

            <p className="text-xs text-forest-900/90 leading-relaxed">
              {entry.content}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-cream-200/80 pt-2 text-[11px]">
              <span className="font-serif italic text-forest-800 font-medium">
                {entry.speciesIdentified}
              </span>

              <div className="flex items-center gap-1">
                {entry.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="rounded bg-cream-200/80 px-2 py-0.5 text-[10px] text-forest-800 font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
