"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { ParkLocation } from "@/types";
import { RefreshCw } from "lucide-react";

// Dynamically import InteractiveMap with SSR disabled to prevent Leaflet window reference errors
const InteractiveMap = dynamic(
  () => import("@/components/explore/InteractiveMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[450px] sm:h-[520px] rounded-2xl border border-cream-300 bg-cream-100 flex flex-col items-center justify-center p-6 text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-forest-700" />
        <p className="font-serif text-sm font-bold text-forest-950">
          Loading OpenStreetMap Nature Cartography...
        </p>
        <p className="text-xs text-forest-800/70 max-w-sm">
          Preparing privacy-first Leaflet tiles and biodiversity geo-coordinates.
        </p>
      </div>
    ),
  }
);

export function MapWrapper() {
  const [selectedPark, setSelectedPark] = useState<ParkLocation | null>(null);

  return (
    <div className="space-y-6">
      <InteractiveMap
        onSelectPark={(park) => setSelectedPark(park)}
        selectedParkId={selectedPark?.id || null}
      />
    </div>
  );
}
