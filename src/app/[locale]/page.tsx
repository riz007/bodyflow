import { getDrug } from "@/data";
import { isLocale, localePath } from "@/i18n/config";
import { drugPath, SeoContent } from "@/lib/seo";
import { App } from "@/ui/App";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const q = await searchParams;
  const id = Array.isArray(q.drug) ? q.drug[0] : q.drug;
  const drug = getDrug(id);
  // Older share links used ?drug=…; send them to the medicine's own page, keeping dose/time state.
  if (drug) {
    const rest = new URLSearchParams();
    for (const [k, v] of Object.entries(q))
      if (k !== "drug" && typeof v === "string") rest.set(k, v);
    redirect(
      `${localePath(locale, drugPath(drug))}${rest.size ? `?${rest}` : ""}`,
    );
  }
  return (
    <>
      <App />
      <SeoContent locale={locale} />
    </>
  );
}
