# Bodyflow

An interactive 3D visualisation of how medicines move through the human body: absorption, distribution to organs, where they act, liver metabolism and kidney excretion, on a scrubbable timeline with the plasma concentration curve.

> **Educational visualisation only. Not medical advice.** Curves are simplified single-dose models of population averages for a 70 kg adult. Always check with a doctor or pharmacist, and go to hospital if you feel unwell.

## Features

- **61 medicines** across everyday, emergency, cardiovascular, CNS, pain, anti-infective, endocrine, GI and respiratory categories, plus the HIV PEP combination (TLD) modelled as three separate curves.
- **Pharmacokinetic engine** (`src/pk`): one-compartment models with first-order absorption (Bateman equation) with optional absorption lag, IV bolus and IV infusion. It reports Cmax, Tmax, halving times, time above an effective level, an "≈ cleared" time (5 half-lives, labelled as a rule of thumb), and cumulative excretion split by the fraction excreted unchanged in urine.
- **3D anatomy** from BodyParts3D, merged and simplified per organ, with desktop and mobile levels of detail (~1 MB and ~370 KB, meshopt-compressed).
- **Organ panels**: what each organ does, what the drug does there, what happens at too high a dose, and when the organ is affected.
- **Dose levels** (typical, high, toxic). The toxic range never shows milligram amounts, multipliers or axis values, and it shows a calm help banner.
- **Compare mode** overlays two medicines. Every state is shareable in the URL (`/drug/diazepam?dose=typical&t=6h&vs=alprazolam`), and each medicine has its own indexable page.
- **SEO**: per-medicine titles, descriptions, canonical URLs and dynamic Open Graph images; a sitemap, robots, a web manifest and JSON-LD.

## Data and sources

Every number lives in typed, Zod-validated files in `src/data/drugs/`. Each value records its source (FDA label via DailyMed, UK SmPC, Goodman & Gilman, StatPearls, EUCAST) and its literature range where one exists. Values that could not be pinned firmly to a source are marked `needsReview: true` and listed in [`docs/DATA_REVIEW.md`](docs/DATA_REVIEW.md), which is generated from the data and checked by the test suite.

Organ "glow" combines blood flow, tissue affinity and elimination route. It is an illustrative approximation, not a validated PBPK model, and the UI says so.

To add a medicine, create a file in `src/data/drugs/` and register it in `src/data/index.ts`. The picker, chart, panels, OG image and sitemap all update from the data.

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # PK engine + data validation (Vitest)
npm run review       # regenerate docs/DATA_REVIEW.md
npm run build
```

Rebuilding the anatomy models (only needed if you change the organ set or budgets) requires the BodyParts3D downloads. Usage is documented at the top of `scripts/build-anatomy.mjs`.

## Deploying

The app deploys to Vercel as-is. Set `NEXT_PUBLIC_SITE_URL` to your production URL, for example `https://bodyflow.example.com`, so canonical URLs, the sitemap and OG image URLs are absolute. Without it, the Vercel production domain is used.

## Project structure

```
src/
  app/        Next.js routes, metadata, OG image, icons, sitemap, robots, manifest
  pk/         Pure pharmacokinetic maths (unit-tested)
  data/       Drug entries, organ metadata, sources, schema
  scene/      React Three Fiber scene: body, camera, intro
  shaders/    GLSL materials (X-ray skin, organ glow)
  state/      Zustand store, URL sync, playback
  ui/         Panels, chart, picker, timeline
scripts/      Anatomy model pipeline
docs/         Specification, build plan, data review list
```

## How this was built

The code and data were drafted with AI assistance (Anthropic's Claude) and are reviewed by the maintainer. Flagged values are tracked in `docs/DATA_REVIEW.md`, and corrections are welcome: please cite a primary source (label or SmPC).

## Credits and licences

- Anatomy: **BodyParts3D**, © The Database Center for Life Science, licensed under [CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en). The derived models in `public/models/` are shared under the same licence; see [`public/models/LICENSE.md`](public/models/LICENSE.md). The lung surfaces are derived from BodyParts3D's bronchial and pulmonary vascular trees, because the dataset has no lung surface mesh.
- Typefaces: Inter Tight and IBM Plex Mono (SIL Open Font License).
