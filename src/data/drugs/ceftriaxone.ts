import type { DrugInput } from "../schema";
import { frac, hrs, litres, mg, mgL } from "./_v";

export const ceftriaxone: DrugInput = {
  id: "ceftriaxone",
  name: "Ceftriaxone",
  brands: ["Rocephin"],
  drugClass: "cephalosporin",
  classLabel: "3rd-generation cephalosporin",
  categories: ["Antibiotic", "ER"],
  mechanism:
    "Like penicillin, it blocks bacterial cell-wall construction, but it resists many bacterial enzymes and reaches the brain well when the meninges are inflamed. Its long half-life allows once-daily dosing.",
  components: [
    {
      id: "ceftriaxone",
      name: "Ceftriaxone",
      regimens: [
        {
          id: "iv",
          label: "IV infusion (30 min)",
          route: "iv-infusion",
          dose: mg(1000, "dailymed-ceftriaxone", { range: [1000, 2000] }),
          infusionDuration: hrs(0.5, "dailymed-ceftriaxone"),
          reportedCmax: mgL(150.7, "dailymed-ceftriaxone", { note: "1 g IV over 30 min, total (bound + free) drug" }),
        },
      ],
      vd: litres(9, "dailymed-ceftriaxone", { range: [5.8, 13.5] }),
      halfLife: hrs(7, "dailymed-ceftriaxone", { range: [5.8, 8.7] }),
      proteinBinding: frac(0.9, "dailymed-ceftriaxone", { range: [0.85, 0.95], note: "Decreases at higher concentrations" }),
      fe: frac(0.5, "dailymed-ceftriaxone", { range: [0.33, 0.67] }),
      nonRenalRoute: "biliary",
      metabolism: "Not metabolised. Roughly half is excreted unchanged in urine and half in bile into the gut.",
      effectiveLevel: {
        ...mgL(0.5, "eucast-breakpoints", {
          needsReview: true,
          note: "Example only: EUCAST susceptible breakpoint for S. pneumoniae (non-meningitis).",
        }),
        label: "Example MIC",
      },
    },
  ],
  organs: {
    brain: {
      affinity: 0.3,
      target: true,
      therapeutic: "Penetrates inflamed meninges well: a first-line treatment for bacterial meningitis.",
      toxic: "Very high levels, especially with kidney failure, can cause encephalopathy.",
    },
    lungs: { affinity: 0.8, target: true, therapeutic: "Treats severe pneumonia." },
    liver: {
      affinity: 1.2,
      therapeutic: "Secreted into bile unchanged.",
      sideEffects: "Can precipitate with calcium in the gallbladder as 'biliary sludge' (pseudolithiasis), usually reversible.",
      toxic: "High biliary concentrations make calcium–ceftriaxone sludge more likely, causing gallbladder pain.",
    },
    largeIntestine: { affinity: 1, sideEffects: "Drug excreted in bile alters gut flora; C. difficile risk." },
    kidneys: { affinity: 1.2, therapeutic: "Excrete about half the dose unchanged.", toxic: "Calcium–ceftriaxone precipitates can, rarely, form kidney stones." },
    bladder: { affinity: 1 },
  },
  toxicity: {
    mechanism:
      "Ceftriaxone binds calcium. At high concentrations it can precipitate in the gallbladder and kidneys. Very high brain levels lower the seizure threshold.",
    warningSigns: ["Abdominal pain under the right ribs", "Reduced urine output", "Confusion or seizures (rare)", "Any rash or wheeze: possible allergy"],
    treatment: "Stopping the drug usually reverses sludge. Supportive care; seizures are treated with benzodiazepines.",
    organs: ["liver", "kidneys", "brain"],
  },
  interactions: [
    { with: "IV calcium (especially in newborns)", effect: "Fatal lung and kidney precipitates have occurred; never mixed or co-infused." },
    { with: "Warfarin", effect: "May raise INR." },
  ],
  didYouKnow: "A single injection of ceftriaxone is a standard treatment for gonorrhoea worldwide.",
  modelNotes: ["Protein binding falls as concentration rises, so free drug rises more than proportionally. This model ignores that."],
};
