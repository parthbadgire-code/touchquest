"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { ParkLocation } from "@/types";
import { fetchNearbyGreenSpaces } from "@/lib/services/parks-service";
import { MapPin, Navigation, Trees, Compass, RefreshCw, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface InteractiveMapProps {
  onSelectPark?: (park: ParkLocation) => void;
  selectedParkId?: string | null;
}

export default function InteractiveMap({ onSelectPark, selectedParkId }: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Default coordinate: Portland / nature green corridor (45.5231, -122.6765)
  const [center, setCenter] = useState<[number, number]>([45.5231, -122.6765]);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [parks, setParks] = useState<ParkLocation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [radiusMeters, setRadiusMeters] = useState<number>(5000);
  const [geoStatus, setGeoStatus] = useState<string>("Click 'Locate Me' to use your GPS");

  // Load nearby parks whenever center or radius changes
  useEffect(() => {
    let isCancelled = false;
    async function loadParks() {
      setIsLoading(true);
      try {
        const results = await fetchNearbyGreenSpaces(center[0], center[1], radiusMeters);
        if (!isCancelled) {
          setParks(results);
        }
      } catch (err) {
        console.error("Failed to load parks:", err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }
    loadParks();
    return () => {
      isCancelled = true;
    };
  }, [center, radiusMeters]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: 14,
      zoomControl: false,
    });

    // Add OpenStreetMap standard tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Reposition zoom controls
    L.control.zoom({ position: "bottomright" }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center when center state changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, 14, { animate: true });
    }
  }, [center]);

  // Update Markers when parks or activeCategory change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Render User Location Pin if available
    if (userCoords) {
      const userIcon = L.divIcon({
        className: "custom-user-pin",
        html: `
          <div style="position: relative; width: 24px; height: 24px;">
            <div style="position: absolute; inset: -4px; border-radius: 50%; background: rgba(30, 82, 60, 0.25); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 24px; height: 24px; border-radius: 50%; background: #123324; border: 3px solid #fdfcf9; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center;">
              <div style="width: 8px; height: 8px; border-radius: 50%; background: #71bd99;"></div>
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const userMarker = L.marker(userCoords, { icon: userIcon })
        .bindPopup("<strong>You are here</strong><br/><span style='font-size: 11px; color: #1e523c;'>TouchQuest outdoor base</span>")
        .addTo(markersLayerRef.current);
      userMarkerRef.current = userMarker;
    }

    const filtered = parks.filter(
      (p) => activeCategory === "all" || p.category === activeCategory
    );

    filtered.forEach((park) => {
      const isSelected = park.id === selectedParkId;
      const categoryColor =
        park.category === "nature_reserve"
          ? "#123324"
          : park.category === "botanical_garden"
          ? "#29684d"
          : park.category === "wetland"
          ? "#1f5268"
          : "#633c1f";

      const pinIcon = L.divIcon({
        className: `custom-park-pin ${isSelected ? "selected" : ""}`,
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${isSelected ? "34px" : "28px"};
            height: ${isSelected ? "34px" : "28px"};
            background: ${categoryColor};
            border: 2px solid #fdfcf9;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            transition: all 0.2s ease;
          ">
            <span style="transform: rotate(45deg); color: #faf8f2; font-size: ${isSelected ? "14px" : "11px"}; font-weight: bold;">🌲</span>
          </div>
        `,
        iconSize: [isSelected ? 34 : 28, isSelected ? 34 : 28],
        iconAnchor: [isSelected ? 17 : 14, isSelected ? 34 : 28],
        popupAnchor: [0, -28],
      });

      const popupHtml = `
        <div style="font-family: inherit; min-width: 200px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <strong style="font-size: 14px; color: #0a1f16;">${park.name}</strong>
            <span style="font-size: 10px; background: #e0ece1; color: #184230; padding: 2px 6px; border-radius: 999px; font-weight: 700;">
              ${park.distanceKm} km
            </span>
          </div>
          <p style="font-size: 11px; color: #546a59; margin: 4px 0 8px;">${park.address}</p>
          <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px;">
            ${park.amenities
              .map(
                (a) =>
                  `<span style="font-size: 9px; background: #f5f2e9; color: #2d2a24; padding: 2px 5px; border-radius: 4px;">${a}</span>`
              )
              .join("")}
          </div>
          <div style="display: flex; gap: 6px;">
            <a href="/missions?terrain=urban_park&duration=15&park=${encodeURIComponent(
              park.name
            )}" style="
              flex: 1;
              text-align: center;
              background: #123324;
              color: #fdfcf9;
              font-size: 11px;
              font-weight: 700;
              padding: 6px 8px;
              border-radius: 6px;
              text-decoration: none;
            ">Start Quest</a>
            <a href="https://www.openstreetmap.org/#map=17/${park.latitude}/${
        park.longitude
      }" target="_blank" rel="noopener noreferrer" style="
              background: #ede8dc;
              color: #1f1d19;
              font-size: 11px;
              font-weight: 700;
              padding: 6px 8px;
              border-radius: 6px;
              text-decoration: none;
            ">OSM</a>
          </div>
        </div>
      `;

      const marker = L.marker([park.latitude, park.longitude], { icon: pinIcon })
        .bindPopup(popupHtml)
        .addTo(markersLayerRef.current!);

      marker.on("click", () => {
        if (onSelectPark) onSelectPark(park);
      });
    });
  }, [parks, activeCategory, userCoords, selectedParkId, onSelectPark]);

  // Request browser geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGeoStatus("Geolocation is not supported by your browser");
      return;
    }
    setGeoStatus("Locating outdoor position...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserCoords(coords);
        setCenter(coords);
        setGeoStatus(`Located within ±${Math.round(pos.coords.accuracy)}m accuracy`);
      },
      (err) => {
        console.warn("Geolocation denied or error:", err);
        setGeoStatus("Location access denied. Showing curated nature area.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const filteredParks = parks.filter(
    (p) => activeCategory === "all" || p.category === activeCategory
  );

  return (
    <div className="space-y-4">
      {/* Controls & Category Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-cream-50 p-3 sm:p-4 rounded-xl border border-cream-300">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "all", label: "All Green Spaces" },
            { id: "nature_reserve", label: "Nature Reserves" },
            { id: "botanical_garden", label: "Botanical" },
            { id: "wetland", label: "Wetlands" },
            { id: "urban_park", label: "City Parks" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeCategory === cat.id
                  ? "bg-forest-900 text-cream-50 shadow-sm"
                  : "bg-cream-200/80 text-forest-900 hover:bg-cream-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={handleLocateMe}
            className="flex items-center gap-1.5 text-xs whitespace-nowrap shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Locate Me</span>
          </Button>

          <select
            value={radiusMeters}
            onChange={(e) => setRadiusMeters(Number(e.target.value))}
            className="text-xs bg-cream-200/90 text-forest-900 font-bold px-2.5 py-1.5 rounded-lg border border-cream-300 focus:outline-none"
          >
            <option value={2000}>2 km radius</option>
            <option value={5000}>5 km radius</option>
            <option value={10000}>10 km radius</option>
          </select>
        </div>
      </div>

      {/* Map Canvas with Leaflet */}
      <div className="relative w-full h-[450px] sm:h-[520px] rounded-2xl overflow-hidden border border-cream-300 shadow-sm bg-cream-200">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Loading overlay badge */}
        {isLoading && (
          <div className="absolute top-3 left-3 z-10 bg-forest-950/85 backdrop-blur-md text-cream-50 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-forest-300" />
            <span>Scanning OpenStreetMap...</span>
          </div>
        )}

        {/* Geolocation status chip */}
        <div className="absolute bottom-3 left-3 z-10 max-w-[80%] bg-cream-50/95 backdrop-blur-md border border-cream-300 px-3 py-1.5 rounded-lg text-[11px] font-medium text-forest-900 shadow-sm flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-forest-600 shrink-0" />
          <span className="truncate">{geoStatus}</span>
        </div>
      </div>

      {/* Nearby Park Cards Carousel / Grid below map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-forest-800">
          <span className="font-bold">
            Found {filteredParks.length} green spaces within {radiusMeters / 1000} km
          </span>
          <span className="text-[11px] text-forest-700/80">Click any card to focus marker</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredParks.slice(0, 6).map((park) => {
            const isSelected = park.id === selectedParkId;
            return (
              <div
                key={park.id}
                onClick={() => {
                  setCenter([park.latitude, park.longitude]);
                  if (onSelectPark) onSelectPark(park);
                }}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? "bg-forest-50 border-forest-600 shadow-sm ring-1 ring-forest-600"
                    : "bg-cream-50/90 border-cream-300 hover:border-forest-400"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-serif text-sm font-bold text-forest-950 line-clamp-1">
                    {park.name}
                  </h4>
                  <span className="shrink-0 rounded-full bg-forest-100 text-forest-900 font-bold px-2 py-0.5 text-[10px]">
                    {park.distanceKm} km
                  </span>
                </div>
                <p className="text-xs text-forest-800/80 mt-1 line-clamp-1">{park.address}</p>

                <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-cream-200">
                  <div className="flex items-center gap-1 text-[11px] text-forest-700 font-medium">
                    <Trees className="w-3 h-3 text-forest-600" />
                    <span className="capitalize">{park.category.replace("_", " ")}</span>
                  </div>

                  <a
                    href={`/missions?terrain=urban_park&duration=15&park=${encodeURIComponent(
                      park.name
                    )}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-forest-900 hover:text-forest-700"
                  >
                    <Sparkles className="w-3 h-3 text-forest-600" />
                    <span>Launch Quest</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
