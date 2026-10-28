import { amountEliminated, eliminationRate, systemicDose, type PkParams } from "./model";

export interface ExcretionState {
  /** Fraction of the systemically available dose excreted unchanged in urine so far (0–1). */
  urineUnchanged: number;
  /** Fraction cleared by the non-renal route (hepatic metabolism or biliary excretion) so far (0–1). */
  nonRenal: number;
  /** Instantaneous renal elimination rate relative to the peak total elimination rate is not needed by the UI;
   *  these are absolute rates in mg/h, used to drive particle flow. */
  renalRate: number;
  nonRenalRate: number;
}

/**
 * Split elimination by fe, the fraction of systemically available drug excreted unchanged in urine.
 * First-order elimination means renal and non-renal routes run in parallel at fixed proportions.
 */
export function excretion(p: PkParams, fe: number, t: number): ExcretionState {
  const total = systemicDose(p);
  const eliminated = amountEliminated(p, t);
  const rate = eliminationRate(p, t);
  return {
    urineUnchanged: total > 0 ? (fe * eliminated) / total : 0,
    nonRenal: total > 0 ? ((1 - fe) * eliminated) / total : 0,
    renalRate: fe * rate,
    nonRenalRate: (1 - fe) * rate,
  };
}
