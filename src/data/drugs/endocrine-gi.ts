import type { DrugInput } from "../schema";
import { frac, hrs, litres, lkg, mg, mgL, oral } from "./_v";

export const levothyroxine: DrugInput = {
  id: "levothyroxine",
  name: "Levothyroxine",
  altNames: ["L-thyroxine", "T4"],
  brands: ["Synthroid", "Eltroxin", "Euthyrox"],
  drugClass: "thyroid-hormone",
  classLabel: "Synthetic thyroid hormone",
  categories: ["Endocrine", "Everyday"],
  mechanism:
    "Identical to the body's own thyroxine (T4). Tissues convert it to the active hormone T3, which sets the pace of metabolism in almost every cell. Replaces missing hormone when the thyroid is underactive.",
  relativeOnly: true,
  components: [
    {
      id: "levothyroxine",
      name: "Levothyroxine",
      regimens: [
        oral(mg(0.1, "dailymed-levothyroxine", { range: [0.025, 0.2], note: "Dose is individual, usually ~1.6 µg/kg/day" }), frac(0.7, "dailymed-levothyroxine", { range: [0.4, 0.8] }), hrs(2, "dailymed-levothyroxine", { range: [2, 4], needsReview: true }), {
          label: "Tablet (empty stomach)",
        }),
      ],
      vd: litres(12, "dailymed-levothyroxine", { range: [10, 12], needsReview: true }),
      halfLife: hrs(168, "dailymed-levothyroxine", { range: [144, 192], note: "6–7 days in normal thyroid function" }),
      proteinBinding: frac(0.99, "dailymed-levothyroxine", { note: ">99%, to TBG, transthyretin and albumin" }),
      fe: frac(0.01, "needs-source", { needsReview: true }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Deiodinated in liver, kidney and other tissues to active T3 and inactive reverse T3; conjugates excreted in bile.",
      noThresholdReason: "The body makes T4 too. Dosing is adjusted to TSH blood tests after 6–8 weeks, not to drug levels.",
    },
  ],
  organs: {
    heart: {
      affinity: 1.4,
      target: true,
      therapeutic: "Restores normal heart rate and strength.",
      sideEffects: "Too high a dose causes palpitations.",
      toxic: "Fast heart rate, atrial fibrillation, angina.",
    },
    brain: { affinity: 1, target: true, therapeutic: "Lifts the slowness, low mood and poor concentration of hypothyroidism.", toxic: "Anxiety, tremor, insomnia; rarely seizures." },
    liver: { affinity: 1.3, therapeutic: "Converts T4 to active T3." },
    smallIntestine: { affinity: 1, therapeutic: "Absorbed best on an empty stomach; calcium, iron and coffee reduce absorption." },
    vessels: { affinity: 1, target: true, therapeutic: "Raises metabolic rate in tissues throughout the body.", toxic: "Overheating, sweating, weight loss." },
  },
  toxicity: {
    mechanism: "Excess thyroid hormone speeds up metabolism (thyrotoxicosis). Because T4 is converted to T3 over days, symptoms of an overdose may be delayed.",
    warningSigns: ["Racing or irregular heartbeat", "Shaking, anxiety, sweating", "Fever, diarrhoea", "Chest pain"],
    treatment: "Supportive care; beta-blockers control heart rate. Effects can last days.",
    organs: ["heart", "brain", "vessels"],
  },
  interactions: [
    { with: "Calcium, iron, PPIs, antacids", effect: "Reduce absorption; take 4 h apart." },
    { with: "Warfarin", effect: "Starting or increasing levothyroxine raises INR." },
    { with: "Coffee, soya", effect: "Can reduce absorption when taken together." },
  ],
  didYouKnow: "Levothyroxine is one of the most prescribed medicines in the world; levels are checked about six weeks after a change because of its week-long half-life.",
  modelNotes: ["Absolute levels are not shown because the body makes its own thyroxine; the curve shows the added dose only."],
};

export const insulinGlargine: DrugInput = {
  id: "insulin-glargine",
  name: "Insulin glargine",
  brands: ["Lantus", "Toujeo", "Abasaglar"],
  drugClass: "insulin",
  classLabel: "Long-acting basal insulin",
  categories: ["Endocrine"],
  mechanism:
    "A modified insulin that forms tiny crystals under the skin and dissolves slowly, giving a steady background insulin level for about 24 hours. Insulin moves glucose into muscle and fat and stops the liver releasing more.",
  relativeOnly: true,
  components: [
    {
      id: "insulin-glargine",
      name: "Insulin glargine",
      regimens: [
        {
          id: "sc",
          label: "Subcutaneous injection",
          route: "sc",
          dose: mg(0.36, "dailymed-glargine", { note: "≈10 units (1 unit ≈ 0.036 mg); doses are individual" }),
          absorption: {
            F: frac(1, "needs-source", { needsReview: true }),
            tmax: hrs(8, "needs-source", { needsReview: true, note: "Profile is relatively flat with no pronounced peak" }),
          },
          note: "Absorption from under the skin is slow and steady, so the curve's shape reflects absorption.",
        },
      ],
      vd: lkg(0.15, "needs-source", { needsReview: true, note: "Placeholder: only sets the absolute scale, which is not shown" }),
      halfLife: hrs(12, "dailymed-glargine", { needsReview: true, note: "Apparent half-life after subcutaneous dosing" }),
      proteinBinding: frac(0, "needs-source", { needsReview: true }),
      fe: frac(0, "needs-source", { needsReview: true, note: "Degraded by tissues, not excreted unchanged" }),
      nonRenalRoute: "tissue-uptake",
      metabolism: "Converted under the skin to active metabolite M1; cleared by insulin-receptor uptake and degradation in liver, kidney and muscle.",
      noThresholdReason: "Dosing is adjusted to blood glucose readings, not insulin levels; the body also makes insulin.",
    },
  ],
  organs: {
    liver: { affinity: 1.4, target: true, therapeutic: "Stops the liver releasing glucose overnight and between meals." },
    vessels: {
      affinity: 1,
      target: true,
      therapeutic: "Moves glucose from blood into muscle and fat.",
      toxic: "Blood sugar falls too low (hypoglycaemia); potassium also shifts into cells.",
    },
    brain: {
      affinity: 0.4,
      sideEffects: "The brain depends on glucose: hypos cause shakiness, sweating and confusion.",
      toxic: "Severe hypoglycaemia: seizures, coma, and brain injury if untreated.",
    },
    pancreas: { affinity: 0.8, therapeutic: "Replaces the background insulin the pancreas can no longer make." },
    kidneys: { affinity: 1, therapeutic: "Degrade insulin; needs often fall in kidney disease." },
  },
  toxicity: {
    mechanism: "Too much insulin drives blood sugar dangerously low. Because glargine is long-acting, low sugar can recur for many hours.",
    warningSigns: ["Shaking, sweating, hunger", "Confusion, unusual behaviour", "Drowsiness, seizures, unconsciousness"],
    treatment: "Fast-acting sugar if awake; glucagon or IV glucose in an emergency. Prolonged monitoring after a large overdose.",
    organs: ["vessels", "brain"],
  },
  interactions: [
    { with: "Sulfonylureas (gliclazide)", effect: "Additive risk of low blood sugar." },
    { with: "Beta-blockers", effect: "Mask the warning signs of a hypo." },
    { with: "Alcohol", effect: "Blocks the liver's glucose release: delayed hypos." },
  ],
  didYouKnow: "Glargine is human insulin with two extra arginines and one swapped amino acid, which makes it precipitate under the skin.",
  modelNotes: [
    "One-compartment kinetics cannot show glargine's flat, peakless profile; the broad hump here is an illustrative approximation.",
    "Absolute levels are not shown.",
  ],
};

export const gliclazide: DrugInput = {
  id: "gliclazide",
  name: "Gliclazide",
  altNames: ["Glipizide (related sulfonylurea)"],
  brands: ["Diamicron", "Glucotrol (glipizide)"],
  drugClass: "sulfonylurea",
  classLabel: "Sulfonylurea antidiabetic",
  categories: ["Endocrine"],
  mechanism:
    "Closes ATP-sensitive potassium channels on the pancreas's beta cells, which triggers insulin release whatever the blood sugar. That makes it effective, but able to cause low blood sugar.",
  components: [
    {
      id: "gliclazide",
      name: "Gliclazide",
      regimens: [oral(mg(80, "smpc-gliclazide", { range: [40, 160] }), frac(0.95, "smpc-gliclazide", { needsReview: true }), hrs(4, "smpc-gliclazide", { range: [2, 6], needsReview: true }), { label: "Tablet (immediate release)" })],
      vd: litres(19, "smpc-gliclazide", { range: [13, 24], needsReview: true }),
      halfLife: hrs(10.4, "smpc-gliclazide", { range: [8, 20] }),
      proteinBinding: frac(0.94, "smpc-gliclazide"),
      fe: frac(0.01, "smpc-gliclazide", { note: "<1% unchanged in urine" }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: CYP2C9 (and 2C19) to inactive metabolites.",
      noThresholdReason: "Glucose lowering is judged by blood glucose and HbA1c, not drug levels.",
    },
  ],
  organs: {
    pancreas: {
      affinity: 1.8,
      target: true,
      therapeutic: "Makes beta cells release insulin.",
      toxic: "Keeps forcing insulin release long after blood sugar is low.",
    },
    vessels: { affinity: 1, toxic: "Prolonged, recurrent hypoglycaemia." },
    brain: {
      affinity: 0.3,
      sideEffects: "Hypos: shakiness, sweating, confusion.",
      toxic: "Severe hypoglycaemia: seizures and coma.",
    },
    liver: { affinity: 1.3, therapeutic: "Metabolised by CYP2C9." },
  },
  toxicity: {
    mechanism: "Too much drives insulin release that cannot be switched off, so blood sugar falls and can stay low for a day or more.",
    warningSigns: ["Shaking, sweating, hunger", "Confusion", "Drowsiness, seizures, unconsciousness"],
    treatment: "IV glucose and hospital monitoring; octreotide blocks further insulin release.",
    organs: ["pancreas", "vessels", "brain"],
  },
  interactions: [
    { with: "Fluconazole, co-trimoxazole", effect: "Raise levels: hypoglycaemia." },
    { with: "Beta-blockers", effect: "Mask hypo symptoms." },
    { with: "Alcohol", effect: "Increases hypo risk." },
  ],
  didYouKnow: "Sulfonylureas were discovered in the 1940s when a sulfonamide antibiotic caused unexpected low blood sugar in patients with typhoid.",
  modelNotes: ["Glipizide works the same way but is shorter-acting (half-life 2–5 h); values here are for gliclazide."],
};

export const pantoprazole: DrugInput = {
  id: "pantoprazole",
  name: "Pantoprazole",
  brands: ["Protonix", "Protium"],
  drugClass: "ppi",
  classLabel: "Proton pump inhibitor",
  categories: ["GI", "Everyday"],
  mechanism:
    "Like omeprazole, it permanently disables the stomach's acid pumps. It has fewer drug interactions than omeprazole, which is why it is preferred with clopidogrel.",
  components: [
    {
      id: "pantoprazole",
      name: "Pantoprazole",
      regimens: [
        {
          ...oral(mg(40, "dailymed-pantoprazole", { range: [20, 40] }), frac(0.77, "dailymed-pantoprazole"), hrs(2.5, "dailymed-pantoprazole", { range: [2, 3] }), {
            label: "Gastro-resistant tablet",
            reportedCmax: mgL(2.5, "dailymed-pantoprazole", { note: "After 40 mg" }),
          }),
          absorption: {
            F: frac(0.77, "dailymed-pantoprazole"),
            tmax: hrs(2.5, "dailymed-pantoprazole", { range: [2, 3] }),
            lag: hrs(1.5, "dailymed-pantoprazole", { needsReview: true, note: "Enteric coating: absorption starts once the tablet leaves the stomach" }),
          },
        },
      ],
      vd: litres(11, "dailymed-pantoprazole", { range: [11, 23.6] }),
      halfLife: hrs(1, "dailymed-pantoprazole"),
      proteinBinding: frac(0.98, "dailymed-pantoprazole"),
      fe: frac(0, "dailymed-pantoprazole", { note: "No unchanged drug in urine" }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: CYP2C19 then sulfation; little CYP inhibition.",
      noThresholdReason: "Acid suppression outlasts plasma levels because the pumps are permanently disabled.",
    },
  ],
  organs: {
    stomach: {
      affinity: 2,
      target: true,
      therapeutic: "Concentrates in parietal cells and shuts down acid pumps.",
      sideEffects: "Long-term use: low magnesium and B12, more gut infections.",
      toxic: "Acute overdose is generally well tolerated.",
    },
    liver: { affinity: 1.1, therapeutic: "Metabolised by CYP2C19." },
    smallIntestine: { affinity: 1, therapeutic: "The coating protects the drug until the intestine." },
  },
  toxicity: {
    mechanism: "Wide safety margin; there is little specific toxicity in overdose.",
    warningSigns: ["Non-specific: headache, dizziness, nausea"],
    treatment: "Supportive care.",
    organs: ["stomach"],
  },
  interactions: [
    { with: "Drugs needing stomach acid (ketoconazole, iron)", effect: "Reduced absorption." },
    { with: "Methotrexate (high dose)", effect: "May raise methotrexate levels." },
  ],
  didYouKnow: "Pantoprazole is available as an IV injection for bleeding stomach ulcers.",
  modelNotes: [],
};

export const famotidine: DrugInput = {
  id: "famotidine",
  name: "Famotidine",
  brands: ["Pepcid"],
  drugClass: "h2-blocker",
  classLabel: "H₂-receptor antagonist",
  categories: ["GI", "Everyday"],
  mechanism:
    "Blocks histamine H₂ receptors on the stomach's parietal cells. Histamine is one of the signals that switches on acid production, so less acid is made. It works faster than a PPI but less completely.",
  components: [
    {
      id: "famotidine",
      name: "Famotidine",
      regimens: [oral(mg(20, "dailymed-famotidine", { range: [10, 40] }), frac(0.43, "dailymed-famotidine", { range: [0.4, 0.45] }), hrs(2, "dailymed-famotidine", { range: [1, 3] }))],
      vd: lkg(1.1, "dailymed-famotidine", { range: [1, 1.3] }),
      halfLife: hrs(3, "dailymed-famotidine", { range: [2.5, 3.5] }),
      proteinBinding: frac(0.18, "dailymed-famotidine", { range: [0.15, 0.2] }),
      fe: frac(0.65, "dailymed-famotidine", { range: [0.65, 0.7] }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Minimal; a small amount becomes an S-oxide. Mostly excreted unchanged by the kidneys.",
      noThresholdReason: "Acid suppression is judged by symptoms and stomach pH, not plasma level.",
    },
  ],
  organs: {
    stomach: { affinity: 1.6, target: true, therapeutic: "Lowers acid output within an hour, for about 10–12 hours.", toxic: "Overdose rarely causes stomach problems." },
    kidneys: { affinity: 1.4, therapeutic: "Excrete it unchanged; dose reduced in kidney disease." },
    brain: { affinity: 0.3, sideEffects: "Headache.", toxic: "Confusion or agitation, mainly in older people with kidney impairment." },
    heart: { affinity: 0.7, toxic: "QT prolongation reported with kidney impairment." },
  },
  toxicity: {
    mechanism: "Famotidine has low toxicity. Very high levels, usually from kidney failure, can affect the brain and heart rhythm.",
    warningSigns: ["Confusion", "Palpitations"],
    treatment: "Supportive care.",
    organs: ["brain"],
  },
  interactions: [{ with: "Drugs needing acid for absorption (ketoconazole, atazanavir)", effect: "Reduced absorption." }],
  didYouKnow: "Famotidine is roughly 20–50 times more potent than cimetidine, the first H₂ blocker.",
  modelNotes: [],
};

export const loperamide: DrugInput = {
  id: "loperamide",
  name: "Loperamide",
  brands: ["Imodium"],
  drugClass: "antidiarrheal",
  classLabel: "Antidiarrhoeal (peripheral opioid agonist)",
  categories: ["GI", "Everyday"],
  mechanism:
    "Activates μ-opioid receptors in the gut wall, slowing movement and letting more water be absorbed. At normal doses almost none reaches the blood, and a pump (P-glycoprotein) keeps it out of the brain.",
  relativeOnly: true,
  components: [
    {
      id: "loperamide",
      name: "Loperamide",
      regimens: [oral(mg(2, "dailymed-loperamide", { range: [2, 4] }), frac(0.003, "dailymed-loperamide", { note: "<1% reaches the blood" }), hrs(5, "dailymed-loperamide", { range: [2.5, 5] }), { label: "Capsule" })],
      vd: lkg(1, "needs-source", { needsReview: true, note: "Placeholder: only sets the absolute scale, which is not shown" }),
      halfLife: hrs(10.8, "dailymed-loperamide", { range: [9.1, 14.4] }),
      proteinBinding: frac(0.95, "dailymed-loperamide"),
      fe: frac(0, "dailymed-loperamide"),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: CYP3A4 and CYP2C8; excreted mainly in faeces.",
      noThresholdReason: "Acts locally in the gut wall; plasma levels are negligible at normal doses.",
    },
  ],
  organs: {
    smallIntestine: { affinity: 2.5, target: true, therapeutic: "Slows gut contractions so stools firm up." },
    largeIntestine: { affinity: 2, target: true, therapeutic: "Increases anal sphincter tone and water absorption.", sideEffects: "Constipation, bloating." },
    heart: {
      affinity: 0.5,
      toxic: "Massive misuse doses block cardiac sodium and potassium channels: QRS/QT prolongation, fatal arrhythmias.",
    },
    brain: { affinity: 0.05, toxic: "Only with huge doses or P-gp inhibitors does it reach the brain and cause opioid effects." },
    liver: { affinity: 1.2, therapeutic: "Extensive first-pass metabolism." },
  },
  toxicity: {
    mechanism:
      "At recommended doses it is very safe. Very large doses (seen in misuse) overwhelm first-pass metabolism and block the heart's ion channels, causing life-threatening arrhythmias.",
    warningSigns: ["Fainting, palpitations", "Severe constipation, abdominal swelling", "Drowsiness, slow breathing (rare)"],
    treatment: "Emergency care with heart monitoring; naloxone for opioid effects.",
    organs: ["heart", "brain"],
  },
  interactions: [
    { with: "P-gp/CYP3A4 inhibitors (quinidine, ritonavir, itraconazole)", effect: "Raise levels and allow entry into the brain." },
    { with: "Bloody diarrhoea or high fever", effect: "Should not be used; it can trap infection in the gut." },
  ],
  didYouKnow: "Loperamide is chemically an opioid, but P-glycoprotein pumps keep it out of the brain at normal doses.",
  modelNotes: ["Absolute levels are not shown; loperamide acts locally and plasma levels are tiny."],
};
