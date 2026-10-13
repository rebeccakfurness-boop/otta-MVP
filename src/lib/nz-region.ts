// Works out the New Zealand region for an address, from the town or city and,
// failing that, the post code. Used for the worksheet's Region box and to pick
// the right regional flood map.

const towns: [RegExp, string][] = [
  [/whangarei|whangārei|kerikeri|kaitaia|paihia|dargaville|kaikohe|mangawhai/i, "Northland"],
  [/auckland|manukau|waitakere|north shore|papakura|pukekohe|orewa|waiheke|albany|takapuna|henderson|botany|howick|warkworth/i, "Auckland"],
  [/hamilton|cambridge|te awamutu|huntly|thames|taupō|taupo|matamata|tokoroa|whitianga|coromandel|morrinsville|raglan|paeroa|waihi|ngāruawāhia|ngaruawahia/i, "Waikato"],
  [/tauranga|mount maunganui|rotorua|whakatāne|whakatane|papamoa|te puke|katikati|ōpōtiki|opotiki|kawerau/i, "Bay of Plenty"],
  [/gisborne/i, "Gisborne"],
  [/napier|hastings|havelock north|wairoa|taradale/i, "Hawke's Bay"],
  [/new plymouth|hāwera|hawera|stratford|inglewood/i, "Taranaki"],
  [/palmerston north|whanganui|wanganui|feilding|levin|ohakune|taihape|dannevirke/i, "Manawatū-Whanganui"],
  [/wellington|lower hutt|upper hutt|porirua|kāpiti|kapiti|paraparaumu|masterton|martinborough|petone|waikanae|carterton|greytown/i, "Wellington"],
  [/^nelson$|stoke/i, "Nelson"],
  [/richmond|motueka|tākaka|takaka|mapua|māpua/i, "Tasman"],
  [/blenheim|picton|renwick/i, "Marlborough"],
  [/greymouth|hokitika|westport|reefton/i, "West Coast"],
  [/christchurch|rangiora|rolleston|ashburton|timaru|kaikōura|kaikoura|akaroa|lincoln|kaiapoi|geraldine|waimate/i, "Canterbury"],
  [/dunedin|queenstown|wānaka|wanaka|oamaru|ōamaru|alexandra|cromwell|arrowtown|balclutha|mosgiel/i, "Otago"],
  [/invercargill|gore|te anau|bluff|winton/i, "Southland"],
];

// Approximate post code ranges, used only when the town isn't recognised.
const postcodes: [number, number, string][] = [
  [100, 499, "Northland"],
  [500, 2699, "Auckland"],
  [3000, 3199, "Bay of Plenty"],
  [3200, 3799, "Waikato"],
  [3800, 3999, "Waikato"],
  [4000, 4099, "Gisborne"],
  [4100, 4299, "Hawke's Bay"],
  [4300, 4399, "Taranaki"],
  [4400, 4999, "Manawatū-Whanganui"],
  [5000, 6999, "Wellington"],
  [7000, 7099, "Nelson"],
  [7100, 7199, "Tasman"],
  [7200, 7299, "Marlborough"],
  [7300, 7799, "Canterbury"],
  [7800, 7899, "West Coast"],
  [7900, 8999, "Canterbury"],
  [9000, 9599, "Otago"],
  [9600, 9999, "Southland"],
];

export function nzRegion(town: string, postcode?: string) {
  for (const part of town.split(",").map((t) => t.trim()).reverse()) {
    const hit = towns.find(([re]) => re.test(part));
    if (hit) return hit[1];
  }
  const pc = Number(postcode);
  if (postcode && /^\d{4}$/.test(postcode)) return postcodes.find(([lo, hi]) => pc >= lo && pc <= hi)?.[2] ?? "";
  return "";
}
