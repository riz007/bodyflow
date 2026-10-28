import type { DrugInput } from "../schema";
import { frac, hrs, lkg, mg, mgL, oral } from "./_v";

const micDepends = "Antimicrobial effect depends on the infecting organism's MIC, which varies; no single plasma threshold applies.";

export const azithromycin: DrugInput = {
  id: "azithromycin",
  name: "Azithromycin",
  brands: ["Zithromax", "Z-Pak"],
  drugClass: "macrolide",
  classLabel: "Macrolide antibiotic",
  categories: ["Antibiotic"],
  mechanism:
    "Binds the 50S subunit of the bacterial ribosome and stops bacteria making proteins. It concentrates inside cells, including white blood cells, which carry it to infected tissue, so short 3–5 day courses work.",
  relativeOnly: true,
  components: [
    {
      id: "azithromycin",
      name: "Azithromycin",
      regimens: [oral(mg(500, "dailymed-azithromycin", { range: [250, 500] }), frac(0.37, "dailymed-azithromycin"), hrs(2.5, "dailymed-azithromycin", { range: [2, 3] }))],
      vd: lkg(31.1, "dailymed-azithromycin"),
      halfLife: hrs(68, "dailymed-azithromycin", { note: "Terminal; tissue levels persist even longer" }),
      proteinBinding: frac(0.3, "dailymed-azithromycin", { range: [0.07, 0.51], note: "Falls as concentration rises" }),
      fe: frac(0.06, "dailymed-azithromycin"),
      nonRenalRoute: "biliary",
      metabolism: "Little metabolism; mostly excreted unchanged in bile.",
      noThresholdReason: micDepends,
    },
  ],
  organs: {
    lungs: { affinity: 2, target: true, therapeutic: "Concentrates in lung tissue and white cells: used for chest infections and atypical pneumonia." },
    heart: {
      affinity: 1,
      sideEffects: "Can prolong the QT interval.",
      toxic: "QT prolongation with risk of dangerous arrhythmias, especially with other QT drugs.",
    },
    liver: { affinity: 1.4, therapeutic: "Excreted in bile.", toxic: "Rare liver injury (cholestatic hepatitis)." },
    smallIntestine: { affinity: 1.2, sideEffects: "Stimulates gut motilin receptors: nausea, diarrhoea, cramps." },
    largeIntestine: { affinity: 1 },
  },
  toxicity: {
    mechanism: "Overdose mainly causes gut upset; the serious risk is QT prolongation and arrhythmia, particularly with other QT-prolonging drugs or low potassium.",
    warningSigns: ["Vomiting, diarrhoea", "Palpitations, fainting", "Hearing changes (rare, high doses)"],
    treatment: "Supportive care with ECG monitoring.",
    organs: ["heart", "liver"],
  },
  interactions: [
    { with: "Other QT-prolonging drugs (ondansetron, citalopram, antipsychotics)", effect: "Additive QT risk." },
    { with: "Warfarin", effect: "May raise INR." },
    { with: "Antacids (aluminium/magnesium)", effect: "Lower peak levels; take apart." },
  ],
  didYouKnow: "Azithromycin was discovered in Croatia by the company Pliva in 1980.",
  modelNotes: [
    "Azithromycin moves rapidly into tissues (volume ~31 L/kg), so a one-compartment model under-states its early plasma peak; absolute levels are therefore not shown.",
  ],
};

export const ciprofloxacin: DrugInput = {
  id: "ciprofloxacin",
  name: "Ciprofloxacin",
  brands: ["Cipro", "Ciproxin"],
  drugClass: "fluoroquinolone",
  classLabel: "Fluoroquinolone antibiotic",
  categories: ["Antibiotic"],
  mechanism:
    "Blocks bacterial DNA gyrase and topoisomerase IV, enzymes bacteria need to copy and untangle their DNA, so the bacteria die. It works especially well against gut bacteria and Pseudomonas.",
  components: [
    {
      id: "ciprofloxacin",
      name: "Ciprofloxacin",
      regimens: [
        oral(mg(500, "dailymed-ciprofloxacin", { range: [250, 750] }), frac(0.7, "dailymed-ciprofloxacin"), hrs(1.2, "dailymed-ciprofloxacin", { range: [1, 2] }), {
          reportedCmax: mgL(2.4, "dailymed-ciprofloxacin", { note: "After 500 mg" }),
        }),
      ],
      vd: lkg(2.5, "dailymed-ciprofloxacin", { range: [2, 3] }),
      halfLife: hrs(4, "dailymed-ciprofloxacin"),
      proteinBinding: frac(0.3, "dailymed-ciprofloxacin", { range: [0.2, 0.4] }),
      fe: frac(0.45, "dailymed-ciprofloxacin", { range: [0.4, 0.5] }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Partly metabolised in the liver; strongly inhibits CYP1A2. Also excreted in bile and directly into the gut.",
      noThresholdReason: micDepends,
    },
  ],
  organs: {
    kidneys: { affinity: 1.5, target: true, therapeutic: "High urine levels: treats complicated urinary and kidney infections.", toxic: "Crystals in urine and kidney injury at very high doses." },
    bladder: { affinity: 1.4, target: true },
    smallIntestine: { affinity: 1.1, therapeutic: "Absorbed well, but blocked by calcium, iron and antacids." },
    brain: { affinity: 0.6, sideEffects: "Dizziness, insomnia, and rarely confusion or seizures.", toxic: "Seizures, psychosis." },
    heart: { affinity: 0.9, sideEffects: "Can prolong QT.", toxic: "QT prolongation." },
    vessels: { affinity: 1, sideEffects: "Small rise in risk of aortic aneurysm; tendons can rupture (FDA boxed warning)." },
    pancreas: { affinity: 0.6, toxic: "Low or high blood sugar, especially in people with diabetes." },
  },
  toxicity: {
    mechanism: "High levels affect the nervous system (GABA blockade), the heart's rhythm and blood sugar control; crystals can form in the kidneys.",
    warningSigns: ["Confusion, agitation, seizures", "Palpitations", "Shakiness or sweating (low blood sugar)", "Reduced urine"],
    treatment: "Supportive care, fluids, ECG and glucose monitoring.",
    organs: ["brain", "kidneys", "heart"],
  },
  interactions: [
    { with: "Calcium, iron, zinc, antacids, dairy alone", effect: "Bind ciprofloxacin and block absorption." },
    { with: "Theophylline, caffeine, tizanidine", effect: "CYP1A2 inhibition raises their levels." },
    { with: "Warfarin", effect: "Raises INR." },
  ],
  didYouKnow: "Because of tendon, nerve and aortic risks, fluoroquinolones are now reserved for infections where safer options don't work.",
  modelNotes: [],
};

export const doxycycline: DrugInput = {
  id: "doxycycline",
  name: "Doxycycline",
  brands: ["Vibramycin", "Doryx"],
  drugClass: "tetracycline",
  classLabel: "Tetracycline antibiotic",
  categories: ["Antibiotic"],
  mechanism:
    "Binds the 30S subunit of the bacterial ribosome and stops protein production, halting bacterial growth. Used for chest infections, acne, Lyme disease, chlamydia and malaria prevention.",
  components: [
    {
      id: "doxycycline",
      name: "Doxycycline",
      regimens: [oral(mg(100, "dailymed-doxycycline", { range: [100, 200] }), frac(0.93, "dailymed-doxycycline", { range: [0.9, 1] }), hrs(2, "dailymed-doxycycline", { range: [1.5, 4] }), { label: "Capsule (with water, upright)" })],
      vd: lkg(0.75, "dailymed-doxycycline", { needsReview: true }),
      halfLife: hrs(18, "dailymed-doxycycline", { range: [16, 22] }),
      proteinBinding: frac(0.88, "dailymed-doxycycline", { range: [0.8, 0.93] }),
      fe: frac(0.4, "dailymed-doxycycline", { needsReview: true }),
      nonRenalRoute: "biliary",
      metabolism: "Little metabolism; excreted in urine and in faeces (via bile and directly into the gut).",
      noThresholdReason: micDepends,
    },
  ],
  organs: {
    lungs: { affinity: 1.2, target: true, therapeutic: "Treats chest infections, including atypical pneumonia." },
    stomach: {
      affinity: 1.2,
      sideEffects: "A capsule stuck in the oesophagus can cause painful ulcers: take with a full glass of water and stay upright.",
      toxic: "Severe nausea, vomiting and oesophageal injury.",
    },
    liver: { affinity: 1.2, toxic: "Liver injury at very high doses." },
    largeIntestine: { affinity: 1, sideEffects: "Diarrhoea; C. difficile risk." },
    vessels: { affinity: 0.8, sideEffects: "Sun sensitivity: skin burns easily. Binds to growing teeth and bone, so avoided under 8 and in pregnancy." },
  },
  toxicity: {
    mechanism: "Acute overdose mostly irritates the gut; very high levels can harm the liver.",
    warningSigns: ["Vomiting, abdominal pain", "Pain on swallowing", "Yellowing of skin or eyes"],
    treatment: "Supportive care.",
    organs: ["stomach", "liver"],
  },
  interactions: [
    { with: "Calcium, iron, magnesium, antacids", effect: "Bind doxycycline and block absorption; take 2–3 h apart." },
    { with: "Isotretinoin", effect: "Raised pressure around the brain; avoid together." },
    { with: "Warfarin", effect: "May raise INR." },
  ],
  didYouKnow: "Low-dose doxycycline is also used for rosacea, at doses below those needed to kill bacteria.",
  modelNotes: [],
};

export const cephalexin: DrugInput = {
  id: "cephalexin",
  name: "Cephalexin",
  altNames: ["Cefalexin"],
  brands: ["Keflex"],
  drugClass: "cephalosporin",
  classLabel: "1st-generation cephalosporin",
  categories: ["Antibiotic", "Everyday"],
  mechanism: "Blocks bacterial cell-wall building (like penicillin). Good against skin bacteria such as staphylococci and streptococci, and some urinary infections.",
  components: [
    {
      id: "cephalexin",
      name: "Cephalexin",
      regimens: [
        oral(mg(500, "dailymed-cephalexin", { range: [250, 1000] }), frac(0.9, "dailymed-cephalexin"), hrs(1, "dailymed-cephalexin"), {
          label: "Capsule",
          reportedCmax: mgL(18, "dailymed-cephalexin", { note: "After 500 mg" }),
        }),
      ],
      vd: lkg(0.26, "dailymed-cephalexin", { needsReview: true }),
      halfLife: hrs(1, "dailymed-cephalexin", { range: [0.5, 1.2] }),
      proteinBinding: frac(0.12, "dailymed-cephalexin", { range: [0.1, 0.15] }),
      fe: frac(0.9, "dailymed-cephalexin", { note: ">90% unchanged in urine within 8 h" }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Not metabolised; excreted unchanged in urine.",
      noThresholdReason: micDepends,
    },
  ],
  organs: {
    kidneys: { affinity: 1.6, target: true, therapeutic: "Very high urine levels for urinary infections.", toxic: "Rarely, kidney inflammation (interstitial nephritis)." },
    bladder: { affinity: 1.5, target: true },
    vessels: { affinity: 1, target: true, therapeutic: "Reaches skin and soft tissue to treat cellulitis and wound infections." },
    largeIntestine: { affinity: 0.9, sideEffects: "Diarrhoea; C. difficile risk." },
    brain: { affinity: 0.1, toxic: "Seizures only at very high levels with kidney failure." },
  },
  toxicity: {
    mechanism: "Low toxicity; overdose mainly upsets the gut. Allergic reactions are not dose-related.",
    warningSigns: ["Nausea, vomiting, diarrhoea", "Rash, swelling, wheeze (allergy)"],
    treatment: "Supportive care; anaphylaxis is treated with adrenaline.",
    organs: ["kidneys"],
  },
  interactions: [
    { with: "Metformin", effect: "Can raise metformin levels." },
    { with: "Probenecid", effect: "Slows excretion, raising levels." },
  ],
  didYouKnow: "Cephalosporins come from Cephalosporium acremonium, a fungus found near a sewage outlet in Sardinia in 1945.",
  modelNotes: [],
};

export const vancomycin: DrugInput = {
  id: "vancomycin",
  name: "Vancomycin",
  brands: ["Vancocin"],
  drugClass: "glycopeptide",
  classLabel: "Glycopeptide antibiotic",
  categories: ["Antibiotic", "ER"],
  mechanism:
    "Binds the building blocks of the bacterial cell wall so they cannot be linked together. A key hospital antibiotic for MRSA. Given IV for blood infections; as an oral dose it stays in the gut to treat C. difficile.",
  components: [
    {
      id: "vancomycin",
      name: "Vancomycin",
      regimens: [
        {
          id: "iv",
          label: "IV infusion (90 min)",
          route: "iv-infusion",
          dose: mg(1000, "dailymed-vancomycin", { range: [500, 1500], note: "Usually dosed by weight (15–20 mg/kg)" }),
          infusionDuration: hrs(1.5, "dailymed-vancomycin", { range: [1, 2], note: "At most 10 mg/min to avoid infusion reactions" }),
        },
      ],
      vd: lkg(0.7, "dailymed-vancomycin", { range: [0.4, 1] }),
      halfLife: hrs(6, "dailymed-vancomycin", { range: [4, 6], note: "Normal kidneys; can exceed 7 days in kidney failure" }),
      proteinBinding: frac(0.5, "dailymed-vancomycin", { range: [0.1, 0.55] }),
      fe: frac(0.8, "dailymed-vancomycin", { range: [0.75, 0.9] }),
      nonRenalRoute: "tissue-uptake",
      metabolism: "Not metabolised; filtered by the kidneys unchanged.",
      noThresholdReason: "Dosing targets the 24-hour exposure relative to the bug's MIC (AUC/MIC), guided by blood levels, not a single concentration.",
    },
  ],
  organs: {
    kidneys: {
      affinity: 1.8,
      therapeutic: "Remove it unchanged; levels are monitored because clearance tracks kidney function.",
      toxic: "Acute kidney injury, more likely with high exposure or other kidney-toxic drugs.",
    },
    vessels: {
      affinity: 1,
      target: true,
      therapeutic: "Treats MRSA and other resistant Gram-positive blood infections.",
      sideEffects: "Infusing too fast releases histamine: flushing and itching ('vancomycin infusion reaction').",
    },
    heart: { affinity: 0.9, target: true, therapeutic: "Used for endocarditis caused by resistant staphylococci." },
    brain: { affinity: 0.2, toxic: "Hearing damage (ototoxicity), rare and usually at high levels." },
    bladder: { affinity: 1.2 },
  },
  toxicity: {
    mechanism: "Too much exposure injures kidney tubule cells, and because vancomycin is cleared by the kidneys, levels then rise further.",
    warningSigns: ["Reduced urine output", "Ringing in the ears or hearing loss", "Flushing and itching during infusion"],
    treatment: "Stopping or reducing the dose with level monitoring; high-flux dialysis can remove it.",
    organs: ["kidneys", "brain"],
  },
  interactions: [
    { with: "Piperacillin-tazobactam, aminoglycosides, NSAIDs", effect: "Higher risk of kidney injury." },
    { with: "Loop diuretics", effect: "Added ear toxicity risk." },
  ],
  didYouKnow: "Vancomycin was isolated in 1953 from soil in Borneo; its name comes from 'vanquish'.",
  modelNotes: ["Real vancomycin kinetics have a distribution phase; dosing in practice is individualised with blood levels."],
};

export const fluconazole: DrugInput = {
  id: "fluconazole",
  name: "Fluconazole",
  brands: ["Diflucan", "Canesten Oral"],
  drugClass: "antifungal",
  classLabel: "Triazole antifungal",
  categories: ["Antibiotic", "Everyday"],
  mechanism:
    "Blocks the fungal enzyme that makes ergosterol, the fungal equivalent of cholesterol, so the fungal cell membrane fails. A single 150 mg dose treats vaginal thrush.",
  components: [
    {
      id: "fluconazole",
      name: "Fluconazole",
      regimens: [oral(mg(150, "dailymed-fluconazole", { range: [50, 400] }), frac(0.9, "dailymed-fluconazole", { note: ">90%" }), hrs(1.5, "dailymed-fluconazole", { range: [1, 2] }), { label: "Capsule" })],
      vd: lkg(0.7, "dailymed-fluconazole"),
      halfLife: hrs(30, "dailymed-fluconazole", { range: [20, 50] }),
      proteinBinding: frac(0.12, "dailymed-fluconazole", { range: [0.11, 0.12] }),
      fe: frac(0.8, "dailymed-fluconazole"),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Little metabolism (~11% as metabolites); inhibits CYP2C9, CYP2C19 and CYP3A4.",
      noThresholdReason: micDepends,
    },
  ],
  organs: {
    vessels: { affinity: 1, target: true, therapeutic: "Reaches tissues throughout the body to treat thrush and systemic yeast infections." },
    brain: { affinity: 0.8, target: true, therapeutic: "Enters the cerebrospinal fluid well: used for cryptococcal meningitis.", toxic: "Hallucinations have been reported in overdose." },
    liver: {
      affinity: 1.2,
      sideEffects: "Blocks several CYP enzymes, raising levels of many other drugs.",
      toxic: "Liver injury, rare but serious.",
    },
    heart: { affinity: 0.9, sideEffects: "Can prolong QT.", toxic: "QT prolongation." },
    kidneys: { affinity: 1.3, therapeutic: "Excrete it mostly unchanged." },
    bladder: { affinity: 1.2, target: true, therapeutic: "High urine levels treat fungal urinary infections." },
  },
  toxicity: {
    mechanism: "Overdose is uncommon and usually mild; high levels can affect the heart rhythm and the liver.",
    warningSigns: ["Palpitations", "Confusion, hallucinations", "Yellowing of skin or eyes"],
    treatment: "Supportive care; haemodialysis removes fluconazole.",
    organs: ["heart", "liver"],
  },
  interactions: [
    { with: "Warfarin", effect: "Raises INR markedly." },
    { with: "Statins (simvastatin, atorvastatin)", effect: "Muscle toxicity risk." },
    { with: "QT-prolonging drugs", effect: "Additive QT risk." },
  ],
  didYouKnow: "Its half-life of about 30 hours is why a single tablet is enough for vaginal thrush.",
  modelNotes: [],
};

export const acyclovir: DrugInput = {
  id: "acyclovir",
  name: "Acyclovir",
  altNames: ["Aciclovir"],
  brands: ["Zovirax"],
  drugClass: "antiviral",
  classLabel: "Antiviral (nucleoside analogue)",
  categories: ["Antibiotic", "Everyday"],
  mechanism:
    "Activated only inside herpes-infected cells (by the viral thymidine kinase), then blocks the viral DNA polymerase. That makes it very selective for infected cells. Treats cold sores, genital herpes and shingles.",
  components: [
    {
      id: "acyclovir",
      name: "Acyclovir",
      regimens: [oral(mg(400, "dailymed-acyclovir", { range: [200, 800] }), frac(0.2, "dailymed-acyclovir", { range: [0.1, 0.3], note: "Falls as dose increases" }), hrs(1.5, "dailymed-acyclovir", { range: [1.5, 2] }))],
      vd: lkg(0.7, "dailymed-acyclovir", { needsReview: true }),
      halfLife: hrs(3, "dailymed-acyclovir", { range: [2.5, 3.3] }),
      proteinBinding: frac(0.2, "dailymed-acyclovir", { range: [0.09, 0.33] }),
      fe: frac(0.75, "dailymed-acyclovir", { range: [0.62, 0.91] }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Small part to an inactive metabolite (CMMG); most excreted unchanged in urine.",
      noThresholdReason: "Antiviral effect depends on activation inside infected cells; no plasma threshold is used clinically.",
    },
  ],
  organs: {
    vessels: { affinity: 1, target: true, therapeutic: "Reaches infected skin and nerve tissue, shortening outbreaks." },
    brain: {
      affinity: 0.5,
      target: true,
      therapeutic: "IV acyclovir treats herpes encephalitis.",
      toxic: "Confusion, tremor and hallucinations with very high levels, mainly in kidney failure.",
    },
    kidneys: {
      affinity: 1.6,
      therapeutic: "Excrete it unchanged; dose is reduced in kidney disease.",
      toxic: "Crystals in kidney tubules (crystal nephropathy), mainly with high IV doses and dehydration.",
    },
    bladder: { affinity: 1.4 },
  },
  toxicity: {
    mechanism: "Acyclovir is poorly soluble: at high urine concentrations it crystallises in the kidney tubules. Accumulation in kidney failure affects the brain.",
    warningSigns: ["Reduced urine, flank pain", "Confusion, agitation, tremor"],
    treatment: "Stopping the drug, IV fluids; haemodialysis removes it.",
    organs: ["kidneys", "brain"],
  },
  interactions: [
    { with: "Other kidney-toxic drugs (NSAIDs, ciclosporin)", effect: "Increase kidney risk." },
    { with: "Probenecid", effect: "Raises acyclovir levels." },
  ],
  didYouKnow: "Gertrude Elion's work on acyclovir contributed to her 1988 Nobel Prize in Medicine.",
  modelNotes: [],
};
