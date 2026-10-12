import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { JournalView } from "@/components/journal/JournalView";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { BookOpen, Feather, Database, ShieldCheck } from "lucide-react";

export default function JournalPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-forest-950">
      <Navbar />

      <main className="flex-1 pb-24 md:pb-16 pt-6 sm:pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-b border-cream-300 pb-4">
            <div className="flex items-center gap-2">
              <Badge variant="sage" size="sm">Field Notebook</Badge>
              <span className="text-xs text-forest-700 font-medium">Encrypted Personal Log</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-forest-950 mt-1">
              Field Nature Journal
            </h1>
            <p className="text-sm text-forest-800/80 mt-1 max-w-2xl">
              Chronicle your sensory impressions, audio recordings, and plant observations.
              Protected by Supabase Row-Level Security so your personal discoveries remain private.
            </p>
          </div>

          <JournalView />

          <Card variant="default" className="p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-forest-700" />
              <h3 className="font-serif text-base font-bold text-forest-950">
                Storage & Authentication Architecture
              </h3>
            </div>
            <p className="text-xs text-forest-800/90 leading-relaxed max-w-3xl">
              The journal table in PostgreSQL maps directly to authenticated user profiles.
              Media files uploaded through the Nature Scanner and BirdCall AI stream to private
              Supabase Storage buckets (`journal-media` and `audio-recordings`).
            </p>
          </Card>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
