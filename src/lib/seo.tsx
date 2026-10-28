import type { Metadata } from "next";
import { DRUGS, type Drug } from "@/data";
import type { OrganId } from "@/data/schema";
import {
  DEFAULT_LOCALE,
  HTML_LANG,
  LOCALES,
  localePath,
  OG_LOCALE,
  type Locale,
} from "@/i18n/config";
import { getDict, tf } from "@/i18n/dictionaries";
import { simulate } from "@/pk/simulate";
import { SITE } from "@/lib/site";
import { fmtTime } from "@/ui/format";

export const drugPath = (d: Drug) => `/drug/${d.id}`;

/** hreflang map for a path that exists in every language, plus x-default (English). */
export function languageAlternates(path: string): Record<string, string> {
  const out: Record<string, string> = Object.fromEntries(
    LOCALES.map((l) => [HTML_LANG[l], localePath(l, path)]),
  );
  out["x-default"] = localePath(DEFAULT_LOCALE, path);
  return out;
}

/** Site-wide metadata for one language. */
export function siteMetadata(locale: Locale): Metadata {
  const t = getDict(locale).meta;
  const image = "/api/og";
  return {
    metadataBase: new URL(SITE.url),
    title: { default: t.title, template: `%s | ${SITE.name}` },
    description: t.description,
    applicationName: SITE.name,
    keywords: [...SITE.keywords],
    category: "education",
    alternates: {
      canonical: localePath(locale, "/"),
      languages: languageAlternates("/"),
    },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: t.title,
      description: t.tagline,
      url: localePath(locale, "/"),
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map(
        (l) => OG_LOCALE[l],
      ),
      images: [{ url: image, width: 1200, height: 630, alt: t.tagline }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.tagline,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    formatDetection: { telephone: false },
  };
}

export function drugDescription(d: Drug, locale: Locale): string {
  const dict = getDict(locale);
  const brands = d.brands.length ? ` (${d.brands.slice(0, 2).join(", ")})` : "";
  return tf(dict.meta.drugDescription, {
    name: d.shortName ?? d.name,
    brands,
    half: fmtTime(d.components[0].halfLife.value, dict.units),
  });
}

/** Title, description, canonical, hreflang and social cards for one medicine's page. */
export function drugMetadata(drug: Drug, locale: Locale): Metadata {
  const t = getDict(locale).meta;
  const title = tf(t.drugTitle, { name: drug.shortName ?? drug.name });
  const description = drugDescription(drug, locale);
  const path = drugPath(drug);
  const url = localePath(locale, path);
  const image = `/api/og?drug=${drug.id}`;
  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      title,
      description,
      url,
      locale: OG_LOCALE[locale],
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/** Server-rendered SEO text plus JSON-LD for a page. */
export function SeoContent({ drug, locale }: { drug?: Drug; locale: Locale }) {
  return (
    <>
      <SeoSummary drug={drug} locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd(locale, drug)).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}

/**
 * Server-rendered text for search engines and screen readers. It mirrors what the interactive
 * panels show, and is visually hidden because the app presents the same content.
 * Headings are translated; medicine content is English (see the in-app notice).
 */
function SeoSummary({ drug, locale }: { drug?: Drug; locale: Locale }) {
  const dict = getDict(locale);
  const t = dict.meta;
  if (!drug) {
    return (
      <section className="sr-only">
        <h1>{t.title}</h1>
        <p>{t.description}</p>
        <h2>{t.medicines}</h2>
        <ul>
          {DRUGS.map((d) => (
            <li key={d.id}>
              <a href={localePath(locale, drugPath(d))}>
                {d.shortName ?? d.name} ({d.classLabel})
              </a>
            </li>
          ))}
        </ul>
      </section>
    );
  }
  const sim = simulate(drug, undefined, "typical");
  const time = (h: number) => fmtTime(h, dict.units);
  return (
    <article className="sr-only">
      <h1>{tf(t.drugTitle, { name: drug.shortName ?? drug.name })}</h1>
      <p>
        {drug.classLabel}.{" "}
        {tf(t.alsoKnown, {
          names: [...drug.altNames, ...drug.brands].join(", "),
        })}
      </p>
      <p>{drug.mechanism}</p>
      {sim.components.map((c) => (
        <p key={c.component.id}>
          {tf(t.pkLine, {
            name: c.component.name,
            tmax: time(c.peak.tmax),
            half: time(c.component.halfLife.value),
            cleared: time(c.cleared),
          })}{" "}
          {c.component.metabolism}
        </p>
      ))}
      <h2>{t.effects}</h2>
      <ul>
        {Object.entries(drug.organs).map(([id, e]) =>
          e?.therapeutic || e?.sideEffects ? (
            <li key={id}>
              {dict.organs[id as OrganId].name}:{" "}
              {[e.therapeutic, e.sideEffects].filter(Boolean).join(" ")}
            </li>
          ) : null,
        )}
      </ul>
      <h2>{dict.overview.interactions}</h2>
      <ul>
        {drug.interactions.map((i) => (
          <li key={i.with}>
            {i.with}: {i.effect}
          </li>
        ))}
      </ul>
      <p>{dict.disclaimer.footer}</p>
    </article>
  );
}

function jsonLd(locale: Locale, drug?: Drug) {
  const t = getDict(locale);
  const home = `${SITE.url}${localePath(locale, "/") === "/" ? "" : localePath(locale, "/")}`;
  const site = {
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    description: t.meta.description,
    inLanguage: LOCALES.map((l) => HTML_LANG[l]),
  };
  const app = {
    "@type": "WebApplication",
    name: SITE.name,
    url: home,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any (web browser with WebGL)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
    inLanguage: HTML_LANG[locale],
  };
  if (!drug) return { "@context": "https://schema.org", "@graph": [site, app] };
  return {
    "@context": "https://schema.org",
    "@graph": [
      site,
      {
        "@type": "MedicalWebPage",
        name: tf(t.meta.drugTitle, { name: drug.shortName ?? drug.name }),
        url: `${SITE.url}${localePath(locale, drugPath(drug))}`,
        inLanguage: HTML_LANG[locale],
        isPartOf: { "@id": `${SITE.url}/#website` },
        audience: {
          "@type": "PeopleAudience",
          audienceType: "General public, students",
        },
        medicalAudience: {
          "@type": "MedicalAudience",
          audienceType: "Patient",
        },
        about: {
          "@type": "Drug",
          name: drug.name,
          alternateName: [...drug.altNames, ...drug.brands],
          drugClass: { "@type": "DrugClass", name: drug.classLabel },
          mechanismOfAction: drug.mechanism,
        },
        disclaimer: t.disclaimer.footer,
      },
    ],
  };
}
