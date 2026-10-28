import type { Metadata } from "next";
import { DRUGS, ORGANS, type Drug } from "@/data";
import { simulate } from "@/pk/simulate";
import { SITE } from "@/lib/site";
import { fmtTime } from "@/ui/format";

export const drugPath = (d: Drug) => `/drug/${d.id}`;

export function drugDescription(d: Drug): string {
  const c = d.components[0];
  const half = fmtTime(c.halfLife.value);
  const brands = d.brands.length ? ` (${d.brands.slice(0, 2).join(", ")})` : "";
  return `How ${d.shortName ?? d.name}${brands} moves through your body: absorption, where it acts, metabolism and excretion. Half-life about ${half}. Interactive 3D visualisation. Educational, not medical advice.`;
}

/** Title, description, canonical and social cards for one medicine's page. */
export function drugMetadata(drug: Drug): Metadata {
  const title = `${drug.shortName ?? drug.name}: how it moves through your body`;
  const description = drugDescription(drug);
  const url = drugPath(drug);
  const image = `/api/og?drug=${drug.id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, images: [{ url: image, width: 1200, height: 630, alt: `${drug.name} in the Bodyflow 3D body` }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/** Server-rendered SEO text plus JSON-LD for a page. */
export function SeoContent({ drug }: { drug?: Drug }) {
  return (
    <>
      <SeoSummary drug={drug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(drug)).replace(/</g, "\\u003c") }} />
    </>
  );
}

/**
 * Server-rendered text for search engines and screen readers. It mirrors what the interactive
 * panels show, and is visually hidden because the app presents the same content.
 */
function SeoSummary({ drug }: { drug?: Drug }) {
  if (!drug) {
    return (
      <section className="sr-only">
        <h1>{SITE.title}</h1>
        <p>{SITE.description}</p>
        <h2>Medicines</h2>
        <ul>
          {DRUGS.map((d) => (
            <li key={d.id}>
              <a href={drugPath(d)}>
                {d.shortName ?? d.name} ({d.classLabel})
              </a>
            </li>
          ))}
        </ul>
      </section>
    );
  }
  const sim = simulate(drug, undefined, "typical");
  return (
    <article className="sr-only">
      <h1>{drug.shortName ?? drug.name}: how it moves through your body</h1>
      <p>
        {drug.classLabel}. Also known as {[...drug.altNames, ...drug.brands].join(", ")}.
      </p>
      <p>{drug.mechanism}</p>
      {sim.components.map((c) => (
        <p key={c.component.id}>
          {c.component.name}: peak level about {fmtTime(c.peak.tmax)} after a typical dose; half-life about {fmtTime(c.component.halfLife.value)};
          roughly cleared after {fmtTime(c.cleared)} (about five half-lives). {c.component.metabolism}
        </p>
      ))}
      <h2>Effects on the body</h2>
      <ul>
        {Object.entries(drug.organs).map(([id, e]) =>
          e?.therapeutic || e?.sideEffects ? (
            <li key={id}>
              {ORGANS[id as keyof typeof ORGANS].name}: {[e.therapeutic, e.sideEffects].filter(Boolean).join(" ")}
            </li>
          ) : null,
        )}
      </ul>
      <h2>Key interactions</h2>
      <ul>
        {drug.interactions.map((i) => (
          <li key={i.with}>
            {i.with}: {i.effect}
          </li>
        ))}
      </ul>
      <p>
        Educational visualisation only, not medical advice. Always check with a doctor or pharmacist, and go to hospital if you feel unwell.
      </p>
    </article>
  );
}

function jsonLd(drug?: Drug) {
  const site = {
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: "en",
  };
  const app = {
    "@type": "WebApplication",
    name: SITE.name,
    url: SITE.url,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any (web browser with WebGL)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
  };
  if (!drug) return { "@context": "https://schema.org", "@graph": [site, app] };
  return {
    "@context": "https://schema.org",
    "@graph": [
      site,
      {
        "@type": "MedicalWebPage",
        name: `${drug.shortName ?? drug.name}: how it moves through your body`,
        url: `${SITE.url}${drugPath(drug)}`,
        isPartOf: { "@id": `${SITE.url}/#website` },
        audience: { "@type": "PeopleAudience", audienceType: "General public, students" },
        medicalAudience: { "@type": "MedicalAudience", audienceType: "Patient" },
        about: {
          "@type": "Drug",
          name: drug.name,
          alternateName: [...drug.altNames, ...drug.brands],
          drugClass: { "@type": "DrugClass", name: drug.classLabel },
          mechanismOfAction: drug.mechanism,
        },
        disclaimer: "Educational visualisation only. Not medical advice. Always check with a doctor or pharmacist.",
      },
    ],
  };
}
