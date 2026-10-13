# Open items

Placeholders in the prototype that need real content or decisions. Search the code for
`TODO(` to find each one.

## Content (Stage 2)
- **Claims phone number**: source copy says "0800 xxx xxxx" (`src/content/site.ts`).
- **Domain and email addresses**: assumed `otta.co.nz`, `hello@otta.co.nz`, `claims@otta.co.nz`.
- **Important information**: Fair Insurance Code, cooling off, dispute resolution, complaints and FSP number wording (`src/content/legal.ts`), plus the Fair Insurance Code and Complaints pages.
- **About us**: the three values (Forward thinking, Re-invention, Continuous Improvement) are draft copy; "The Otta success story" needs its story.
- **Partners**: partner names are shown as text tiles until logos are supplied.
- **Our Team, Case Studies**: copy, team profiles and photos.
- **Hero video**: licensed lake footage needed at `public/media/hero.mp4`, plus a still at `public/media/hero-poster.jpg`. A teal gradient shows until then.
- **Photography**: all images are placeholders (dark blocks on the home page, gradient blocks elsewhere).
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

## Later stages
- Broker portal: authentication (iron-session + bcryptjs), Neon Postgres, Vercel Blob uploads.
- Compliance review (Privacy Act 2020, FMC Act, Fair Trading Act, CoFI, etc.).
- Remove `robots: noindex` in `src/app/layout.tsx` at launch.
