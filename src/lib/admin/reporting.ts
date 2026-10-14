import "server-only";
// Figures for the admin Reporting page: quote conversion (quoted to bound) and
// renewal retention. Live quotes and policies are combined with sample history
// for the past 12 months so the demo has something to chart. When quotes and
// policies come from Neon and InsuredHQ, swap sampleHistory() for real records
// with the same shape.
import { products } from "@/content/products";
import { brokerages, policies, quotes } from "@/lib/portal/demo-data";
import { policyStatus } from "@/lib/portal/status";

export type QuoteOutcome = {
  ref: string;
  productSlug: string;
  brokerageId: string;
  /** Month the quote was issued (YYYY-MM). */
  month: string;
  outcome: "Bound" | "Not taken" | "Open";
  premium: number;
};

export type RenewalOutcome = {
  ref: string;
  productSlug: string;
  brokerageId: string;
  /** Month the policy was due to renew (YYYY-MM). */
  month: string;
  outcome: "Renewed" | "Lapsed" | "Upcoming";
  expiringPremium: number;
  renewedPremium?: number;
};

const ym = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

/** The last `n` months up to and including this month, oldest first. */
export function pastMonths(now: Date, n = 12) {
  return Array.from({ length: n }, (_, i) => ym(new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1)));
}

/** The next `n` months from this month, oldest first. */
export function nextMonths(now: Date, n = 12) {
  return Array.from({ length: n }, (_, i) => ym(new Date(now.getFullYear(), now.getMonth() + i, 1)));
}

export function monthLabel(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-NZ", { month: "short" });
}

// Sample history: steady, seeded so the charts look the same on every load.
function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const profile: Record<string, { quotes: number; bind: number; premium: [number, number]; renewals: number; retention: number }> = {
  "corporate-travel-insurance": { quotes: 5, bind: 0.62, premium: [2500, 9000], renewals: 3, retention: 0.88 },
  "liability-insurance": { quotes: 4, bind: 0.52, premium: [2800, 12000], renewals: 3, retention: 0.9 },
  "rental-property-insurance": { quotes: 6, bind: 0.68, premium: [3500, 15000], renewals: 4, retention: 0.86 },
  "landlord-insurance": { quotes: 5, bind: 0.72, premium: [1800, 6500], renewals: 4, retention: 0.84 },
  "social-and-community-housing-insurance": { quotes: 2, bind: 0.48, premium: [12000, 38000], renewals: 1, retention: 0.92 },
  "personal-accident-insurance": { quotes: 3, bind: 0.45, premium: [1200, 4800], renewals: 2, retention: 0.8 },
};

function sampleHistory(now: Date) {
  const rand = random(2026);
  const months = pastMonths(now, 13).slice(0, 12); // the 12 full months before this one
  const quoteRows: QuoteOutcome[] = [];
  const renewalRows: RenewalOutcome[] = [];
  let n = 0;
  months.forEach((month, mi) => {
    const season = 0.8 + 0.4 * Math.sin((mi / 12) * Math.PI * 2);
    for (const p of products) {
      const pr = profile[p.slug] ?? profile["landlord-insurance"];
      const count = Math.max(0, Math.round(pr.quotes * season + (rand() - 0.5) * 3));
      for (let i = 0; i < count; i++) {
        const premium = Math.round((pr.premium[0] + rand() * (pr.premium[1] - pr.premium[0])) / 10) * 10;
        quoteRows.push({
          ref: `H-Q-${++n}`,
          productSlug: p.slug,
          brokerageId: brokerages[Math.floor(rand() * brokerages.length)].id,
          month,
          outcome: rand() < pr.bind + (mi / 12) * 0.06 ? "Bound" : "Not taken",
          premium,
        });
      }
      const due = Math.max(0, Math.round(pr.renewals + (rand() - 0.5) * 2.5));
      for (let i = 0; i < due; i++) {
        const expiring = Math.round((pr.premium[0] + rand() * (pr.premium[1] - pr.premium[0])) / 10) * 10;
        const renewed = rand() < pr.retention;
        renewalRows.push({
          ref: `H-R-${++n}`,
          productSlug: p.slug,
          brokerageId: brokerages[Math.floor(rand() * brokerages.length)].id,
          month,
          outcome: renewed ? "Renewed" : "Lapsed",
          expiringPremium: expiring,
          renewedPremium: renewed ? Math.round((expiring * (1.02 + rand() * 0.07)) / 10) * 10 : undefined,
        });
      }
    }
  });
  return { quoteRows, renewalRows };
}

function issuedMonth(history: { date: string; event: string }[], fallback: string) {
  return (history.find((h) => /quote issued/i.test(h.event))?.date ?? fallback).slice(0, 7);
}

export async function reportingData(now: Date) {
  const { quoteRows, renewalRows } = sampleHistory(now);
  const premiumOf = new Map(policies.map((p) => [p.id, p.premium]));
  const live: QuoteOutcome[] = quotes
    .filter((q) => q.status === "Quoted" || q.status === "Bound")
    .map((q) => ({
      ref: q.ref,
      productSlug: q.productSlug,
      brokerageId: q.brokerageId,
      month: issuedMonth(q.history, q.submitted),
      outcome: q.status === "Bound" ? "Bound" : "Open",
      premium: (q.policyId && premiumOf.get(q.policyId)) || 0,
    }));
  const upcoming: RenewalOutcome[] = policies
    .filter((p) => policyStatus(p, now) !== "Expired")
    .map((p) => ({
      ref: p.number,
      productSlug: p.productSlug,
      brokerageId: p.brokerageId,
      month: p.end.slice(0, 7),
      outcome: "Upcoming",
      expiringPremium: p.premium,
    }));
  return {
    quotes: [...quoteRows, ...live],
    renewals: [...renewalRows, ...upcoming],
    sample: true,
  };
}
