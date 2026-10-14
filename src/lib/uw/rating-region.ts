import type { RatingRegion } from "@/content/rating-regions";

// Picks the worksheet's rating region for an address: first from the suburb or
// town name, then from the post code. Always worth a glance from the
// underwriter, so the result says how it was worked out.

export type RatingRegionMatch = { region: RatingRegion | ""; basis: "suburb or town" | "post code" | "not found" };

// Suburbs and towns, most specific first. Matched as whole words.
const places: [RatingRegion, string[]][] = [
  // Auckland
  ["Auckland - North Shore", ["north shore", "takapuna", "devonport", "milford", "albany", "glenfield", "northcote", "birkenhead", "beach haven", "browns bay", "mairangi bay", "murrays bay", "torbay", "long bay", "sunnynook", "forrest hill", "castor bay", "hauraki", "bayswater", "belmont", "narrow neck", "unsworth heights", "pinehill", "rosedale", "greenhithe", "hillcrest", "chatswood", "wairau valley", "totara vale", "campbells bay", "orewa", "whangaparaoa", "silverdale", "red beach", "millwater", "gulf harbour", "warkworth", "snells beach", "wellsford", "matakana", "dairy flat"]],
  ["Auckland - West", ["henderson", "te atatu", "massey", "west harbour", "hobsonville", "whenuapai", "ranui", "swanson", "sunnyvale", "glen eden", "titirangi", "green bay", "new lynn", "kelston", "glendene", "laingholm", "oratia", "piha", "kumeu", "huapai", "waimauku", "helensville", "riverhead", "lincoln", "waitakere", "western heights", "royal heights", "west auckland"]],
  ["Auckland City - West", ["avondale", "blockhouse bay", "new windsor", "waterview", "point chevalier", "pt chevalier", "lynfield", "waikowhai", "rosebank"]],
  ["Auckland City - West Central", ["mount albert", "mt albert", "sandringham", "kingsland", "western springs", "morningside", "owairaka", "mount roskill", "mt roskill", "three kings", "hillsborough", "wesley", "balmoral", "mount eden", "mt eden", "grey lynn", "westmere", "herne bay", "arch hill"]],
  ["Auckland City - Central", ["auckland central", "auckland cbd", "cbd", "freemans bay", "ponsonby", "st marys bay", "grafton", "newton", "eden terrace", "parnell", "newmarket", "wynyard quarter"]],
  ["Auckland City - East Central", ["epsom", "remuera", "greenlane", "ellerslie", "one tree hill", "royal oak", "onehunga", "penrose", "oranga", "te papapa", "mount wellington", "mt wellington", "sylvia park", "mount smart"]],
  ["Auckland City - East", ["orakei", "mission bay", "kohimarama", "st heliers", "glendowie", "glen innes", "point england", "pt england", "meadowbank", "st johns", "panmure", "stonefields", "waiheke"]],
  ["Auckland - South", ["otahuhu", "mangere", "papatoetoe", "otara", "manukau", "manurewa", "wiri", "clendon", "weymouth", "takanini", "papakura", "drury", "pukekohe", "waiuku", "karaka", "flat bush", "botany", "howick", "pakuranga", "half moon bay", "bucklands beach", "cockle bay", "highland park", "east tamaki", "dannemora", "beachlands", "maraetai", "clevedon", "tuakau", "pokeno", "conifer grove", "red hill", "rosehill", "ardmore"]],
  // Wellington
  ["Wellington - North", ["johnsonville", "newlands", "churton park", "grenada", "tawa", "linden", "khandallah", "ngaio", "crofton downs", "broadmeadows", "paparangi", "woodridge", "ohariu", "glenside", "redwood"]],
  ["Wellington - Central", ["wellington central", "te aro", "thorndon", "kelburn", "wadestown", "northland", "karori", "mount victoria", "mt victoria", "aro valley", "pipitea", "oriental bay", "highbury", "wilton", "northland", "mount cook", "mt cook"]],
  ["Wellington - South", ["island bay", "newtown", "berhampore", "brooklyn", "vogeltown", "kingston", "owhiro bay", "southgate", "houghton bay", "mornington", "melrose", "happy valley"]],
  ["Wellington - East", ["kilbirnie", "miramar", "lyall bay", "seatoun", "strathmore", "hataitai", "roseneath", "rongotai", "karaka bays", "breaker bay", "maupuia", "evans bay"]],
  ["Wellington - Upper Hutt", ["upper hutt", "trentham", "silverstream", "wallaceville", "totara park", "heretaunga", "pinehaven", "maoribank", "birchville", "te marua", "kingsley heights", "ebdentown", "elderslea", "brown owl", "clouston park", "riverstone terraces"]],
  ["Wellington - Lower Hutt", ["lower hutt", "petone", "eastbourne", "wainuiomata", "naenae", "taita", "stokes valley", "avalon", "waterloo", "epuni", "moera", "alicetown", "korokoro", "maungaraki", "belmont", "kelson", "normandale", "boulcott", "woburn", "melling", "seaview", "gracefield", "fairfield", "pomare", "manor park", "harbour view"]],
  ["Porirua", ["porirua", "titahi bay", "whitby", "papakowhai", "paremata", "plimmerton", "pukerua bay", "cannons creek", "waitangirua", "ascot park", "aotea", "camborne", "elsdon", "takapuwahia", "mana"]],
  ["Kapiti Coast", ["kapiti", "kāpiti", "paraparaumu", "raumati", "waikanae", "otaki", "ōtaki", "paekakariki", "peka peka", "te horo"]],
  ["Wairarapa", ["wairarapa", "masterton", "carterton", "greytown", "featherston", "martinborough", "eketahuna"]],
  // Upper South Island
  ["Nelson", ["nelson", "stoke", "tahunanui", "richmond", "motueka", "takaka", "tākaka", "mapua", "māpua", "brightwater", "wakefield", "murchison", "tasman", "atawhai", "nelson south"]],
  ["Marlborough", ["blenheim", "picton", "renwick", "havelock", "seddon", "marlborough", "spring creek", "redwoodtown"]],
  ["West Coast", ["greymouth", "hokitika", "westport", "reefton", "runanga", "cobden", "karamea", "franz josef", "haast", "west coast"]],
  // Canterbury
  ["Canterbury - North", ["rangiora", "kaiapoi", "woodend", "pegasus", "amberley", "oxford", "kaikoura", "kaikōura", "hanmer springs", "cheviot", "culverden", "waikari", "ravenswood", "west melton", "waimakariri"]],
  ["Canterbury - Mid", ["rolleston", "lincoln", "prebbleton", "ashburton", "darfield", "methven", "leeston", "southbridge", "akaroa", "rakaia", "tinwald", "selwyn", "west melton", "springston", "little river"]],
  ["Canterbury - South", ["timaru", "geraldine", "temuka", "waimate", "fairlie", "twizel", "tekapo", "pleasant point", "st andrews", "highfield", "gleniti", "marchwiel"]],
  ["Christchurch", ["christchurch", "riccarton", "fendalton", "merivale", "papanui", "hornby", "sumner", "lyttelton", "addington", "sydenham", "cashmere", "halswell", "burnside", "avonhead", "ilam", "shirley", "linwood", "woolston", "new brighton", "st albans", "redwood", "belfast", "spreydon", "bishopdale", "aranui", "wigram", "mount pleasant", "opawa", "beckenham", "st martins", "parklands", "burwood", "hoon hay", "upper riccarton", "strowan", "bryndwr", "harewood", "northwood", "casebrook", "yaldhurst", "sockburn", "hillsborough", "heathcote", "redcliffs", "waltham", "phillipstown", "edgeware", "richmond"]],
  // Otago and Southland
  ["Dunedin", ["dunedin", "mosgiel", "port chalmers", "roslyn", "maori hill", "andersons bay", "st clair", "st kilda", "caversham", "north east valley", "mornington", "green island", "brockville", "halfway bush", "wakari", "concord", "corstorphine", "musselburgh", "waverley", "kaikorai valley", "abbotsford", "fairfield", "outram"]],
  ["Otago - North", ["oamaru", "ōamaru", "palmerston", "waikouaiti", "kakanui", "hampden", "omarama", "kurow", "waitaki"]],
  ["Otago - Central", ["queenstown", "frankton", "arrowtown", "wanaka", "wānaka", "alexandra", "cromwell", "clyde", "roxburgh", "ranfurly", "lake hawea", "kelvin heights", "jacks point", "lake hayes", "albert town", "glenorchy"]],
  ["Otago - South", ["balclutha", "milton", "owaka", "kaitangata", "lawrence", "tapanui", "clinton", "clutha"]],
  ["Invercargill", ["invercargill", "bluff", "otatara", "waikiwi", "windsor", "glengarry", "georgetown", "appleby", "strathern", "hawthorndale", "rosedale", "kew", "richmond"]],
  ["Southland", ["gore", "te anau", "winton", "riverton", "mataura", "lumsden", "otautau", "tuatapere", "wyndham", "edendale", "southland"]],
  // Waikato and Bay of Plenty
  ["Hamilton", ["hamilton", "hillcrest", "chartwell", "rototuna", "flagstaff", "frankton", "dinsdale", "nawton", "fairfield", "melville", "claudelands", "hamilton east", "huntington", "te rapa", "glenview", "silverdale", "enderley", "pukete", "st andrews", "queenwood", "temple view", "bader"]],
  ["King Country", ["te kuiti", "taumarunui", "otorohanga", "ōtorohanga", "waitomo", "piopio", "benneydale", "mokau", "king country"]],
  ["Coromandel", ["thames", "whitianga", "coromandel", "whangamata", "whangamatā", "tairua", "pauanui", "waihi", "paeroa", "cooks beach", "hahei", "matarangi", "whiritoa", "onemana", "ngatea"]],
  ["Taupo", ["taupo", "taupō", "turangi", "tūrangi", "kinloch", "acacia bay", "mangakino", "tokaanu"]],
  ["Rotorua", ["rotorua", "ngongotaha", "ngongotahā", "owhata", "fenton park", "glenholme", "lynmore", "springfield", "reporoa", "mamaku", "hamurana"]],
  ["Whakatane", ["whakatane", "whakatāne", "ohope", "ōhope", "opotiki", "ōpōtiki", "kawerau", "edgecumbe", "matata", "murupara", "te teko", "taneatua"]],
  ["Tauranga", ["tauranga", "mount maunganui", "mt maunganui", "papamoa", "pāpāmoa", "te puke", "katikati", "omokoroa", "ōmokoroa", "bethlehem", "otumoetai", "greerton", "welcome bay", "pyes pa", "brookfield", "matua", "judea", "gate pa", "ohauiti", "maungatapu", "bayfair", "arataki", "waihi beach"]],
  ["Waikato", ["cambridge", "te awamutu", "huntly", "ngaruawahia", "ngāruawāhia", "raglan", "morrinsville", "matamata", "tokoroa", "putaruru", "te aroha", "tirau", "pirongia", "ohaupo", "te kauwhata", "meremere", "kihikihi", "waikato"]],
  // Central North Island and East Coast
  ["Gisborne", ["gisborne", "tolaga bay", "ruatoria", "wainui", "kaiti", "tokomaru bay"]],
  ["Napier", ["napier", "taradale", "greenmeadows", "tamatea", "marewa", "onekawa", "ahuriri", "westshore", "bay view", "pirimai", "meeanee", "maraenui", "bluff hill"]],
  ["Hastings", ["hastings", "havelock north", "flaxmere", "clive", "haumoana", "te awanga", "mahora", "akina", "camberley", "parkvale", "raureka", "frimley", "st leonards"]],
  ["Hawkes Bay", ["wairoa", "waipukurau", "waipawa", "otane", "takapau", "porangahau", "dannevirke", "central hawkes bay", "hawke's bay", "hawkes bay"]],
  ["New Plymouth", ["new plymouth", "waitara", "bell block", "oakura", "ōākura", "inglewood", "fitzroy", "merrilands", "westown", "vogeltown", "spotswood", "moturoa", "highlands park", "lynmouth", "strandon", "welbourn", "frankleigh park", "glen avon", "marfell"]],
  ["Taranaki", ["hawera", "hāwera", "stratford", "eltham", "opunake", "ōpunake", "patea", "pātea", "manaia", "waverley", "taranaki"]],
  ["Palmerston North", ["palmerston north", "feilding", "ashhurst", "levin", "foxton", "shannon", "pahiatua", "woodville", "bulls", "hokowhitu", "kelvin grove", "awapuni", "takaro", "highbury", "milson", "roslyn", "terrace end", "westbrook", "cloverlea", "fitzherbert", "aokautere"]],
  ["Wanganui", ["wanganui", "whanganui", "marton", "taihape", "ohakune", "raetihi", "hunterville", "castlecliff", "gonville", "springvale", "aramoho", "waikanae beach", "national park"]],
  // Northland
  ["Whangarei / Northland", ["whangarei", "whangārei", "kerikeri", "kaitaia", "kaitāia", "paihia", "russell", "dargaville", "kaikohe", "mangawhai", "ruakaka", "waipu", "hikurangi", "kawakawa", "moerewa", "ngunguru", "tutukaka", "onerahi", "kamo", "tikipunga", "maunu", "regent", "raumanga", "mangonui", "doubtless bay", "ahipara", "opononi", "northland"]],
];

// Post code ranges, used when no suburb or town matched.
const postcodes: [number, number, RatingRegion][] = [
  [100, 599, "Whangarei / Northland"],
  [600, 609, "Auckland - West"],
  [610, 619, "Auckland - West"],
  [620, 632, "Auckland - North Shore"],
  [800, 899, "Auckland - West"],
  [900, 999, "Auckland - North Shore"],
  [1010, 1011, "Auckland City - Central"],
  [1021, 1021, "Auckland City - West Central"],
  [1022, 1022, "Auckland City - West Central"],
  [1023, 1023, "Auckland City - East Central"],
  [1024, 1025, "Auckland City - West Central"],
  [1026, 1026, "Auckland City - West"],
  [1041, 1042, "Auckland City - West Central"],
  [1050, 1051, "Auckland City - East Central"],
  [1052, 1052, "Auckland City - Central"],
  [1060, 1061, "Auckland City - East Central"],
  [1062, 1062, "Auckland - South"],
  [1071, 1072, "Auckland City - East"],
  [1081, 1081, "Auckland City - East"],
  [2010, 2699, "Auckland - South"],
  [3010, 3099, "Rotorua"],
  [3110, 3119, "Tauranga"],
  [3120, 3128, "Whakatane"],
  [3129, 3199, "Tauranga"],
  [3200, 3299, "Hamilton"],
  [3300, 3499, "Waikato"],
  [3330, 3399, "Taupo"],
  [3500, 3699, "Coromandel"],
  [3700, 3899, "Waikato"],
  [3900, 3999, "King Country"],
  [4010, 4099, "Gisborne"],
  [4100, 4119, "Napier"],
  [4120, 4199, "Hastings"],
  [4200, 4299, "Hawkes Bay"],
  [4310, 4399, "New Plymouth"],
  [4400, 4499, "Palmerston North"],
  [4500, 4599, "Wanganui"],
  [4600, 4699, "Taranaki"],
  [4700, 4799, "Wanganui"],
  [4800, 4999, "Palmerston North"],
  [5010, 5016, "Wellington - Lower Hutt"],
  [5018, 5019, "Wellington - Upper Hutt"],
  [5022, 5028, "Porirua"],
  [5032, 5036, "Kapiti Coast"],
  [5500, 5599, "Palmerston North"],
  [5700, 5899, "Wairarapa"],
  [6011, 6012, "Wellington - Central"],
  [6021, 6023, "Wellington - South"],
  [6022, 6022, "Wellington - East"],
  [6035, 6037, "Wellington - North"],
  [7010, 7199, "Nelson"],
  [7200, 7299, "Marlborough"],
  [7300, 7499, "Canterbury - North"],
  [7500, 7799, "Canterbury - Mid"],
  [7800, 7899, "West Coast"],
  [7900, 7999, "Canterbury - South"],
  [8000, 8999, "Christchurch"],
  [9010, 9099, "Dunedin"],
  [9200, 9299, "Otago - South"],
  [9300, 9399, "Otago - Central"],
  [9400, 9499, "Otago - North"],
  [9500, 9799, "Southland"],
  [9810, 9879, "Invercargill"],
  [9800, 9899, "Southland"],
];

const normalise = (s: string) => ` ${s.toLowerCase().replace(/[^a-z0-9āēīōū' ]+/g, " ").replace(/\s+/g, " ").trim()} `;

// Broad areas, to tell apart suburbs with the same name in different cities
// (Belmont, Hillsborough, Fairfield, Richmond ...).
const areaOf = (region: string) =>
  /^Auckland/.test(region) ? "auckland"
  : /^Wellington|^Porirua|^Kapiti/.test(region) ? "wellington"
  : /^Canterbury|^Christchurch/.test(region) ? "canterbury"
  : /^Otago|^Dunedin/.test(region) ? "otago"
  : /^Invercargill|^Southland/.test(region) ? "southland"
  : region.toLowerCase();

function postcodeRegion(postcode?: string) {
  const pc = Number(postcode);
  if (!postcode || !/^\d{3,4}$/.test(postcode)) return null;
  // The narrowest range wins.
  return postcodes.filter(([lo, hi]) => pc >= lo && pc <= hi).sort((a, b) => a[1] - a[0] - (b[1] - b[0]))[0]?.[2] ?? null;
}

function matches(part?: string) {
  const text = normalise(part ?? "");
  const found: { region: RatingRegion; length: number }[] = [];
  if (text.trim() === "") return found;
  for (const [region, names] of places) {
    for (const name of names) if (text.includes(` ${name} `)) found.push({ region, length: name.length });
  }
  return found.sort((a, b) => b.length - a.length);
}

/** The rating region for an address, from its suburb and town (or post code). */
export function ratingRegion(loc: { suburb?: string; city?: string; postcode?: string }): RatingRegionMatch {
  const byPostcode = postcodeRegion(loc.postcode);
  const cityHits = matches(loc.city);
  const city = /auckland/i.test(loc.city ?? "") ? "auckland" : /wellington/i.test(loc.city ?? "") ? "wellington" : cityHits[0] ? areaOf(cityHits[0].region) : null;
  const area = city ?? (byPostcode ? areaOf(byPostcode) : null);

  // Suburb first (it's the most specific), kept to the right city when the name is shared.
  const suburbHits = matches(loc.suburb);
  const suburb = suburbHits.find((h) => !area || areaOf(h.region) === area) ?? (area ? null : suburbHits[0]);
  if (suburb) return { region: suburb.region, basis: "suburb or town" };
  // A city that is its own rating region (Hamilton, Tauranga ...), unless it's a big city split into several.
  if (cityHits[0] && !["auckland", "wellington"].includes(city ?? "")) return { region: cityHits[0].region, basis: "suburb or town" };
  if (byPostcode) return { region: byPostcode, basis: "post code" };
  if (cityHits[0]) return { region: cityHits[0].region, basis: "suburb or town" };
  return { region: "", basis: "not found" };
}
