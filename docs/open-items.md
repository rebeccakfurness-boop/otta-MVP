# Open items

Placeholders in the prototype that need real content or decisions. Search the code for
`TODO(` to find each one.

## Content (Stage 2)
- **Claims phone number**: source copy says "0800 xxx xxxx" (`src/content/site.ts`).
- **Claims page**: the intro paragraph and claim forms blurb are draft copy; the original mockup used admin@tai.co.nz, now the Otta claims address.
- **Contact page**: intro paragraph drawn from the product copy.
- **Claims email**: domain confirmed as `ottainsurance.co.nz`; the claims address `claims@ottainsurance.co.nz` is assumed and needs confirming. Brevo must be set up to send from `no-reply@ottainsurance.co.nz` (or change `ENQUIRY_FROM_EMAIL`).
- **Important information**: Fair Insurance Code, cooling off, dispute resolution, complaints and FSP number wording (`src/content/legal.ts`), plus the Fair Insurance Code and Complaints pages.
- **About us**: the three values (Forward thinking, Re-invention, Continuous Improvement) are draft copy; "The Otta success story" needs its story.
- **Partners**: partner names are shown as text tiles until logos are supplied.
- **Our Team**: all twelve members are listed; photos still needed for Rosanna, Shabnam, Michelle, Jemma, Gaby, Carmel and Jen (`src/content/team.ts`, `public/team/`).
- **Case Studies**: copy and photos.
- **Hero video**: `public/media/hero.mp4` is a watermarked, low-resolution iStock preview (iStock 1390591506) used as a placeholder. License the full clip (or replace it) and swap both `hero.mp4` and `hero-poster.jpg` before launch.
- **Photography**: all images are placeholders (soft teal blocks labelled "placeholder image").
- **Home page case study**: heading, summary and copy are placeholders.
- **Documents**: PDFs for fact sheets, policy wordings, proposal forms, renewal declarations and claim forms.
- **Product page "Why choose Otta" text**: the paragraph under each statement is draft copy drawn from the product summaries (`statementDetails` in `products.ts`).
- **Product page photos**: each product needs a hero image (left half of the page).
- **Coverage taglines**: only Corporate Travel had one in the mockup ("Smart organisations don't leave home without Otta onboard."); the others are drafts in `products.ts`.

## Wording changed from the Hummi mockup
- All "Hummi" and "TAI" references now say "Otta".
- "keeps business and life humming" → "keeps business and life moving".
- "keeps Company Name in tune" → "keeps Company Name moving".
- Lorem ipsum on the home page replaced with draft copy drawn from the product summaries.

## Steve the otter (chatbot)
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

- Building insurance application: add `BREVO_API_KEY` in Vercel and verify `no-reply@ottainsurance.co.nz` (or the `ENQUIRY_FROM_EMAIL` address) as a sender in Brevo, or emails will be rejected. Change `APPLICATION_TO_EMAIL` if applications should go somewhere other than rebecca@tai.co.nz.
- Have the declaration and duty of disclosure wording on the application form reviewed for Otta (it is carried over from the TAI form).

## Admin portal
- Set `NEXT_PUBLIC_ADMIN_HOST` in Vercel and add the `admin.ottainsurance.co.nz` domain (see `docs/admin-portal.md`).
- Register staff SSO (Microsoft 365 tenant or Google Workspace) and set the `ADMIN_*` keys.
- Replace the demo staff account with real staff users before any real data is loaded.
- Manual entry screens (add or edit a policy or quote) and the InsuredHQ sync job once Neon is in place.

## Later stages
- Compliance review (Privacy Act 2020, FMC Act, Fair Trading Act, CoFI, etc.).
- Remove `robots: noindex` in `src/app/layout.tsx` at launch.
