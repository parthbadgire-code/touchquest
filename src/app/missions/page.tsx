import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { QuickMissionSelector } from "@/components/dashboard/QuickMissionSelector";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Compass, Footprints, Wind, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function MissionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-forest-950">
      <Navbar />

      <main className="flex-1 pb-24 md:pb-16 pt-6 sm:pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-b border-cream-300 pb-4">
            <div className="flex items-center gap-2">
              <Badge variant="sage" size="sm">Open-Weight Generation</Badge>
              <span className="text-xs text-forest-700 font-medium">Anti-Doomscroll Engine</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-forest-950 mt-1">
              Outdoor Missions
            </h1>
            <p className="text-sm text-forest-800/80 mt-1 max-w-2xl">
              Select 15, 30, or 60 minutes. TouchQuest crafts an intentional outdoor quest designed
              to cultivate focus, sensory engagement, and ecological appreciation.
            </p>
          </div>

          <QuickMissionSelector />

          {/* Philosophy Card */}
          <Card variant="earth" className="p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Footprints className="w-4 h-4 text-earth-800" />
              <h3 className="font-serif text-base font-bold text-earth-950">
                The Science of Micro-Exploration
              </h3>
            </div>
            <p className="text-xs text-earth-900/90 leading-relaxed max-w-3xl">
              Research in environmental psychology indicates that even 15 minutes of immersive
              sensory connection with living trees and soil reduces salivary cortisol, restores
              directed attention capacity, and counteracts the fatigue of digital multitasking.
            </p>
          </Card>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
