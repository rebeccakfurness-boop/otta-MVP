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
