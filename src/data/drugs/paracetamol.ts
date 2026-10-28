import type { DrugInput } from "../schema";
import { frac, hrs, lkg, mg, mgL } from "./_v";

export const paracetamol: DrugInput = {
  id: "paracetamol",
  name: "Paracetamol",
  altNames: ["Acetaminophen", "APAP"],
  brands: ["Panadol", "Tylenol", "Calpol"],
  drugClass: "analgesic",
  classLabel: "Analgesic / antipyretic",
  categories: ["Everyday"],
  mechanism:
    "Reduces pain and fever mainly inside the brain and spinal cord, by damping prostaglandin production and acting on pain-signalling pathways. Unlike ibuprofen it has very little anti-inflammatory effect in the rest of the body.",
  components: [
    {
      id: "paracetamol",
      name: "Paracetamol",
      regimens: [
        {
          id: "oral",
          label: "Oral tablet",
          route: "oral",
          dose: mg(1000, "statpearls-acetaminophen", { range: [500, 1000], note: "Typical adult single dose" }),
          absorption: {
            F: frac(0.88, "gg-appendix", { range: [0.63, 0.89] }),
            tmax: hrs(0.75, "gg-appendix", { range: [0.33, 1.4], note: "Slower with food" }),
          },
        },
      ],
      vd: lkg(0.95, "gg-appendix", { range: [0.83, 1.07] }),
      halfLife: hrs(2, "gg-appendix", { range: [1.6, 3] }),
      proteinBinding: frac(0.2, "statpearls-acetaminophen", { range: [0.1, 0.25] }),
      fe: frac(0.03, "gg-appendix", { range: [0.01, 0.05] }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism:
        "Liver: glucuronidation (~55%) and sulfation (~30%) to harmless conjugates; a small share (~5–10%) via CYP2E1 to the reactive metabolite NAPQI, which glutathione normally neutralises.",
      effectiveLevel: {
        ...mgL(10, "statpearls-acetaminophen", {
          range: [10, 20],
          needsReview: true,
          note: "Commonly quoted analgesic/antipyretic range; effect correlates loosely with plasma level.",
        }),
        label: "Analgesic range",
      },
    },
  ],
  organs: {
    brain: {
      affinity: 1,
      target: true,
      therapeutic: "Raises the pain threshold and resets the hypothalamic thermostat, bringing a fever down.",
      toxic: "Confusion and drowsiness only appear late, when liver failure causes encephalopathy.",
    },
    liver: {
      affinity: 1.4,
      therapeutic: "Converts paracetamol into inactive conjugates that the kidneys then remove.",
      sideEffects: "At normal doses the small NAPQI by-product is neutralised by glutathione.",
      toxic:
        "Glutathione runs out, NAPQI builds up and binds to liver-cell proteins, killing cells around the central veins (centrilobular necrosis).",
    },
    stomach: { affinity: 0.6, therapeutic: "Gentle on the stomach compared with NSAIDs." },
    smallIntestine: { affinity: 1, therapeutic: "Rapidly absorbed here into the portal blood." },
    kidneys: {
      affinity: 0.8,
      therapeutic: "Excrete the conjugated metabolites; only a few percent leaves unchanged.",
      toxic: "Acute kidney injury can accompany severe overdose.",
    },
  },
  toxicity: {
    mechanism:
      "Too much paracetamol overwhelms the safe conjugation pathways. More is diverted to CYP2E1, producing NAPQI faster than the liver's glutathione can neutralise it. Once glutathione is depleted, NAPQI injures liver cells.",
    warningSigns: [
      "Often no symptoms in the first 24 hours: feeling fine is not reassurance",
      "Nausea, vomiting, sweating",
      "Pain under the right ribs",
      "Yellowing of skin or eyes, confusion (late signs)",
    ],
    treatment:
      "Acetylcysteine (NAC) replenishes glutathione and is highly effective, especially when started early. Seek emergency care immediately, even without symptoms.",
    organs: ["liver", "kidneys"],
  },
  interactions: [
    { with: "Other paracetamol-containing products", effect: "Accidental double-dosing; many cold and flu remedies contain it." },
    { with: "Regular heavy alcohol use", effect: "Induces CYP2E1 and lowers glutathione reserves, increasing liver risk." },
    { with: "Warfarin", effect: "Regular use can raise INR (bleeding tendency)." },
  ],
  didYouKnow:
    "Paracetamol overdose is a leading cause of acute liver failure in the UK and US, and often follows accidental double-dosing from combination products.",
  modelNotes: [
    "In overdose, conjugation saturates and the real half-life lengthens; the curve here scales linearly with dose.",
  ],
};
