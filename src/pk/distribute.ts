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

export function organLevels(sim: Simulation, t: number): OrganLevels {
  const out = Object.fromEntries(ORGAN_IDS.map((o) => [o, 0])) as OrganLevels;
  const n = sim.components.length;

  sim.components.forEach((s, i) => {
    const ref = sim.reference[i];
    const cRel = concentration(s.params, t) / ref.peak.cmax;
    const refRate = eliminationRate(ref.params, ref.peak.tmax) || 1;

    for (const o of ORGAN_IDS) {
      const affinity = sim.drug.organs[o]?.affinity ?? DEFAULT_AFFINITY;
      out[o] += (ORGANS[o].perfusion * affinity * cRel) / n;
    }

    // Absorption: drug still in the gut (oral) lights up stomach first, then small intestine.
    const route = s.regimen.route;
    if (route === "oral") {
      const gut = amountAtAbsorptionSite(s.params, t) / systemicDose(ref.params);
      out.stomach += (gut * Math.exp(-t / 0.4)) / n;
      out.smallIntestine += gut / n;
      out.liver += (0.5 * gut) / n; // portal blood passes the liver first
    }

    // Elimination split by fe.
    const fe = s.component.fe.value;
    const ex = excretion(s.params, fe, t);
    out.kidneys += ex.renalRate / refRate / n;
    if (s.component.nonRenalRoute !== "tissue-uptake") out.liver += ex.nonRenalRate / refRate / n;
    if (s.component.nonRenalRoute === "biliary") out.largeIntestine += (0.6 * ex.nonRenalRate) / refRate / n;
    out.bladder += ex.urineUnchanged / n;
  });

  return out;
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
