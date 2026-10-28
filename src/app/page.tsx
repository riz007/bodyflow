import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDrug } from "@/data";
import { drugPath, SeoContent } from "@/lib/seo";
import { App } from "@/ui/App";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Page({ searchParams }: Props) {
  const q = await searchParams;
  const id = Array.isArray(q.drug) ? q.drug[0] : q.drug;
  const drug = getDrug(id);
  // Older share links used ?drug=…; send them to the medicine's own page, keeping dose/time state.
  if (drug) {
    const rest = new URLSearchParams();
    for (const [k, v] of Object.entries(q)) if (k !== "drug" && typeof v === "string") rest.set(k, v);
    redirect(`${drugPath(drug)}${rest.size ? `?${rest}` : ""}`);
  }
  return (
    <>
      <App />
      <SeoContent />
    </>
  );
}
