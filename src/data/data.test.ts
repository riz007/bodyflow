import { describe, expect, it } from "vitest";
import { DRUGS, SOURCES } from "@/data";
import { simulate } from "@/pk/simulate";
import { organLevels } from "@/pk/distribute";
import { buildParams } from "@/pk/simulate";
import { peak } from "@/pk/derive";

describe("drug data", () => {
  it("has unique ids", () => {
    expect(new Set(DRUGS.map((d) => d.id)).size).toBe(DRUGS.length);
  });

  it("every drug simulates to a finite curve for every regimen and dose level", () => {
    for (const d of DRUGS)
      for (const r of d.components[0].regimens)
        for (const level of ["typical", "high", "toxic"] as const) {
          const s = simulate(d, r.id, level);
          for (const c of s.components) {
            expect(Number.isFinite(c.peak.cmax), `${d.id}/${r.id}`).toBe(true);
            expect(c.peak.cmax).toBeGreaterThan(0);
            expect(c.cleared).toBeGreaterThan(c.peak.tmax);
          }
          const levels = organLevels(s, s.components[0].peak.tmax);
          Object.values(levels).forEach((v) => expect(Number.isFinite(v)).toBe(true));
        }
  });

  it("toxic-state organs have toxicity text", () => {
    for (const d of DRUGS) for (const o of d.toxicity.organs) expect(d.organs[o]?.toxic, `${d.id}/${o}`).toBeTruthy();
  });

  it("every source id resolves", () => {
    const json = JSON.stringify(DRUGS);
    for (const m of json.matchAll(/"source":"([^"]+)"/g)) expect(SOURCES).toHaveProperty(m[1]);
  });
});

/**
 * Sanity check: the one-compartment model should land in the right ballpark of published Cmax.
 * A factor-of-2 band is deliberate: label Cmax values are means with wide variability, and a
 * one-compartment model ignores distribution phases.
 */
describe("model vs published Cmax", () => {
  for (const d of DRUGS)
    for (const c of d.components)
      for (const r of c.regimens)
        if (r.reportedCmax)
          it(`${d.id} / ${c.id} / ${r.id}`, () => {
            const model = peak(buildParams(c, r, 1)).cmax;
            const ratio = model / r.reportedCmax!.value;
            expect(ratio).toBeGreaterThan(0.5);
            expect(ratio).toBeLessThan(2);
          });
});
