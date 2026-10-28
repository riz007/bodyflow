import { z } from "zod";
import { SOURCE_IDS } from "./sources";

export const ORGAN_IDS = [
  "brain",
  "heart",
  "lungs",
  "liver",
  "stomach",
  "smallIntestine",
  "largeIntestine",
  "pancreas",
  "spleen",
  "kidneys",
  "bladder",
  "vessels",
] as const;
export type OrganId = (typeof ORGAN_IDS)[number];

export const CATEGORIES = ["Everyday", "ER", "Cardio", "CNS", "Pain", "Antibiotic", "Endocrine", "GI", "Respiratory", "PEP"] as const;
export type Category = (typeof CATEGORIES)[number];

export const DRUG_CLASSES = [
  "analgesic",
  "nsaid",
  "penicillin",
  "cephalosporin",
  "benzodiazepine",
  "antihistamine",
  "ppi",
  "biguanide",
  "antiemetic",
  "bronchodilator",
  "opioid",
  "opioid-antagonist",
  "catecholamine",
  "antiretroviral",
  "calcium-channel-blocker",
  "statin",
  "ace-inhibitor",
  "arb",
  "beta-blocker",
  "diuretic",
  "antiplatelet",
  "anticoagulant",
  "cardiac-glycoside",
  "ssri",
  "snri",
  "gabapentinoid",
  "hypnotic",
  "macrolide",
  "fluoroquinolone",
  "tetracycline",
  "glycopeptide",
  "antifungal",
  "antiviral",
  "thyroid-hormone",
  "insulin",
  "sulfonylurea",
  "h2-blocker",
  "antidiarrheal",
  "corticosteroid",
  "leukotriene-antagonist",
] as const;
export type DrugClass = (typeof DRUG_CLASSES)[number];

const sourceId = z.enum(SOURCE_IDS);

/** A literature value. Every number shown in the UI comes through one of these. */
const sourced = <U extends z.ZodType<string>>(unit: U) =>
  z
    .object({
      value: z.number().nonnegative(),
      /** Literature range, displayed when present. */
      range: z.tuple([z.number().nonnegative(), z.number().nonnegative()]).optional(),
      unit,
      source: sourceId,
      note: z.string().optional(),
      /** True when the value could not be pinned firmly to the cited source and needs expert review. */
      needsReview: z.boolean().optional(),
    })
    .refine((v) => !v.range || (v.range[0] <= v.value && v.value <= v.range[1]), {
      message: "value must lie within range",
    });

export const fraction = sourced(z.literal("fraction"));
export const hours = sourced(z.literal("h"));
export const mg = sourced(z.literal("mg"));
export const mgPerL = sourced(z.literal("mg/L"));
const volume = sourced(z.enum(["L/kg", "L"])).and(
  z.object({
    /** "V/F" when the source reports apparent volume after oral dosing (then F is not applied again). */
    basis: z.enum(["V", "V/F"]).default("V"),
  }),
);

export const ROUTES = ["oral", "iv-bolus", "iv-infusion", "im", "sc", "inhaled", "intranasal"] as const;
export type Route = (typeof ROUTES)[number];

const absorption = z.object({
  F: fraction,
  /** Give ka directly (1/h) or Tmax (h), from which ka is solved. */
  ka: sourced(z.literal("1/h")).optional(),
  tmax: hours.optional(),
  /** Delay before absorption starts (enteric coating). Tmax includes it. */
  lag: hours.optional(),
});

export const regimenSchema = z
  .object({
    id: z.string(),
    label: z.string(),
    route: z.enum(ROUTES),
    dose: mg,
    /** For iv-infusion. */
    infusionDuration: hours.optional(),
    absorption: absorption.optional(),
    note: z.string().optional(),
    /** Published single-dose Cmax for this regimen, used to sanity-check the model in tests. */
    reportedCmax: mgPerL.optional(),
  })
  .refine((r) => (r.route === "iv-bolus" || r.route === "iv-infusion") === !r.absorption, {
    message: "absorption parameters are required for non-IV routes and must be absent for IV",
  })
  .refine((r) => r.route !== "iv-infusion" || !!r.infusionDuration, {
    message: "iv-infusion needs infusionDuration",
  })
  .refine((r) => !r.absorption || !!r.absorption.ka !== !!r.absorption.tmax, {
    message: "give exactly one of ka or tmax",
  });

const organEffect = z.object({
  /** 0–1 tissue affinity multiplier on top of perfusion (1 = drug concentrates here). */
  affinity: z.number().min(0).max(3).default(1),
  /** True for the organ(s) where the drug produces its intended effect. */
  target: z.boolean().optional(),
  therapeutic: z.string().optional(),
  sideEffects: z.string().optional(),
  toxic: z.string().optional(),
});

export const componentSchema = z.object({
  id: z.string(),
  name: z.string(),
  /** Pharmacokinetics describe this moiety, which may differ from what is swallowed (e.g. salicylate from aspirin). */
  measuredMoiety: z.string().optional(),
  /** mg of measured moiety per mg of administered drug (molecular weight or prodrug conversion). */
  moietyFactor: z
    .object({ value: z.number().positive(), source: sourceId, note: z.string().optional() })
    .optional(),
  regimens: z.array(regimenSchema).min(1),
  vd: volume,
  halfLife: hours,
  proteinBinding: fraction,
  /** Fraction of systemically available drug excreted unchanged in urine. */
  fe: fraction,
  /** Where the rest goes. */
  nonRenalRoute: z.enum(["hepatic-metabolism", "biliary", "tissue-uptake"]),
  metabolism: z.string(),
  /** Plasma level associated with effect. Absent when no meaningful plasma threshold exists. */
  effectiveLevel: mgPerL.and(z.object({ label: z.string() })).optional(),
  noThresholdReason: z.string().optional(),
});

export const drugSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string(),
    /** Compact name for cards and headings when `name` is long. */
    shortName: z.string().optional(),
    /** Card subtitle; defaults to alternative names and brands. */
    subtitle: z.string().optional(),
    altNames: z.array(z.string()).default([]),
    brands: z.array(z.string()),
    drugClass: z.enum(DRUG_CLASSES),
    classLabel: z.string(),
    categories: z.array(z.enum(CATEGORIES)).min(1),
    mechanism: z.string(),
    components: z.array(componentSchema).min(1),
    organs: z.partialRecord(z.enum(ORGAN_IDS), organEffect),
    toxicity: z.object({
      mechanism: z.string(),
      warningSigns: z.array(z.string()),
      treatment: z.string(),
      /** Organs that switch to the damage visual in the toxic range. */
      organs: z.array(z.enum(ORGAN_IDS)).min(1),
    }),
    interactions: z.array(z.object({ with: z.string(), effect: z.string() })),
    didYouKnow: z.string(),
    /** Plain-English modelling caveats specific to this drug. */
    modelNotes: z.array(z.string()).default([]),
    /** Absolute concentrations are not reliable; chart in % of peak only. */
    relativeOnly: z.boolean().default(false),
  })
  .refine((d) => d.components.every((c) => c.effectiveLevel || c.noThresholdReason), {
    message: "each component needs effectiveLevel or noThresholdReason",
  })
  .refine((d) => d.components.every((c) => c.regimens.length === d.components[0].regimens.length), {
    message: "combination components must have the same regimen list",
  });

export type DrugInput = z.input<typeof drugSchema>;
export type Drug = z.output<typeof drugSchema>;
export type DrugComponent = Drug["components"][number];
export type Regimen = DrugComponent["regimens"][number];
export type Sourced = { value: number; range?: [number, number]; unit: string; source: string; note?: string; needsReview?: boolean };
