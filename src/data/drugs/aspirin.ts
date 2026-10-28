import type { DrugInput } from "../schema";
import { frac, hrs, lkg, mg, mgL } from "./_v";

export const aspirin: DrugInput = {
  id: "aspirin",
  name: "Aspirin",
  altNames: ["Acetylsalicylic acid"],
  brands: ["Disprin", "Bayer Aspirin", "Ecotrin"],
  drugClass: "nsaid",
  classLabel: "Salicylate / NSAID",
  categories: ["Everyday"],
  mechanism:
    "Permanently disables the COX enzyme by attaching an acetyl group to it. In platelets, which cannot make new enzyme, this lasts their whole 7–10 day life, which is why low-dose aspirin thins the blood. At higher doses, its breakdown product salicylate relieves pain, fever and inflammation.",
  components: [
    {
      id: "salicylate",
      name: "Salicylate",
      measuredMoiety: "Salicylic acid (aspirin is converted to it within ~20 minutes)",
      moietyFactor: { value: 0.767, source: "statpearls-salicylate-tox", note: "Molecular weight ratio 138/180" },
      regimens: [
        {
          id: "oral",
          label: "Oral tablet (analgesic dose)",
          route: "oral",
          dose: mg(600, "gg-appendix", { range: [300, 900], note: "Typical adult analgesic dose of aspirin" }),
          absorption: {
            F: frac(1, "gg-appendix", { note: "Systemic availability of salicylate from aspirin is near complete", needsReview: true }),
            tmax: hrs(1, "statpearls-salicylate-tox", { range: [0.5, 2] }),
          },
        },
      ],
      vd: lkg(0.17, "statpearls-salicylate-tox", { range: [0.15, 0.2] }),
      halfLife: hrs(2.5, "statpearls-salicylate-tox", {
        range: [2, 4.5],
        note: "At therapeutic doses; rises to 15–30 h in overdose as metabolism saturates",
      }),
      proteinBinding: frac(0.85, "statpearls-salicylate-tox", { range: [0.8, 0.9], note: "Falls as concentration rises" }),
      fe: frac(0.1, "gg-appendix", { range: [0.02, 0.3], note: "Strongly dependent on urine pH" }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: conjugation with glycine (salicyluric acid) and glucuronic acid; these pathways saturate at high doses.",
      effectiveLevel: {
        ...mgL(30, "gg-appendix", {
          range: [30, 100],
          needsReview: true,
          note: "Analgesic/antipyretic range. The 150–300 mg/L (15–30 mg/dL) range often quoted as 'therapeutic' is the higher anti-inflammatory range.",
        }),
        label: "Analgesic range",
      },
    },
  ],
  organs: {
    vessels: { affinity: 1, target: true, therapeutic: "Platelets lose their COX-1 for life, so clots form less readily." },
    brain: {
      affinity: 0.5,
      target: true,
      therapeutic: "Lowers fever and reduces pain.",
      toxic: "Tinnitus, confusion, agitation; salicylate stimulates the breathing centre, driving fast, deep breathing.",
    },
    stomach: {
      affinity: 1.4,
      sideEffects: "Direct irritation plus loss of protective prostaglandins: indigestion and bleeding risk.",
      toxic: "Bleeding erosions; aspirin tablets can clump into a mass that keeps releasing drug.",
    },
    lungs: { affinity: 0.8, toxic: "Non-cardiogenic pulmonary oedema (fluid in the lungs) in severe poisoning." },
    kidneys: { affinity: 1, therapeutic: "Excrete salicylate and its conjugates; alkaline urine speeds this up.", toxic: "Kidney injury." },
    liver: { affinity: 1, therapeutic: "Conjugates salicylate for excretion." },
  },
  toxicity: {
    mechanism:
      "Salicylate uncouples the cell's energy factories (mitochondria), so heat and acid build up. It also stimulates the brainstem breathing centre. Metabolism saturates, so levels fall far more slowly than at normal doses.",
    warningSigns: ["Ringing in the ears, hearing loss", "Nausea and vomiting", "Fast, deep breathing", "Fever, sweating, confusion"],
    treatment:
      "Hospital treatment works: activated charcoal, sodium bicarbonate to make the urine alkaline so salicylate is excreted faster, and haemodialysis in severe cases.",
    organs: ["brain", "lungs", "stomach", "kidneys"],
  },
  interactions: [
    { with: "Anticoagulants and other NSAIDs", effect: "Additive bleeding risk." },
    { with: "Methotrexate", effect: "Reduces methotrexate excretion, raising toxicity." },
    { with: "Children and teenagers with viral illness", effect: "Linked to Reye's syndrome; avoided under 16 in the UK." },
  ],
  didYouKnow: "Salicylates come from willow bark, used for pain for thousands of years. Bayer branded synthetic acetylsalicylic acid as 'Aspirin' in 1899.",
  modelNotes: [
    "The curve shows salicylate, the main active product in plasma. Aspirin itself has a half-life of only ~15–20 minutes.",
    "Salicylate elimination saturates at high doses, so in overdose real levels stay high far longer than this linear model shows.",
  ],
};
