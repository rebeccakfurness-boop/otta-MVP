import { complaintStatuses, feedbackTypes } from "@/content/admin-feedback";
import { readAdminSession } from "@/lib/admin/session";
import { listFeedback } from "@/lib/feedback";
import { productName } from "@/lib/portal/products";

// The whole compliments and complaints register as a CSV, for reporting (Otta staff only).
export async function GET() {
  if (!(await readAdminSession())) return new Response("Please sign in again.", { status: 401 });
  const entries = await listFeedback();
  const columns = [
    "Reference", "Type", "Received", "From", "They are a", "Brokerage or company", "Channel", "Product", "Policy or claim",
    "About", "Summary", "Status", "Acknowledged", "Resolved", "Outcome", "Root cause", "Logged by",
  ];
  const rows = entries.map((f) => [
    f.reference, feedbackTypes[f.type], f.receivedOn, f.fromName, f.fromType, f.organisation, f.channel,
    f.productSlug ? productName(f.productSlug) : "", f.policyRef, f.category ?? f.about, f.summary,
    f.status ? complaintStatuses[f.status] : "", f.acknowledgedOn, f.resolvedOn, f.outcome, f.rootCause, f.loggedBy,
  ]);
  const cell = (v: string | undefined) => {
    const s = (v ?? "").replace(/^[=+\-@]/, "'$&");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [columns, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  return new Response(`﻿${csv}\r\n`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="otta-compliments-and-complaints-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store",
    },
  });
}
