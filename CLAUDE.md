@AGENTS.md

# Otta website

- Brand: Ocean `#76bab2` is the primary colour; use `ocean-700`/`ocean-800` for teal text and buttons on white (contrast). Font is Raleway. Tokens live in `src/app/globals.css`.
- The brand is **Otta**. Source material may say "Hummi" or "TAI" – always replace with Otta.
- Copy lives in `src/content/`; pages should read from there rather than hard-coding text.
- `cacheComponents` is on: no `dynamicParams` export, and wrap time/request-dependent values in `"use cache"` or Suspense.
- Run `npm run check` before committing.
