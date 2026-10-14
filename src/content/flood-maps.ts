// Flood mapping links for underwriting, from the Property and Landlord
// Underwriting Guide (section 7, Flood Risk Area), by worksheet rating region.
// The national viewer covers the whole country. Update a link here if a
// council moves it.

export type FloodMap = { name: string; url: string };

/** The complete (nationwide) flood map. */
export const nationalFloodMap: FloodMap = {
  name: "Earth Sciences NZ national flood hazard viewer (1% AEP rainfall)",
  url: "https://niwa.maps.arcgis.com/apps/dashboards/8c1db2b8e37841f29a57a38675388897",
};

/** Directory of every council's hazard maps, for regions the guide has no link for. */
const directory: FloodMap = {
  name: "Natural Hazards Portal: natural hazards in your area (links to every council)",
  url: "https://www.naturalhazardsportal.govt.nz/natural-hazard-risk/natural-hazards-in-your-area/",
};

const maps = {
  northland: { name: "Northland Regional Council flood maps", url: "https://www.nrc.govt.nz/floodmaps/" },
  auckland: { name: "Auckland Council flood viewer", url: "https://experience.arcgis.com/experience/cbde7f2134404f4d90adce5396a0a630" },
  waikato: { name: "Waikato Regional Council flood maps", url: "https://experience.arcgis.com/experience/0eced30c44eb43a2b6fcb1ce8727c9db/" },
  waikatoWarning: {
    name: "Waikato Regional Council flood warning levels",
    url: "https://waikatoregion.govt.nz/environment/envirohub/environmental-maps-and-data?dt=Flood+warning+level&af=floodWarningLevel",
  },
  hamilton: { name: "Hamilton City Council flood viewer", url: "https://maps.hamilton.govt.nz/floodviewer/" },
  rotorua: { name: "Rotorua Lakes Council maps", url: "https://www.rotorualakescouncil.nz/community/maps#toc-link-0" },
  westernBop: { name: "Western Bay of Plenty natural hazards viewer", url: "https://map.westernbay.govt.nz/Html5Viewer/?viewer=Natural_Hazards" },
  tauranga: { name: "Tauranga City Council hazard maps", url: "https://gis.tauranga.govt.nz/vertigisstudio/web/?app=8d1e800bf4314d8b89bd41a84e5daeb5" },
  gisborne: { name: "Gisborne significant flood plains", url: "https://geoportal-gizzy.opendata.arcgis.com/maps/gizzy::gisborne-significant-flood-plains/about" },
  hawkesBay: { name: "Hawke's Bay Regional Council hazard maps", url: "https://gis.hbrc.govt.nz/Hazards/" },
  hawkesBayObserved: {
    name: "Hawke's Bay flood observation extents",
    url: "https://hbrcopendata-hbrc.opendata.arcgis.com/datasets/hawkes-bay-flood-observation-extents/explore?location=-39.488900%2C177.047300%2C9",
  },
  manawatu: { name: "Horizons (Manawatū) flood maps", url: "https://experience.arcgis.com/experience/fa57e94bcc8249c8968785b427a99e7c/" },
  huttCity: {
    name: "Hutt City stormwater models and flood mapping",
    url: "https://experience.arcgis.com/experience/789b67f52c1d409682d6f853e336bd31/page/Stormwater-Models-and-Mapping",
  },
  wellington: { name: "Wellington City Council flood zones", url: "https://data-wcc.opendata.arcgis.com/datasets/WCC::flood-zones-3/explore" },
  wellingtonLocal: { name: "Wellington City Council local maps viewer", url: "https://gis.wcc.govt.nz/LocalMapsViewer/?map=5c3d903dc4c043e0953410033c5c0b3e" },
  tasman: { name: "Tasman and Nelson flood maps", url: "https://experience.arcgis.com/experience/9547b4b796254b9788556b902a03cdb3" },
  tasmanLidar: { name: "Nelson and Tasman flood LiDAR index (LINZ)", url: "https://data.linz.govt.nz/layer/112783-nelson-and-tasman-top-of-the-south-flood-lidar-index-tiles-2022/" },
  canterbury: { name: "Canterbury Maps flood model results", url: "https://apps.canterburymaps.govt.nz/FloodModelResults/" },
  christchurch: {
    name: "Christchurch City Council flood maps",
    url: "https://gis.ccc.govt.nz/portal/apps/webappviewer/index.html?id=65b4e2bfc84c4f2e85606cc46bcb6d01",
  },
  wanaka: { name: "Queenstown Lakes (Wānaka) flood maps", url: "https://experience.arcgis.com/experience/0b39760dc8fe4ddebac30e4ef397d716" },
  otago: { name: "Otago Regional Council flooding maps", url: "https://experience.arcgis.com/experience/30bb9b65ada445b5af4ab4a0bc2d6d93/page/Flooding" },
  otagoSeries: { name: "Otago Regional Council hazard map series", url: "https://maps.orc.govt.nz/portal/apps/MapSeries/index.html?appid=55020b1c52184433880ea3b0fad0065f" },
  invercargill: { name: "Invercargill flood maps", url: "https://www.arcgis.com/apps/mapviewer/index.html?webmap=94ff824ba04047d4bc84dd272315b5bf" },
} satisfies Record<string, FloodMap>;

/** The guide's maps for each rating region. An empty list means the guide says no council mapping is available. */
const byRatingRegion: Record<string, FloodMap[]> = {
  "Whangarei / Northland": [maps.northland],
  Hamilton: [maps.hamilton, maps.waikato],
  Waikato: [maps.waikato, maps.waikatoWarning],
  "King Country": [maps.waikato, maps.waikatoWarning],
  Coromandel: [maps.waikato, maps.waikatoWarning],
  Taupo: [maps.waikato, maps.waikatoWarning],
  Rotorua: [maps.rotorua],
  Tauranga: [maps.tauranga, maps.westernBop],
  Gisborne: [maps.gisborne],
  Napier: [maps.hawkesBay, maps.hawkesBayObserved],
  Hastings: [maps.hawkesBay, maps.hawkesBayObserved],
  "Hawkes Bay": [maps.hawkesBay, maps.hawkesBayObserved],
  "Palmerston North": [maps.manawatu],
  Wanganui: [],
  "Wellington - Lower Hutt": [maps.huttCity],
  "Wellington - North": [maps.wellington, maps.wellingtonLocal],
  "Wellington - Central": [maps.wellington, maps.wellingtonLocal],
  "Wellington - South": [maps.wellington, maps.wellingtonLocal],
  "Wellington - East": [maps.wellington, maps.wellingtonLocal],
  Nelson: [maps.tasman, maps.tasmanLidar],
  Christchurch: [maps.christchurch, maps.canterbury],
  "Canterbury - North": [maps.canterbury],
  "Canterbury - Mid": [maps.canterbury],
  "Canterbury - South": [maps.canterbury],
  "Otago - Central": [maps.wanaka, maps.otago],
  "Otago - North": [maps.otago, maps.otagoSeries],
  "Otago - South": [maps.otago, maps.otagoSeries],
  Dunedin: [maps.otago, maps.otagoSeries],
  Invercargill: [maps.invercargill],
};

/** Council-region fallbacks, when the rating region isn't known. */
const byCouncilRegion: Record<string, FloodMap[]> = {
  Northland: [maps.northland],
  Auckland: [maps.auckland],
  Waikato: [maps.waikato],
  "Bay of Plenty": [maps.westernBop],
  Gisborne: [maps.gisborne],
  "Hawke's Bay": [maps.hawkesBay],
  "Manawatū-Whanganui": [maps.manawatu],
  Wellington: [maps.wellington],
  Nelson: [maps.tasman],
  Tasman: [maps.tasman],
  Canterbury: [maps.canterbury],
  Otago: [maps.otago],
};

/**
 * Flood maps for a property. `regional` is the first council map (or the
 * national directory), `more` any others the guide lists, and `unavailable`
 * true where the guide notes there is no council flood mapping (Wanganui,
 * Palmerston North, Dunedin): then the broker must describe how the property
 * performed in flood events over the last five years.
 */
export function floodMapsFor(councilRegion: string, ratingRegion = "") {
  const list = ratingRegion.startsWith("Auckland") ? [maps.auckland] : (byRatingRegion[ratingRegion] ?? byCouncilRegion[councilRegion] ?? []);
  const unavailable = ["Wanganui", "Palmerston North", "Dunedin"].includes(ratingRegion);
  return { national: nationalFloodMap, regional: list[0] ?? directory, more: list.slice(1), hasRegional: list.length > 0, unavailable };
}
