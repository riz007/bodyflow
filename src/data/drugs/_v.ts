import type { SourceId } from "../sources";

interface Opts {
  range?: [number, number];
  note?: string;
  needsReview?: boolean;
}

/** Terse constructors for sourced values in drug files. */
export const frac = (value: number, source: SourceId, o: Opts = {}) => ({ value, unit: "fraction" as const, source, ...o });
export const hrs = (value: number, source: SourceId, o: Opts = {}) => ({ value, unit: "h" as const, source, ...o });
export const mg = (value: number, source: SourceId, o: Opts = {}) => ({ value, unit: "mg" as const, source, ...o });
export const mgL = (value: number, source: SourceId, o: Opts = {}) => ({ value, unit: "mg/L" as const, source, ...o });
export const lkg = (value: number, source: SourceId, o: Opts & { basis?: "V" | "V/F" } = {}) => ({
  value,
  unit: "L/kg" as const,
  source,
  ...o,
});
export const litres = (value: number, source: SourceId, o: Opts & { basis?: "V" | "V/F" } = {}) => ({
  value,
  unit: "L" as const,
  source,
  ...o,
});

type V<U extends string> = { value: number; unit: U; source: SourceId } & Opts;

/** The usual single oral regimen. */
export const oral = (dose: V<"mg">, F: V<"fraction">, tmax: V<"h">, extra: { label?: string; note?: string; reportedCmax?: V<"mg/L"> } = {}) => ({
  id: "oral",
  label: extra.label ?? "Oral tablet",
  route: "oral" as const,
  dose,
  absorption: { F, tmax },
  ...(extra.note ? { note: extra.note } : {}),
  ...(extra.reportedCmax ? { reportedCmax: extra.reportedCmax } : {}),
});
