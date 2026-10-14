# Broker portal

The broker portal lives in the same codebase as the website but runs on its own
subdomain, **portal.ottainsurance.co.nz**. The website's only link to it is the
"Account Login" button in the header.

## What brokers can do

| Page | Path on the subdomain | What it shows |
| --- | --- | --- |
| Sign in | `/login` | Microsoft or Google single sign-on, or email and password |
| Email me a sign-in link | `/login/link` | Forgotten password: emails a one-time link (20 minutes) |
| Request access | `/join` | New brokers ask for an account (see Joining the portal) |
| Welcome | `/welcome?token=…` | A newly approved broker sets their password (link valid 7 days) |
| Your account | `/account` | Their details; change or reset their password |
| Dashboard | `/` | Open quotes, active policies, renewals due, quick links to forms |
| Forms | `/forms` | Every proposal form, renewal declaration, claim form and general form; filter by type and product, search, download |
| Quote requests | `/quotes`, `/quotes/<ref>` | All quote requests with status, details and progress |
| Policies | `/policies`, `/policies/<id>` | Bound policies, status (active, renewal due, expired), documents, renewal and claim shortcuts |
| Documents | `/documents` | Every policy's documents plus product wordings and fact sheets |
| Help & contact | `/help` | Team emails, phone, how to get portal access |

Brokers only ever see their own brokerage's records: every query in
`src/lib/portal/data.ts` is scoped to the signed-in brokerage.

## Online forms

Brokers can fill in, or send a client, these forms (Forms page and
Applications page):

| Form | Portal page | Client link | Website download |
| --- | --- | --- | --- |
| Building Insurance Application | `/forms/building-application` | `/apply/building/...` | `/downloads/building-application.pdf` |
| Landlord Protect Application | `/forms/landlord-protect-application` | `/apply/landlord-protect/...` | `/downloads/landlord-protect-application.pdf` |
| Corporate Travel Proposal | `/forms/corporate-travel-proposal` | `/apply/corporate-travel/...` | `/downloads/corporate-travel-proposal.pdf` |
| Group Personal Accident and Illness Proposal | `/forms/group-personal-accident-proposal` | `/apply/pa-group/...` | `/downloads/group-personal-accident-proposal.pdf` |
| Professional Indemnity Proposal | `/forms/professional-indemnity-proposal` | `/apply/professional-indemnity/...` | `/downloads/professional-indemnity-proposal.pdf` |
| No Claims / Material Changes Declaration | `/forms/no-claims-declaration` | `/apply/no-claims-declaration/...` | `/downloads/no-claims-declaration.pdf` |
| Personal Accident and Illness Claim Form | `/forms/personal-accident-claim` | `/apply/pa-claim/...` | `/downloads/personal-accident-claim.pdf` (Claim Forms page) |

Every form works the same way: validation, the branded PDF (blank or filled),
the email to Otta with the PDF attached, client links and the Applications
pages. Only the building application adds the underwriting worksheet and flood
map links.

**Apply now on the website:** each product page's Apply now button opens
`/solutions/<product>/apply`, which offers "I'm a broker" (the broker portal,
straight to that product's form after signing in) or "Download the proposal
form" (the blank PDF from `/downloads/<form>.pdf`). Only brokers submit
applications, through the portal (or a client link they send). Products
without a proposal form offer the broker portal or the contact page.
(Applications with source `public`, from the earlier direct website form,
still display in the admin portal as "Direct (website)".)

Completed forms go to each form's `teamEmail` (property@, real@ for Landlord
Protect, travel@, liability@, hello@ for declarations), unless
`APPLICATION_TO_EMAIL` is set. In demo mode every email still goes to
`EMAIL_DEMO_TO`.

**Adding a form:** write its questions as data in `src/content/forms/` (see
`corporate-travel.ts`), add it to `onlineForms` in `src/content/forms/index.ts`
and list the products it belongs to in `productSlugs` (that links the blank PDF
on Resources > Proposal Forms). Nothing else needs changing.

## Online building insurance application

`/forms/building-application` is the Building Insurance Application Form as an
online form, in Otta branding.

- Questions live in `src/content/forms/building.ts`. The web form, the
  validation, the email and the PDF are all built from that one file.
- Follow-up questions appear only when they apply (mortgagee name, the pre-1940
  section, multi unit, social housing and mortgagee sale questions).
- **Submit** emails the application to `APPLICATION_TO_EMAIL` (default
  rebecca@tai.co.nz) through Brevo, with the completed form attached as a PDF.
  Replies go to the broker who sent it.
- **Download PDF** works at any point: a blank form prints for filling by hand,
  a partly filled one prints as is.
- The mailing and property address fields suggest NZ addresses as you type,
  and choosing one fills in the post code. Suggestions come from
  `src/lib/address.ts`: Addressfinder if `ADDRESSFINDER_KEY` is set, Google
  Places if `GOOGLE_PLACES_API_KEY` is set, otherwise free OpenStreetMap data.
  Free typing (for example a PO Box) always works.
- The email to Otta also attaches the **underwriting worksheet** (UW Notes,
  V13) as Excel, pre-filled from the application: risk type, broker, insured,
  inception date, interested party, location 1 address and region, sum
  insured, units, landlords chattels and the remaining answers in the Notes
  boxes. Built by `src/lib/uw/worksheet.ts` in Otta branding with the same
  cell positions as the original; levies and totals are formulas using the
  editable Rates sheet. Brokers never receive it; staff can download it from
  the application in the admin portal.
- The email lists **flood mapping** links for the property: the national flood
  hazard viewer and the regional council's flood map for the region worked out
  from the address (`src/content/flood-maps.ts`, `src/lib/nz-region.ts`).
- Every application is saved under **Applications** in the portal (and in the
  admin portal), with its answers and a PDF download.

### Sending the form to a client

From Applications (or the Forms page) a broker chooses **Send to a client**,
enters the client's name and, optionally, their email and a note.

1. Otta creates a secure link to the form on the website
   (`/apply/building/<token>`), valid for 30 days. The token is sealed with
   `SESSION_SECRET`, so it can't be altered or pointed at another brokerage.
2. The link is emailed to the client from Otta (replies go to the broker), or
   the broker copies it and sends it themselves.
3. The client fills in the form on the website with their name, email and the
   brokerage already filled in, and can download a PDF copy.
4. On submit, the application goes straight to Otta (the same email and PDF
   as a broker submission), appears in the broker's Applications marked
   "Completed by client", and the broker gets an email. The link then shows
   "already submitted" so it can't be sent twice.

Applications and links are stored in Neon when `DATABASE_URL` is set (tables
are created automatically). Without it they are kept in memory for the demo;
the emails still always go out.

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

## Joining the portal

1. A broker fills in **Request access** (`/join`): name, work email, phone,
   role, brokerage, FSP number. If the email already has an account they are
   pointed to sign in or a sign-in link instead.
2. If the email domain matches a brokerage already on the portal (free email
   providers such as gmail are never matched), the request is flagged with
   that brokerage.
3. The Otta team gets an email (`BROKER_ACCESS_EMAIL`, default
   hello@ottainsurance.co.nz) and the request appears in the admin portal under
   **Access requests**, with a banner on the Overview. The broker gets a
   "we've received your request" email.
4. Staff approve it (choosing the matched brokerage, another one, or a new
   brokerage) or decline it (the broker is emailed). Approving creates the
   account and emails a welcome link. Staff can also **Invite a broker**
   directly, and resend a welcome email.
5. The broker opens the welcome link, sets a password (10+ characters) and is
   signed in.

**Sign-in links (forgotten password):** "Email me a sign-in link" on the sign-in
page emails a one-time link valid for 20 minutes (the response is the same
whether or not the email has an account; 3 requests per email and IP per 15
minutes). Opening it signs the broker in and takes them to Your account to set
a new password. Links are sealed with `SESSION_SECRET` and recorded when used,
so each works once.

New brokerages, brokers, passwords, access requests and used links are stored
in the `records` table in Neon when `DATABASE_URL` is set (created
automatically); without it they are kept in memory and reset on restart.

## Security

- Sessions: iron-session encrypted cookie, 8 hour lifetime, httpOnly, secure,
  scoped to the portal host only, encrypted with `SESSION_SECRET`.
- **Demo mode** (`PORTAL_DEMO_LOGIN` not `false`): if `SESSION_SECRET` is not set,
  a fallback secret from the source code is used so the demo account works.
  Anyone with the code could forge a session, which is acceptable only while
  the portal holds fictional data. Set `SESSION_SECRET` and
  `PORTAL_DEMO_LOGIN=false` before any real broker data goes in.
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
