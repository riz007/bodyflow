import { DRUGS, getDrug } from "@/data";
import { isLocale, LOCALES } from "@/i18n/config";
import { drugMetadata, SeoContent } from "@/lib/seo";
import { App } from "@/ui/App";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: string; id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => DRUGS.map((d) => ({ locale, id: d.id })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const drug = getDrug(id);
  return drug && isLocale(locale) ? drugMetadata(drug, locale) : {};
}

export default async function DrugPage({ params }: Props) {
  const { locale, id } = await params;
  const drug = getDrug(id);
  if (!drug || !isLocale(locale)) notFound();
  return (
    <>
      <App initialDrugId={drug.id} />
      <SeoContent drug={drug} locale={locale} />
    </>
  );
}
