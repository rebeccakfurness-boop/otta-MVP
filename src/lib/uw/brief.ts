import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { buildingApplication } from "@/content/forms";
import { binderPeriod, uwAssistantPrompt } from "@/content/uw-assistant";
import { getRecord, putRecord } from "@/lib/db/records";
import { summaryText, type Answers } from "@/lib/forms/application";
import type { Application } from "@/lib/applications/store";
import { propertyLocation } from "./worksheet";

// The underwriting assistant: a first read of a building application for the
// Otta underwriter. Claude writes the brief when ANTHROPIC_API_KEY is set;
// otherwise the built-in checks below write a simpler one, so the demo works.

const MODEL = "claude-opus-5-5";

const termSchema = z.object({
  kind: z.enum(["subjectivity", "endorsement", "excess", "loading", "premium"]),
  text: z.string(),
  guideSection: z.string().describe('For example "Guide 8, Standard Excesses". Empty if not from the guide.'),
});

export const briefSchema = z.object({
  recommendation: z.enum(["accept", "refer", "decline"]),
  headline: z.string().describe("One sentence: the risk and the main reason for the recommendation."),
  summary: z.string().describe("Two to four sentences describing the risk in plain English."),
  redFlags: z
    .array(
      z.object({
        severity: z.enum(["high", "medium", "low"]),
        title: z.string(),
        detail: z.string().describe("Which answer raised it, why it matters and what the guide says to do."),
        guideSection: z.string().describe('For example "Guide 6, History". Empty if not from the guide.'),
      }),
    )
    .describe("Most serious first. Empty if there are none."),
  terms: z.array(termSchema).describe("Suggested subjectivities, endorsements, excesses, loadings and premiums."),
  positives: z.array(z.string()).describe("Short points in the risk's favour."),
  missingInformation: z.array(z.string()).describe("What the underwriter still needs from the broker."),
  brokerEmail: z.object({ subject: z.string(), body: z.string() }),
  underwriterNotes: z.string().describe("At most 600 characters, one paragraph, for the worksheet notes box."),
});

export type UwBrief = z.infer<typeof briefSchema>;
export type UwTerm = z.infer<typeof termSchema>;
export type RiskCheck = {
  severity: "high" | "medium" | "low";
  title: string;
  detail: string;
  guideSection: string;
  /** What the guide says this means for the risk, when it decides it. */
  action?: "refer" | "decline";
  /** Something to ask the broker for. */
  ask?: string;
};

export type BriefRecord = {
  applicationId: string;
  status: "pending" | "ready" | "failed";
  /** "claude" when the AI wrote it, "rules" when the built-in checks did. */
  source?: "claude" | "rules";
  model?: string;
  brief?: UwBrief;
  checks?: RiskCheck[];
  error?: string;
  startedAt?: string;
  finishedAt?: string;
  /** The rating region the underwriter chose, if they changed it. */
  ratingRegion?: string;
};

const COLLECTION = "uw-briefs";
export async function getBrief(applicationId: string) {
  const record = await getRecord<BriefRecord>(COLLECTION, applicationId);
  // Briefs from before suggested terms and guide references were added.
  if (record?.brief) record.brief = { ...record.brief, terms: record.brief.terms ?? [], redFlags: record.brief.redFlags.map((r) => ({ ...r, guideSection: r.guideSection ?? "" })) };
  return record;
}
const saveBrief = (record: BriefRecord) => putRecord(COLLECTION, record.applicationId, record);

/** Shows the brief as being written straight away, before the background job starts. */
export async function markBriefPending(applicationId: string) {
  const record = await getBrief(applicationId);
  await saveBrief({ ...(record ?? { applicationId }), status: "pending", startedAt: new Date().toISOString(), error: undefined });
}

/** The suggested terms as text for the worksheet's Subjectivity (C49) and Endorsements (C50) boxes. */
export function worksheetTerms(brief?: UwBrief) {
  const of = (kind: UwTerm["kind"]) => brief?.terms.filter((t) => t.kind === kind).map((t) => t.text).join("; ") || undefined;
  return { subjectivity: of("subjectivity"), endorsements: of("endorsement") };
}

export async function setRatingRegion(applicationId: string, region: string) {
  const record = (await getBrief(applicationId)) ?? { applicationId, status: "failed" as const };
  await saveBrief({ ...record, ratingRegion: region });
}

const num = (v?: string) => {
  const n = Number((v ?? "").replace(/[$,\s]/g, ""));
  return v && Number.isFinite(n) ? n : null;
};
const nzd = (n: number) => `$${Math.round(n).toLocaleString("en-NZ")}`;

const isoToday = () => new Date().toISOString().slice(0, 10);
const addDays = (iso: string, days: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10);

/** The facts worked out from the answers, given to Claude alongside the form. */
export function riskFacts(a: Answers) {
  const loc = propertyLocation(a);
  const multi = a.isMultiUnit === "yes";
  const sumInsured = num(multi && a.unitsSumInsured ? a.unitsSumInsured : a.sumInsured);
  const sqm = num(a.internalSqm);
  const year = num(a.yearBuilt);
  return {
    address: a.propertyAddress ?? "",
    councilRegion: loc.region || "unknown",
    ratingRegion: loc.rating.region || "not found",
    ratingRegionBasis: loc.rating.basis,
    sumInsured,
    sumInsuredPerSqm: sumInsured && sqm ? Math.round(sumInsured / sqm) : null,
    units: Number(multi ? a.unitsTotal : a.selfContainedUnits) || 1,
    yearBuilt: year,
    insuredAgeYears: a.dateOfBirth ? ageOn(a.dateOfBirth, isoToday()) : null,
    earthquakeSiteDeductible: earthquakeDeductible(loc.region, year),
    councilFloodMappingAvailable: !loc.flood.unavailable,
    inceptionDate: a.inceptionDate ?? "",
    today: isoToday(),
    binderPeriod,
  };
}

function ageOn(dob: string, on: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
  const [y, m, d] = dob.split("-").map(Number);
  const [ty, tm, td] = on.split("-").map(Number);
  return ty - y - (tm < m || (tm === m && td < d) ? 1 : 0);
}

/** Guide 8, Standard Excesses: the earthquake site deductible for the council region. */
export function earthquakeDeductible(councilRegion: string, yearBuilt: number | null) {
  const old = yearBuilt !== null && yearBuilt < 1935;
  if (["Auckland", "Northland", "Waikato", "Otago", "Southland"].includes(councilRegion))
    return old ? "5% of the site deductible amount, minimum $5,000 (pre-1935)" : "1% of the site deductible amount, minimum $1,000";
  if (councilRegion === "Bay of Plenty") return old ? "5% of the site deductible amount, minimum $5,000 (pre-1935)" : "2.5% of the site deductible amount, minimum $2,500";
  return old ? "10% of the site deductible amount, minimum $10,000 (pre-1935)" : "5% of the site deductible amount, minimum $5,000";
}

/** Appendix 2: the mortgagee sale risk category and fixed premium. */
export function mortgageeSaleTerms(a: Answers, sumInsured: number | null) {
  const vacant = a.possession === "Vacant possession";
  const canInspect = a.purchaserInspected === "yes" || a.auctionDayInspection === "yes";
  const contentious = /\b(forced|contentious|hostile|dispute|refus|evict|angry|squat)/i.test(a.contentious ?? "") && !/\bnot contentious|no issues|accepting\b/i.test(a.contentious ?? "");
  const category: "low" | "medium" | "high" = contentious || (!vacant && !canInspect) ? "high" : vacant && canInspect ? "low" : "medium";
  const base = { low: 2750, medium: 4000, high: 5750 }[category];
  const over = sumInsured && sumInsured > 1_000_000 ? (sumInsured - 1_000_000) * { low: 0.001, medium: 0.002, high: 0.003 }[category] : 0;
  return { category, premium: Math.round(base + over) };
}

const moneyAmounts = (text = "") => [...text.matchAll(/\$\s?([\d,]+(?:\.\d+)?)\s*(k\b)?/gi)].map((m) => Number(m[1].replace(/,/g, "")) * (m[2] ? 1000 : 1));

/** The guide's rules applied to the answers: always run, shown to Claude, and used on their own without an API key. */
export function riskChecks(a: Answers): RiskCheck[] {
  const f = riskFacts(a);
  const checks: RiskCheck[] = [];
  const add = (c: RiskCheck) => checks.push(c);
  const yes = (k: string) => a[k] === "yes";
  const no = (k: string) => a[k] === "no";
  const year = f.yearBuilt;

  // Guide 5
  if (f.sumInsured !== null && f.sumInsured > 5_000_000)
    add({ severity: "high", title: "Over the underwriters' limit", detail: `Sum insured ${nzd(f.sumInsured)} is over NZD 5,000,000 any one risk per location.`, guideSection: "Guide 5, Maximum Limits", action: "decline" });
  else if (f.sumInsured !== null && f.sumInsured > 2_000_000)
    add({ severity: "high", title: "Over the coverholder limit", detail: `Sum insured ${nzd(f.sumInsured)} is over the NZD 2,000,000 coverholder limit per location: refer to Beazley.`, guideSection: "Guide 5, Maximum Limits", action: "refer" });
  if (f.inceptionDate && (f.inceptionDate < binderPeriod.start || f.inceptionDate > binderPeriod.end))
    add({ severity: "high", title: "Inception outside the binder period", detail: `Inception ${f.inceptionDate} is outside the binder (${binderPeriod.start} to ${binderPeriod.end}).`, guideSection: "Guide 5, Period of Insurance", action: "refer" });
  else if (f.inceptionDate && f.inceptionDate > addDays(f.today, 30))
    add({ severity: "medium", title: "Inception more than 30 days away", detail: `Inception ${f.inceptionDate}: cover can't be bound or held more than 30 days before inception, so quote now and bind closer to the date.`, guideSection: "Guide 5, Period of Insurance" });

  // Guide 6, History
  if (yes("insuranceHistory"))
    add({ severity: "high", title: "Previous insurance declined, cancelled or on special terms", detail: a.insuranceHistoryDetails ? `Details given: ${a.insuranceHistoryDetails}` : "No details given.", guideSection: "Guide 6, History", action: "refer", ask: a.insuranceHistoryDetails ? undefined : "Full details of the previous insurance decline, cancellation, special terms or rejected claim." });
  if (yes("convictions"))
    add({ severity: "high", title: "Criminal record or prosecution pending", detail: "Must be referred unless the record is driving convictions only.", guideSection: "Guide 6, History", action: "refer", ask: "Details of the criminal record or pending prosecution (driving convictions only don't need referral)." });
  if (yes("bankrupt")) add({ severity: "high", title: "Bankruptcy", detail: "Bankrupt or No Asset Procedure in the last 10 years: must be referred.", guideSection: "Guide 6, History", action: "refer" });
  if (f.insuredAgeYears !== null && f.insuredAgeYears < 18) add({ severity: "high", title: "Insured under 18", detail: `Date of birth ${a.dateOfBirth}.`, guideSection: "Guide 6, History", action: "refer" });

  // Guide 6, Claims Record
  if (yes("losses")) {
    const details = a.lossesDetails ?? "";
    const big = moneyAmounts(details).filter((n) => n > 10_000);
    const perils = details.match(/\b(flood\w*|subsid\w*|landslip|slip|heave|liabilit\w*|arson)\b/gi);
    if (big.length || perils) {
      add({
        severity: "high",
        title: "Claims history needs referral",
        detail: [big.length ? `A claim over NZD 10,000 (${big.map(nzd).join(", ")}).` : "", perils ? `Claim involving ${[...new Set(perils.map((p) => p.toLowerCase()))].join(", ")}.` : ""].filter(Boolean).join(" "),
        guideSection: "Guide 6, Claims Record",
        action: "refer",
      });
    } else {
      add({ severity: "medium", title: "Losses in the last 3 years", detail: details ? `Details given: ${details}` : "No details given.", guideSection: "Guide 6, Claims Record" });
    }
    if (/\b(water|leak|burst|flood|pipe|plumbing|escape)\b/i.test(details))
      add({ severity: "medium", title: "Escape of water history", detail: "Understand the remediation, and consider excluding the peril, a higher excess or a lower sublimit.", guideSection: "Guide 7, Escape of Water Clauses", ask: "What repairs were made after the water damage, and when." });
    add({ severity: "low", title: "Five year claims history", detail: "The form asks about 3 years; the guide's referral triggers look at 5.", guideSection: "Guide 6, Claims Record", ask: "Claims for the last 5 years, with the cause, amount and remedial action for each." });
  }

  // Guide 7, Premises
  if (no("structurallySound"))
    add({ severity: "high", title: "Not in a good state of repair", detail: "The insured did not confirm the house is structurally sound, well maintained, watertight and secure. The coverholder isn't authorised to bind it.", guideSection: "Guide 7, General", action: "decline" });
  if (yes("naturalHazards"))
    add({ severity: "high", title: "Natural hazards at the site", detail: "Check the council flood map and street view to establish why it won't flood. In a high flood area exclude flood until a satisfactory Flood Questionnaire is received.", guideSection: "Guide 7, Flood Risk Area", action: "refer", ask: "What the identified natural hazards are, and any reports (for example a LIM or geotechnical report)." });
  if (!f.councilFloodMappingAvailable)
    add({ severity: "medium", title: "No council flood mapping for this area", detail: `${f.ratingRegion}: the guide needs a description of how the property performed in flood events over the last five years.`, guideSection: "Guide 7, Flood Risk Area", ask: "How the property has performed in any flood events over the last five years." });

  // Guide 7 and 8, Age
  if (year !== null && year < 1935) {
    if (!yes("rewired")) add({ severity: "medium", title: "Pre-1935 and not confirmed rewired", detail: `Built ${year}. Apply the Electrical Certificate Condition unless totally rewired since 1970.`, guideSection: "Guide 7, Electrical Certificate Condition", ask: "When the building was last rewired (and an electrical certificate if available)." });
    if (!yes("pilings")) add({ severity: "medium", title: "Piles not confirmed inspected", detail: `Built ${year}. Piles should be inspected and replaced if needed.`, guideSection: "Guide 8, Age of Property", ask: "When the piles were last inspected or replaced." });
    if (yes("scrim")) add({ severity: "high", title: "Scrim present", detail: "Scrim lets fire spread inside the walls and should be replaced with plasterboard.", guideSection: "Guide 8, Age of Property", action: "refer" });
  }
  if (year !== null && year < 1940 && yes("heritage")) add({ severity: "medium", title: "Heritage listing", detail: "Heritage rules can raise reinstatement costs and time.", guideSection: "" });
  if (year !== null && year >= 1980 && year < 1990) add({ severity: "low", title: "1980s plumbing", detail: "Check for Dux Quest pipes, which lead to more water damage claims.", guideSection: "Guide 8, Age of Property", ask: "What internal plumbing the property has (in particular whether any Dux Quest pipes remain)." });
  if (year !== null && year >= 1990 && year < 2010) add({ severity: "low", title: "1990s or 2000s build", detail: "Weathertightness isn't covered; confirm the building is in good repair with no known issues.", guideSection: "Guide 8, Age of Property" });

  // Appendix 4, connected units
  if (a.isMultiUnit === "yes") {
    if (yes("stackedUnits")) {
      const whole = a.propertyType === "Block of units";
      add({ severity: whole ? "medium" : "high", title: "Stacked units", detail: whole ? "Acceptable only because the entire building is insured: confirm every unit is on the policy." : "Stacked units are declined unless the entire building is insured.", guideSection: "Appendix 4, Multi-connecting walls", action: whole ? undefined : "decline" });
    }
    if (no("fireWalls")) add({ severity: "high", title: "No fire walls between units", detail: "Connected units are only acceptable without referral if built to code with fire walls between units.", guideSection: "Appendix 4, Multi-connecting walls", action: "refer", ask: "Whether the walls between units (including roof cavity divisions) meet the 2004 building compliance standard, and if not, their fire rating and material." });
    if (no("smokeDetectors")) add({ severity: "medium", title: "Not every unit has a smoke detector", detail: "Multi-unit dwelling without a smoke or heat detector in each unit.", guideSection: "" });
  }
  if (a.propertyType === "Apartment")
    add({ severity: "low", title: "Apartment: likely a body corporate", detail: "If the unit is in a body corporate, cover it as excess over the body corporate policy with the usual rate discounted 30%.", guideSection: "Appendix 7, Body Corporates", ask: "Whether the apartment is in a body corporate, and the body corporate's name." });

  // Social housing and NHI
  if (yes("isSocialHousing") && yes("shortTenancy"))
    add({ severity: "high", title: "Tenancies under 28 days", detail: "Short stay accommodation may fall outside NHI, which must be referred to Beazley. A Short-Term Tenancy Questionnaire is needed.", guideSection: "Guide 8, Standard Excesses (NHI)", action: "refer", ask: "The completed Short-Term Tenancy Questionnaire." });

  // Appendix 2, mortgagee sales
  if (yes("isMortgageeSale")) {
    if (a.transactionType === "Retail")
      add({ severity: "high", title: "Retail mortgagee sale", detail: "The purchaser must be buying for a business purpose; a retail transaction can't be covered.", guideSection: "Appendix 2 and 6, Mortgagee Sales", action: "decline" });
    const { category } = mortgageeSaleTerms(a, f.sumInsured);
    add({ severity: category === "high" ? "high" : "medium", title: `Mortgagee sale, ${category} risk`, detail: `Possession: ${a.possession || "not given"}. Inspected: ${a.purchaserInspected || "not given"}. Contentious: ${a.contentious || "not given"}. Settlement: ${a.settlementPeriod || "not given"}.`, guideSection: "Appendix 2, Mortgagee Sales" });
  }

  // Other points from the form
  if (f.sumInsuredPerSqm !== null && f.sumInsuredPerSqm < 2500)
    add({ severity: "medium", title: "Possible underinsurance", detail: `${nzd(f.sumInsuredPerSqm)} per square metre is below the usual $3,000 to $5,000 rebuild cost (a rule of thumb, not from the guide).`, guideSection: "", ask: "How the sum insured was worked out (a registered valuation is ideal)." });
  if (no("inspections")) add({ severity: "medium", title: "No 6 monthly inspections", detail: "Inspections at least every 6 months and at each change of tenancy are a requirement for parts of the cover.", guideSection: "" });
  else if (no("inspectionRecords")) add({ severity: "low", title: "No written inspection records", detail: "Written records of inspections are expected.", guideSection: "" });
  if (yes("retainingWalls")) add({ severity: "low", title: "Retaining walls over $25,000", detail: "Check the walls are within cover and in good condition.", guideSection: "" });
  if (yes("recreational")) add({ severity: "low", title: "Recreational features", detail: `Value ${a.recreationalValue ? `$${a.recreationalValue}` : "not given"}. For example a pool, spa or solar system.`, guideSection: "" });
  const chattels = num(a.chattelsValue);
  if (chattels !== null && chattels > 50000) add({ severity: "medium", title: "Landlords chattels over $50,000", detail: `${nzd(chattels)} is above the $50,000 maximum on the worksheet.`, guideSection: "" });
  if (f.ratingRegion === "not found") add({ severity: "medium", title: "Rating region not found", detail: "Choose the region on the worksheet by hand.", guideSection: "" });

  const order = { high: 0, medium: 1, low: 2 };
  return checks.sort((x, y) => order[x.severity] - order[y.severity]);
}

/** The terms the guide calls for, from the answers. */
export function suggestedTerms(a: Answers, checks: RiskCheck[]): UwTerm[] {
  const f = riskFacts(a);
  const terms: UwTerm[] = [];
  const has = (title: string) => checks.some((c) => c.title.startsWith(title));
  terms.push({ kind: "excess", text: "Standard excess $1,000 (all perils, theft and malicious damage)", guideSection: "Guide 8, Standard Excesses" });
  terms.push({ kind: "excess", text: `Earthquake: ${f.earthquakeSiteDeductible} (${f.councilRegion})`, guideSection: "Guide 8, Standard Excesses" });
  if (has("Pre-1935 and not confirmed rewired")) terms.push({ kind: "endorsement", text: "Electrical Certificate Condition", guideSection: "Guide 7, Electrical Certificate Condition" });
  if (has("Natural hazards")) terms.push({ kind: "subjectivity", text: "Flood Questionnaire within 14 days (flood excluded until received if in a high flood area)", guideSection: "Guide 9, Flood Questionnaire" });
  if (has("Escape of water")) terms.push({ kind: "excess", text: "Consider a higher escape of water excess or sublimit", guideSection: "Guide 7, Escape of Water Clauses" });
  if (has("Apartment")) terms.push({ kind: "endorsement", text: "Body Corporate / Unit Title Excess Cover Endorsement (rate discounted 30%)", guideSection: "Appendix 7, Body Corporates" });
  if (a.isMultiUnit === "yes" && a.fireWalls === "yes")
    terms.push({ kind: "loading", text: "Connected units: load 10% for one connecting wall, 20% for two", guideSection: "Appendix 4, Multi-connecting walls" });
  if (a.isMortgageeSale === "yes") {
    const { category, premium } = mortgageeSaleTerms(a, f.sumInsured);
    terms.push({ kind: "premium", text: `Mortgagee sale (${category} risk): ${nzd(premium)} for the settlement period up to 3 months, plus taxes and levies; add 30% per extra month`, guideSection: "Appendix 2, Mortgagee Sales" });
    terms.push({ kind: "excess", text: "Malicious damage excess $5,000; fire excess $10,000", guideSection: "Appendix 2, Mortgagee Sales" });
    terms.push({ kind: "endorsement", text: "Unoccupied Endorsement", guideSection: "Appendix 2, Mortgagee Sales" });
    terms.push({ kind: "endorsement", text: "Pre-existing damage exclusion", guideSection: "Appendix 2, Mortgagee Sales" });
  }
  return terms;
}

/** "Natural hazards at the site; claims history needs referral." */
const sentence = (titles: string[]) => {
  const text = titles.map((t, i) => (i === 0 ? t : t.charAt(0).toLowerCase() + t.slice(1))).join("; ");
  return `${text}.`;
};

/** A brief from the guide checks alone, for when the AI isn't available. */
export function rulesBrief(app: Application, checks: RiskCheck[]): UwBrief {
  const f = riskFacts(app.answers);
  const a = app.answers;
  const decline = checks.filter((c) => c.action === "decline");
  const refer = checks.filter((c) => c.action === "refer");
  const recommendation = decline.length ? "decline" : refer.length || checks.some((c) => c.severity !== "low") ? "refer" : "accept";
  const missing = [...new Set(checks.map((c) => c.ask).filter((x): x is string => !!x))];
  const first = app.brokerName.split(" ")[0];
  const terms = suggestedTerms(a, checks);
  return {
    recommendation,
    headline: decline.length
      ? sentence(decline.map((c) => c.title))
      : refer.length
        ? sentence(refer.map((c) => c.title))
        : checks.some((c) => c.severity !== "low")
          ? "No referral triggers; a few points to check before quoting."
          : "Within binder authority on the answers given.",
    summary: `${a.propertyType || "Property"} at ${f.address || "an unknown address"}${f.ratingRegion !== "not found" ? ` (${f.ratingRegion})` : ""}, built ${a.yearBuilt || "in an unknown year"}, sum insured ${f.sumInsured ? nzd(f.sumInsured) : "not given"}${f.sumInsuredPerSqm ? ` (${nzd(f.sumInsuredPerSqm)} per square metre)` : ""}, ${f.units} ${f.units === 1 ? "unit" : "units"}.`,
    redFlags: checks.map(({ severity, title, detail, guideSection }) => ({ severity, title, detail, guideSection })),
    terms,
    positives: [
      ...(a.structurallySound === "yes" ? ["Confirmed structurally sound, well maintained and watertight."] : []),
      ...(a.inspections === "yes" ? ["6 monthly inspections carried out."] : []),
      ...(a.losses === "no" ? ["No losses in the last 3 years."] : []),
      ...(a.insuranceHistory === "no" ? ["Clean insurance history."] : []),
      ...(f.sumInsured !== null && f.sumInsured <= 2_000_000 ? ["Within the NZD 2,000,000 coverholder limit."] : []),
    ],
    missingInformation: missing,
    brokerEmail: {
      subject: `${app.reference}: ${app.insuredName}, ${f.address}`,
      body: missing.length
        ? `Kia ora ${first},\n\nThanks for the application for ${app.insuredName}. To finish our assessment, could you please send:\n\n${missing.map((m, i) => `${i + 1}. ${m}`).join("\n")}\n\nNgā mihi,\nThe Otta underwriting team`
        : `Kia ora ${first},\n\nThanks for the application for ${app.insuredName}. We're reviewing it now and will be in touch shortly.\n\nNgā mihi,\nThe Otta underwriting team`,
    },
    underwriterNotes: (checks.length
      ? `Guide checks: ${checks.map((c) => `${c.title}${c.guideSection ? ` (${c.guideSection.replace(/,.*$/, "")})` : ""}`).join("; ")}.`
      : "No issues found by the guide checks."
    ).slice(0, 600),
  };
}

const noDashes = (s: string) => s.replace(/\s*[–—]\s*/g, ", ");
function tidy(brief: UwBrief): UwBrief {
  const t = noDashes;
  return {
    ...brief,
    headline: t(brief.headline),
    summary: t(brief.summary),
    redFlags: brief.redFlags.map((r) => ({ ...r, title: t(r.title), detail: t(r.detail) })),
    terms: brief.terms.map((x) => ({ ...x, text: t(x.text) })),
    positives: brief.positives.map(t),
    missingInformation: brief.missingInformation.map(t),
    brokerEmail: { subject: t(brief.brokerEmail.subject), body: t(brief.brokerEmail.body) },
    underwriterNotes: t(brief.underwriterNotes).replace(/\s*\n+\s*/g, " ").slice(0, 600),
  };
}

async function claudeBrief(app: Application, checks: RiskCheck[]): Promise<{ brief: UwBrief; model: string }> {
  const client = new Anthropic({ timeout: 180_000, maxRetries: 1 });
  const response = await client.beta.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: "medium", format: betaZodOutputFormat(briefSchema) },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: [{ type: "text", text: uwAssistantPrompt, cache_control: { type: "ephemeral" } }],
    messages: [
      {
        role: "user",
        content: [
          `Application ${app.reference}, submitted ${app.createdAt.slice(0, 10)} by ${app.brokerName} (${app.source === "client" ? "completed by the client from the broker's link" : "broker"}).`,
          ``,
          `Worked out from the answers:`,
          JSON.stringify(riskFacts(app.answers), null, 2),
          ``,
          `Automatic guide checks (verify them against the guide, and add anything they missed):`,
          checks.length ? checks.map((c) => `- [${c.severity}${c.action ? `, ${c.action}` : ""}] ${c.title}: ${c.detail}${c.guideSection ? ` (${c.guideSection})` : ""}`).join("\n") : "- none",
          ``,
          `Terms the checks suggest:`,
          suggestedTerms(app.answers, checks).map((x) => `- ${x.kind}: ${x.text} (${x.guideSection})`).join("\n"),
          ``,
          `The application as submitted:`,
          summaryText(buildingApplication, app.answers),
        ].join("\n"),
      },
    ],
  });
  if (response.stop_reason === "refusal") throw new Error("The model declined to write this brief.");
  if (response.stop_reason === "max_tokens") throw new Error("The brief was cut off.");
  if (!response.parsed_output) throw new Error("The brief couldn't be read.");
  return { brief: tidy(response.parsed_output), model: response.model };
}

/**
 * Writes (or rewrites) the brief for an application and saves it. Safe to call
 * more than once: a brief already being written is left alone unless forced.
 */
export async function generateBrief(app: Application, { force = false } = {}) {
  const existing = await getBrief(app.id);
  const fresh = existing?.status === "pending" && existing.startedAt && Date.now() - Date.parse(existing.startedAt) < 4 * 60_000;
  if (!force && (existing?.status === "ready" || fresh)) return existing;

  const base = { applicationId: app.id, ratingRegion: existing?.ratingRegion };
  const checks = riskChecks(app.answers);
  await saveBrief({ ...base, status: "pending", checks, startedAt: new Date().toISOString() });

  let record: BriefRecord;
  if (!process.env.ANTHROPIC_API_KEY) {
    record = { ...base, status: "ready", source: "rules", checks, brief: rulesBrief(app, checks) };
  } else {
    try {
      const { brief, model } = await claudeBrief(app, checks);
      record = { ...base, status: "ready", source: "claude", model, checks, brief };
    } catch (error) {
      console.error("[uw-brief] Claude brief failed; using the rule checks", error);
      const message = error instanceof Anthropic.APIError ? `API error ${error.status}` : error instanceof Error ? error.message : "Unknown error";
      record = { ...base, status: "ready", source: "rules", checks, brief: rulesBrief(app, checks), error: message };
    }
  }
  record.finishedAt = new Date().toISOString();
  await saveBrief(record);
  return record;
}
