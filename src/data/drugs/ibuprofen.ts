import type { DrugInput } from "../schema";
import { frac, hrs, lkg, mg } from "./_v";

export const ibuprofen: DrugInput = {
  id: "ibuprofen",
  name: "Ibuprofen",
  brands: ["Nurofen", "Advil", "Brufen", "Motrin"],
  drugClass: "nsaid",
  classLabel: "NSAID",
  categories: ["Everyday"],
  mechanism:
    "Blocks the COX-1 and COX-2 enzymes that make prostaglandins, the chemical messengers of pain, fever and inflammation. Because prostaglandins also protect the stomach lining and keep blood flowing to the kidneys, blocking them explains the main side effects.",
  components: [
    {
      id: "ibuprofen",
      name: "Ibuprofen",
      regimens: [
        {
          id: "oral",
          label: "Oral tablet",
          route: "oral",
          dose: mg(400, "dailymed-ibuprofen", { range: [200, 400], note: "Typical adult single dose" }),
          absorption: {
            F: frac(0.9, "gg-appendix", { range: [0.8, 1], needsReview: true }),
            tmax: hrs(1.5, "dailymed-ibuprofen", { range: [1, 2] }),
          },
        },
      ],
      vd: lkg(0.15, "gg-appendix", { range: [0.1, 0.2] }),
      halfLife: hrs(2, "dailymed-ibuprofen", { range: [1.8, 2.5] }),
      proteinBinding: frac(0.99, "dailymed-ibuprofen"),
      fe: frac(0.01, "gg-appendix", { range: [0, 0.01] }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: oxidation mainly by CYP2C9 to inactive metabolites, which the kidneys then excrete.",
      noThresholdReason:
        "Pain relief tracks the drug's concentration at the site of inflammation and its effect on COX, not a single plasma cut-off.",
    },
  ],
  organs: {
    brain: { affinity: 0.4, target: true, therapeutic: "Lowers fever by reducing prostaglandins in the hypothalamus." },
    stomach: {
      affinity: 1.2,
      sideEffects: "Less protective prostaglandin means less mucus and bicarbonate, so the lining is more exposed to acid.",
      toxic: "Erosions, ulcers and bleeding of the stomach lining; vomiting blood or black stools.",
    },
    kidneys: {
      affinity: 1,
      sideEffects: "Prostaglandins keep kidney blood vessels open; blocking them can reduce kidney blood flow, especially when dehydrated.",
      toxic: "Acute kidney injury from reduced renal blood flow.",
    },
    heart: { affinity: 0.8, sideEffects: "Regular long-term use slightly raises cardiovascular risk and can raise blood pressure." },
    vessels: { affinity: 1, target: true, therapeutic: "Reduces inflammatory swelling throughout tissues." },
    liver: { affinity: 1, therapeutic: "Metabolised here by CYP2C9." },
  },
  toxicity: {
    mechanism:
      "Very high levels cause widespread prostaglandin loss (stomach injury, reduced kidney blood flow). Massive overdoses also cause metabolic acidosis and depress the nervous system.",
    warningSigns: ["Stomach pain, nausea, vomiting", "Drowsiness, dizziness, ringing in the ears", "Reduced urine output", "Rarely: seizures, very low blood pressure"],
    treatment: "There is no specific antidote; supportive hospital care (fluids, stomach protection, monitoring kidneys) is effective.",
    organs: ["stomach", "kidneys"],
  },
  interactions: [
    { with: "Anticoagulants (warfarin, DOACs)", effect: "Higher bleeding risk, especially from the gut." },
    { with: "ACE inhibitors / ARBs + diuretics", effect: "The 'triple whammy': together they can cause acute kidney injury." },
    { with: "Low-dose aspirin", effect: "Taken just before aspirin, ibuprofen can block aspirin's heart-protective effect on platelets." },
  ],
  didYouKnow: "Ibuprofen was discovered in the 1960s by Boots in Nottingham; one of its inventors tested it on his own hangover.",
  modelNotes: [],
};
