import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Card, CardHeader, LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { access as copy } from "@/content/admin-access";
import { products } from "@/content/products";
import { requireAdmin } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/config";
import { allOrganisations, allUsers } from "@/lib/portal/accounts";
import { productName } from "@/lib/portal/products";
import type { Brokerage, PortalUser } from "@/lib/portal/types";
import { AddOrganisationForm, AddPersonForm, ProductsForm } from "./AccessForms";

export const metadata: Metadata = { title: "Networks and coverholders" };

export default function OrganisationsPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={8} />}>
      <Organisations />
    </Suspense>
  );
}

const productOptions = products.map((p) => ({ slug: p.slug, name: productName(p.slug) }));

async function Organisations() {
  await requireAdmin();
  const [orgs, users] = await Promise.all([allOrganisations(), allUsers()]);
  const networks = orgs.filter((o) => o.kind === "network");
  const coverholders = orgs.filter((o) => o.kind === "coverholder");
  const brokerages = orgs.filter((o) => (o.kind ?? "brokerage") === "brokerage");
  const peopleOf = (id: string) => users.filter((u) => u.brokerageId === id);

  return (
    <>
      <PageHeader title={copy.orgs.title} description={copy.orgs.intro} />

      <h2 className="mb-4 font-heading text-[20px] font-semibold tracking-normal text-charcoal">{copy.orgs.networks}</h2>
      <div className="space-y-6">
        {networks.map((n) => {
          const members = brokerages.filter((b) => b.networkId === n.id);
          return (
            <OrgCard key={n.id} org={n} people={peopleOf(n.id)}>
              <p className="mb-2 text-[12px] font-semibold tracking-[0.1em] text-body uppercase">{copy.orgs.members}</p>
              {members.length === 0 ? (
                <p className="text-[14px] text-body">{copy.orgs.noMembers}</p>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {members.map((b) => (
                    <li key={b.id}>
                      <Link href={adminPath(`/brokers/${b.id}`)} className="inline-block border border-[#d9d9d9] px-3 py-1.5 text-[13px] text-charcoal hover:border-site-teal hover:text-site-teal">
                        {b.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </OrgCard>
          );
        })}
      </div>

      <h2 className="mt-12 mb-4 font-heading text-[20px] font-semibold tracking-normal text-charcoal">{copy.orgs.coverholders}</h2>
      <div className="space-y-6">
        {coverholders.map((c) => (
          <OrgCard key={c.id} org={c} people={peopleOf(c.id)}>
            <p className="mb-3 text-[12px] font-semibold tracking-[0.1em] text-body uppercase">{copy.orgs.products}</p>
            <ProductsForm orgId={c.id} selected={c.productSlugs ?? []} products={productOptions} />
          </OrgCard>
        ))}
      </div>

      <Card className="mt-12">
        <CardHeader title={copy.orgs.create} />
        <div className="px-6 py-6">
          <AddOrganisationForm products={productOptions} />
        </div>
      </Card>
    </>
  );
}

function OrgCard({ org, people, children }: { org: Brokerage; people: PortalUser[]; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader title={org.name} />
      <div className="grid gap-8 px-6 py-6 lg:grid-cols-2">
        <div>{children}</div>
        <div>
          <p className="mb-2 text-[12px] font-semibold tracking-[0.1em] text-body uppercase">{copy.orgs.people}</p>
          {people.length === 0 ? (
            <p className="mb-4 text-[14px] text-body">{copy.orgs.noPeople}</p>
          ) : (
            <ul className="mb-4 divide-y divide-[#eaeaea] border-y border-[#eaeaea]">
              {people.map((u) => (
                <li key={u.id} className="flex flex-wrap justify-between gap-2 py-2.5 text-[14px]">
                  <span className="font-medium text-charcoal">{u.name}</span>
                  <a href={`mailto:${u.email}`} className="text-site-teal hover:underline">
                    {u.email}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <AddPersonForm orgId={org.id} />
        </div>
      </div>
    </Card>
  );
}
