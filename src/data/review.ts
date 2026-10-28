import type { Drug } from "./schema";
import { SOURCES, type SourceId } from "./sources";

export interface ReviewItem {
  drug: string;
  path: string;
  value: number;
  unit: string;
  source: string;
  note?: string;
}

/** Every sourced value flagged `needsReview`, with its location in the data. */
export function needsReview(drugs: Drug[]): ReviewItem[] {
  const out: ReviewItem[] = [];
  const walk = (drug: Drug, node: unknown, path: string[]) => {
    if (!node || typeof node !== "object") return;
    const o = node as Record<string, unknown>;
    if (o.needsReview === true && typeof o.value === "number") {
      out.push({
        drug: drug.name,
        path: path.join("."),
        value: o.value,
        unit: String(o.unit),
        source: SOURCES[o.source as SourceId]?.label ?? String(o.source),
        note: o.note as string | undefined,
      });
    }
    for (const [k, v] of Object.entries(o)) walk(drug, v, [...path, k]);
  };
  for (const d of drugs) walk(d, d.components, ["components"]);
  return out;
}

export function reviewMarkdown(items: ReviewItem[]): string {
  const rows = items.map(
    (i) =>
      `| ${i.drug} | \`${i.path.replace(/^components\.\d+\./, "")}\` | ${i.value} ${i.unit} | ${i.source} | ${i.note ?? ""} |`,
  );
  return [
    "# Data values flagged `needsReview`",
    "",
    "Generated from `src/data` by `npm run review`. Do not edit by hand.",
    "",
    `${items.length} values.`,
    "",
    "| Medicine | Field | Value | Cited source | Note |",
    "| --- | --- | --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");
}
