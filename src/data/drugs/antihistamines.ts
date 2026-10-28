import type { DrugInput } from "../schema";
import { frac, hrs, lkg, mg, mgL } from "./_v";

const firstGenToxicity = (extra: string): DrugInput["toxicity"] => ({
  mechanism:
    "First-generation antihistamines cross into the brain and also block acetylcholine receptors. In overdose this causes an anticholinergic syndrome: the body's 'rest and digest' signals switch off. " +
    extra,
  warningSigns: [
    "Severe drowsiness or, especially in children, agitation and hallucinations",
    "Hot, dry, flushed skin; dilated pupils",
    "Fast heartbeat, difficulty passing urine",
    "Seizures",
  ],
  treatment:
    "Emergency supportive care: cooling, benzodiazepines for agitation or seizures, heart monitoring. Physostigmine is sometimes used by specialists for severe anticholinergic delirium.",
  organs: ["brain", "heart", "bladder"],
});

const sedativeInteractions: DrugInput["interactions"] = [
  { with: "Alcohol, benzodiazepines, opioids", effect: "Additive sedation and breathing suppression." },
  { with: "Other anticholinergics (some antidepressants, bladder drugs)", effect: "Confusion, constipation, urinary retention, especially in older adults." },
];

export const promethazine: DrugInput = {
  id: "promethazine",
  name: "Promethazine",
  brands: ["Phenergan", "Avomin (as promethazine teoclate)"],
  drugClass: "antihistamine",
  classLabel: "1st-generation antihistamine (phenothiazine)",
  categories: ["CNS", "Everyday"],
  mechanism:
    "Blocks histamine H1 receptors (allergy and nausea), plus acetylcholine and dopamine receptors. That makes it a strong sedative and anti-sickness drug.",
  components: [
    {
      id: "promethazine",
      name: "Promethazine",
      regimens: [
        {
          id: "oral",
          label: "Oral tablet",
          route: "oral",
          dose: mg(25, "dailymed-promethazine", { range: [10, 25], note: "Promethazine hydrochloride" }),
          absorption: {
            F: frac(0.25, "gg-appendix", { note: "Extensive first-pass metabolism" }),
            tmax: hrs(2.8, "dailymed-promethazine", { range: [2, 3], needsReview: true }),
          },
          note: "Avomin contains promethazine teoclate, a different salt, so its mg strength is not directly equivalent.",
        },
      ],
      vd: lkg(13, "gg-appendix", { range: [9, 19], needsReview: true }),
      halfLife: hrs(12, "dailymed-promethazine", { range: [10, 19], needsReview: true }),
      proteinBinding: frac(0.93, "dailymed-promethazine", { range: [0.76, 0.93], needsReview: true }),
      fe: frac(0.01, "gg-appendix", { needsReview: true }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: sulfoxidation and N-demethylation, largely via CYP2D6.",
      noThresholdReason: "Sedative and anti-nausea effects correlate poorly with plasma level, and no therapeutic range is used clinically.",
    },
  ],
  organs: {
    brain: {
      affinity: 1.6,
      target: true,
      therapeutic: "Blocks histamine and dopamine in the vomiting centre and inner-ear pathways, so it prevents motion sickness and nausea.",
      sideEffects: "Marked drowsiness: often used as a sleep aid.",
      toxic: "Agitation, delirium, hallucinations or deep coma; seizures. In children under 2 it can fatally suppress breathing.",
    },
    heart: { affinity: 0.8, toxic: "Fast heart rate and, rarely, rhythm disturbances." },
    bladder: { affinity: 0.3, toxic: "Anticholinergic effect can stop the bladder emptying." },
    liver: { affinity: 1.2, therapeutic: "Heavy first-pass metabolism means only about a quarter of a tablet reaches the blood." },
    vessels: { affinity: 1, sideEffects: "Injected into or near an artery it can cause severe tissue injury (FDA boxed warning)." },
  },
  toxicity: firstGenToxicity("Promethazine is also a phenothiazine, so it can cause abnormal movements."),
  interactions: [...sedativeInteractions],
  didYouKnow: "Promethazine is a phenothiazine, the chemical family that led to the first antipsychotic, chlorpromazine.",
  modelNotes: [],
};

export const chlorphenamine: DrugInput = {
  id: "chlorphenamine",
  name: "Chlorphenamine",
  altNames: ["Chlorpheniramine"],
  brands: ["Piriton", "Histacin", "Chlor-Trimeton"],
  drugClass: "antihistamine",
  classLabel: "1st-generation antihistamine",
  categories: ["Everyday", "ER"],
  mechanism:
    "Blocks histamine H1 receptors, relieving itching, sneezing, hives and swelling. It crosses into the brain, so it also causes drowsiness.",
  components: [
    {
      id: "chlorphenamine",
      name: "Chlorphenamine",
      regimens: [
        {
          id: "oral",
          label: "Oral tablet",
          route: "oral",
          dose: mg(4, "statpearls-chlorpheniramine"),
          absorption: {
            F: frac(0.4, "statpearls-chlorpheniramine", { range: [0.25, 0.5], needsReview: true }),
            tmax: hrs(3, "statpearls-chlorpheniramine", { range: [2.5, 6] }),
          },
        },
      ],
      vd: lkg(3.2, "gg-appendix", { range: [2.5, 3.5], needsReview: true }),
      halfLife: hrs(20, "statpearls-chlorpheniramine", { range: [12, 43] }),
      proteinBinding: frac(0.7, "statpearls-chlorpheniramine", { needsReview: true }),
      fe: frac(0.2, "gg-appendix", { needsReview: true }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: N-demethylation (CYP2D6 involved) to inactive metabolites.",
      noThresholdReason: "Antihistamine effect depends on receptor occupancy in skin and airway tissue; no plasma range is used clinically.",
    },
  ],
  organs: {
    vessels: { affinity: 1, target: true, therapeutic: "Stops histamine making small vessels leak, so it reduces hives and swelling." },
    lungs: { affinity: 0.8, target: true, therapeutic: "Reduces sneezing and runny nose." },
    brain: {
      affinity: 1.3,
      sideEffects: "Drowsiness and slowed reactions: do not drive.",
      toxic: "Excitation, hallucinations and seizures, particularly in children.",
    },
    heart: { affinity: 0.8, toxic: "Fast heart rate and rhythm disturbances." },
    bladder: { affinity: 0.3, toxic: "Urinary retention." },
  },
  toxicity: firstGenToxicity(""),
  interactions: [...sedativeInteractions],
  didYouKnow: "IV chlorphenamine is part of emergency anaphylaxis care in many countries, after adrenaline, to ease itching and hives.",
  modelNotes: [],
};

export const cetirizine: DrugInput = {
  id: "cetirizine",
  name: "Cetirizine",
  brands: ["Zyrtec", "Piriteze", "Reactine"],
  drugClass: "antihistamine",
  classLabel: "2nd-generation antihistamine",
  categories: ["Everyday"],
  mechanism:
    "Blocks histamine H1 receptors for allergy relief. It is a 'second-generation' antihistamine that is largely pumped back out of the brain, so it causes far less drowsiness.",
  components: [
    {
      id: "cetirizine",
      name: "Cetirizine",
      regimens: [
        {
          id: "oral",
          label: "Oral tablet",
          route: "oral",
          dose: mg(10, "dailymed-cetirizine"),
          absorption: {
            F: frac(1, "dailymed-cetirizine", { note: "Absolute F not determined; volume given as V/F" }),
            tmax: hrs(1, "dailymed-cetirizine"),
          },
          reportedCmax: mgL(0.311, "dailymed-cetirizine", { note: "311 ng/mL after 10 mg" }),
        },
      ],
      vd: lkg(0.45, "dailymed-cetirizine", { basis: "V/F" }),
      halfLife: hrs(8.3, "dailymed-cetirizine", { range: [6.5, 10] }),
      proteinBinding: frac(0.93, "dailymed-cetirizine"),
      fe: frac(0.5, "dailymed-cetirizine", { note: "~70% recovered in urine, ~half of dose unchanged", needsReview: true }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Very little metabolism; mostly excreted unchanged by the kidneys.",
      noThresholdReason: "Effect on skin weals outlasts plasma levels; no plasma range is used clinically.",
    },
  ],
  organs: {
    vessels: { affinity: 1, target: true, therapeutic: "Reduces histamine-driven leakiness: less itching, hives and swelling." },
    lungs: { affinity: 0.8, target: true, therapeutic: "Relieves hay-fever sneezing and runny nose." },
    brain: { affinity: 0.2, sideEffects: "Mild drowsiness in some people.", toxic: "Restlessness and irritability, then drowsiness." },
    kidneys: { affinity: 1.2, therapeutic: "Excrete it largely unchanged; dose is reduced in kidney disease." },
    heart: { affinity: 0.8, toxic: "Fast heart rate." },
  },
  toxicity: {
    mechanism:
      "Overdose mainly exaggerates its effects: drowsiness, or restlessness in children. It is much less anticholinergic than older antihistamines.",
    warningSigns: ["Marked drowsiness or agitation", "Fast heartbeat", "Difficulty passing urine"],
    treatment: "Supportive care; serious toxicity is uncommon.",
    organs: ["brain"],
  },
  interactions: [{ with: "Alcohol and other sedatives", effect: "Can add to drowsiness in some people." }],
  didYouKnow: "Cetirizine is the active metabolite of the older antihistamine hydroxyzine, which is far more sedating.",
  modelNotes: [],
};
