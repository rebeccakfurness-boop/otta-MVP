import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Card, CardHeader, DetailList, LoadingBlocks, PageHeader, Timeline } from "@/components/portal/ui";
import { feedbackCopy as copy, feedbackTypes } from "@/content/admin-feedback";
import { requireAdmin } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/config";
import { complaintTargets, getFeedback, nzToday } from "@/lib/feedback";
import { productName } from "@/lib/portal/products";
import { formatDate } from "@/lib/portal/status";
import { FeedbackBadges } from "../FeedbackBadges";
import { UpdateComplaintForm } from "../FeedbackForms";

export const metadata: Metadata = { title: "Compliments and complaints" };

export default function FeedbackEntryPage({ params }: PageProps<"/admin/feedback/[id]">) {
  return (
    <Suspense fallback={<LoadingBlocks rows={6} />}>
      <Entry params={params} />
    </Suspense>
  );
}

const when = (date: string) => new Date(date).toLocaleString("en-NZ", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Pacific/Auckland" });

async function Entry({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const entry = await getFeedback((await params).id);
  if (!entry) notFound();
  const today = nzToday();
  const targets = entry.type === "complaint" ? complaintTargets(entry, today) : null;
  const details = [
    { label: "Received", value: `${formatDate(entry.receivedOn)} by ${entry.channel.toLowerCase()}` },
    { label: "From", value: `${entry.fromName} (${entry.fromType})` },
    ...(entry.organisation ? [{ label: "Brokerage or company", value: entry.organisation }] : []),
    ...(entry.productSlug ? [{ label: "Product", value: productName(entry.productSlug) }] : []),
    ...(entry.policyRef ? [{ label: "Policy or claim", value: entry.policyRef }] : []),
    ...(entry.category ? [{ label: "About", value: entry.category }] : []),
    ...(entry.about ? [{ label: "About", value: entry.about }] : []),
    { label: "Logged by", value: entry.loggedBy },
  ];

  return (
    <>
      <PageHeader
        back={{ href: adminPath(entry.type === "complaint" ? "/feedback?type=complaint" : "/feedback?type=compliment"), label: copy.back }}
        title={`${feedbackTypes[entry.type]} from ${entry.fromName}`}
        description={
          <span className="flex flex-wrap items-center gap-3">
            {entry.reference} <FeedbackBadges entry={entry} today={today} />
          </span>
        }
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <Card>
            <CardHeader title={entry.type === "complaint" ? "The complaint" : "What they said"} />
            <p className="px-6 pt-6 text-[15px] leading-relaxed whitespace-pre-line text-charcoal">{entry.summary}</p>
            <DetailList items={details} />
          </Card>
          {entry.type === "complaint" && (
            <Card>
              <CardHeader title={copy.update} />
              <p className="px-6 pt-5 text-[14px] text-body">{copy.updateIntro}</p>
              <UpdateComplaintForm
                today={today}
                complaint={{ id: entry.id, status: entry.status ?? "open", acknowledgedOn: entry.acknowledgedOn, resolvedOn: entry.resolvedOn, outcome: entry.outcome, rootCause: entry.rootCause }}
              />
            </Card>
          )}
        </div>
        <div className="space-y-8">
          {targets && (
            <Card>
              <CardHeader title="Targets" />
              <DetailList
                items={[
                  { label: "Acknowledge by", value: entry.acknowledgedOn ? `Done ${formatDate(entry.acknowledgedOn)}` : formatDate(targets.acknowledgeBy) },
                  { label: "Resolve by", value: entry.resolvedOn ? `Done ${formatDate(entry.resolvedOn)}` : formatDate(targets.resolveBy) },
                ]}
              />
              <p className="px-6 pb-6 text-[13px] leading-relaxed text-body">{copy.targets.note}</p>
            </Card>
          )}
          <Card>
            <CardHeader title={copy.history} />
            <Timeline items={entry.history} format={when} />
          </Card>
        </div>
      </div>
    </>
  );
}
