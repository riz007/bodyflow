import type { MetadataRoute } from "next";
import { DRUGS } from "@/data";
import { drugPath } from "@/lib/seo";
import { SITE } from "@/lib/site";

/** The home page plus one entry per medicine (each has its own title, description and OG image). */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...DRUGS.map((d) => ({
      url: `${SITE.url}${drugPath(d)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
