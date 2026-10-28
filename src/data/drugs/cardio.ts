import type { DrugInput } from "../schema";
import { frac, hrs, litres, lkg, mg, mgL, oral } from "./_v";

const bpLowering = "Blood-pressure effects build over days to weeks of regular dosing and do not track a single-dose plasma level.";

export const amlodipine: DrugInput = {
  id: "amlodipine",
  name: "Amlodipine",
  brands: ["Norvasc", "Istin"],
  drugClass: "calcium-channel-blocker",
  classLabel: "Calcium channel blocker",
  categories: ["Cardio"],
  mechanism:
    "Blocks L-type calcium channels in the muscle of artery walls, so the arteries relax and widen. Blood pressure falls and the heart has less resistance to pump against. It is very long-acting, so one tablet covers a full day.",
  components: [
    {
      id: "amlodipine",
      name: "Amlodipine",
      regimens: [oral(mg(5, "dailymed-amlodipine", { range: [2.5, 10] }), frac(0.75, "dailymed-amlodipine", { range: [0.64, 0.9] }), hrs(8, "dailymed-amlodipine", { range: [6, 12] }))],
      vd: lkg(21, "dailymed-amlodipine"),
      halfLife: hrs(40, "dailymed-amlodipine", { range: [30, 50] }),
      proteinBinding: frac(0.93, "dailymed-amlodipine"),
      fe: frac(0.1, "dailymed-amlodipine", { note: "~10% unchanged, ~60% as metabolites in urine" }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: extensively (~90%) metabolised by CYP3A4 to inactive products.",
      noThresholdReason: bpLowering,
    },
  ],
  organs: {
    vessels: {
      affinity: 1.4,
      target: true,
      therapeutic: "Relaxes the smooth muscle of arteries, lowering blood pressure.",
      sideEffects: "Ankle swelling (pre-capillary dilation), flushing, headache.",
      toxic: "Profound widening of blood vessels: severe, hard-to-treat low blood pressure and shock.",
    },
    heart: {
      affinity: 1,
      target: true,
      therapeutic: "Widens coronary arteries and reduces the heart's workload, easing angina.",
      toxic: "Slow heart rate and weak contraction in large overdoses.",
    },
    pancreas: { affinity: 0.6, toxic: "Calcium-channel blockade reduces insulin release: high blood sugar is a sign of serious overdose." },
    lungs: { affinity: 0.8, toxic: "Non-cardiogenic pulmonary oedema has been reported, sometimes a day after overdose." },
    liver: { affinity: 1.2, therapeutic: "Metabolised by CYP3A4." },
  },
  toxicity: {
    mechanism:
      "Too much amlodipine relaxes blood vessels so much that blood pressure collapses. Because it lasts so long, effects can persist for days.",
    warningSigns: ["Dizziness, fainting", "Very low blood pressure", "Slow or fast heart rate", "Breathlessness"],
    treatment: "Emergency care: IV fluids, calcium, high-dose insulin and vasopressors. Prolonged monitoring is needed because of the long half-life.",
    organs: ["vessels", "heart", "pancreas"],
  },
  interactions: [
    { with: "Strong CYP3A4 inhibitors (clarithromycin, itraconazole, ritonavir)", effect: "Raise amlodipine levels: more low blood pressure and swelling." },
    { with: "Simvastatin (high dose)", effect: "Amlodipine raises simvastatin levels; dose is limited." },
    { with: "Grapefruit juice", effect: "Can modestly increase levels." },
  ],
  didYouKnow: "Amlodipine's 30–50 hour half-life means a missed dose barely changes blood pressure, which makes it forgiving for everyday use.",
  modelNotes: [],
};

export const atorvastatin: DrugInput = {
  id: "atorvastatin",
  name: "Atorvastatin",
  brands: ["Lipitor"],
  drugClass: "statin",
  classLabel: "Statin (HMG-CoA reductase inhibitor)",
  categories: ["Cardio"],
  mechanism:
    "Blocks HMG-CoA reductase, the liver enzyme that controls cholesterol production. The liver responds by pulling more LDL ('bad') cholesterol out of the blood, which lowers the risk of heart attack and stroke.",
  components: [
    {
      id: "atorvastatin",
      name: "Atorvastatin",
      regimens: [oral(mg(20, "dailymed-atorvastatin", { range: [10, 80] }), frac(0.14, "dailymed-atorvastatin", { note: "Extensive first-pass in gut wall and liver" }), hrs(1.5, "dailymed-atorvastatin", { range: [1, 2] }))],
      vd: litres(381, "dailymed-atorvastatin"),
      halfLife: hrs(14, "dailymed-atorvastatin", { note: "Enzyme inhibition lasts 20–30 h because of active metabolites" }),
      proteinBinding: frac(0.98, "dailymed-atorvastatin"),
      fe: frac(0.02, "dailymed-atorvastatin", { note: "<2% recovered in urine" }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: CYP3A4 to active ortho- and para-hydroxylated metabolites; eliminated in bile.",
      noThresholdReason: "Cholesterol lowering builds over weeks and depends on liver enzyme inhibition, not plasma level.",
    },
  ],
  organs: {
    liver: {
      affinity: 2,
      target: true,
      therapeutic: "Taken up selectively by liver cells, where it blocks cholesterol production.",
      sideEffects: "Mild rises in liver enzymes are fairly common.",
      toxic: "Liver injury is rare but possible.",
    },
    vessels: { affinity: 1, target: true, therapeutic: "Lower LDL slows the build-up of plaque in artery walls." },
    kidneys: { affinity: 0.6, toxic: "Severe muscle breakdown releases myoglobin, which can injure the kidneys." },
    heart: { affinity: 0.8, therapeutic: "Long-term use reduces heart attacks." },
  },
  toxicity: {
    mechanism:
      "Single overdoses are usually well tolerated. The serious risk is muscle damage (myopathy, rarely rhabdomyolysis), which becomes more likely when levels are high, often because of interacting drugs.",
    warningSigns: ["Unexplained muscle pain, tenderness or weakness", "Dark, cola-coloured urine", "Yellowing of skin or eyes"],
    treatment: "Stop the statin and seek care. Rhabdomyolysis is treated with IV fluids to protect the kidneys.",
    organs: ["liver", "kidneys"],
  },
  interactions: [
    { with: "Clarithromycin, itraconazole, HIV protease inhibitors", effect: "Block CYP3A4: much higher levels and muscle-damage risk." },
    { with: "Ciclosporin, gemfibrozil", effect: "Increase myopathy risk." },
    { with: "Grapefruit juice (large amounts)", effect: "Raises levels." },
  ],
  didYouKnow: "Statins were inspired by a compound found in a fungus, Penicillium citrinum, by Akira Endo in the 1970s.",
  modelNotes: ["The plasma curve is short-lived, but cholesterol lowering depends on steady daily dosing."],
};

export const lisinopril: DrugInput = {
  id: "lisinopril",
  name: "Lisinopril",
  brands: ["Zestril", "Prinivil"],
  drugClass: "ace-inhibitor",
  classLabel: "ACE inhibitor",
  categories: ["Cardio"],
  mechanism:
    "Blocks angiotensin-converting enzyme (ACE), so less angiotensin II is made. Angiotensin II tightens blood vessels and makes the body hold salt and water, so blocking it lowers blood pressure and protects the heart and kidneys.",
  components: [
    {
      id: "lisinopril",
      name: "Lisinopril",
      regimens: [oral(mg(10, "dailymed-lisinopril", { range: [2.5, 40] }), frac(0.25, "dailymed-lisinopril", { range: [0.06, 0.6] }), hrs(7, "dailymed-lisinopril", { range: [6, 8] }))],
      vd: litres(124, "dailymed-lisinopril", { needsReview: true }),
      halfLife: hrs(12, "dailymed-lisinopril", { note: "Effective half-life for accumulation" }),
      proteinBinding: frac(0, "dailymed-lisinopril", { note: "Does not bind plasma proteins other than ACE" }),
      fe: frac(1, "dailymed-lisinopril", { note: "Not metabolised; excreted unchanged in urine" }),
      nonRenalRoute: "tissue-uptake",
      metabolism: "Not metabolised. Excreted entirely unchanged by the kidneys.",
      noThresholdReason: bpLowering,
    },
  ],
  organs: {
    vessels: {
      affinity: 1.2,
      target: true,
      therapeutic: "Less angiotensin II means relaxed arteries and lower blood pressure.",
      sideEffects: "Bradykinin build-up causes a dry cough in about 1 in 10 people; rarely, swelling of lips and tongue (angioedema).",
      toxic: "Very low blood pressure.",
    },
    kidneys: {
      affinity: 1.5,
      target: true,
      therapeutic: "Reduces pressure inside the kidney's filters, slowing kidney damage in diabetes.",
      sideEffects: "Can raise potassium and creatinine.",
      toxic: "Acute kidney injury, especially with dehydration or NSAIDs.",
    },
    heart: { affinity: 1, target: true, therapeutic: "Reduces strain on a failing heart and improves survival after heart attack." },
    lungs: { affinity: 1, sideEffects: "ACE also breaks down bradykinin in the lungs; the build-up triggers cough." },
    bladder: { affinity: 1 },
  },
  toxicity: {
    mechanism: "Overdose mainly causes low blood pressure. High potassium and kidney injury can follow, particularly in dehydration.",
    warningSigns: ["Dizziness or fainting on standing", "Very low urine output", "Swelling of face, lips or tongue (emergency)"],
    treatment: "IV fluids and monitoring; dialysis can remove lisinopril. Angioedema is an emergency.",
    organs: ["vessels", "kidneys"],
  },
  interactions: [
    { with: "NSAIDs + diuretics", effect: "The 'triple whammy' risk of acute kidney injury." },
    { with: "Potassium supplements, spironolactone", effect: "Dangerously high potassium." },
    { with: "Sacubitril (Entresto)", effect: "Angioedema risk; must not be combined." },
  ],
  didYouKnow: "ACE inhibitors were developed from a peptide found in the venom of the Brazilian pit viper Bothrops jararaca.",
  modelNotes: [],
};

export const losartan: DrugInput = {
  id: "losartan",
  name: "Losartan",
  brands: ["Cozaar"],
  drugClass: "arb",
  classLabel: "Angiotensin II receptor blocker (ARB)",
  categories: ["Cardio"],
  mechanism:
    "Blocks the AT1 receptor so angiotensin II cannot tighten blood vessels or trigger salt retention. Similar benefits to ACE inhibitors, but without the bradykinin cough.",
  components: [
    {
      id: "losartan",
      name: "Losartan",
      regimens: [oral(mg(50, "dailymed-losartan", { range: [25, 100] }), frac(0.33, "dailymed-losartan"), hrs(1, "dailymed-losartan"))],
      vd: litres(34, "dailymed-losartan"),
      halfLife: hrs(2, "dailymed-losartan", { note: "Active metabolite E-3174: 6–9 h" }),
      proteinBinding: frac(0.987, "dailymed-losartan"),
      fe: frac(0.04, "dailymed-losartan"),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: CYP2C9 and CYP3A4 convert ~14% to E-3174, a 10–40× more potent and longer-lasting metabolite.",
      noThresholdReason: bpLowering,
    },
  ],
  organs: {
    vessels: { affinity: 1.2, target: true, therapeutic: "Blocks angiotensin II at blood vessels: lower blood pressure.", toxic: "Very low blood pressure." },
    kidneys: {
      affinity: 1.3,
      target: true,
      therapeutic: "Protects kidneys in diabetes by lowering filter pressure.",
      sideEffects: "Can raise potassium.",
      toxic: "Kidney injury, especially when dehydrated.",
    },
    heart: { affinity: 1, therapeutic: "Used in heart failure when ACE inhibitors cause cough." },
    liver: { affinity: 1.2, therapeutic: "Converts losartan to its more powerful metabolite." },
  },
  toxicity: {
    mechanism: "Overdose mostly causes low blood pressure, and sometimes a fast or slow heart rate.",
    warningSigns: ["Dizziness, fainting", "Palpitations", "Reduced urine"],
    treatment: "Supportive care with fluids; losartan is not removed by dialysis.",
    organs: ["vessels", "kidneys"],
  },
  interactions: [
    { with: "NSAIDs + diuretics", effect: "Acute kidney injury risk." },
    { with: "Potassium supplements, spironolactone", effect: "High potassium." },
    { with: "Lithium", effect: "Raises lithium levels." },
  ],
  didYouKnow: "Losartan was the first ARB, approved in 1995. Much of its effect comes from its own metabolite.",
  modelNotes: ["The curve shows losartan itself; its active metabolite E-3174 peaks later (3–4 h) and lasts longer."],
};

export const metoprolol: DrugInput = {
  id: "metoprolol",
  name: "Metoprolol",
  brands: ["Lopressor (tartrate)", "Toprol-XL (succinate)", "Betaloc"],
  drugClass: "beta-blocker",
  classLabel: "β₁-selective beta-blocker",
  categories: ["Cardio"],
  mechanism:
    "Blocks β₁ adrenaline receptors in the heart, so the heart beats more slowly and less forcefully. That lowers blood pressure, reduces angina and protects the heart after a heart attack. The tartrate form is immediate release; succinate is extended release.",
  components: [
    {
      id: "metoprolol",
      name: "Metoprolol",
      regimens: [oral(mg(50, "dailymed-metoprolol", { range: [25, 100] }), frac(0.5, "dailymed-metoprolol", { note: "~50% first-pass metabolism" }), hrs(1.5, "dailymed-metoprolol", { range: [1, 2] }), { label: "Tartrate tablet" })],
      vd: lkg(4.2, "dailymed-metoprolol", { range: [3.2, 5.6] }),
      halfLife: hrs(3.5, "dailymed-metoprolol", { range: [3, 7], note: "7–9 h in CYP2D6 poor metabolisers" }),
      proteinBinding: frac(0.12, "dailymed-metoprolol"),
      fe: frac(0.05, "dailymed-metoprolol", { range: [0.03, 0.1] }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: mainly CYP2D6. Genetic 'poor metabolisers' (~7% of white people) have several-fold higher levels.",
      noThresholdReason: "Heart-rate lowering is titrated clinically; no plasma range is used.",
    },
  ],
  organs: {
    heart: {
      affinity: 1.4,
      target: true,
      therapeutic: "Slows the heart and reduces its oxygen demand.",
      sideEffects: "Tiredness, cold hands, slow pulse.",
      toxic: "Very slow heart rate, heart block and failing pump function.",
    },
    vessels: { affinity: 1, target: true, therapeutic: "Lower cardiac output brings blood pressure down.", toxic: "Low blood pressure and shock." },
    lungs: { affinity: 0.6, sideEffects: "Less likely than non-selective beta-blockers to tighten airways, but can at higher doses." },
    brain: { affinity: 0.7, sideEffects: "Vivid dreams, fatigue.", toxic: "Drowsiness, confusion, seizures." },
    liver: { affinity: 1.2, therapeutic: "Metabolised by CYP2D6." },
  },
  toxicity: {
    mechanism: "Too much beta-blockade switches off the heart's response to adrenaline: the heart slows, conduction blocks and blood pressure falls. Blood sugar can drop.",
    warningSigns: ["Very slow pulse", "Dizziness, fainting", "Breathlessness or wheeze", "Confusion"],
    treatment: "Emergency care: atropine, glucagon, high-dose insulin, pacing if needed.",
    organs: ["heart", "vessels"],
  },
  interactions: [
    { with: "Verapamil, diltiazem", effect: "Severe slowing of the heart; avoid together." },
    { with: "CYP2D6 inhibitors (fluoxetine, paroxetine)", effect: "Raise metoprolol levels." },
    { with: "Stopping suddenly", effect: "Rebound fast heart rate and angina; dose is tapered." },
  ],
  didYouKnow: "Beta-blockers came from James Black's work in the 1960s, which earned him a share of the 1988 Nobel Prize.",
  modelNotes: [],
};

export const propranolol: DrugInput = {
  id: "propranolol",
  name: "Propranolol",
  brands: ["Inderal"],
  drugClass: "beta-blocker",
  classLabel: "Non-selective beta-blocker",
  categories: ["Cardio", "CNS"],
  mechanism:
    "Blocks both β₁ (heart) and β₂ (airways, vessels) receptors. It is fat-soluble and enters the brain, so as well as heart conditions it is used for tremor, migraine prevention and the physical symptoms of anxiety.",
  components: [
    {
      id: "propranolol",
      name: "Propranolol",
      regimens: [oral(mg(40, "dailymed-propranolol", { range: [10, 80] }), frac(0.25, "dailymed-propranolol", { note: "High first-pass metabolism" }), hrs(2, "dailymed-propranolol", { range: [1, 4] }))],
      vd: lkg(4, "dailymed-propranolol", { range: [3, 5] }),
      halfLife: hrs(4, "dailymed-propranolol", { range: [3, 6] }),
      proteinBinding: frac(0.9, "dailymed-propranolol"),
      fe: frac(0.01, "dailymed-propranolol"),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: CYP2D6, CYP1A2 and CYP2C19, plus glucuronidation.",
      noThresholdReason: "Effect is titrated to heart rate and symptoms; plasma levels vary widely between people.",
    },
  ],
  organs: {
    heart: { affinity: 1.3, target: true, therapeutic: "Slows the heart and steadies rhythm.", toxic: "Very slow heart rate, heart block, and QRS widening from sodium-channel effects." },
    brain: {
      affinity: 1.5,
      target: true,
      therapeutic: "Reduces tremor and the pounding-heart symptoms of anxiety; prevents migraine.",
      sideEffects: "Fatigue, vivid dreams.",
      toxic: "Seizures and coma: propranolol is the most dangerous beta-blocker in overdose because it crosses into the brain.",
    },
    lungs: {
      affinity: 1,
      sideEffects: "Blocks β₂ receptors in the airways: can trigger severe asthma attacks.",
      toxic: "Bronchospasm.",
    },
    liver: { affinity: 1.3, therapeutic: "Heavy first-pass metabolism; reduces portal pressure in cirrhosis." },
    vessels: { affinity: 1, toxic: "Low blood pressure." },
  },
  toxicity: {
    mechanism:
      "Beyond beta-blockade, propranolol also blocks sodium channels (like some anti-arrhythmics) and enters the brain, so overdose can cause seizures and dangerous heart rhythms.",
    warningSigns: ["Very slow pulse, fainting", "Seizures", "Wheeze", "Low blood sugar"],
    treatment: "Emergency care: glucagon, high-dose insulin, sodium bicarbonate for QRS widening, benzodiazepines for seizures.",
    organs: ["heart", "brain", "lungs"],
  },
  interactions: [
    { with: "Asthma", effect: "Can cause life-threatening bronchospasm; generally avoided." },
    { with: "Verapamil, diltiazem", effect: "Severe slowing of the heart." },
    { with: "Insulin, sulfonylureas", effect: "Masks the warning signs of low blood sugar." },
  ],
  didYouKnow: "Propranolol was the first clinically successful beta-blocker, launched in 1964.",
  modelNotes: [],
};

export const furosemide: DrugInput = {
  id: "furosemide",
  name: "Furosemide",
  altNames: ["Frusemide"],
  brands: ["Lasix"],
  drugClass: "diuretic",
  classLabel: "Loop diuretic",
  categories: ["Cardio", "ER"],
  mechanism:
    "Blocks the Na-K-2Cl pump in the loop of Henle in the kidney, so much more salt, and water with it, is lost in urine. Used to clear fluid from the lungs and legs in heart failure.",
  components: [
    {
      id: "furosemide",
      name: "Furosemide",
      regimens: [
        oral(mg(40, "dailymed-furosemide", { range: [20, 80] }), frac(0.6, "dailymed-furosemide", { range: [0.1, 1], note: "Highly variable" }), hrs(1.25, "dailymed-furosemide", { range: [1, 1.5] })),
        { id: "iv", label: "IV injection", route: "iv-bolus", dose: mg(40, "dailymed-furosemide", { range: [20, 80] }) },
      ],
      vd: lkg(0.11, "dailymed-furosemide", { range: [0.07, 0.2] }),
      halfLife: hrs(2, "dailymed-furosemide", { range: [0.5, 2] }),
      proteinBinding: frac(0.98, "dailymed-furosemide", { range: [0.91, 0.99] }),
      fe: frac(0.65, "dailymed-furosemide", { needsReview: true, note: "Most of the absorbed dose is excreted unchanged; some glucuronidated in the kidney" }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Partly glucuronidated, mostly in the kidney; most is excreted unchanged.",
      noThresholdReason: "Effect depends on how much drug reaches the kidney tubule, not on plasma level.",
    },
  ],
  organs: {
    kidneys: {
      affinity: 2,
      target: true,
      therapeutic: "Secreted into the tubule, where it blocks salt reabsorption: urine flow rises within 30–60 minutes.",
      sideEffects: "Loss of potassium, magnesium and sodium.",
      toxic: "Severe dehydration and electrolyte loss; reduced kidney blood flow.",
    },
    bladder: { affinity: 1.5, therapeutic: "Large volumes of urine collect quickly." },
    lungs: { affinity: 1, target: true, therapeutic: "Clears fluid from the lungs in acute heart failure (pulmonary oedema)." },
    heart: { affinity: 1, sideEffects: "Low potassium can trigger arrhythmias.", toxic: "Dangerous rhythms from very low potassium." },
    vessels: { affinity: 1, toxic: "Collapse of blood volume: low blood pressure." },
    brain: { affinity: 0.2, toxic: "High doses (especially fast IV) can damage hearing (ototoxicity)." },
  },
  toxicity: {
    mechanism: "Too much furosemide drains water and salts from the body faster than they can be replaced.",
    warningSigns: ["Extreme thirst, dizziness", "Muscle cramps, weakness", "Palpitations", "Ringing in the ears or hearing loss"],
    treatment: "Fluids and electrolyte replacement with heart monitoring.",
    organs: ["kidneys", "heart", "vessels"],
  },
  interactions: [
    { with: "Aminoglycosides (gentamicin)", effect: "Together they increase ear damage." },
    { with: "Digoxin", effect: "Low potassium makes digoxin toxicity more likely." },
    { with: "Lithium", effect: "Raises lithium levels." },
  ],
  didYouKnow: "Furosemide's brand name Lasix comes from its effect: it 'lasts six' hours.",
  modelNotes: [],
};

export const hydrochlorothiazide: DrugInput = {
  id: "hydrochlorothiazide",
  name: "Hydrochlorothiazide",
  altNames: ["HCTZ"],
  brands: ["Microzide", "Esidrex"],
  drugClass: "diuretic",
  classLabel: "Thiazide diuretic",
  categories: ["Cardio"],
  mechanism:
    "Blocks the Na-Cl co-transporter in the distal kidney tubule, so more salt and water leave in urine. Over weeks it also relaxes blood vessels, lowering blood pressure.",
  components: [
    {
      id: "hydrochlorothiazide",
      name: "Hydrochlorothiazide",
      regimens: [oral(mg(25, "dailymed-hctz", { range: [12.5, 50] }), frac(0.7, "dailymed-hctz", { range: [0.65, 0.75] }), hrs(2, "dailymed-hctz", { range: [1, 2.5] }))],
      vd: lkg(3, "dailymed-hctz", { range: [0.83, 4.19], needsReview: true }),
      halfLife: hrs(10, "dailymed-hctz", { range: [6, 15] }),
      proteinBinding: frac(0.6, "dailymed-hctz", { range: [0.4, 0.68] }),
      fe: frac(0.95, "dailymed-hctz", { note: "Not metabolised; ≥61% excreted unchanged within 24 h" }),
      nonRenalRoute: "tissue-uptake",
      metabolism: "Not metabolised; excreted unchanged by the kidneys.",
      noThresholdReason: bpLowering,
    },
  ],
  organs: {
    kidneys: {
      affinity: 1.8,
      target: true,
      therapeutic: "Blocks salt reabsorption in the distal tubule.",
      sideEffects: "Low potassium and sodium; raises uric acid (gout) and blood sugar slightly.",
      toxic: "Dehydration and severe electrolyte loss.",
    },
    vessels: { affinity: 1, target: true, therapeutic: "Lowers blood pressure over weeks.", toxic: "Low blood pressure." },
    heart: { affinity: 0.8, toxic: "Arrhythmias from low potassium." },
    pancreas: { affinity: 0.6, sideEffects: "Can slightly raise blood sugar." },
    bladder: { affinity: 1.2 },
  },
  toxicity: {
    mechanism: "Overdose leads to fluid and salt depletion: low sodium and potassium, dehydration.",
    warningSigns: ["Weakness, cramps", "Confusion (low sodium)", "Dizziness on standing", "Palpitations"],
    treatment: "Fluids and electrolyte correction.",
    organs: ["kidneys", "heart"],
  },
  interactions: [
    { with: "Lithium", effect: "Raises lithium levels." },
    { with: "NSAIDs", effect: "Blunt its effect and add kidney risk." },
    { with: "Digoxin", effect: "Low potassium increases digoxin toxicity." },
  ],
  didYouKnow: "Long-term thiazide use is linked with a higher risk of some non-melanoma skin cancers, so sun protection is advised.",
  modelNotes: [],
};

export const clopidogrel: DrugInput = {
  id: "clopidogrel",
  name: "Clopidogrel",
  brands: ["Plavix"],
  drugClass: "antiplatelet",
  classLabel: "Antiplatelet (P2Y12 inhibitor)",
  categories: ["Cardio"],
  mechanism:
    "A prodrug: the liver (CYP2C19) converts it to an active form that permanently blocks the P2Y12 receptor on platelets, so they cannot clump to form clots. The effect lasts the platelet's 7–10 day lifespan.",
  relativeOnly: true,
  components: [
    {
      id: "clopidogrel",
      name: "Clopidogrel",
      measuredMoiety: "Parent clopidogrel (the active metabolite lasts only ~30 minutes)",
      regimens: [oral(mg(75, "dailymed-clopidogrel", { note: "Loading dose 300–600 mg" }), frac(0.5, "dailymed-clopidogrel", { note: "At least 50% absorbed" }), hrs(0.75, "dailymed-clopidogrel"))],
      vd: lkg(1, "needs-source", { needsReview: true, note: "Placeholder: only sets the absolute scale, which is not shown" }),
      halfLife: hrs(6, "dailymed-clopidogrel"),
      proteinBinding: frac(0.98, "dailymed-clopidogrel"),
      fe: frac(0.01, "dailymed-clopidogrel", { needsReview: true }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: ~85% hydrolysed to an inactive acid; ~15% activated by CYP2C19 (and others) to the active thiol metabolite.",
      noThresholdReason: "The effect is on platelets and outlasts the drug by days; plasma levels are not used.",
    },
  ],
  organs: {
    vessels: {
      affinity: 1.2,
      target: true,
      therapeutic: "Platelets lose their ability to clump, preventing clots in stents and narrowed arteries.",
      sideEffects: "Bruising and bleeding more easily.",
      toxic: "Prolonged, hard-to-stop bleeding.",
    },
    liver: { affinity: 1.4, therapeutic: "Activates the prodrug via CYP2C19; poor metabolisers get less benefit." },
    stomach: { affinity: 0.8, sideEffects: "Gut bleeding risk, higher with aspirin or NSAIDs.", toxic: "Gastrointestinal bleeding." },
    brain: { affinity: 0.2, toxic: "Rarely, bleeding in the brain." },
    heart: { affinity: 1, target: true, therapeutic: "Prevents stent clotting and repeat heart attacks." },
  },
  toxicity: {
    mechanism: "Because the effect on platelets is irreversible, overdose raises bleeding risk for about a week, until new platelets are made.",
    warningSigns: ["Bleeding that won't stop", "Black or bloody stools, vomiting blood", "Sudden severe headache"],
    treatment: "There is no reversal agent; platelet transfusion may be used for serious bleeding.",
    organs: ["vessels", "stomach"],
  },
  interactions: [
    { with: "Omeprazole, esomeprazole", effect: "Inhibit CYP2C19 and may reduce clopidogrel activation; pantoprazole is preferred." },
    { with: "Aspirin, NSAIDs, anticoagulants", effect: "Add to bleeding risk." },
  ],
  didYouKnow: "About 30% of people of East Asian descent carry CYP2C19 variants that make clopidogrel less effective.",
  modelNotes: ["Absolute levels are not shown: the parent drug is mostly inactive and plasma data are sparse."],
};

export const warfarin: DrugInput = {
  id: "warfarin",
  name: "Warfarin",
  brands: ["Coumadin", "Jantoven", "Marevan"],
  drugClass: "anticoagulant",
  classLabel: "Vitamin K antagonist anticoagulant",
  categories: ["Cardio"],
  mechanism:
    "Blocks the enzyme that recycles vitamin K, so the liver makes fewer working clotting factors (II, VII, IX, X). Because existing factors have to run down first, full effect takes 3–5 days, long after plasma levels peak.",
  components: [
    {
      id: "warfarin",
      name: "Warfarin",
      regimens: [oral(mg(5, "dailymed-warfarin", { range: [1, 10] }), frac(1, "dailymed-warfarin", { note: "Essentially complete" }), hrs(4, "dailymed-warfarin", { needsReview: true }))],
      vd: lkg(0.14, "dailymed-warfarin"),
      halfLife: hrs(40, "dailymed-warfarin", { range: [20, 60] }),
      proteinBinding: frac(0.99, "dailymed-warfarin"),
      fe: frac(0.01, "dailymed-warfarin"),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: the more potent S-enantiomer by CYP2C9; R-warfarin by CYP3A4 and CYP1A2. Many drugs and foods interact.",
      noThresholdReason: "Dosing is guided by the INR blood test (usually target 2–3), which reflects clotting factors, not warfarin level.",
    },
  ],
  organs: {
    liver: { affinity: 1.5, target: true, therapeutic: "Reduces production of active clotting factors." },
    vessels: {
      affinity: 1,
      target: true,
      therapeutic: "Prevents clots in veins, and in the heart in atrial fibrillation.",
      sideEffects: "Bruising, nosebleeds.",
      toxic: "Spontaneous bleeding anywhere.",
    },
    brain: { affinity: 0.2, toxic: "Bleeding in the brain, the most feared complication." },
    stomach: { affinity: 0.6, toxic: "Gastrointestinal bleeding." },
    kidneys: { affinity: 0.6, toxic: "Blood in the urine." },
  },
  toxicity: {
    mechanism: "Too much warfarin leaves too few working clotting factors, so blood cannot clot. The effect is delayed and lasts days.",
    warningSigns: ["Unusual bruising or bleeding gums", "Blood in urine, black stools", "Sudden severe headache or weakness"],
    treatment: "Reversal exists: vitamin K, and prothrombin complex concentrate for serious bleeding.",
    organs: ["vessels", "brain", "stomach"],
  },
  interactions: [
    { with: "Antibiotics (co-trimoxazole, metronidazole, ciprofloxacin), fluconazole", effect: "Raise INR, sometimes sharply." },
    { with: "Aspirin, NSAIDs, clopidogrel", effect: "Bleeding risk." },
    { with: "Changes in vitamin K intake (leafy greens)", effect: "Change the INR." },
  ],
  didYouKnow: "Warfarin was first sold as rat poison; its name comes from the Wisconsin Alumni Research Foundation.",
  modelNotes: ["The anticoagulant effect lags the plasma curve by days."],
};

export const rivaroxaban: DrugInput = {
  id: "rivaroxaban",
  name: "Rivaroxaban",
  brands: ["Xarelto"],
  drugClass: "anticoagulant",
  classLabel: "Direct oral anticoagulant (factor Xa inhibitor)",
  categories: ["Cardio"],
  mechanism:
    "Directly blocks clotting factor Xa, a key step in forming a clot. Unlike warfarin it works within hours and wears off within a day, without regular blood tests.",
  components: [
    {
      id: "rivaroxaban",
      name: "Rivaroxaban",
      regimens: [oral(mg(20, "dailymed-rivaroxaban", { range: [10, 20] }), frac(0.8, "dailymed-rivaroxaban", { range: [0.66, 1], note: "20 mg: ~66% fasting, near-complete with food" }), hrs(3, "dailymed-rivaroxaban", { range: [2, 4] }), { label: "Tablet with food" })],
      vd: litres(50, "dailymed-rivaroxaban"),
      halfLife: hrs(7, "dailymed-rivaroxaban", { range: [5, 13], note: "Longer in older adults" }),
      proteinBinding: frac(0.93, "dailymed-rivaroxaban", { range: [0.92, 0.95] }),
      fe: frac(0.36, "dailymed-rivaroxaban"),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: CYP3A4/5 and CYP2J2; about a third is excreted unchanged in urine.",
      noThresholdReason: "No routine therapeutic plasma range; anti-Xa levels are measured only in special situations.",
    },
  ],
  organs: {
    vessels: {
      affinity: 1.2,
      target: true,
      therapeutic: "Prevents clots in veins and stroke in atrial fibrillation.",
      sideEffects: "Bleeding, bruising.",
      toxic: "Serious bleeding.",
    },
    brain: { affinity: 0.2, toxic: "Bleeding in the brain." },
    stomach: { affinity: 0.7, toxic: "Gastrointestinal bleeding." },
    kidneys: { affinity: 1.2, therapeutic: "Excrete about a third unchanged; dose is reduced in kidney impairment." },
    liver: { affinity: 1.1 },
  },
  toxicity: {
    mechanism: "High levels block clotting too much. Absorption saturates above about 50 mg, which limits how high levels can go.",
    warningSigns: ["Bleeding that won't stop", "Black stools, blood in urine", "Sudden headache or weakness"],
    treatment: "A specific reversal agent exists (andexanet alfa); prothrombin complex concentrate is also used.",
    organs: ["vessels", "brain", "stomach"],
  },
  interactions: [
    { with: "Ketoconazole, ritonavir", effect: "Raise levels markedly; avoid." },
    { with: "Rifampicin, carbamazepine, St John's wort", effect: "Lower levels: clots may form." },
    { with: "Aspirin, NSAIDs, clopidogrel", effect: "Bleeding risk." },
  ],
  didYouKnow: "The 15 and 20 mg tablets must be taken with food, which raises absorption from about two thirds to nearly all of the dose.",
  modelNotes: [],
};

export const digoxin: DrugInput = {
  id: "digoxin",
  name: "Digoxin",
  brands: ["Lanoxin"],
  drugClass: "cardiac-glycoside",
  classLabel: "Cardiac glycoside",
  categories: ["Cardio"],
  mechanism:
    "Inhibits the Na⁺/K⁺-ATPase pump in heart muscle, so more calcium is available for each contraction and the heart beats more strongly. It also slows conduction through the AV node, controlling a fast heart rate in atrial fibrillation.",
  components: [
    {
      id: "digoxin",
      name: "Digoxin",
      regimens: [oral(mg(0.25, "dailymed-digoxin", { range: [0.0625, 0.25] }), frac(0.7, "dailymed-digoxin", { range: [0.6, 0.8] }), hrs(1.5, "dailymed-digoxin", { range: [1, 3] }))],
      vd: lkg(7, "dailymed-digoxin", { range: [5, 8] }),
      halfLife: hrs(40, "dailymed-digoxin", { range: [36, 48], note: "Much longer in kidney impairment" }),
      proteinBinding: frac(0.25, "dailymed-digoxin"),
      fe: frac(0.7, "dailymed-digoxin", { range: [0.5, 0.7] }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Mostly excreted unchanged by the kidneys; a small part metabolised. P-glycoprotein transports it.",
      effectiveLevel: {
        ...mgL(0.0005, "dailymed-digoxin", {
          range: [0.0005, 0.0009],
          needsReview: true,
          note: "0.5–0.9 ng/mL is the level usually targeted in heart failure; levels are measured ≥6 h after a dose, at steady state.",
        }),
        label: "Target range (HF)",
      },
    },
  ],
  organs: {
    heart: {
      affinity: 2.5,
      target: true,
      therapeutic: "Strengthens contraction and slows AV-node conduction.",
      toxic: "Almost any arrhythmia: extra beats, heart block, ventricular tachycardia.",
    },
    brain: { affinity: 0.4, sideEffects: "Nausea, confusion in older people.", toxic: "Confusion and yellow-green vision changes (xanthopsia)." },
    kidneys: { affinity: 1.5, therapeutic: "Remove most of the drug; kidney decline is the main cause of toxicity." },
    stomach: { affinity: 0.8, toxic: "Nausea, vomiting and loss of appetite are early signs of toxicity." },
    vessels: { affinity: 1, toxic: "Pump inhibition shifts potassium out of cells: high blood potassium in acute overdose." },
  },
  toxicity: {
    mechanism:
      "Digoxin's therapeutic window is narrow. Too much over-inhibits the Na⁺/K⁺ pump, overloading heart cells with calcium and making them fire abnormally. Low potassium and kidney failure make this more likely.",
    warningSigns: ["Nausea, vomiting, poor appetite", "Palpitations, slow or irregular pulse", "Blurred or yellow-tinged vision", "Confusion"],
    treatment: "A specific antidote exists: digoxin-specific antibody fragments (DigiFab) bind and remove it.",
    organs: ["heart", "vessels", "stomach"],
  },
  interactions: [
    { with: "Amiodarone, verapamil, clarithromycin", effect: "Raise digoxin levels (P-glycoprotein inhibition)." },
    { with: "Diuretics (furosemide, HCTZ)", effect: "Low potassium increases toxicity risk." },
  ],
  didYouKnow: "Digoxin comes from the foxglove plant, whose use for 'dropsy' was described by William Withering in 1785.",
  modelNotes: [
    "A single tablet does not reach the target range; digoxin is given daily (or loaded) to build up a steady level.",
    "There is a long distribution phase into heart muscle that a one-compartment model smooths out.",
  ],
};
