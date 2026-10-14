import type { Metadata } from "next";
import { Suspense } from "react";
import {
  Card,
  EmptyState,
  LoadingBlocks,
  PageHeader,
} from "@/components/portal/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { listEnquiries, type Enquiry } from "@/lib/enquiries";
import { formatDate } from "@/lib/portal/status";
import { HandledButton } from "./HandledButton";

export const metadata: Metadata = { title: "Enquiries" };

export default function EnquiriesPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={6} />}>
      <Enquiries />
    </Suspense>
  );
}

const emailLabel: Record<Enquiry["emailed"], { text: string; tone: string }> = {
  sent: { text: "Emailed", tone: "text-[#2e7d74]" },
  "not-sent": { text: "Not emailed (email sending off)", tone: "text-body" },
  failed: { text: "Email failed", tone: "text-site-purple" },
};

async function Enquiries() {
  await requireAdmin();
  const enquiries = await listEnquiries();
  const open = enquiries.filter((e) => !e.handledAt);
  const done = enquiries.filter((e) => e.handledAt);
  const list = (items: Enquiry[]) => (
    <ul className="divide-y divide-[#eaeaea]">
      {items.map((e) => (
        <li key={e.id} className="px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-charcoal">
                {e.name}
                {e.company && (
                  <span className="font-normal text-body"> · {e.company}</span>
                )}
              </p>
              <p className="text-[14px] text-body">
                <a
                  href={`mailto:${e.email}?subject=${encodeURIComponent(`Your enquiry to Otta`)}`}
                  className="text-[#2e7d74] hover:underline"
                >
                  {e.email}
                </a>
                {e.phone && (
                  <>
                    {" "}
                    ·{" "}
                    <a href={`tel:${e.phone}`} className="hover:text-site-teal">
                      {e.phone}
                    </a>
                  </>
                )}
              </p>
              <p className="mt-1 text-[13px] font-medium text-charcoal">
                {e.enquiryType}
                {e.product && (
                  <span className="font-normal text-body"> · {e.product}</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-body">
                {formatDate(e.createdAt)}
              </span>
              <HandledButton id={e.id} handled={!!e.handledAt} />
            </div>
          </div>
          <p className="mt-3 border-l-2 border-[#eaeaea] pl-3 text-[14px] leading-relaxed whitespace-pre-line text-charcoal">
            {e.message}
          </p>
          <p className="mt-2 text-[12px]">
            <span className={emailLabel[e.emailed].tone}>
              {emailLabel[e.emailed].text}
            </span>
            {e.handledAt && (
              <span className="text-body">
                {" "}
                · Handled by {e.handledBy}, {formatDate(e.handledAt)}
              </span>
            )}
          </p>
        </li>
      ))}
    </ul>
  );
  return (
    <>
      <PageHeader
        title="Enquiries"
        description="Messages sent from the website's Contact Us page. Each one is also emailed to the team."
      />
      <div className="space-y-6">
        <Card>
          <div className="border-b border-[#eaeaea] px-6 py-4">
            <h2 className="font-heading text-[18px] font-semibold tracking-normal text-charcoal">
              Open ({open.length})
            </h2>
          </div>
          {open.length ? (
            list(open)
          ) : (
            <EmptyState title="No open enquiries">
              New messages from the Contact Us page appear here.
            </EmptyState>
          )}
        </Card>
        {done.length > 0 && (
          <Card>
            <div className="border-b border-[#eaeaea] px-6 py-4">
              <h2 className="font-heading text-[18px] font-semibold tracking-normal text-charcoal">
                Handled ({done.length})
              </h2>
            </div>
            {list(done)}
          </Card>
        )}
      </div>
    </>
  );
}
