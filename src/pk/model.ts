/**
 * One-compartment pharmacokinetic models. Pure functions, no React.
 *
 * Units throughout: time in hours, dose in mg, volume in L, concentration in mg/L.
 */

export type Kinetics =
  /** oral, IM, SC, inhaled. `lag` (h) delays absorption, e.g. enteric-coated tablets waiting to leave the stomach. */
  | { kind: "first-order"; F: number; ka: number; lag?: number }
  | { kind: "iv-bolus" }
  | { kind: "iv-infusion"; duration: number };

export interface PkParams {
  /** Dose of the active moiety reaching the formulation, mg. */
  dose: number;
  /** Volume of distribution, L. If the source gives V/F, pass V/F here and F = 1. */
  vd: number;
  /** Elimination rate constant, 1/h. */
  ke: number;
  kinetics: Kinetics;
}

export const LN2 = Math.LN2;

export const keFromHalfLife = (halfLife: number): number => LN2 / halfLife;
export const halfLifeFromKe = (ke: number): number => LN2 / ke;

/** Relative tolerance for treating ka and ke as equal (the Bateman equation's removable singularity). */
const EQ_TOL = 1e-9;

/**
 * Plasma concentration at time t (h).
 * Oral/first-order: Bateman equation C = F·D·ka / (Vd·(ka − ke)) · (e^(−ke·t) − e^(−ka·t)).
 */
export function concentration(p: PkParams, t: number): number {
  if (t <= 0) return p.kinetics.kind === "iv-bolus" && t === 0 ? p.dose / p.vd : 0;
  const { dose, vd, ke, kinetics } = p;
  switch (kinetics.kind) {
    case "iv-bolus":
      return (dose / vd) * Math.exp(-ke * t);
    case "iv-infusion": {
      const T = kinetics.duration;
      const rate = dose / T; // mg/h
      const plateau = rate / (ke * vd);
      if (t <= T) return plateau * (1 - Math.exp(-ke * t));
      return plateau * (1 - Math.exp(-ke * T)) * Math.exp(-ke * (t - T));
    }
    case "first-order": {
      const { F, ka } = kinetics;
      t -= kinetics.lag ?? 0;
      if (t <= 0) return 0;
      if (Math.abs(ka - ke) / ke < EQ_TOL) {
        // Limit ka → ke: C = F·D·k·t·e^(−k·t) / Vd
        return ((F * dose) / vd) * ke * t * Math.exp(-ke * t);
      }
      return ((F * dose * ka) / (vd * (ka - ke))) * (Math.exp(-ke * t) - Math.exp(-ka * t));
    }
  }
}

/** Amount (mg) still waiting to be absorbed at the absorption site (gut, muscle). */
export function amountAtAbsorptionSite(p: PkParams, t: number): number {
  const k = p.kinetics;
  if (k.kind !== "first-order") return 0;
  return k.F * p.dose * Math.exp(-k.ka * Math.max(0, t - (k.lag ?? 0)));
}

/** Amount (mg) that will ever reach the systemic circulation. */
export function systemicDose(p: PkParams): number {
  return p.kinetics.kind === "first-order" ? p.kinetics.F * p.dose : p.dose;
}

/** Amount (mg) delivered into the body by time t (absorbed or infused). */
export function amountDelivered(p: PkParams, t: number): number {
  const k = p.kinetics;
  if (t <= 0) return k.kind === "iv-bolus" && t === 0 ? p.dose : 0;
  switch (k.kind) {
    case "iv-bolus":
      return p.dose;
    case "iv-infusion":
      return p.dose * Math.min(1, t / k.duration);
    case "first-order":
      return k.F * p.dose * (1 - Math.exp(-k.ka * Math.max(0, t - (k.lag ?? 0))));
  }
}

/** Cumulative amount (mg) eliminated from the body (by any route) by time t. */
export function amountEliminated(p: PkParams, t: number): number {
  return Math.max(0, amountDelivered(p, t) - concentration(p, t) * p.vd);
}

/** Instantaneous elimination rate (mg/h) = ke · amount in body. */
export function eliminationRate(p: PkParams, t: number): number {
  return p.ke * concentration(p, t) * p.vd;
}

/** Time of peak for first-order absorption: Tmax = ln(ka/ke) / (ka − ke). */
export function tmaxFirstOrder(ka: number, ke: number): number {
  if (Math.abs(ka - ke) / ke < EQ_TOL) return 1 / ke;
  return Math.log(ka / ke) / (ka - ke);
}

/**
 * Solve Tmax = ln(ka/ke)/(ka − ke) for ka.
 * Tmax is symmetric in ka and ke and strictly decreasing in ka, from ∞ (ka → 0) through 1/ke (ka = ke)
 * down to 0 (ka → ∞), so there is exactly one root and bisection is safe:
 *  - Tmax < 1/ke → ka > ke, the usual case.
 *  - Tmax > 1/ke → ka < ke, "flip-flop" kinetics where absorption is slower than elimination
 *    (e.g. IM adrenaline), and the falling limb of the curve reflects absorption.
 */
export function kaFromTmax(tmax: number, ke: number): number {
  if (!(tmax > 0)) throw new Error("Tmax must be positive");
  if (Math.abs(tmax - 1 / ke) * ke < 1e-9) return ke;
  let lo: number;
  let hi: number;
  if (tmax < 1 / ke) {
    lo = ke;
    hi = ke * 2;
    while (tmaxFirstOrder(hi, ke) > tmax) hi *= 2;
  } else {
    lo = ke / 2;
    hi = ke;
    while (tmaxFirstOrder(lo, ke) < tmax) lo /= 2;
  }
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (lo + hi);
    if (tmaxFirstOrder(mid, ke) > tmax) lo = mid;
    else hi = mid;
    if (hi - lo < 1e-12 * hi) break;
  }
  return 0.5 * (lo + hi);
}
