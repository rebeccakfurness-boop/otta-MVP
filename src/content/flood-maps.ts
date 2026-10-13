// Flood mapping links for underwriting, by region. The national viewer covers
// the whole country; the regional council maps are more detailed and should be
// checked for the insured address. Update a link here if a council moves it.

export type FloodMap = { name: string; url: string };

/** The complete (nationwide) flood map. */
export const nationalFloodMap: FloodMap = {
  name: "Earth Sciences NZ national flood hazard viewer (1% AEP rainfall)",
  url: "https://niwa.maps.arcgis.com/apps/dashboards/8c1db2b8e37841f29a57a38675388897",
};

/** Directory of every council's hazard maps, for regions without their own link below. */
const directory: FloodMap = {
  name: "Natural Hazards Portal: natural hazards in your area (links to every council)",
  url: "https://www.naturalhazardsportal.govt.nz/natural-hazard-risk/natural-hazards-in-your-area/",
};

export const regionalFloodMaps: Record<string, FloodMap> = {
  Northland: { name: "Northland Regional Council flood and coastal hazard maps", url: "https://www.nrc.govt.nz/floodmaps" },
  Auckland: {
    name: "Auckland Council: check flood risks (Flood Viewer and GeoMaps)",
    url: "https://www.aucklandcouncil.govt.nz/en/environment/looking-after-aucklands-water/flooding-blockages/check-flood-risks-before-buy-build.html",
  },
  Waikato: { name: "Waikato Regional Hazards Portal", url: "https://waikatoregion.govt.nz/regional-hazards-portal" },
  "Manawatū-Whanganui": { name: "Horizons Regional Council regional hazards", url: "https://www.horizons.govt.nz/flood-emergency-management/regional-hazards" },
  Canterbury: { name: "Environment Canterbury natural hazards (Canterbury Maps)", url: "https://ecan.govt.nz/your-region/your-environment/natural-hazards" },
  Otago: {
    name: "Otago Regional Council natural hazards database",
    url: "https://www.orc.govt.nz/managing-natural-hazards/natural-hazards-adaptation/otago-natural-hazards-database",
  },
  Tasman: { name: "Tasman District Council natural hazards map viewer", url: "https://www.tasman.govt.nz/natural-hazards-map-viewer" },
  Nelson: { name: "Nelson City Council natural hazards", url: "https://nelson.govt.nz/environment/nelson-plan/natural-hazards" },
};

export function floodMapsFor(region: string) {
  return { national: nationalFloodMap, regional: regionalFloodMaps[region] ?? directory, hasRegional: region in regionalFloodMaps };
}
