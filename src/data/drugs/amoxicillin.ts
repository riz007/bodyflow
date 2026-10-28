import type { DrugInput } from "../schema";
import { frac, hrs, lkg, mg, mgL } from "./_v";

export const amoxicillin: DrugInput = {
  id: "amoxicillin",
  name: "Amoxicillin",
  altNames: ["Amoxycillin"],
  brands: ["Amoxil", "Moxatag"],
  drugClass: "penicillin",
  classLabel: "Penicillin antibiotic",
  categories: ["Antibiotic", "Everyday"],
  mechanism:
    "Stops bacteria building their cell wall by blocking penicillin-binding proteins. Growing bacteria then burst. Human cells have no cell wall, which is why it is so well tolerated.",
  components: [
    {
      id: "amoxicillin",
      name: "Amoxicillin",
      regimens: [
        {
          id: "oral",
          label: "Oral capsule",
          route: "oral",
          dose: mg(500, "dailymed-amoxicillin", { range: [250, 1000] }),
          absorption: {
            F: frac(0.8, "gg-appendix", { range: [0.74, 0.92] }),
            tmax: hrs(1.5, "dailymed-amoxicillin", { range: [1, 2] }),
          },
          reportedCmax: mgL(6.5, "dailymed-amoxicillin", { range: [5.5, 7.5], note: "After a 500 mg capsule" }),
        },
      ],
      vd: lkg(0.3, "gg-appendix", { range: [0.2, 0.4], needsReview: true }),
      halfLife: hrs(1.0, "dailymed-amoxicillin", { range: [0.8, 1.5], note: "Label: 61.3 minutes" }),
      proteinBinding: frac(0.18, "dailymed-amoxicillin", { range: [0.17, 0.2] }),
      fe: frac(0.6, "dailymed-amoxicillin", { note: "~60% excreted unchanged in urine within 6–8 h" }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Minimal; a small fraction is hydrolysed to penicilloic acid. Most leaves unchanged through the kidneys.",
      effectiveLevel: {
        ...mgL(0.5, "eucast-breakpoints", {
          needsReview: true,
          note: "Example only: EUCAST susceptible breakpoint for S. pneumoniae. The relevant MIC depends on the organism.",
        }),
        label: "Example MIC",
      },
    },
  ],
  organs: {
    lungs: { affinity: 0.8, target: true, therapeutic: "Reaches lung tissue and airway secretions to treat chest infections." },
    smallIntestine: { affinity: 1, therapeutic: "Well absorbed, with or without food.", sideEffects: "Disturbs gut bacteria: diarrhoea is common." },
    largeIntestine: { affinity: 0.8, sideEffects: "Changes in gut flora can, rarely, allow C. difficile overgrowth." },
    kidneys: {
      affinity: 1.4,
      target: true,
      therapeutic: "Concentrated in urine, which is why it can treat some urinary infections.",
      toxic: "Very high doses can form crystals in urine (crystalluria) and, rarely, kidney inflammation.",
    },
    bladder: { affinity: 1, therapeutic: "Unchanged drug collects here at concentrations far above plasma." },
    brain: { affinity: 0.1, sideEffects: "Barely crosses an intact blood–brain barrier." },
  },
  toxicity: {
    mechanism:
      "Acute overdose is usually mild because amoxicillin is not toxic to human cells. Very large amounts can crystallise in the kidney tubules. Allergic reactions are not dose-related and can happen at any dose.",
    warningSigns: ["Nausea, vomiting, diarrhoea", "Reduced urine or blood in urine (rare)", "Any rash, swelling or wheeze: possible allergy"],
    treatment: "Supportive care and fluids to keep urine flowing. Anaphylaxis is treated with adrenaline.",
    organs: ["kidneys"],
  },
  interactions: [
    { with: "Allopurinol", effect: "Higher chance of skin rash." },
    { with: "Methotrexate", effect: "Penicillins can reduce methotrexate clearance." },
    { with: "Warfarin", effect: "INR may rise; monitoring is advised." },
  ],
  didYouKnow: "It is often paired with clavulanic acid (co-amoxiclav), which disarms the β-lactamase enzymes some bacteria use to destroy amoxicillin.",
  modelNotes: ["For antibiotics the meaningful measure is time above the MIC of the infecting organism, which varies by bug."],
};
