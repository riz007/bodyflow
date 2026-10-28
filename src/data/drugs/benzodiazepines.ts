import type { DrugInput } from "../schema";
import { frac, hrs, lkg, mg, mgL } from "./_v";

const benzoMechanism =
  "Makes the brain's main calming signal, GABA, work harder at GABA-A receptors. Nerve cells become less excitable, which reduces anxiety, relaxes muscles, stops seizures and causes sleepiness.";

const benzoNoThreshold =
  "Clinical effect varies widely between people and fades with tolerance; there is no single plasma level that marks 'working'.";

const benzoToxicity: DrugInput["toxicity"] = {
  mechanism:
    "On their own, benzodiazepines rarely stop breathing. Combined with opioids, alcohol or other sedatives, their effects multiply in the brainstem's breathing centre, and breathing can slow or stop (respiratory depression).",
  warningSigns: [
    "Extreme drowsiness, cannot be woken",
    "Slurred speech, loss of coordination",
    "Slow or shallow breathing, blue lips",
    "Especially dangerous if alcohol or opioids were also taken",
  ],
  treatment:
    "Emergency airway and breathing support. Flumazenil can reverse benzodiazepines but is used cautiously because it can trigger seizures; naloxone reverses any opioid component.",
  organs: ["brain", "lungs"],
};

const benzoInteractions: DrugInput["interactions"] = [
  { with: "Opioids (morphine, codeine, oxycodone…)", effect: "Profound sedation and respiratory depression; the combination carries an FDA boxed warning." },
  { with: "Alcohol", effect: "Additive CNS depression; a common factor in fatal overdoses." },
  { with: "Other sedatives (antihistamines, gabapentinoids, sleeping pills)", effect: "Additive drowsiness and breathing suppression." },
];

export const alprazolam: DrugInput = {
  id: "alprazolam",
  name: "Alprazolam",
  brands: ["Xanax", "Alprax"],
  drugClass: "benzodiazepine",
  classLabel: "Benzodiazepine",
  categories: ["CNS"],
  mechanism: benzoMechanism + " Alprazolam acts fast and wears off relatively quickly, which raises dependence risk.",
  components: [
    {
      id: "alprazolam",
      name: "Alprazolam",
      regimens: [
        {
          id: "oral",
          label: "Oral tablet",
          route: "oral",
          dose: mg(0.5, "dailymed-alprazolam", { range: [0.25, 1] }),
          absorption: {
            F: frac(0.9, "gg-appendix", { range: [0.8, 1], needsReview: true }),
            tmax: hrs(1.5, "dailymed-alprazolam", { range: [1, 2] }),
          },
          reportedCmax: mgL(0.008, "dailymed-alprazolam", { note: "Label: 8–37 ng/mL across 0.5–3 mg; ~8 ng/mL at 0.5 mg", needsReview: true }),
        },
      ],
      vd: lkg(0.9, "gg-appendix", { range: [0.8, 1.3], needsReview: true }),
      halfLife: hrs(11.2, "dailymed-alprazolam", { range: [6.3, 26.9] }),
      proteinBinding: frac(0.8, "dailymed-alprazolam"),
      fe: frac(0.2, "gg-appendix", { needsReview: true }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: CYP3A4 to α-hydroxy-alprazolam (weakly active) and 4-hydroxy-alprazolam.",
      noThresholdReason: benzoNoThreshold,
    },
  ],
  organs: {
    brain: {
      affinity: 1.8,
      target: true,
      therapeutic: "Calms the amygdala and limbic system, quickly reducing anxiety and panic.",
      sideEffects: "Drowsiness, memory gaps, slowed reactions; dependence with regular use.",
      toxic: "Deep sedation and coma; in the brainstem, suppression of the drive to breathe, greatly amplified by opioids or alcohol.",
    },
    lungs: { affinity: 0.8, toxic: "Breathing becomes slow and shallow when the brainstem is suppressed." },
    liver: { affinity: 1, therapeutic: "Broken down by CYP3A4; strong CYP3A4 inhibitors make levels soar." },
    kidneys: { affinity: 0.8, therapeutic: "Excrete the metabolites." },
  },
  toxicity: benzoToxicity,
  interactions: [
    ...benzoInteractions,
    { with: "Ketoconazole, itraconazole (CYP3A4 inhibitors)", effect: "Block alprazolam breakdown; contraindicated." },
  ],
  didYouKnow: "Because it wears off quickly, people can feel 'interdose' rebound anxiety, one reason alprazolam is harder to stop than longer-acting benzodiazepines.",
  modelNotes: [],
};

export const diazepam: DrugInput = {
  id: "diazepam",
  name: "Diazepam",
  brands: ["Valium", "Stesolid"],
  drugClass: "benzodiazepine",
  classLabel: "Benzodiazepine",
  categories: ["CNS", "ER"],
  mechanism: benzoMechanism + " Diazepam and its active metabolite last for days, which smooths out its effect.",
  components: [
    {
      id: "diazepam",
      name: "Diazepam",
      regimens: [
        {
          id: "oral",
          label: "Oral tablet",
          route: "oral",
          dose: mg(5, "dailymed-diazepam", { range: [2, 10] }),
          absorption: {
            F: frac(0.95, "dailymed-diazepam", { range: [0.9, 1], note: "Label: ≥90%" }),
            tmax: hrs(1.25, "dailymed-diazepam", { range: [1, 1.5] }),
          },
        },
        {
          id: "iv",
          label: "IV (seizures)",
          route: "iv-bolus",
          dose: mg(10, "dailymed-diazepam", { range: [5, 10], note: "Status epilepticus dose in adults" }),
        },
      ],
      vd: lkg(1.1, "gg-appendix", { range: [0.8, 1.3] }),
      halfLife: hrs(43, "gg-appendix", { range: [20, 56], note: "Longer in older adults (up to ~100 h)" }),
      proteinBinding: frac(0.98, "dailymed-diazepam"),
      fe: frac(0.01, "gg-appendix", { range: [0, 0.01] }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism:
        "Liver: CYP2C19 and CYP3A4 to desmethyldiazepam (active, half-life up to ~100 h), then temazepam and oxazepam (also active), finally glucuronidated.",
      noThresholdReason: benzoNoThreshold,
    },
  ],
  organs: {
    brain: {
      affinity: 1.8,
      target: true,
      therapeutic: "Reduces anxiety, stops seizures, relieves alcohol withdrawal.",
      sideEffects: "Drowsiness that can carry over to the next day as the drug accumulates.",
      toxic: "Deep sedation and coma; suppression of brainstem breathing, especially with opioids or alcohol.",
    },
    lungs: { affinity: 0.8, toxic: "Slow, shallow breathing when the brainstem is suppressed." },
    liver: { affinity: 1.1, therapeutic: "Converts it to a chain of active metabolites, which is why effects last so long." },
    vessels: { affinity: 1, therapeutic: "Relaxes skeletal muscle via spinal cord GABA receptors." },
  },
  toxicity: benzoToxicity,
  interactions: [
    ...benzoInteractions,
    { with: "Omeprazole, fluvoxamine (CYP2C19 inhibitors)", effect: "Slow diazepam clearance, prolonging sedation." },
  ],
  didYouKnow: "Valium was the most-prescribed drug in the US from 1969 to 1982, and was mentioned in the Rolling Stones' 'Mother's Little Helper'.",
  modelNotes: ["The curve shows diazepam only. Its active metabolite desmethyldiazepam lasts even longer and extends the real effect."],
};
