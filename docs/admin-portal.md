# Admin portal

The Otta staff back office. It runs on its own subdomain
(`admin.ottainsurance.co.nz`) with its own sign-in, and reads the same data as
the broker portal, so what staff see is exactly what brokers see.

## What staff can do

- **Overview**: active policies, renewals due, open quote requests and premium
  in force, split by product. Every number links through to the matching list.
- **Policies** and **Quote requests**: every record across all brokers, with
  product tabs, status filters and search (insured, policy number, broker or
  InsuredHQ reference).
- **Brokers**: search brokerages and their users, open a brokerage to see its
  policies and quotes, or open **Broker view** to see the portal exactly as that
  brokerage sees it (read only).
- **Documents** and **Forms**: every policy document by product, and the forms
  library brokers use.
- **Data sources**: which records came from InsuredHQ and which were entered
  manually.

## Demo data

While the portals are in demo mode (`PORTAL_DEMO_LOGIN` not `false`), the first
read of the applications loads sample data (`src/lib/applications/demo-seed.ts`):
ten applications across every online form (four building applications that show
the underwriting assistant's accept, refer and mortgagee sale outcomes, a client
completed social housing application, Landlord Protect, Corporate Travel, Group
PA, Professional Indemnity, a No Claims declaration and a PA claim), client links
and two brokers waiting for portal access. Everything in it is fictional. Set
`DEMO_DATA=off` to start empty. Without `DATABASE_URL` the sample data reloads
whenever the server restarts; with Neon it loads once.

## Underwriting assistant

Every building insurance application gets an AI brief, written in the
background as soon as it is submitted (`src/lib/uw/brief.ts`, instructions in
`src/content/uw-assistant.ts`). It applies the Coverholder Underwriting
Guidelines, Property and Landlord Risks (version 05, July 2026), the source of
truth for property underwriting: the instructions summarise the guide's rules
(limits, referral triggers, premises and age rules, flood, excesses and
earthquake deductibles, endorsements, mortgagee sales, connected units, body
corporates) and cite its sections. Update them when the guide changes. On the
application page in the admin portal:

- **The brief**: a recommendation (within binder authority, refer, outside the
  binder), a summary, red flags by severity with the guide section, suggested
  terms (subjectivities, endorsements, excesses including the earthquake site
  deductible, loadings, mortgagee sale premiums), what's still needed from the
  broker, and a
  draft email to the broker (copy it, or open it in your email app). "Write
  again" rewrites it. The underwriter makes every decision.
- **Copy into the V13 worksheet**: the yellow boxes as blocks that line up with
  the V13 worksheet (C7, C11:C12, C25:C26, F25, C31:C38, C41:C48, C49:C50
  suggested subjectivity and endorsements, C56, B86),
  skipping its formula cells. Copy a block, click its first cell in V13 and
  paste: only values go in, so the formatting, dropdowns and formulas stay.
- **Region (C35)**: worked out from the suburb, town or post code as one of the
  47 V13 rating regions (`src/content/rating-regions.ts`,
  `src/lib/uw/rating-region.ts`). The underwriter can change it; the copy
  blocks and the Excel download follow their choice. In the Excel worksheet the
  Region cells are a dropdown of the same 47 regions (Lists sheet).
- **V13 worksheet (Excel)** includes the brief's notes in the "Underwriter use
  only" box.

Flood map links follow the guide's table by rating region
(`src/content/flood-maps.ts`); where the guide says no council mapping exists
(Palmerston North, Wanganui, Dunedin) the brief asks for the property's flood
history instead.

The brief is written by Claude (`claude-opus-5-5`) when `ANTHROPIC_API_KEY` is
set. Without it, or if the AI call fails, built-in rule checks write a simpler
brief so the page always works. Briefs are stored in the `records` table
(collection `uw-briefs`).

## How it is wired

- Pages live in `src/app/(admin)/admin/`; data reads in `src/lib/admin/data.ts`
  (unscoped versions of the broker portal reads in `src/lib/portal/data.ts`).
- `src/proxy.ts` maps `NEXT_PUBLIC_ADMIN_HOST` to `/admin`, exactly as it does
  for the portal. Without the variable, admin is served at `/admin`.
- Sessions use a separate cookie (`otta_admin_session`), so a broker sign-in
  never opens admin and an admin sign-in never opens the broker portal.
- Each record carries `source` (`ihq` or `manual`) and, for InsuredHQ records,
  `ihqRef`. Once Neon is in place both the sync job and manual entry write to
  the same tables.

## Security

- Staff SSO only accepts `@ottainsurance.co.nz` accounts (Google `hd` claim,
  Microsoft tenant set by `ADMIN_MICROSOFT_TENANT_ID`).
- Password sign-in uses bcrypt hashes and is throttled.

## Going live

1. Set `SESSION_SECRET` and `PORTAL_DEMO_LOGIN=false` in Vercel.
2. Set `NEXT_PUBLIC_ADMIN_HOST=admin.ottainsurance.co.nz` and add the domain to
   the Vercel project.
3. Register the staff SSO apps with redirect URIs
   `https://admin.ottainsurance.co.nz/auth/microsoft/callback` and
   `https://admin.ottainsurance.co.nz/auth/google/callback`.

## Demo account (prototype only)

`admin@ottainsurance.co.nz` / `OttaAdmin2026!`
