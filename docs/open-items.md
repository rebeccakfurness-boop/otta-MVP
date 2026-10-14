# Open items

Placeholders in the prototype that need real content or decisions. Search the code for
`TODO(` to find each one.

## Content (Stage 2)
- **Claims page**: the intro paragraph and claim forms blurb are draft copy; the original mockup used admin@tai.co.nz, now the Otta claims address.
- **Contact page**: intro paragraph drawn from the product copy.
- **Claims email**: domain confirmed as `ottainsurance.co.nz`; the claims address `claims@ottainsurance.co.nz` is assumed and needs confirming. Brevo must be set up to send from `no-reply@ottainsurance.co.nz` (or change `ENQUIRY_FROM_EMAIL`).
- **Important information**: Fair Insurance Code, cooling off, dispute resolution, complaints and FSP number wording (`src/content/legal.ts`), plus the Fair Insurance Code and Complaints pages.
- **About us**: the three values (Forward thinking, Re-invention, Continuous Improvement) are draft copy; "The Otta success story" needs its story.
- **Partners**: partner names are shown as text tiles until logos are supplied.
- **Our Team**: all twelve members are listed; photos still needed for Shabnam, Michelle, Jemma, Gaby, Carmel and Jen (`src/content/team.ts`, `public/team/`).
- **Case Studies**: copy and photos.
- **Hero video**: `public/media/hero.mp4` is a watermarked, low-resolution iStock preview (iStock 1390591506) used as a placeholder. License the full clip (or replace it) and swap both `hero.mp4` and `hero-poster.jpg` before launch.
- **Photography**: product pages, the home page product columns, property banner and About Us banner now use real photos (`public/images/`, set per product in `products.ts`). Still placeholders: the Case Studies page images and the About us page values (the home page case study uses a stock photo for now). Confirm the stock photo licences.
- **Home page case study**: heading, summary and copy are placeholders.
- **Documents**: policy wordings are in (rebranded from TAI, `public/documents/policy-wordings/`, listed in `src/content/documents.ts`). Still needed: fact sheets, claim forms, and a proposal form for Personal Accident. The Landlord Protect application and the No Claims / Material Changes Declaration (Renewal Declarations) are online forms with PDF downloads.
- **Professional Indemnity proposal**: the TAI form asked "Does any one client account for more than 25% of your annual income?" twice; the second (under Contractual Agreements, followed by "if yes, please provide a copy") is worded online as "Do you use a standard contractual agreement with your clients?". Please confirm.
- **Policy wordings, please check before publishing**: the legal wording is unchanged and still names Insurance Wholesale Limited as coverholder. Contact details were changed as follows and need confirming: TAIClaims@gbtpa.co.nz (Gallagher Bassett) to claims@ottainsurance.co.nz; admin@, claims@ and craigf@tai.co.nz to the same names @ottainsurance.co.nz; www.tai.co.nz to www.ottainsurance.co.nz; the cover address (3 Morton Street) to 3/527A Rosebank Road. The Property wording is linked to Rental Property, Social and Community Housing and Landlord; the Inbound Workers wording to Corporate Travel.
- **Product page "Why choose Otta" text**: the paragraph under each statement is draft copy drawn from the product summaries (`statementDetails` in `products.ts`).
- **Coverage taglines**: only Corporate Travel had one in the mockup ("Smart organisations don't leave home without Otta onboard."); the others are drafts in `products.ts`.

## Wording changed from the Hummi mockup
- All "Hummi" and "TAI" references now say "Otta".
- "keeps business and life humming" → "keeps business and life moving".
- "keeps Company Name in tune" → "keeps Company Name moving".
- Lorem ipsum on the home page replaced with draft copy drawn from the product summaries.

## Steve the otter (chatbot)
- **Temporary**: the chat offers Brad (normal answers) or Steve (pub replies only, no AI). Turn it off with `enabled: false` in `chatPersonas` in `src/content/steve-ui.ts`.
- Add `ANTHROPIC_API_KEY` in Vercel (Settings, Environment Variables) to switch Steve from built-in keyword answers to Claude.
- Have compliance review Steve's instructions in `src/content/steve.ts` (general information only, no advice, no personal details) and the disclaimer under the chat box.
- The rate limit is per server instance and best effort; add a shared store (for example Vercel KV) if traffic grows.

## Broker portal
- The demo account works now using a demo-only fallback secret. Before any real broker data: set `SESSION_SECRET` and `PORTAL_DEMO_LOGIN=false` in Vercel.
- Set `NEXT_PUBLIC_PORTAL_HOST` in Vercel and add the `portal.ottainsurance.co.nz` domain (see `docs/broker-portal.md`).
- Explore an InsuredHQ (IHQ-API) integration: draft quotes from portal forms, live policy counts and documents. Needs IHQ API access and documentation.
- Register the Microsoft and Google SSO apps.
- Replace the demo brokerage, quotes and policies with Neon Postgres; upload forms and documents (Vercel Blob).
- Decide how brokers request quotes online (currently via proposal forms).
- **Broker onboarding**: add the Neon integration (`DATABASE_URL`) before approving real brokers, or new accounts and passwords reset on each deploy. Set `BROKER_ACCESS_EMAIL` if access requests should go somewhere other than hello@ottainsurance.co.nz.

- Building insurance application: add `BREVO_API_KEY` in Vercel and verify `no-reply@ottainsurance.co.nz` (or the `ENQUIRY_FROM_EMAIL` address) as a sender in Brevo, or emails will be rejected. Change `APPLICATION_TO_EMAIL` if applications should go somewhere other than rebecca@tai.co.nz.
- **Demo emails**: while `PORTAL_DEMO_LOGIN` is on, every email goes to rebecca@tai.co.nz with a "[Demo for ...]" subject. Set `EMAIL_DEMO_TO=off` at go-live so client links and broker notices reach their real recipients.
- **Save applications permanently**: add the Neon integration in Vercel (sets `DATABASE_URL`). Until then, the Applications lists reset when the server restarts.
- **Address suggestions**: currently free OpenStreetMap data, which can miss newer addresses. For production, sign up to Addressfinder (addressfinder.nz) and set `ADDRESSFINDER_KEY` and `ADDRESSFINDER_SECRET` in Vercel.
- **Underwriting worksheet**: confirm the levy rates and caps on the Rates sheet (FSL 0.1074 per $100 was taken from the V13 sheet; NHI 0.16 per $100 capped at $300,000; FSL cap $100,000) and the binder number and dates. Premium per unit is left for the underwriter because the V13 rating tables weren't supplied: send the original .xlsx to bring its rating formulas across. Broker street address, city and post code stay blank until brokerage addresses are stored.
- **Flood map links** (`src/content/flood-maps.ts`): confirm each council link. Regions without their own link (Bay of Plenty, Gisborne, Hawke's Bay, Taranaki, Wellington, Marlborough, West Coast, Southland) currently point to the Natural Hazards Portal council directory; add their direct viewer links.
- **Team inboxes**: online forms are emailed to property@, real@ (Landlord Protect), travel@, liability@ and hello@ottainsurance.co.nz. Make sure these mailboxes exist before turning off demo email.
- Have the declaration and duty of disclosure wording on the application form reviewed for Otta (it is carried over from the TAI form).

## Admin portal
- **Underwriting assistant**: add `ANTHROPIC_API_KEY` in Vercel to switch on the AI brief (a few cents per application); until then the built-in checks write it. The assistant follows the July 2026 underwriting guide (summarised in `src/content/uw-assistant.ts`); update that summary when the guide changes. Still assumptions, not from the guide: the rebuild cost rule of thumb ($3,000 to $5,000 per square metre) and the binder period (23 October 2025 to 1 December 2026, from the V13 sheet). The proposal form asks about 3 years of claims while the guide's referral triggers use 5: consider changing the form question.
- **Rating regions**: spot-check the suburb and post code mapping in `src/lib/uw/rating-region.ts`, especially the Auckland City and Wellington splits and the edges between Canterbury, Otago and Southland regions.
- Set `NEXT_PUBLIC_ADMIN_HOST` in Vercel and add the `admin.ottainsurance.co.nz` domain (see `docs/admin-portal.md`).
- Register staff SSO (Microsoft 365 tenant or Google Workspace) and set the `ADMIN_*` keys.
- Replace the demo staff account with real staff users before any real data is loaded.
- Manual entry screens (add or edit a policy or quote) and the InsuredHQ sync job once Neon is in place.

## Website search
- The search index is built from `src/content/` (products, `search.ts` for other pages). Add new pages to `src/content/search.ts`.

## Coming Soon gate (temporary)
- Every page, portal and document shows the Coming Soon screen until the team signs in ("Team sign in", bottom right). Sign-in lasts 30 days and covers www, portal and admin on ottainsurance.co.nz.
- The default password is in `src/lib/gate/config.ts`. Set `SITE_PASSWORD` in Vercel to change it (everyone is signed out when it changes).
- **At launch**: set `SITE_GATE=off` in Vercel and redeploy.

## Later stages
- Compliance review (Privacy Act 2020, FMC Act, Fair Trading Act, CoFI, etc.).
- Remove `robots: noindex` in `src/app/layout.tsx` at launch.
