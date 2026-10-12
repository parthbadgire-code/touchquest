import React from "react";
import Link from "next/link";
import { MapPin, Navigation, Trees, Info, ExternalLink, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ParkLocation } from "@/types";

export function NearbyParkPreview() {
  // Curated representative demo parks showing the UI layout
  const sampleParks: ParkLocation[] = [
    {
      id: "park-1",
      name: "Whispering Pines Nature Reserve",
      category: "nature_reserve",
      distanceKm: 0.8,
      address: "Ridgeview Trailhead & Woodland Path",
      latitude: 45.5231,
      longitude: -122.6765,
      amenities: ["Old-growth canopy", "Bird blinds", "Loop trails"],
      isOpenNow: true,
    },
    {
      id: "park-2",
      name: "Meadowbrook Botanical Commons",
      category: "botanical_garden",
      distanceKm: 1.4,
      address: "1040 Willow Creek Parkway",
      latitude: 45.518,
      longitude: -122.668,
      amenities: ["Wildflower meadow", "Pollinator sanctuary", "Benches"],
      isOpenNow: true,
    },
    {
      id: "park-3",
      name: "Cedar Creek Wetland Sanctuary",
      category: "wetland",
      distanceKm: 2.3,
      address: "Marshland Boardwalk Entrance",
      latitude: 45.511,
      longitude: -122.682,
      amenities: ["Boardwalk", "Heron nesting area", "Water lily ponds"],
      isOpenNow: true,
    },
  ];

  return (
    <Card variant="default" className="p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl font-bold text-forest-950 flex items-center gap-2">
              <Trees className="w-5 h-5 text-forest-600" /> Explore Nearby Green Spaces
            </h3>
            <Badge variant="sage" size="sm">Leaflet + OSM</Badge>
          </div>
          <p className="text-xs text-forest-800/80 mt-1">
            Discover urban sanctuaries, wetlands, and quiet trails within walking or cycling distance.
          </p>
        </div>

        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-900 hover:text-forest-700 transition-colors"
        >
          <span>Full Interactive Map</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Map visual canvas placeholder with Leaflet readiness notice */}
      <div className="relative h-48 sm:h-56 w-full rounded-xl overflow-hidden border border-cream-300 bg-cream-200/70 flex flex-col items-center justify-center p-4 text-center">
        {/* Subtle topographical grid decoration */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#1e523c_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 max-w-md space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-forest-900 text-cream-50 shadow-sm">
            <MapPin className="h-5 w-5 text-forest-300 animate-bounce" />
          </div>
          <h4 className="font-serif text-sm font-bold text-forest-950">
            OpenStreetMap & Leaflet Integration Ready
          </h4>
          <p className="text-xs text-forest-800/80 leading-relaxed">
            Privacy-respecting tile layers via OpenStreetMap. When you allow geolocation in the full
            view, nearby parks and trail polygons render dynamically with zero third-party telemetry.
          </p>
          <div className="pt-1 flex items-center justify-center gap-2">
            <Badge variant="pending" size="sm">
              <Info className="w-3 h-3 mr-1" /> Client Geolocation Standby
            </Badge>
          </div>
        </div>
      </div>

      {/* Nearby parks list preview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {sampleParks.map((park) => (
          <div
            key={park.id}
            className="rounded-xl border border-cream-300 bg-cream-50/80 p-3.5 space-y-2 hover:border-forest-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-1">
              <h5 className="font-serif text-xs font-bold text-forest-950 leading-snug">
                {park.name}
              </h5>
              <span className="shrink-0 rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-bold text-forest-900">
                {park.distanceKm} km
              </span>
            </div>

            <p className="text-[11px] text-forest-800/80 line-clamp-1">{park.address}</p>

            <div className="flex flex-wrap gap-1 pt-1">
              {park.amenities.slice(0, 2).map((amenity, i) => (
                <span
                  key={i}
                  className="rounded bg-cream-200/90 px-1.5 py-0.5 text-[10px] text-forest-900 font-medium"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
