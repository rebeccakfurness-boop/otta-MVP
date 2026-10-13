# Broker portal

The broker portal lives in the same codebase as the website but runs on its own
subdomain, **portal.ottainsurance.co.nz**. The website's only link to it is the
"Account Login" button in the header.

## What brokers can do

| Page | Path on the subdomain | What it shows |
| --- | --- | --- |
| Sign in | `/login` | Microsoft or Google single sign-on, or email and password |
| Dashboard | `/` | Open quotes, active policies, renewals due, quick links to forms |
| Forms | `/forms` | Every proposal form, renewal declaration, claim form and general form; filter by type and product, search, download |
| Quote requests | `/quotes`, `/quotes/<ref>` | All quote requests with status, details and progress |
| Policies | `/policies`, `/policies/<id>` | Bound policies, status (active, renewal due, expired), documents, renewal and claim shortcuts |
| Documents | `/documents` | Every policy's documents plus product wordings and fact sheets |
| Help & contact | `/help` | Team emails, phone, how to get portal access |

Brokers only ever see their own brokerage's records: every query in
`src/lib/portal/data.ts` is scoped to the signed-in brokerage.

## How it is wired

- `src/proxy.ts` maps the portal subdomain onto the `/portal` routes
  (`portal.ottainsurance.co.nz/quotes` serves `/portal/quotes`), redirects any
  `/portal` URL on the website to the subdomain, and sends signed-out visitors to
  the sign-in page.
- Without `NEXT_PUBLIC_PORTAL_HOST` (local development, Vercel previews) the
  portal is served at `/portal` on the same host instead.
- Portal pages live in `src/app/(portal)/portal/`; the website lives in
  `src/app/(site)/`. The two have separate layouts, so nothing in the portal
  changes the website.
- Build every portal link with `portalPath()` from `src/lib/portal/config.ts`.
- After sign-in and sign-out the browser does a full page load
  (`window.location`), because a server-side redirect would skip the subdomain
  mapping.

## Security

- Sessions: iron-session encrypted cookie, 8 hour lifetime, httpOnly, secure,
  scoped to the portal host only. Needs `SESSION_SECRET`.
- Passwords: bcrypt hashes; the same error for unknown email and wrong password;
  5 failed attempts per email and IP per 15 minutes.
- Single sign-on (arctic, OAuth with PKCE and state):
  - **Google**: only verified Google Workspace accounts whose workspace domain
    matches a brokerage domain.
  - **Microsoft**: the account's Entra tenant ID must be listed on the
    brokerage (`microsoftTenantIds`), so an outside tenant can't claim a
    brokerage's email domain.
- Every page checks the session on the server; the proxy check is only a fast
  first pass.

## Going live

1. **Domain**: in Vercel, Project, Settings, Domains, add
   `portal.ottainsurance.co.nz`, then add the CNAME record Vercel shows at the
   DNS provider.
2. **Environment variables** (Vercel, Settings, Environment Variables):
   - `SESSION_SECRET`: a random 32+ character string (`openssl rand -base64 32`).
   - `NEXT_PUBLIC_PORTAL_HOST`: `portal.ottainsurance.co.nz`
   - Redeploy after adding them.
3. **Microsoft sign-in** (Microsoft Entra admin centre, App registrations):
   new multi-tenant app, redirect URI
   `https://portal.ottainsurance.co.nz/auth/microsoft/callback`, create a client
   secret, then set `PORTAL_MICROSOFT_CLIENT_ID` and
   `PORTAL_MICROSOFT_CLIENT_SECRET`. Add each brokerage's tenant ID to its
   record.
4. **Google sign-in** (Google Cloud console, Credentials, OAuth client ID, web
   application): redirect URI
   `https://portal.ottainsurance.co.nz/auth/google/callback`, then set
   `PORTAL_GOOGLE_CLIENT_ID` and `PORTAL_GOOGLE_CLIENT_SECRET`.
5. **Real data**: replace the demo arrays in `src/lib/portal/demo-data.ts` with
   Neon Postgres queries in `src/lib/portal/data.ts`, upload documents and
   forms to Vercel Blob, then set `PORTAL_DEMO_LOGIN=false` and remove the demo
   user.

## Demo account (prototype only)

Email `demo@harbourbrokers.co.nz`, password `OttaDemo2026!`. All brokerages,
quotes and policies in the prototype are fictional.
