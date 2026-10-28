import type { Sourced } from "@/data/schema";

/** Human time from hours: "25 min", "6.5 h", "3.2 days". */
export function fmtTime(h: number): string {
  if (!Number.isFinite(h)) return "—";
  if (h < 1) return `${Math.round(h * 60)} min`;
  if (h < 48) return `${trim(h < 10 ? h.toFixed(1) : h.toFixed(0))} h`;
  return `${trim((h / 24).toFixed(1))} days`;
}

/** Compact axis label. */
export function fmtTimeShort(h: number): string {
  if (h === 0) return "0";
  if (h < 1) return `${Math.round(h * 60)}m`;
  if (h < 48 || h % 24 !== 0) return `${trim(h.toFixed(h < 10 ? 1 : 0))}h`;
  return `${h / 24}d`;
}

/** Concentration in mg/L, switched to ng/mL below 1 mg/L (1 mg/L = 1000 ng/mL). */
export function fmtConc(mgPerL: number): string {
  if (!Number.isFinite(mgPerL)) return "—";
  if (mgPerL >= 1) return `${sig(mgPerL)} mg/L`;
  return `${sig(mgPerL * 1000)} ng/mL`;
}

export function fmtPct(f: number): string {
  if (f >= 0.995) return ">99%";
  if (f > 0 && f < 0.01) return "<1%";
  return `${Math.round(f * 100)}%`;
}

export function fmtMg(mg: number): string {
  return mg < 1 ? `${sig(mg * 1000)} µg` : `${sig(mg)} mg`;
}

/** Display a sourced literature value with its range. */
export function fmtSourced(v: Sourced, kind: "time" | "fraction" | "volume" | "mg" | "conc"): string {
  const one = (x: number) => {
    switch (kind) {
      case "time":
        return fmtTime(x);
      case "fraction":
        return fmtPct(x);
      case "mg":
        return fmtMg(x);
      case "conc":
        return fmtConc(x);
      case "volume":
        return `${sig(x)} ${v.unit}`;
    }
  };
  if (!v.range || v.range[0] === v.range[1]) return one(v.value);
  return `${one(v.value)} (${one(v.range[0])}–${one(v.range[1])})`;
}

/** Shareable time token for URLs: 30m, 6h, 2d. */
export function timeToken(h: number): string {
  if (h < 1) return `${Math.round(h * 60)}m`;
  if (h < 48) return `${trim(h.toFixed(1))}h`;
  return `${trim((h / 24).toFixed(2))}d`;
}

export function parseTimeToken(s: string | null | undefined): number | null {
  const m = s?.match(/^(\d+(?:\.\d+)?)(m|h|d)?$/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return m[2] === "m" ? n / 60 : m[2] === "d" ? n * 24 : n;
}

function sig(x: number): string {
  if (x >= 100) return x.toFixed(0);
  if (x >= 10) return trim(x.toFixed(1));
  return trim(x.toPrecision(2));
}

function trim(s: string): string {
  return s.includes(".") ? s.replace(/\.?0+$/, "") : s;
}
