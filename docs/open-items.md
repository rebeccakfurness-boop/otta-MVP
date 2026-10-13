# Open items

Placeholders in the prototype that need real content or decisions. Search the code for
`TODO(` to find each one.

## Content (Stage 2)
- **Claims phone number** – source copy says "0800 xxx xxxx" (`src/content/site.ts`).
- **Domain and email addresses** – assumed `otta.co.nz`, `hello@otta.co.nz`, `claims@otta.co.nz`.
- **Important information** – Fair Insurance Code, cooling off, dispute resolution, complaints and FSP number wording (`src/content/legal.ts`), plus the Fair Insurance Code and Complaints pages.
- **About us, Our Team, Case Studies** – copy, team profiles and photos.
- **Photography** – all images are branded gradient placeholders (`ImagePlaceholder`).
- **Documents** – PDFs for fact sheets, policy wordings, proposal forms, renewal declarations and claim forms.
- **Coverage taglines** – only Corporate Travel had one in the mockup ("Smart organisations don't leave home without Otta onboard."); the others are drafts in `products.ts`.

## Wording changed from the Hummi mockup
- All "Hummi" and "TAI" references now say "Otta".
- "keeps business and life humming" → "keeps business and life moving".
- "keeps Company Name in tune" → "keeps Company Name moving".
- Lorem ipsum on the home page replaced with draft copy drawn from the product summaries.

## Later stages
- Broker portal: authentication (iron-session + bcryptjs), Neon Postgres, Vercel Blob uploads.
- Compliance review (Privacy Act 2020, FMC Act, Fair Trading Act, CoFI, etc.).
- Remove `robots: noindex` in `src/app/layout.tsx` at launch.
