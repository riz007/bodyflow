/**
 * Illustrative organ "presence" signal for the glow visuals.
 *
 * NOT a validated PBPK model. Each organ's value is:
 *   perfusion weight (organs.ts) × drug tissue affinity (drug data) × plasma level relative to the typical-dose peak
 * plus route-specific terms: drug waiting in the gut for oral doses, elimination flow through the
 * kidneys (fe) or liver (1 − fe), and cumulative unchanged drug collected in the bladder.
 */
import { ORGANS } from "@/data/organs";
import { ORGAN_IDS, type OrganId } from "@/data/schema";
import { amountAtAbsorptionSite, concentration, eliminationRate, systemicDose } from "./model";
import { excretion } from "./excretion";
import type { Simulation } from "./simulate";

export type OrganLevels = Record<OrganId, number>;

/** Affinity used for organs a drug entry does not mention: present in blood, no special uptake. */
const DEFAULT_AFFINITY = 0.5;

/** Where an organ's level comes from: drug in the blood, drug still in the gut, or drug being cleared. */
export interface OrganTerms {
  blood: number;
  gut: number;
  clearing: number;
}

export function organTerms(sim: Simulation, t: number): Record<OrganId, OrganTerms> {
  const out = Object.fromEntries(ORGAN_IDS.map((o) => [o, { blood: 0, gut: 0, clearing: 0 }])) as Record<OrganId, OrganTerms>;
  const n = sim.components.length;

  sim.components.forEach((s, i) => {
    const ref = sim.reference[i];
    const cRel = concentration(s.params, t) / ref.peak.cmax;
    const refRate = eliminationRate(ref.params, ref.peak.tmax) || 1;

    for (const o of ORGAN_IDS) {
      const affinity = sim.drug.organs[o]?.affinity ?? DEFAULT_AFFINITY;
      out[o].blood += (ORGANS[o].perfusion * affinity * cRel) / n;
    }

    // Absorption: drug still in the gut (oral) lights up stomach first, then small intestine.
    const route = s.regimen.route;
    if (route === "oral") {
      const gut = amountAtAbsorptionSite(s.params, t) / systemicDose(ref.params);
      out.stomach.gut += (gut * Math.exp(-t / 0.4)) / n;
      out.smallIntestine.gut += gut / n;
      out.liver.clearing += (0.5 * gut) / n; // portal blood passes the liver first
    }

    // Elimination split by fe.
    const fe = s.component.fe.value;
    const ex = excretion(s.params, fe, t);
    out.kidneys.clearing += ex.renalRate / refRate / n;
    if (s.component.nonRenalRoute !== "tissue-uptake") out.liver.clearing += ex.nonRenalRate / refRate / n;
    if (s.component.nonRenalRoute === "biliary") out.largeIntestine.clearing += (0.6 * ex.nonRenalRate) / refRate / n;
    out.bladder.clearing += ex.urineUnchanged / n;
  });

  return out;
}

export function organLevels(sim: Simulation, t: number): OrganLevels {
  const terms = organTerms(sim, t);
  return Object.fromEntries(ORGAN_IDS.map((o) => [o, terms[o].blood + terms[o].gut + terms[o].clearing])) as OrganLevels;
}

/**
 * What an organ is doing with the drug right now, for the glow pattern and on-body callouts.
 * "carried" means the drug is only passing through in the blood.
 */
export type OrganRole = "damage" | "target" | "absorbing" | "clearing" | "side" | "carried";

/** Level below which an organ is not worth calling out. */
const ACTIVE = 0.05;

export function organRoles(sim: Simulation, t: number): Record<OrganId, { level: number; role: OrganRole }> {
  const terms = organTerms(sim, t);
  const toxic = sim.level === "toxic";
  return Object.fromEntries(
    ORGAN_IDS.map((o) => {
      const { blood, gut, clearing } = terms[o];
      const level = blood + gut + clearing;
      const effect = sim.drug.organs[o];
      let role: OrganRole = "carried";
      // Same rule the damage visual has always used: toxic range, a listed organ, real exposure.
      if (toxic && sim.drug.toxicity.organs.includes(o) && level > 0.25) role = "damage";
      else if (effect?.target) role = "target";
      else if (gut > ACTIVE && gut >= blood && gut >= clearing) role = "absorbing";
      else if (clearing > ACTIVE && clearing >= 0.5 * blood) role = "clearing";
      else if (effect?.sideEffects) role = "side";
      return [o, { level, role }];
    }),
  ) as Record<OrganId, { level: number; role: OrganRole }>;
}

/**
 * Time window (h) during which an organ's level is at least `fraction` of its own maximum.
 * Used for "affected from … to …" in the organ panel.
 */
export function organWindow(sim: Simulation, organ: OrganId, fraction = 0.25, samples = 300) {
  const ts = Array.from({ length: samples + 1 }, (_, i) => (sim.tEnd * i) / samples);
  const vals = ts.map((t) => organLevels(sim, t)[organ]);
  const max = Math.max(...vals);
  if (max <= 1e-6) return null;
  const idx = vals.map((v, i) => (v >= fraction * max ? i : -1)).filter((i) => i >= 0);
  return { start: ts[idx[0]], end: ts[idx[idx.length - 1]], peakAt: ts[vals.indexOf(max)] };
}
