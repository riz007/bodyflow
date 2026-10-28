/**
 * Bridges typed drug data to the pure PK math: resolves units, ka-from-Tmax, salt factors and dose level.
 */
import type { Drug, DrugComponent, Regimen } from "@/data/schema";
import { kaFromTmax, keFromHalfLife, type Kinetics, type PkParams } from "./model";
import { clearedTime, halvingTimes, peak, windowAbove, type Peak, type ThresholdWindow } from "./derive";

export const BODY_WEIGHT_KG = 70;

export const DOSE_LEVELS = {
  typical: { label: "Typical dose", multiplier: 1 },
  high: { label: "High dose", multiplier: 2 },
  toxic: { label: "Toxic range", multiplier: 8 },
} as const;
export type DoseLevel = keyof typeof DOSE_LEVELS;
export const DOSE_LEVEL_IDS = Object.keys(DOSE_LEVELS) as DoseLevel[];

export interface ComponentSim {
  component: DrugComponent;
  regimen: Regimen;
  params: PkParams;
  peak: Peak;
  halfLife: number;
  /** Times (h) at which C has halved 1..5 times from peak. */
  halvings: number[];
  /** ≈ fully cleared (C ≤ Cmax/32), h. */
  cleared: number;
  /** Window above the effective level, if the drug has one. */
  window: ThresholdWindow | null;
  /** True when absorption is slower than elimination. */
  flipFlop: boolean;
}

export interface Simulation {
  drug: Drug;
  regimenId: string;
  level: DoseLevel;
  components: ComponentSim[];
  /** Same components at the typical dose, used as the 100% reference for glow and relative charts. */
  reference: ComponentSim[];
  /** Suggested timeline length, h. */
  tEnd: number;
}

export function buildParams(c: DrugComponent, r: Regimen, multiplier: number, weightKg = BODY_WEIGHT_KG): PkParams {
  const ke = keFromHalfLife(c.halfLife.value);
  const vd = c.vd.unit === "L/kg" ? c.vd.value * weightKg : c.vd.value;
  const dose = r.dose.value * (c.moietyFactor?.value ?? 1) * multiplier;
  let kinetics: Kinetics;
  if (r.route === "iv-bolus") kinetics = { kind: "iv-bolus" };
  else if (r.route === "iv-infusion") kinetics = { kind: "iv-infusion", duration: r.infusionDuration!.value };
  else {
    const a = r.absorption!;
    // With an apparent volume (V/F) the bioavailability is already folded into the volume.
    const F = c.vd.basis === "V/F" ? 1 : a.F.value;
    const lag = a.lag?.value ?? 0;
    const ka = a.ka ? a.ka.value : kaFromTmax(a.tmax!.value - lag, ke);
    kinetics = { kind: "first-order", F, ka, lag };
  }
  return { dose, vd, ke, kinetics };
}

function simulateComponent(c: DrugComponent, r: Regimen, multiplier: number): ComponentSim {
  const params = buildParams(c, r, multiplier);
  const threshold = c.effectiveLevel?.value;
  return {
    component: c,
    regimen: r,
    params,
    peak: peak(params),
    halfLife: c.halfLife.value,
    halvings: halvingTimes(params),
    cleared: clearedTime(params),
    window: threshold !== undefined ? windowAbove(params, threshold) : null,
    flipFlop: params.kinetics.kind === "first-order" && params.kinetics.ka < params.ke,
  };
}

export function regimenFor(c: DrugComponent, regimenId: string): Regimen {
  return c.regimens.find((r) => r.id === regimenId) ?? c.regimens[0];
}

export function simulate(drug: Drug, regimenId: string | undefined, level: DoseLevel): Simulation {
  const rid = regimenId ?? drug.components[0].regimens[0].id;
  const m = DOSE_LEVELS[level].multiplier;
  const components = drug.components.map((c) => simulateComponent(c, regimenFor(c, rid), m));
  const reference = m === 1 ? components : drug.components.map((c) => simulateComponent(c, regimenFor(c, rid), 1));
  const tEnd = niceEnd(Math.max(...components.map((s) => s.cleared)) * 1.15);
  return { drug, regimenId: rid, level, components, reference, tEnd };
}

/** Round a timeline length up to a tidy value. */
export function niceEnd(h: number): number {
  const steps = [0.5, 1, 2, 3, 4, 6, 8, 12, 16, 24, 36, 48, 72, 96, 120, 168, 240, 336];
  return steps.find((s) => s >= h) ?? Math.ceil(h / 24) * 24;
}
