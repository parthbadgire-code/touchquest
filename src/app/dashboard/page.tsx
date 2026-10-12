import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { QuickMissionSelector } from "@/components/dashboard/QuickMissionSelector";
import { DiscoveryActions } from "@/components/dashboard/DiscoveryActions";
import { NearbyParkPreview } from "@/components/dashboard/NearbyParkPreview";
import { JournalFeedPreview } from "@/components/dashboard/JournalFeedPreview";
import { Badge } from "@/components/ui/Badge";
import { TreePine, Smartphone, Heart, Sparkles, SunMedium, Compass } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-forest-950">
      <Navbar />

      <main className="flex-1 pb-24 md:pb-16 pt-6 sm:pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          {/* Header & Mindful Outdoor Reminder */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-300 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="forest" size="sm">Active Session</Badge>
                <span className="text-xs text-forest-700/80 font-medium">Field Basecamp</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-forest-950 mt-1">
                TouchQuest Hub
              </h1>
            </div>

            {/* Mindful Anti-Screen Banner */}
            <div className="flex items-center gap-2 rounded-xl bg-forest-900/5 px-3.5 py-2 border border-forest-900/10 text-xs text-forest-900">
              <SunMedium className="w-4 h-4 text-earth-600 shrink-0" />
              <span>
                <strong>Reminder:</strong> Grab your mission, pocket the phone, and look around.
              </span>
            </div>
          </div>

          {/* 1. STREAK & REAL-WORLD OFFLINE PROGRESS */}
          <section aria-label="Real World Progress">
            <StreakCard
              streakDays={3}
              digitalBreakMinutesToday={45}
              totalOutdoorMinutes={320}
              levelTitle="Woodland Wanderer"
              levelProgress={65}
            />
          </section>

          {/* 2. OUTDOOR MISSION GENERATOR (15, 30, 60m) */}
          <section aria-label="Micro Quests">
            <QuickMissionSelector />
          </section>

          {/* 3. DISCOVERY LAUNCHPAD (Nature Scanner & BirdCall AI) */}
          <section aria-label="Field AI Scanners">
            <DiscoveryActions />
          </section>

          {/* 4. EXPLORE NEARBY GREEN SPACES & MAP PREVIEW */}
          <section aria-label="Local Sanctuaries & Parks">
            <NearbyParkPreview />
          </section>

          {/* 5. NATURE JOURNAL PREVIEW */}
          <section aria-label="Recent Journal Entries">
            <JournalFeedPreview />
          </section>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
