import { describe, expect, it } from "vitest";
import {
  amountDelivered,
  amountEliminated,
  concentration,
  kaFromTmax,
  keFromHalfLife,
  tmaxFirstOrder,
  type PkParams,
} from "./model";
import { clearedTime, halvingTimes, peak, timeToFractionOfPeak, windowAbove } from "./derive";
import { excretion } from "./excretion";
import { simulate } from "./simulate";
import { getDrug } from "@/data";

const close = (a: number, b: number, rel = 1e-6) => expect(Math.abs(a - b) / Math.abs(b)).toBeLessThan(rel);

describe("half-life behaviour", () => {
  const ke = keFromHalfLife(4);
  const iv: PkParams = { dose: 100, vd: 50, ke, kinetics: { kind: "iv-bolus" } };

  it("IV bolus starts at D/Vd and halves every t½", () => {
    close(concentration(iv, 0), 2);
    close(concentration(iv, 4), 1);
    close(concentration(iv, 8), 0.5);
    close(concentration(iv, 20), 2 / 32);
  });

  it("halving times for an IV bolus are exact multiples of t½", () => {
    halvingTimes(iv).forEach((t, i) => close(t, 4 * (i + 1), 1e-6));
    close(clearedTime(iv), 20, 1e-6);
  });

  it("oral terminal phase decays with t½ once absorption is complete", () => {
    const oral: PkParams = { dose: 100, vd: 50, ke, kinetics: { kind: "first-order", F: 1, ka: 5 } };
    const r = concentration(oral, 24) / concentration(oral, 28);
    close(r, 2, 1e-6);
  });

  it("doubling the dose doubles concentration but not the half-life (linear kinetics)", () => {
    const double = { ...iv, dose: 200 };
    close(concentration(double, 3), 2 * concentration(iv, 3));
    close(halvingTimes(double)[0], halvingTimes(iv)[0]);
  });
});

describe("Bateman equation: Cmax / Tmax for known parameters", () => {
  // Textbook case: F=1, D=500 mg, Vd=35 L, ka=1.5 /h, ke=0.2 /h.
  const p: PkParams = { dose: 500, vd: 35, ke: 0.2, kinetics: { kind: "first-order", F: 1, ka: 1.5 } };

  it("Tmax = ln(ka/ke)/(ka−ke)", () => {
    const expected = Math.log(1.5 / 0.2) / 1.3; // 1.5499 h
    close(peak(p).tmax, expected);
    close(expected, 1.54993, 1e-4);
  });

  it("Cmax matches the closed form", () => {
    const t = Math.log(1.5 / 0.2) / 1.3;
    const expected = ((500 * 1.5) / (35 * 1.3)) * (Math.exp(-0.2 * t) - Math.exp(-1.5 * t));
    close(peak(p).cmax, expected);
    close(expected, 10.478, 1e-3);
  });

  it("Cmax is the true maximum of the sampled curve", () => {
    const { cmax } = peak(p);
    for (let t = 0; t < 30; t += 0.01) expect(concentration(p, t)).toBeLessThanOrEqual(cmax * (1 + 1e-12));
  });

  it("bioavailability scales the curve linearly", () => {
    const half = { ...p, kinetics: { kind: "first-order" as const, F: 0.5, ka: 1.5 } };
    close(concentration(half, 2), concentration(p, 2) / 2);
  });

  it("handles ka = ke without dividing by zero", () => {
    const eq: PkParams = { dose: 100, vd: 10, ke: 0.3, kinetics: { kind: "first-order", F: 1, ka: 0.3 } };
    close(peak(eq).tmax, 1 / 0.3);
    const near: PkParams = { ...eq, kinetics: { kind: "first-order", F: 1, ka: 0.3 * (1 + 1e-6) } };
    close(concentration(eq, 2), concentration(near, 2), 1e-4);
  });
});

describe("ka from Tmax", () => {
  it("round-trips for the normal case (ka > ke)", () => {
    const ke = keFromHalfLife(6);
    for (const tmax of [0.25, 0.5, 1, 2, 4]) {
      const ka = kaFromTmax(tmax, ke);
      expect(ka).toBeGreaterThan(ke);
      close(tmaxFirstOrder(ka, ke), tmax, 1e-8);
    }
  });

  it("finds the flip-flop root (ka < ke) when Tmax > 1/ke", () => {
    const ke = keFromHalfLife(0.04); // adrenaline-like
    const ka = kaFromTmax(0.17, ke);
    expect(ka).toBeLessThan(ke);
    close(tmaxFirstOrder(ka, ke), 0.17, 1e-8);
  });
});

describe("absorption lag", () => {
  const base: PkParams = { dose: 40, vd: 11, ke: keFromHalfLife(1), kinetics: { kind: "first-order", F: 0.77, ka: 3 } };
  const lagged: PkParams = { ...base, kinetics: { kind: "first-order", F: 0.77, ka: 3, lag: 1.5 } };

  it("shifts the whole curve right without changing its shape", () => {
    expect(concentration(lagged, 1.4)).toBe(0);
    for (const t of [0.5, 1, 3]) close(concentration(lagged, t + 1.5), concentration(base, t));
    close(peak(lagged).tmax, peak(base).tmax + 1.5);
    close(peak(lagged).cmax, peak(base).cmax);
  });

  it("keeps mass balance", () => {
    for (const t of [2, 3, 6]) close(amountDelivered(lagged, t), concentration(lagged, t) * lagged.vd + amountEliminated(lagged, t), 1e-9);
  });
});

describe("IV infusion", () => {
  const p: PkParams = { dose: 1000, vd: 10, ke: keFromHalfLife(7), kinetics: { kind: "iv-infusion", duration: 0.5 } };

  it("peaks at the end of the infusion and is continuous there", () => {
    expect(peak(p).tmax).toBe(0.5);
    close(concentration(p, 0.5 - 1e-9), concentration(p, 0.5 + 1e-9), 1e-6);
  });

  it("approaches the bolus curve after the infusion ends", () => {
    const bolus: PkParams = { ...p, kinetics: { kind: "iv-bolus" } };
    const ratio = concentration(p, 48) / concentration(bolus, 48);
    // Short infusion delays exposure by ~T/2: ratio = (e^(ke·T) − 1)/(ke·T)
    close(ratio, (Math.exp(p.ke * 0.5) - 1) / (p.ke * 0.5), 1e-6);
  });
});

describe("effective-level window", () => {
  const p: PkParams = { dose: 100, vd: 10, ke: keFromHalfLife(2), kinetics: { kind: "iv-bolus" } };
  it("IV bolus above threshold from 0 until C falls to it", () => {
    const w = windowAbove(p, 2.5)!; // 10 → 2.5 takes exactly 2 half-lives
    expect(w.onset).toBe(0);
    close(w.offset, 4, 1e-6);
  });
  it("returns null when the peak never reaches the threshold", () => {
    expect(windowAbove(p, 20)).toBeNull();
  });
  it("time-to-fraction is consistent with the window", () => {
    close(timeToFractionOfPeak(p, 0.25), 4, 1e-6);
  });
});

describe("mass balance and excretion", () => {
  const p: PkParams = { dose: 500, vd: 40, ke: keFromHalfLife(3), kinetics: { kind: "first-order", F: 0.8, ka: 1.2 } };

  it("delivered = in body + eliminated", () => {
    for (const t of [0.5, 2, 10]) close(amountDelivered(p, t), concentration(p, t) * p.vd + amountEliminated(p, t), 1e-9);
  });

  it("splits elimination by fe and tends to fe of the absorbed dose", () => {
    const late = excretion(p, 0.6, 200);
    close(late.urineUnchanged, 0.6, 1e-6);
    close(late.nonRenal, 0.4, 1e-6);
  });
});

describe("combination products (TLD)", () => {
  const sim = simulate(getDrug("tld")!, undefined, "typical");

  it("models each component separately", () => {
    expect(sim.components.map((c) => c.component.id)).toEqual(["tenofovir", "lamivudine", "dolutegravir"]);
  });

  it("each component keeps its own half-life", () => {
    const [tfv, ltc, dtg] = sim.components;
    // Terminal-phase ratio over one half-life is 2 for each component independently.
    for (const c of [tfv, ltc, dtg]) {
      const t = 72;
      close(concentration(c.params, t) / concentration(c.params, t + c.halfLife), 2, 1e-4);
    }
    expect(ltc.cleared).toBeLessThan(dtg.cleared);
  });

  it("applies the tenofovir disoproxil → tenofovir conversion", () => {
    expect(sim.components[0].params.dose).toBeCloseTo(300 * 0.452, 6);
  });

  it("timeline covers the slowest component", () => {
    expect(sim.tEnd).toBeGreaterThanOrEqual(Math.max(...sim.components.map((c) => c.cleared)));
  });
});

describe("dose levels", () => {
  it("toxic level scales concentrations but keeps the typical reference", () => {
    const d = getDrug("paracetamol")!;
    const typ = simulate(d, undefined, "typical");
    const tox = simulate(d, undefined, "toxic");
    close(tox.components[0].peak.cmax, 8 * typ.components[0].peak.cmax);
    close(tox.reference[0].peak.cmax, typ.components[0].peak.cmax);
  });
});
