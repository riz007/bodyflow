/** Site-wide constants for metadata, OG images, sitemap and structured data. */

function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL)
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const SITE = {
  name: "Bodyflow",
  url: resolveSiteUrl(),
  title: "Bodyflow — see how medicines move through your body",
  tagline:
    "An interactive 3D visualisation of how medicines are absorbed, distributed, metabolised and excreted.",
  description:
    "Pick a medicine and watch it travel through a 3D human body: absorption, where it acts, liver metabolism and kidney excretion, with half-life, peak level and clearance on a live timeline. 60+ common medicines, from paracetamol to warfarin. Educational only, not medical advice.",
  keywords: [
    "pharmacokinetics",
    "drug half-life",
    "how long does a medicine stay in your body",
    "medicine visualisation",
    "3D human body",
    "ADME",
    "absorption distribution metabolism excretion",
    "plasma concentration curve",
    "drug metabolism liver",
    "pharmacology education",
  ],
  themeColor: "#05060a",
  /** Google Analytics 4 measurement ID; override with NEXT_PUBLIC_GA_ID. */
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "G-XRNGH1Y9DW",
} as const;
