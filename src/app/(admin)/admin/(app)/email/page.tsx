import type { Metadata } from "next";
import { Suspense } from "react";
import {
  Card,
  CardHeader,
  LoadingBlocks,
  PageHeader,
} from "@/components/portal/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { env } from "@/lib/env";
import { TestEmailForm } from "./TestEmailForm";

export const metadata: Metadata = { title: "Email check" };

export default function EmailCheckPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={4} />}>
      <EmailCheck />
    </Suspense>
  );
}

type Sender = { email: string; name?: string; active?: boolean };

/** The senders Brevo has on this account, and whether each is verified (active). */
async function brevoSenders(): Promise<{ senders?: Sender[]; error?: string }> {
  if (!env.brevoApiKey)
    return { error: "No BREVO_API_KEY on this deployment." };
  try {
    const res = await fetch("https://api.brevo.com/v3/senders", {
      headers: { "api-key": env.brevoApiKey, accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok)
      return {
        error: `Brevo responded ${res.status}: ${(await res.text()).slice(0, 200)}`,
      };
    const data = (await res.json()) as { senders?: Sender[] };
    return { senders: data.senders ?? [] };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

async function EmailCheck() {
  const admin = await requireAdmin();
  const { senders, error } = await brevoSenders();
  const from = env.enquiryFromEmail.toLowerCase();
  const fromSender = senders?.find((s) => s.email.toLowerCase() === from);
  const where = process.env.VERCEL_ENV ?? "local";

  const rows: { label: string; value: string; ok: boolean; fix?: string }[] = [
    {
      label: "This deployment",
      value:
        where === "production"
          ? "Production"
          : where === "preview"
            ? "Preview (a branch link)"
            : "Local",
      ok: true,
    },
    {
      label: "Brevo API key",
      value: env.brevoApiKey ? "Set" : "Not set: emails are only logged",
      ok: !!env.brevoApiKey,
      fix: "Add BREVO_API_KEY in Vercel for this environment (Production and, to test branch links, Preview), then redeploy.",
    },
    {
      label: "Sending from",
      value: senders
        ? `${env.enquiryFromEmail} (${fromSender ? (fromSender.active === false ? "in Brevo, not verified yet" : "verified in Brevo") : "not a Brevo sender"})`
        : env.enquiryFromEmail,
      ok: !senders || (!!fromSender && fromSender.active !== false),
      fix: "In Brevo, add and verify this sender (or authenticate its domain), or set ENQUIRY_FROM_EMAIL in Vercel to a sender Brevo has verified, then redeploy.",
    },
    {
      label: "Demo mode",
      value: env.emailDemoTo
        ? `On: every email goes to ${env.emailDemoTo}`
        : "Off: emails go to their real recipients",
      ok: true,
    },
    { label: "Website enquiries go to", value: env.enquiryToEmail, ok: true },
    {
      label: "Applications go to",
      value:
        env.applicationToEmail ||
        "Each form's team inbox (property@, travel@, liability@, real@, claims@, hello@)",
      ok: true,
    },
  ];

  return (
    <>
      <PageHeader
        title="Email check"
        description="How this deployment sends email, and a test send that shows exactly what Brevo says."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Set-up" />
          <dl className="divide-y divide-[#f0f0f0]">
            {rows.map((r) => (
              <div key={r.label} className="px-6 py-4">
                <dt className="text-[11px] font-semibold tracking-[0.1em] text-body uppercase">
                  {r.label}
                </dt>
                <dd
                  className={`mt-1 text-[14px] ${r.ok ? "text-charcoal" : "font-medium text-site-purple"}`}
                >
                  {r.value}
                </dd>
                {!r.ok && r.fix && (
                  <dd className="mt-1 text-[13px] text-body">{r.fix}</dd>
                )}
              </div>
            ))}
          </dl>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader title="Send a test" />
            <div className="p-6">
              <TestEmailForm defaultTo={env.emailDemoTo || admin.email} />
            </div>
          </Card>
          <Card>
            <CardHeader title="Senders in Brevo" />
            <div className="px-6 py-4 text-[14px]">
              {error && <p className="text-site-purple">{error}</p>}
              {senders && senders.length === 0 && (
                <p className="text-body">
                  Brevo has no senders on this account yet.
                </p>
              )}
              {senders && senders.length > 0 && (
                <ul className="space-y-1.5">
                  {senders.map((s) => (
                    <li
                      key={s.email}
                      className="flex flex-wrap justify-between gap-2"
                    >
                      <span className="text-charcoal">{s.email}</span>
                      <span
                        className={
                          s.active === false
                            ? "text-site-purple"
                            : "text-[#2e7d74]"
                        }
                      >
                        {s.active === false ? "Not verified" : "Verified"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
