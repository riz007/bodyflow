import { concentration, halfLifeFromKe, tmaxFirstOrder, type PkParams } from "./model";

export interface Peak {
  tmax: number;
  cmax: number;
}

/** Cmax and Tmax, analytic where possible. */
export function peak(p: PkParams): Peak {
  const k = p.kinetics;
  switch (k.kind) {
    case "iv-bolus":
      return { tmax: 0, cmax: concentration(p, 0) };
    case "iv-infusion":
      return { tmax: k.duration, cmax: concentration(p, k.duration) };
    case "first-order": {
      const tmax = (k.lag ?? 0) + tmaxFirstOrder(k.ka, p.ke);
      return { tmax, cmax: concentration(p, tmax) };
    }
  }
}

/** Find t in [lo, hi] where f crosses zero, assuming one sign change. */
function bisect(f: (t: number) => number, lo: number, hi: number): number {
  let flo = f(lo);
  for (let i = 0; i < 100; i++) {
    const mid = 0.5 * (lo + hi);
    const fm = f(mid);
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = mid;
      flo = fm;
    } else hi = mid;
    if (hi - lo < 1e-9) break;
  }
  return 0.5 * (lo + hi);
}

/**
 * Time after the peak at which concentration has fallen to `fraction` of Cmax.
 * For an IV bolus this is exactly n half-lives for fraction = 2^-n.
 */
export function timeToFractionOfPeak(p: PkParams, fraction: number): number {
  const { tmax, cmax } = peak(p);
  const target = cmax * fraction;
  let hi = Math.max(tmax, 1e-6) + halfLifeFromKe(p.ke);
  while (concentration(p, hi) > target) hi *= 2;
  return bisect((t) => concentration(p, t) - target, tmax, hi);
}

/** Times at which plasma concentration has halved n = 1..count times from its peak. */
export function halvingTimes(p: PkParams, count = 5): number[] {
  return Array.from({ length: count }, (_, i) => timeToFractionOfPeak(p, 2 ** -(i + 1)));
}

/**
 * The "≈ fully cleared" rule of thumb: after ~5 half-lives about 97% of the drug is gone.
 * Returned as time from dosing: the time when C has fallen to 1/32 of Cmax.
 */
export function clearedTime(p: PkParams): number {
  return timeToFractionOfPeak(p, 1 / 32);
}

export interface ThresholdWindow {
  /** Time concentration first rises above the threshold, h. */
  onset: number;
  /** Time concentration drops back below it, h. */
  offset: number;
  duration: number;
}

/** When is plasma concentration above an effective level? null if never reached. */
export function windowAbove(p: PkParams, threshold: number): ThresholdWindow | null {
  const { tmax, cmax } = peak(p);
  if (cmax <= threshold) return null;
  const f = (t: number) => concentration(p, t) - threshold;
  const onset = tmax === 0 || concentration(p, 0) >= threshold ? 0 : bisect(f, 0, tmax);
  let hi = Math.max(tmax, 1e-6) + halfLifeFromKe(p.ke);
  while (concentration(p, hi) > threshold) hi *= 2;
  const offset = bisect(f, tmax, hi);
  return { onset, offset, duration: offset - onset };
}

/** Evenly sampled curve for charting. */
export function sampleCurve(p: PkParams, tEnd: number, n = 400): { t: number; c: number }[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = (tEnd * i) / n;
    return { t, c: concentration(p, t) };
  });
}
