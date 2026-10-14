import { after } from "next/server";
import { Card } from "@/components/portal/ui";
import { uwAssistantCopy as copy } from "@/content/uw-assistant";
import type { Application } from "@/lib/applications/store";
import { generateBrief, getBrief, worksheetTerms, type BriefRecord, type RiskCheck } from "@/lib/uw/brief";
import { pasteBlocks, propertyLocation, worksheetValues } from "@/lib/uw/worksheet";
import { CopyButton, RefreshWhilePending, RegionSelect, RewriteButton } from "./BriefControls";

const tone = {
  accept: "bg-[#e6f4f2] text-[#2e7d74] border-[#61b9ad]",
  refer: "bg-[#fff6e0] text-[#8a5a00] border-[#e8b54a]",
  decline: "bg-[#f8f1fa] text-site-purple border-site-purple",
};
const severityTone: Record<RiskCheck["severity"], string> = {
  high: "bg-site-purple text-white",
  medium: "bg-[#e8b54a] text-charcoal",
  low: "bg-[#efefef] text-[#555]",
};

/** The AI underwriting brief and the copy-and-paste blocks for the V13 worksheet. */
export async function UnderwritingAssistant({ app, brokerageName }: { app: Application; brokerageName: string }) {
  let record: BriefRecord | null = await getBrief(app.id);
  if (!record || (!record.brief && record.status !== "pending")) {
    // Not written yet (for example an application from before the assistant): start it now.
    after(() => generateBrief(app).catch((error) => console.error("[uw-brief] failed", error)));
    record = { applicationId: app.id, status: "pending", ratingRegion: record?.ratingRegion };
  }
  const loc = propertyLocation(app.answers);
  const region = record.ratingRegion || loc.rating.region;
  const values = worksheetValues(
    app.answers,
    { reference: app.reference, brokerageName, brokerName: app.brokerName, createdAt: app.createdAt },
    { ratingRegion: region, underwriterNotes: record.brief?.underwriterNotes, ...worksheetTerms(record.brief) },
  );
  const blocks = pasteBlocks(values);
  const brief = record.status === "ready" ? record.brief : undefined;

  return (
    <div className="mb-8 grid grid-cols-[minmax(0,1fr)] gap-6 2xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#eaeaea] bg-[#f6fbfa] px-6 py-4">
          <div>
            <h2 className="flex items-center gap-2 font-heading text-[18px] font-semibold tracking-normal text-charcoal">
              <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-site-teal" />
              {copy.title}
            </h2>
            <p className="mt-1 max-w-xl text-[13px] text-body">{copy.intro}</p>
          </div>
          {record.status !== "pending" && <RewriteButton applicationId={app.id} />}
        </div>

        {record.status === "pending" && (
          <div className="flex items-center gap-3 px-6 py-10 text-[14px] text-body">
            <RefreshWhilePending />
            <span aria-hidden className="h-5 w-5 animate-spin rounded-full border-2 border-[#d6ecea] border-t-site-teal" />
            {copy.pending}
          </div>
        )}
        {record.status === "failed" && !brief && <p className="px-6 py-8 text-[14px] text-site-purple">{copy.failed}</p>}

        {brief && (
          <div className="space-y-6 px-6 py-6">
            <div className={`border-l-4 px-4 py-3 ${tone[brief.recommendation]}`}>
              <p className="text-[11px] font-semibold tracking-[0.14em] uppercase">{copy.recommendation[brief.recommendation]}</p>
              <p className="mt-1 text-[16px] font-medium text-charcoal">{brief.headline}</p>
            </div>
            <p className="text-[15px] leading-relaxed text-charcoal">{brief.summary}</p>

            {brief.redFlags.length > 0 && (
              <section>
                <h3 className="text-[12px] font-semibold tracking-[0.12em] text-body uppercase">Red flags</h3>
                <ul className="mt-3 space-y-3">
                  {brief.redFlags.map((f, i) => (
                    <li key={i} className="flex gap-3">
                      <span className={`mt-0.5 h-fit shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.08em] uppercase ${severityTone[f.severity]}`}>
                        {f.severity}
                      </span>
                      <span className="text-[14px] leading-relaxed">
                        <strong className="font-semibold text-charcoal">{f.title}.</strong> <span className="text-body">{f.detail}</span>
                        {f.guideSection && <span className="ml-1.5 text-[12px] whitespace-nowrap text-[#2e7d74]">{f.guideSection}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {brief.terms.length > 0 && (
              <section>
                <h3 className="text-[12px] font-semibold tracking-[0.12em] text-body uppercase">Suggested terms</h3>
                <ul className="mt-3 divide-y divide-[#f0f0f0] border border-[#eaeaea]">
                  {brief.terms.map((t, i) => (
                    <li key={i} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-2.5 text-[14px]">
                      <span className="w-24 shrink-0 text-[11px] font-semibold tracking-[0.08em] text-body uppercase">{copy.termKinds[t.kind]}</span>
                      <span className="min-w-0 flex-1 text-charcoal">{t.text}</span>
                      {t.guideSection && <span className="text-[12px] text-[#2e7d74]">{t.guideSection}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {brief.missingInformation.length > 0 && (
                <section>
                  <h3 className="text-[12px] font-semibold tracking-[0.12em] text-body uppercase">Still needed from the broker</h3>
                  <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[14px] text-charcoal">
                    {brief.missingInformation.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ol>
                </section>
              )}
              {brief.positives.length > 0 && (
                <section>
                  <h3 className="text-[12px] font-semibold tracking-[0.12em] text-body uppercase">In its favour</h3>
                  <ul className="mt-3 space-y-1.5 text-[14px] text-charcoal">
                    {brief.positives.map((p, i) => (
                      <li key={i} className="flex gap-2">
                        <span aria-hidden className="text-site-teal">✓</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <section className="border border-[#eaeaea]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eaeaea] bg-footer px-4 py-2.5">
                <h3 className="text-[12px] font-semibold tracking-[0.12em] text-body uppercase">Draft email to {app.brokerName}</h3>
                <div className="flex gap-2">
                  <CopyButton text={`${brief.brokerEmail.subject}\n\n${brief.brokerEmail.body}`} label="Copy email" />
                  <a
                    href={`mailto:${app.brokerEmail}?subject=${encodeURIComponent(brief.brokerEmail.subject)}&body=${encodeURIComponent(brief.brokerEmail.body)}`}
                    className="inline-flex items-center gap-1.5 bg-site-teal px-3 py-1.5 text-[11px] font-medium tracking-[0.1em] text-white uppercase hover:bg-[#4fa99c]"
                  >
                    Open in email
                  </a>
                </div>
              </div>
              <div className="px-4 py-3">
                <p className="text-[13px] text-body">Subject: {brief.brokerEmail.subject}</p>
                <p className="mt-2 text-[14px] leading-relaxed whitespace-pre-line text-charcoal">{brief.brokerEmail.body}</p>
              </div>
            </section>

            <p className="text-[12px] text-body">
              {[
                record.finishedAt &&
                  `${new Date(record.finishedAt).toLocaleString("en-NZ", { timeZone: "Pacific/Auckland", dateStyle: "medium", timeStyle: "short" })}.`,
                record.source === "claude" ? `Written by Claude (${record.model ?? "AI"}).` : copy.rulesNote,
                record.error && `The AI brief failed (${record.error}), so the built-in checks wrote this one.`,
              ]
                .filter(Boolean)
                .join(" ")}
            </p>
          </div>
        )}
      </Card>

      <Card className="self-start">
        <div className="border-b border-[#eaeaea] px-6 py-4">
          <h2 className="font-heading text-[18px] font-semibold tracking-normal text-charcoal">{copy.copyTitle}</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-body">{copy.copyIntro}</p>
        </div>
        <div className="border-b border-[#eaeaea] px-6 py-4">
          <p className="mb-2 text-[12px] font-semibold tracking-[0.12em] text-body uppercase">Region (C35)</p>
          <RegionSelect applicationId={app.id} value={region} suggested={loc.rating.region} />
          <p className="mt-1.5 text-[12px] text-body">
            {record.ratingRegion
              ? "Chosen by the underwriter."
              : loc.rating.region
                ? `Suggested from the ${loc.rating.basis}.`
                : "Couldn't be worked out from the address: please choose."}
          </p>
        </div>
        <ul className="divide-y divide-[#f0f0f0]">
          {blocks.map((b) => (
            <li key={b.range} className="px-6 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[14px] font-medium text-charcoal">
                  {b.label} <span className="ml-1 rounded-sm bg-[#fffbcc] px-1.5 py-0.5 font-mono text-[12px] text-charcoal">{b.range}</span>
                </p>
                <CopyButton text={b.rows.map((r) => r.value).join("\n")} />
              </div>
              <dl className="mt-2 space-y-0.5 text-[12px]">
                {b.rows.map((r) => (
                  <div key={r.label} className="flex gap-3">
                    <dt className="w-36 shrink-0 text-body">{r.label}</dt>
                    <dd className="min-w-0 truncate text-charcoal">{r.value || " "}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
