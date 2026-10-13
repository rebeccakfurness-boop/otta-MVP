# Otta website

Public website and broker portal for **Otta: Insurance that works**.

Built on the stack in the Otta technology proposal: Next.js + TypeScript, Tailwind CSS,
GitHub, Vercel, with Zod for form validation and Brevo for email. The broker portal uses iron-session, bcryptjs and arctic (Microsoft and Google SSO); Neon Postgres and Vercel Blob are next.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional; the site runs without any env vars
npm run dev                  # http://localhost:3000
```

Before pushing: `npm run check` (lint + typecheck). CI runs lint, typecheck and build on every PR.

## Where things live

| What | Where |
| --- | --- |
| Brand colours and font | `src/app/globals.css` (`@theme` tokens), `src/app/layout.tsx` (Raleway) |
| Logos | `public/brand/` |
| Navigation, phone, email, address | `src/content/site.ts` |
| Product page copy (all six solutions) | `src/content/products.ts` |
| Compliance / important information text | `src/content/legal.ts` |
| Page templates | `src/app/**/page.tsx` |
| Shared UI (header, footer, buttons…) | `src/components/` |
| Steve the otter chatbot (persona, knowledge, popup, API route) | `src/content/steve.ts`, `src/content/steve-ui.ts`, `src/components/SteveChat.tsx`, `src/app/api/steve/route.ts` |
| Contact form (Zod schema, server action, email) | `src/lib/schemas.ts`, `src/app/contact/`, `src/lib/email.ts` |

To change copy, edit the files in `src/content/` and every page that uses it updates.

## Site map

- `/` Home
- `/about-us`: `/our-team`, `/partners`, `/case-studies`
- `/solutions`: one page per product at `/solutions/<slug>` (generated from `products.ts`)
- `/resources`: `/product-fact-sheets`, `/policy-wording`, `/proposal-forms`, `/renewal-declarations`, `/claim-forms`
- `/claims`
- `/contact` (accepts `?product=<slug>` to pre-fill the form, used by "Apply now")
- `/fair-insurance-code`, `/complaints`

## Deployment

Import the GitHub repo into Vercel (framework preset: Next.js, no build settings needed).
Every push to a branch gets a preview URL; merging to `main` deploys production.
Add the environment variables from `.env.example` in Vercel project settings.
Steve the otter answers with Claude when `ANTHROPIC_API_KEY` is set; without it he uses simple built-in answers.

## Broker portal

The broker portal runs on its own subdomain from this same codebase. See
[`docs/broker-portal.md`](docs/broker-portal.md) for how it works and how to go live.

## Open items

See [`docs/open-items.md`](docs/open-items.md).
