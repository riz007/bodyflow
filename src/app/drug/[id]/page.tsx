import { DRUGS, getDrug } from "@/data";
import { drugMetadata, SeoContent } from "@/lib/seo";
import { App } from "@/ui/App";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return DRUGS.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const drug = getDrug((await params).id);
  return drug ? drugMetadata(drug) : {};
}

export default async function DrugPage({ params }: Props) {
  const drug = getDrug((await params).id);
  if (!drug) notFound();
  return (
    <>
      <App initialDrugId={drug.id} />
      <SeoContent drug={drug} />
    </>
  );
}
