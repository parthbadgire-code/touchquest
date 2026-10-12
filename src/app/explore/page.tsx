import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { MapWrapper } from "@/components/explore/MapWrapper";
import { Badge } from "@/components/ui/Badge";
import { MapPin, Navigation, Compass, Layers } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function ExplorePage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-forest-950">
      <Navbar />

      <main className="flex-1 pb-24 md:pb-16 pt-6 sm:pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-b border-cream-300 pb-4">
            <div className="flex items-center gap-2">
              <Badge variant="sage" size="sm">OpenStreetMap & Leaflet</Badge>
              <span className="text-xs text-forest-700 font-medium">Privacy-First Cartography</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-forest-950 mt-1">
              Explore Nearby Parks
            </h1>
            <p className="text-sm text-forest-800/80 mt-1 max-w-2xl">
              Locate public green spaces, botanical sanctuaries, and riverfronts near your area.
              Tile maps load through OpenStreetMap without surveillance advertising.
            </p>
          </div>

          {/* Interactive Leaflet Map with Geolocation & OSM Overpass data */}
          <MapWrapper />

          <Card variant="earth" className="p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-earth-800" />
              <h3 className="font-serif text-base font-bold text-earth-950">
                Outdoor Etiquette & "Leave No Trace"
              </h3>
            </div>
            <p className="text-xs text-earth-900/90 leading-relaxed">
              TouchQuest encourages mindful exploration of nature preserves and botanical commons.
              Stay on marked trails, respect wildlife boundaries, observe bird species from a respectful
              distance, and pack out any trash you find.
            </p>
          </Card>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
