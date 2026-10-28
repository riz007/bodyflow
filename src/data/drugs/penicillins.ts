import type { DrugInput } from "../schema";
import { frac, hrs, lkg, mg, mgL } from "./_v";

const penicillinMechanism =
  "Blocks the penicillin-binding proteins bacteria use to cross-link their cell wall, so growing bacteria burst. Human cells have no cell wall.";

const penicillinOrgans: DrugInput["organs"] = {
  lungs: { affinity: 0.8, target: true, therapeutic: "Treats streptococcal and pneumococcal infections, including pneumonia." },
  heart: { affinity: 0.8, target: true, therapeutic: "Used for infections of the heart valves (endocarditis) caused by susceptible bacteria." },
  kidneys: {
    affinity: 1.4,
    therapeutic: "Actively pumped into urine by the tubules, which is why it leaves the body so quickly.",
    toxic: "Very high doses can cause kidney inflammation (interstitial nephritis).",
  },
  bladder: { affinity: 1 },
  brain: {
    affinity: 0.15,
    sideEffects: "Normally barely enters the brain; inflamed meninges let more in, which is how it treats meningitis.",
    toxic: "At very high levels, especially with kidney failure, it can trigger seizures (penicillin neurotoxicity).",
  },
};

export const benzylpenicillin: DrugInput = {
  id: "benzylpenicillin",
  name: "Benzylpenicillin",
  altNames: ["Penicillin G"],
  brands: ["Crystapen", "Pfizerpen"],
  drugClass: "penicillin",
  classLabel: "Penicillin antibiotic",
  categories: ["Antibiotic", "ER"],
  mechanism: penicillinMechanism + " Given by injection because stomach acid destroys it.",
  components: [
    {
      id: "benzylpenicillin",
      name: "Benzylpenicillin",
      regimens: [
        {
          id: "iv",
          label: "IV injection",
          route: "iv-bolus",
          dose: mg(1200, "smpc-benzylpenicillin", { range: [600, 2400], note: "1.2 g ≈ 2 million units" }),
          note: "Given by slow IV injection over 3–5 minutes; modelled as a bolus.",
        },
      ],
      vd: lkg(0.3, "gg-appendix", { range: [0.2, 0.4], needsReview: true }),
      halfLife: hrs(0.5, "smpc-benzylpenicillin", { range: [0.4, 0.9] }),
      proteinBinding: frac(0.6, "smpc-benzylpenicillin", { range: [0.45, 0.68], needsReview: true }),
      fe: frac(0.75, "smpc-benzylpenicillin", { range: [0.6, 0.9], needsReview: true }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "About a fifth is metabolised in the liver to penicilloic acid; most is excreted unchanged by tubular secretion.",
      effectiveLevel: {
        ...mgL(0.06, "eucast-breakpoints", {
          needsReview: true,
          note: "Example only: EUCAST susceptible breakpoint for S. pneumoniae (non-meningitis).",
        }),
        label: "Example MIC",
      },
    },
  ],
  organs: penicillinOrgans,
  toxicity: {
    mechanism:
      "At very high concentrations penicillin blocks GABA-A receptors in the brain, lowering the seizure threshold. This mostly happens with kidney failure, when it cannot be cleared. Large doses of the potassium salt can also raise blood potassium.",
    warningSigns: ["Muscle twitching, confusion", "Seizures", "Any rash, swelling or wheeze: possible allergy (not dose-related)"],
    treatment: "Stopping or reducing the drug, benzodiazepines for seizures, and dialysis if kidneys have failed. Anaphylaxis is treated with adrenaline.",
    organs: ["brain", "kidneys"],
  },
  interactions: [
    { with: "Probenecid", effect: "Blocks tubular secretion, raising and prolonging penicillin levels (sometimes used on purpose)." },
    { with: "Methotrexate", effect: "Reduced methotrexate excretion." },
  ],
  didYouKnow:
    "In WWII penicillin was so scarce that it was recovered from patients' urine and reused, and probenecid was developed to slow its excretion.",
  modelNotes: ["Real IV kinetics show a fast distribution phase; a one-compartment model smooths this out."],
};

export const phenoxymethylpenicillin: DrugInput = {
  id: "phenoxymethylpenicillin",
  name: "Phenoxymethylpenicillin",
  altNames: ["Penicillin V"],
  brands: ["Penicillin VK", "Calvepen"],
  drugClass: "penicillin",
  classLabel: "Penicillin antibiotic",
  categories: ["Antibiotic", "Everyday"],
  mechanism: penicillinMechanism + " More acid-stable than penicillin G, so it works as a tablet.",
  components: [
    {
      id: "phenoxymethylpenicillin",
      name: "Penicillin V",
      regimens: [
        {
          id: "oral",
          label: "Oral tablet",
          route: "oral",
          dose: mg(500, "smpc-phenoxymethylpenicillin", { range: [250, 1000] }),
          absorption: {
            F: frac(0.6, "smpc-phenoxymethylpenicillin", { range: [0.6, 0.73], needsReview: true }),
            tmax: hrs(0.75, "smpc-phenoxymethylpenicillin", { range: [0.5, 1] }),
          },
        },
      ],
      vd: lkg(0.5, "gg-appendix", { needsReview: true }),
      halfLife: hrs(0.75, "smpc-phenoxymethylpenicillin", { range: [0.5, 1] }),
      proteinBinding: frac(0.8, "smpc-phenoxymethylpenicillin", { needsReview: true }),
      fe: frac(0.4, "smpc-phenoxymethylpenicillin", { range: [0.25, 0.4], needsReview: true }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Partly metabolised in the liver to penicilloic acid; the rest is excreted unchanged in urine.",
      effectiveLevel: {
        ...mgL(0.06, "eucast-breakpoints", {
          needsReview: true,
          note: "Example only: EUCAST susceptible breakpoint for streptococci.",
        }),
        label: "Example MIC",
      },
    },
  ],
  organs: {
    ...penicillinOrgans,
    smallIntestine: { affinity: 1, therapeutic: "Absorbed best on an empty stomach.", sideEffects: "Can cause nausea and diarrhoea.", toxic: "Large amounts mainly cause vomiting and diarrhoea." },
  },
  toxicity: {
    mechanism:
      "Oral overdose is rarely dangerous; mostly gut upset. As with all penicillins, allergic reactions are not dose-related.",
    warningSigns: ["Nausea, vomiting, diarrhoea", "Any rash, swelling or wheeze: possible allergy"],
    treatment: "Supportive care. Anaphylaxis is treated with adrenaline.",
    organs: ["smallIntestine"],
  },
  interactions: [
    { with: "Methotrexate", effect: "Reduced methotrexate excretion." },
    { with: "Oral typhoid vaccine", effect: "Antibiotics inactivate the live vaccine." },
  ],
  didYouKnow: "Penicillin V is still the first choice for strep throat in many countries, nearly 70 years after its introduction.",
  modelNotes: [],
};
