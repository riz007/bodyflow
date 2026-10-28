import type { MetadataRoute } from "next";
import { DRUGS } from "@/data";
import { LOCALES, localePath } from "@/i18n/config";
import { drugPath, languageAlternates } from "@/lib/seo";
import { SITE } from "@/lib/site";

const abs = (p: string) => `${SITE.url}${p === "/" ? "" : p}`;

/** Every page in every language, each listing its translations (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (
    path: string,
    priority: number,
    changeFrequency: "weekly" | "monthly",
  ) =>
    LOCALES.map((l) => ({
      url: abs(localePath(l, path)),
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languageAlternates(path)).map(([lang, p]) => [
            lang,
            abs(p),
          ]),
        ),
      },
    }));
  return [
    ...entry("/", 1, "weekly"),
    ...DRUGS.flatMap((d) => entry(drugPath(d), 0.7, "monthly")),
  ];
}
