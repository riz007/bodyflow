import type { DrugInput } from "../schema";
import { frac, hrs, litres, lkg, mg, mgL } from "./_v";

export const tld: DrugInput = {
  id: "tld",
  name: "Tenofovir DF + lamivudine + dolutegravir",
  shortName: "TLD (HIV PEP)",
  subtitle: "Tenofovir DF · lamivudine · dolutegravir",
  altNames: ["TLD", "HIV PEP"],
  brands: ["Acriptega", "Tenolam-D"],
  drugClass: "antiretroviral",
  classLabel: "Antiretroviral combination",
  categories: ["PEP"],
  mechanism:
    "Three drugs block HIV at two steps. Tenofovir and lamivudine are chain-terminators that stop the virus copying its RNA into DNA (reverse transcriptase). Dolutegravir stops that DNA being stitched into the cell's own genes (integrase). Started within 72 hours of exposure and taken for 28 days, it can prevent infection taking hold.",
  components: [
    {
      id: "tenofovir",
      name: "Tenofovir",
      measuredMoiety: "Tenofovir (tenofovir disoproxil is a prodrug converted in gut and blood)",
      moietyFactor: { value: 0.452, source: "dailymed-viread", note: "300 mg tenofovir disoproxil fumarate ≈ 136 mg tenofovir" },
      regimens: [
        {
          id: "oral",
          label: "One tablet daily",
          route: "oral",
          dose: mg(300, "dailymed-viread", { note: "Tenofovir disoproxil fumarate" }),
          absorption: {
            F: frac(0.25, "dailymed-viread", { range: [0.25, 0.39], note: "~25% fasting, ~39% with a high-fat meal" }),
            tmax: hrs(1, "dailymed-viread", { range: [0.6, 1.4] }),
          },
          reportedCmax: mgL(0.3, "dailymed-viread", { range: [0.21, 0.39] }),
        },
      ],
      vd: lkg(1.3, "dailymed-viread", { range: [0.7, 1.9], note: "From IV tenofovir" }),
      halfLife: hrs(17, "dailymed-viread", { range: [12, 18], needsReview: true }),
      proteinBinding: frac(0.007, "dailymed-viread", { note: "<0.7%" }),
      fe: frac(0.75, "dailymed-viread", { range: [0.7, 0.8] }),
      nonRenalRoute: "tissue-uptake",
      metabolism: "Not metabolised by CYP enzymes. Inside cells it is phosphorylated to its active form; excreted unchanged by the kidneys.",
      noThresholdReason: "Activity depends on the active diphosphate inside cells, which lasts far longer than plasma tenofovir.",
    },
    {
      id: "lamivudine",
      name: "Lamivudine",
      regimens: [
        {
          id: "oral",
          label: "One tablet daily",
          route: "oral",
          dose: mg(300, "dailymed-epivir"),
          absorption: {
            F: frac(0.86, "dailymed-epivir", { range: [0.82, 0.87] }),
            tmax: hrs(1, "dailymed-epivir", { range: [0.5, 1.5], needsReview: true }),
          },
          reportedCmax: mgL(2.04, "dailymed-epivir", { note: "300 mg once daily, steady state (little accumulation)" }),
        },
      ],
      vd: lkg(1.3, "dailymed-epivir", { range: [0.9, 1.7] }),
      halfLife: hrs(6, "dailymed-epivir", { range: [5, 7] }),
      proteinBinding: frac(0.36, "dailymed-epivir", { note: "<36%" }),
      fe: frac(0.7, "dailymed-epivir"),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Mostly excreted unchanged by the kidneys; ~5% to a trans-sulfoxide metabolite.",
      noThresholdReason: "Activity depends on the triphosphate inside cells (half-life ~15–22 h), not the plasma level.",
    },
    {
      id: "dolutegravir",
      name: "Dolutegravir",
      regimens: [
        {
          id: "oral",
          label: "One tablet daily",
          route: "oral",
          dose: mg(50, "dailymed-tivicay"),
          absorption: {
            F: frac(1, "dailymed-tivicay", { note: "Absolute F not established; volume given as V/F" }),
            tmax: hrs(2.5, "dailymed-tivicay", { range: [2, 3] }),
          },
        },
      ],
      vd: litres(17.4, "dailymed-tivicay", { basis: "V/F" }),
      halfLife: hrs(14, "dailymed-tivicay"),
      proteinBinding: frac(0.989, "dailymed-tivicay", { note: ">98.9%" }),
      fe: frac(0.01, "dailymed-tivicay", { note: "<1% unchanged in urine" }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: UGT1A1 glucuronidation (main) with a minor CYP3A4 pathway.",
      effectiveLevel: {
        ...mgL(0.064, "dailymed-tivicay", { note: "Protein-adjusted IC₉₀ against wild-type HIV-1" }),
        label: "PA-IC₉₀",
      },
    },
  ],
  organs: {
    vessels: { affinity: 1, target: true, therapeutic: "Reaches the immune cells (CD4 T cells) in blood where HIV would replicate." },
    spleen: { affinity: 1.2, target: true, therapeutic: "Lymphoid tissue, a key early site of HIV replication, is protected." },
    kidneys: {
      affinity: 1.4,
      therapeutic: "Tenofovir and lamivudine are excreted unchanged here.",
      sideEffects: "Dolutegravir blocks creatinine secretion, so a small rise in blood creatinine is expected and harmless.",
      toxic: "Tenofovir can injure the proximal tubules (Fanconi syndrome), mainly with long-term use or existing kidney disease.",
    },
    liver: { affinity: 1, therapeutic: "Metabolises dolutegravir.", sideEffects: "Rarely, liver enzyme rises." },
    brain: { affinity: 0.3, sideEffects: "Dolutegravir can cause insomnia, vivid dreams or headache." },
    smallIntestine: { affinity: 1, therapeutic: "Tenofovir disoproxil is converted to tenofovir as it is absorbed.", sideEffects: "Nausea and diarrhoea in the first days." },
  },
  toxicity: {
    mechanism:
      "Experience with large overdoses is limited. Tenofovir is the main concern for the kidneys, where it accumulates in the tubule cells. Dolutegravir is highly protein-bound and unlikely to be removed by dialysis.",
    warningSigns: ["Nausea, vomiting, abdominal pain", "Unusual tiredness or reduced urine", "Insomnia, headache"],
    treatment: "Supportive care and kidney monitoring. Contact poison control; haemodialysis removes some tenofovir.",
    organs: ["kidneys"],
  },
  interactions: [
    { with: "Antacids, iron, calcium, magnesium, zinc", effect: "Bind dolutegravir in the gut; take it 2 h before or 6 h after." },
    { with: "Metformin", effect: "Dolutegravir raises metformin levels." },
    { with: "Rifampicin, carbamazepine, St John's wort", effect: "Lower dolutegravir levels; the dose may need doubling or switching." },
    { with: "NSAIDs (long-term, high-dose)", effect: "Add to tenofovir's kidney risk." },
  ],
  didYouKnow: "PEP works best when started as soon as possible and within 72 hours of exposure, and it must be taken for the full 28 days.",
  modelNotes: [
    "Each component is modelled separately with its own curve.",
    "The curves show a single dose. In practice one tablet is taken daily for 28 days, and levels build to a steady state.",
  ],
};
