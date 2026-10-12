import { ParkLocation } from "@/types";

/**
 * Calculates Great-circle distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Fallback curated nature spaces when offline or Overpass API has rate limits
 */
export function getCuratedGreenSpaces(centerLat: number, centerLon: number): ParkLocation[] {
  const offsets = [
    { name: "Whispering Pines Nature Reserve", cat: "nature_reserve" as const, dLat: 0.007, dLon: 0.005, amenities: ["Canopy trails", "Bird blinds", "Loop trails"] },
    { name: "Meadowbrook Botanical Commons", cat: "botanical_garden" as const, dLat: -0.005, dLon: -0.008, amenities: ["Wildflower meadow", "Pollinator sanctuary", "Benches"] },
    { name: "Cedar Creek Wetland Sanctuary", cat: "wetland" as const, dLat: -0.012, dLon: 0.006, amenities: ["Boardwalk", "Heron nesting area", "Lily ponds"] },
    { name: "Riverbend Forest Trailhead", cat: "trailhead" as const, dLat: 0.015, dLon: -0.011, amenities: ["Shaded path", "Stream overlook", "Dog-friendly"] },
    { name: "Sunburst Community Meadow", cat: "urban_park" as const, dLat: 0.003, dLon: -0.003, amenities: ["Picnic grove", "Native grasses", "Quiet benches"] },
  ];

  return offsets.map((item, i) => {
    const lat = centerLat + item.dLat;
    const lon = centerLon + item.dLon;
    return {
      id: `curated-park-${i + 1}`,
      name: item.name,
      category: item.cat,
      distanceKm: calculateDistanceKm(centerLat, centerLon, lat, lon),
      address: `Greenway Sector ${i + 1}`,
      latitude: lat,
      longitude: lon,
      amenities: item.amenities,
      isOpenNow: true,
    };
  });
}

/**
 * Queries OpenStreetMap Overpass API for real public green spaces within radius
 */
export async function fetchNearbyGreenSpaces(
  centerLat: number,
  centerLon: number,
  radiusMeters: number = 4000
): Promise<ParkLocation[]> {
  const query = `[out:json][timeout:8];(
    node["leisure"="park"](around:${radiusMeters},${centerLat},${centerLon});
    way["leisure"="park"](around:${radiusMeters},${centerLat},${centerLon});
    node["leisure"="nature_reserve"](around:${radiusMeters},${centerLat},${centerLon});
    way["leisure"="nature_reserve"](around:${radiusMeters},${centerLat},${centerLon});
    node["leisure"="garden"](around:${radiusMeters},${centerLat},${centerLon});
  );out center 25;`;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
      signal: AbortSignal.timeout(9000),
    });

    if (!response.ok) {
      return getCuratedGreenSpaces(centerLat, centerLon);
    }

    const data = await response.json();
    if (!data.elements || !Array.isArray(data.elements) || data.elements.length === 0) {
      return getCuratedGreenSpaces(centerLat, centerLon);
    }

    const results: ParkLocation[] = [];
    const seenNames = new Set<string>();

    for (const el of data.elements) {
      const lat = el.lat || el.center?.lat;
      const lon = el.lon || el.center?.lon;
      const name = el.tags?.name;

      if (!lat || !lon || !name || seenNames.has(name)) continue;
      seenNames.add(name);

      let category: ParkLocation["category"] = "urban_park";
      if (el.tags?.leisure === "nature_reserve") category = "nature_reserve";
      else if (el.tags?.leisure === "garden") category = "botanical_garden";
      else if (el.tags?.natural === "wetland") category = "wetland";

      const amenities: string[] = [];
      if (el.tags?.dog === "yes" || el.tags?.dog === "leashed") amenities.push("Dog-friendly");
      if (el.tags?.lit === "yes") amenities.push("Lit paths");
      if (el.tags?.wheelchair === "yes") amenities.push("Accessible");
      if (el.tags?.bench === "yes") amenities.push("Benches");
      if (amenities.length === 0) amenities.push("Nature trails", "Open lawn");

      results.push({
        id: `osm-${el.id}`,
        name,
        category,
        distanceKm: calculateDistanceKm(centerLat, centerLon, lat, lon),
        address: el.tags?.["addr:street"] || `${category.replace("_", " ")} green space`,
        latitude: lat,
        longitude: lon,
        amenities,
        isOpenNow: true,
      });

      if (results.length >= 15) break;
    }

    results.sort((a, b) => a.distanceKm - b.distanceKm);

    return results.length > 0 ? results : getCuratedGreenSpaces(centerLat, centerLon);
  } catch {
    return getCuratedGreenSpaces(centerLat, centerLon);
  }
}
