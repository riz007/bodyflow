import { describe, expect, it } from "vitest";
import { DRUGS, getDrug } from "@/data";
import { ORGAN_IDS } from "@/data/schema";
import { organLevels, organRoles, organTerms } from "@/pk/distribute";
import { simulate } from "@/pk/simulate";
import { glowCurve } from "./glow";
import { MIN_CALLOUT_LEVEL, calloutKey, pickCallouts } from "./callouts";

const paracetamol = getDrug("paracetamol")!;

describe("organ terms", () => {
  it("sum to the organ levels used everywhere else", () => {
    for (const d of DRUGS) {
      const s = simulate(d, undefined, "typical");
      const t = s.components[0].peak.tmax;
      const terms = organTerms(s, t);
      const levels = organLevels(s, t);
      for (const o of ORGAN_IDS) expect(terms[o].blood + terms[o].gut + terms[o].clearing).toBeCloseTo(levels[o], 10);
    }
  });
});

describe("organ roles", () => {
  it("marks the site of action as target", () => {
    const s = simulate(paracetamol, "oral", "typical");
    expect(organRoles(s, 1).brain.role).toBe("target");
  });

  it("shows oral drugs being absorbed in the gut early, then not once absorbed", () => {
    const s = simulate(paracetamol, "oral", "typical");
    expect(organRoles(s, 0.1).smallIntestine.role).toBe("absorbing");
    expect(organRoles(s, s.components[0].cleared).smallIntestine.role).not.toBe("absorbing");
  });

  it("shows the liver clearing a hepatically metabolised drug", () => {
    const s = simulate(paracetamol, "oral", "typical");
    expect(organRoles(s, 2).liver.role).toBe("clearing");
  });

  it("only shows damage in the toxic range, on the drug's toxicity organs", () => {
    for (const d of DRUGS) {
      const typical = simulate(d, undefined, "typical");
      const toxic = simulate(d, undefined, "toxic");
      const t = toxic.components[0].peak.tmax;
      const rt = organRoles(typical, t);
      const rx = organRoles(toxic, t);
      for (const o of ORGAN_IDS) {
        expect(rt[o].role, `${d.id}/${o}`).not.toBe("damage");
        if (rx[o].role === "damage") expect(d.toxicity.organs).toContain(o);
      }
    }
    expect(organRoles(simulate(paracetamol, "oral", "toxic"), 6).liver.role).toBe("damage");
  });
});

describe("glow", () => {
  it("keeps getting brighter with dose instead of saturating", () => {
    expect(glowCurve(0)).toBe(0);
    expect(glowCurve(0.5)).toBeGreaterThan(0.5); // a typical-dose target organ is clearly lit
    expect(glowCurve(2) - glowCurve(1)).toBeGreaterThan(0.3);
    expect(glowCurve(4)).toBeGreaterThan(glowCurve(2) + 0.3);
  });
});

describe("callouts", () => {
  it("never label organs that only carry the drug in blood", () => {
    expect(calloutKey("heart", "carried")).toBeNull();
  });

  it("name each clearing organ by what it does", () => {
    expect(calloutKey("liver", "clearing")).toBe("breakingDown");
    expect(calloutKey("kidneys", "clearing")).toBe("filtering");
    expect(calloutKey("bladder", "clearing")).toBe("collecting");
    expect(calloutKey("largeIntestine", "clearing")).toBe("bile");
  });

  it("put damage first and respect the limit", () => {
    const s = simulate(paracetamol, "oral", "toxic");
    const picked = pickCallouts(organRoles(s, 6), 3);
    expect(picked.length).toBeLessThanOrEqual(3);
    expect(picked[0]).toMatchObject({ organ: "liver", key: "damage" });
  });

  it("skip vessels and faint organs", () => {
    for (const d of DRUGS) {
      const s = simulate(d, undefined, "typical");
      const roles = organRoles(s, s.components[0].peak.tmax);
      for (const c of pickCallouts(roles, 12)) {
        expect(c.organ).not.toBe("vessels");
        expect(roles[c.organ].level).toBeGreaterThanOrEqual(MIN_CALLOUT_LEVEL);
      }
    }
  });
});
