import type { Metadata } from "next";
import { Icon } from "@/components/portal/Icon";
import { Card, CardHeader, PageHeader } from "@/components/portal/ui";
import { site } from "@/content/site";
import { contactTeams } from "@/content/steve-ui";
import { portalPath } from "@/lib/portal/config";

export const metadata: Metadata = { title: "Help & contact" };

export default function HelpPage() {
  return (
    <>
      <PageHeader title="Help & contact" description="Talk directly to the underwriters who make the decisions." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Email the right team" />
          <ul className="divide-y divide-[#eaeaea]">
            {contactTeams.map((t) => (
              <li key={t.email} className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-[15px] font-medium text-charcoal">{t.label}</span>
                <a href={`mailto:${t.email}`} className="inline-flex items-center gap-2 text-[14px] text-site-teal hover:underline">
                  <Icon name="mail" className="h-4 w-4" />
                  {t.email}
                </a>
              </li>
            ))}
          </ul>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader title="Call us" />
            <div className="px-6 py-5">
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 font-heading text-[22px] font-bold text-charcoal">
                <Icon name="phone" className="h-5 w-5 text-site-teal" />
                {site.phone}
              </a>
              <p className="mt-2 text-[13px] text-body">Claims: {site.claimsEmail}</p>
            </div>
          </Card>
          <Card>
            <CardHeader title="Portal access" />
            <p className="px-6 py-5 text-[14px] leading-relaxed text-body">
              Colleagues can ask for their own account from the{" "}
              <a href={portalPath("/join")} className="text-site-teal hover:underline">
                Request access
              </a>{" "}
              page. Change your password in{" "}
              <a href={portalPath("/account")} className="text-site-teal hover:underline">
                Your account
              </a>
              , or use &ldquo;Email me a sign-in link&rdquo; on the sign-in page if you&apos;ve forgotten it. To set up single sign-on for your brokerage, email{" "}
              <a href={`mailto:${site.email}?subject=${encodeURIComponent("Broker portal access")}`} className="text-site-teal hover:underline">
                {site.email}
              </a>
              .
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
