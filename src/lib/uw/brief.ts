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

export const briefSchema = z.object({
  recommendation: z.enum(["accept", "refer", "decline"]),
  headline: z.string().describe("One sentence: the risk and the main reason for the recommendation."),
  summary: z.string().describe("Two to four sentences describing the risk in plain English."),
  redFlags: z
    .array(
      z.object({
        severity: z.enum(["high", "medium", "low"]),
        title: z.string(),
        detail: z.string().describe("Which answer raised it and why it matters."),
      }),
    )
    .describe("Most serious first. Empty if there are none."),
  positives: z.array(z.string()).describe("Short points in the risk's favour."),
  missingInformation: z.array(z.string()).describe("What the underwriter still needs from the broker."),
  brokerEmail: z.object({ subject: z.string(), body: z.string() }),
  underwriterNotes: z.string().describe("At most 600 characters, one paragraph, for the worksheet notes box."),
});

export type UwBrief = z.infer<typeof briefSchema>;
export type RiskCheck = { severity: "high" | "medium" | "low"; title: string; detail: string };

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
export const getBrief = (applicationId: string) => getRecord<BriefRecord>(COLLECTION, applicationId);
const saveBrief = (record: BriefRecord) => putRecord(COLLECTION, record.applicationId, record);

/** Shows the brief as being written straight away, before the background job starts. */
export async function markBriefPending(applicationId: string) {
  const record = await getBrief(applicationId);
  await saveBrief({ ...(record ?? { applicationId }), status: "pending", startedAt: new Date().toISOString(), error: undefined });
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
    buildingAgeYears: year ? new Date().getUTCFullYear() - year : null,
    inceptionDate: a.inceptionDate ?? "",
    binderPeriod,
  };
}

/** Plain rule checks: always run, shown to Claude and used on their own without an API key. */
export function riskChecks(a: Answers): RiskCheck[] {
  const f = riskFacts(a);
  const checks: RiskCheck[] = [];
  const add = (severity: RiskCheck["severity"], title: string, detail: string) => checks.push({ severity, title, detail });
  const yes = (k: string) => a[k] === "yes";
  const no = (k: string) => a[k] === "no";

  if (f.inceptionDate && (f.inceptionDate < binderPeriod.start || f.inceptionDate > binderPeriod.end))
    add("high", "Inception outside the binder period", `Inception ${f.inceptionDate} is outside ${binderPeriod.start} to ${binderPeriod.end}.`);
  if (no("structurallySound")) add("high", "Not confirmed structurally sound", "The insured did not confirm the house is structurally sound, well maintained, watertight and secure.");
  if (yes("naturalHazards")) add("high", "Natural hazards at the site", "The application says there are identified natural hazards (for example flooding, slippage or coastal inundation). Check the flood maps.");
  if (yes("insuranceHistory")) add("high", "Previous insurance declined, cancelled or claim rejected", a.insuranceHistoryDetails ? `Details given: ${a.insuranceHistoryDetails}` : "No details given.");
  if (yes("convictions")) add("high", "Criminal convictions or prosecutions pending", "Answered yes to the convictions question.");
  if (yes("bankrupt")) add("high", "Bankrupt in the last 10 years", "Answered yes to bankruptcy or No Asset Procedure.");
  if (yes("losses")) add("medium", "Losses in the last 3 years", a.lossesDetails ? `Details given: ${a.lossesDetails}` : "No details given.");
  if (f.buildingAgeYears !== null && f.buildingAgeYears > new Date().getUTCFullYear() - 1940) {
    const notDone = [["rewired", "re-wiring"], ["plumbing", "re-plumbing"], ["pilings", "piles"], ["reroofed", "re-roofing"]].filter(([k]) => !yes(k)).map(([, l]) => l);
    if (notDone.length) add("medium", "Pre-1940 building not fully updated", `Built ${a.yearBuilt}. Not confirmed: ${notDone.join(", ")}.`);
    if (yes("scrim")) add("high", "Scrim present", "Scrim is a fire risk in older homes.");
    if (yes("heritage")) add("medium", "Heritage listing", "Heritage rules can raise reinstatement costs and time.");
  }
  if (f.sumInsuredPerSqm !== null) {
    if (f.sumInsuredPerSqm < 2500) add("medium", "Possible underinsurance", `${nzd(f.sumInsuredPerSqm)} per square metre is below the usual $3,000 to $5,000 rebuild cost.`);
    else if (f.sumInsuredPerSqm > 8000) add("low", "High sum insured for the floor area", `${nzd(f.sumInsuredPerSqm)} per square metre. Check the floor area and the sum insured.`);
  }
  if (no("inspections")) add("medium", "No 6 monthly inspections", "Landlord obligations: inspections at least every 6 months and at each change of tenancy are a requirement for parts of the cover.");
  else if (no("inspectionRecords")) add("low", "No written inspection records", "Written records of inspections are expected.");
  if (a.isMultiUnit === "yes") {
    if (no("smokeDetectors")) add("high", "Not every unit has a smoke detector", "Multi-unit dwelling without a smoke or heat detector in each unit.");
    if (no("fireWalls")) add("medium", "No fire walls between units", "Fire spread between units is more likely.");
    if (yes("stackedUnits")) add("low", "Stacked units", "Units are stacked, so one loss can affect several units.");
  }
  if (yes("isMortgageeSale") && yes("contentious")) add("high", "Contentious mortgagee sale", "Risk of malicious damage or difficulty getting possession.");
  if (yes("retainingWalls")) add("low", "Retaining walls over $25,000", "Check the walls are within cover and in good condition.");
  if (yes("recreational")) add("low", "Recreational features", `Value ${a.recreationalValue ? `$${a.recreationalValue}` : "not given"}. For example a pool, spa or solar system.`);
  const chattels = num(a.chattelsValue);
  if (chattels !== null && chattels > 50000) add("medium", "Landlords chattels over $50,000", `${nzd(chattels)} is above the $50,000 maximum on the worksheet.`);
  if (f.ratingRegion === "not found") add("medium", "Rating region not found", "Choose the region on the worksheet by hand.");
  const order = { high: 0, medium: 1, low: 2 };
  return checks.sort((x, y) => order[x.severity] - order[y.severity]);
}

/** A brief from the rule checks alone, for when the AI isn't available. */
export function rulesBrief(app: Application, checks: RiskCheck[]): UwBrief {
  const f = riskFacts(app.answers);
  const a = app.answers;
  const high = checks.filter((c) => c.severity === "high");
  const recommendation = high.length ? "refer" : checks.some((c) => c.severity === "medium") ? "refer" : "accept";
  const missing = [
    ...(yes(a, "insuranceHistory") && !a.insuranceHistoryDetails ? ["Full details of the previous insurance decline, cancellation or rejected claim."] : []),
    ...(yes(a, "losses") && !a.lossesDetails ? ["Full details of each loss in the last 3 years."] : []),
    ...(yes(a, "naturalHazards") ? ["What the identified natural hazards are, and any reports (for example a LIM or geotechnical report)."] : []),
    ...(checks.some((c) => c.title === "Pre-1940 building not fully updated") ? ["When the building was last re-wired, re-plumbed, re-piled and re-roofed."] : []),
    ...(checks.some((c) => c.title === "Possible underinsurance") ? ["How the sum insured was worked out (a registered valuation is ideal)."] : []),
  ];
  const first = app.brokerName.split(" ")[0];
  return {
    recommendation,
    headline: high.length
      ? `${high.length === 1 ? "One serious point needs" : `${high.length} serious points need`} the underwriter's review before quoting.`
      : checks.length
        ? "No serious concerns; a few points to check before quoting."
        : "Nothing unusual in the answers given.",
    summary: `${a.propertyType || "Property"} at ${f.address || "an unknown address"}${f.ratingRegion !== "not found" ? ` (${f.ratingRegion})` : ""}, built ${a.yearBuilt || "in an unknown year"}, sum insured ${f.sumInsured ? nzd(f.sumInsured) : "not given"}${f.sumInsuredPerSqm ? ` (${nzd(f.sumInsuredPerSqm)} per square metre)` : ""}, ${f.units} ${f.units === 1 ? "unit" : "units"}.`,
    redFlags: checks,
    positives: [
      ...(a.structurallySound === "yes" ? ["Confirmed structurally sound, well maintained and watertight."] : []),
      ...(a.inspections === "yes" ? ["6 monthly inspections carried out."] : []),
      ...(a.losses === "no" ? ["No losses in the last 3 years."] : []),
      ...(a.insuranceHistory === "no" ? ["Clean insurance history."] : []),
    ],
    missingInformation: missing,
    brokerEmail: {
      subject: `${app.reference}: ${app.insuredName}, ${f.address}`,
      body: missing.length
        ? `Kia ora ${first},\n\nThanks for the application for ${app.insuredName}. To finish our assessment, could you please send:\n\n${missing.map((m, i) => `${i + 1}. ${m}`).join("\n")}\n\nNgā mihi,\nThe Otta underwriting team`
        : `Kia ora ${first},\n\nThanks for the application for ${app.insuredName}. We're reviewing it now and will be in touch shortly.\n\nNgā mihi,\nThe Otta underwriting team`,
    },
    underwriterNotes: (checks.length ? `Checks: ${checks.map((c) => c.title).join("; ")}.` : "No issues found by the automatic checks.").slice(0, 600),
  };
}
const yes = (a: Answers, k: string) => a[k] === "yes";

const noDashes = (s: string) => s.replace(/\s*[–—]\s*/g, ", ");
function tidy(brief: UwBrief): UwBrief {
  const t = noDashes;
  return {
    ...brief,
    headline: t(brief.headline),
    summary: t(brief.summary),
    redFlags: brief.redFlags.map((r) => ({ ...r, title: t(r.title), detail: t(r.detail) })),
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
          `Automatic checks (verify them, and add anything they missed):`,
          checks.length ? checks.map((c) => `- [${c.severity}] ${c.title}: ${c.detail}`).join("\n") : "- none",
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
