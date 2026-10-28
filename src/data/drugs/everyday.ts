import type { DrugInput } from "../schema";
import { frac, hrs, lkg, litres, mg, mgL } from "./_v";

export const omeprazole: DrugInput = {
  id: "omeprazole",
  name: "Omeprazole",
  brands: ["Losec", "Prilosec"],
  drugClass: "ppi",
  classLabel: "Proton pump inhibitor",
  categories: ["Everyday"],
  mechanism:
    "Switches off the stomach's acid pumps (H⁺/K⁺-ATPase) by binding to them permanently. Acid output only recovers as the stomach makes new pumps, so one dose works for about a day even though the drug leaves the blood within hours.",
  components: [
    {
      id: "omeprazole",
      name: "Omeprazole",
      regimens: [
        {
          id: "oral",
          label: "Delayed-release capsule",
          route: "oral",
          dose: mg(20, "dailymed-omeprazole", { range: [10, 40] }),
          absorption: {
            F: frac(0.35, "dailymed-omeprazole", { range: [0.3, 0.4], note: "Rises to ~60% with repeated daily dosing" }),
            tmax: hrs(2, "dailymed-omeprazole", { range: [0.5, 3.5] }),
            lag: hrs(1, "dailymed-omeprazole", { needsReview: true, note: "Delayed-release coating" }),
          },
        },
      ],
      vd: lkg(0.3, "gg-appendix", { range: [0.2, 0.4], needsReview: true }),
      halfLife: hrs(0.75, "dailymed-omeprazole", { range: [0.5, 1] }),
      proteinBinding: frac(0.95, "dailymed-omeprazole"),
      fe: frac(0, "dailymed-omeprazole", { note: "Little or no unchanged drug in urine; ~77% of dose appears as metabolites" }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: CYP2C19 (major) and CYP3A4. 'Poor metabolisers' of CYP2C19 have several-fold higher levels.",
      noThresholdReason:
        "Effect is uncoupled from plasma level: the drug permanently disables acid pumps, so acid suppression lasts ~24 h after plasma levels are gone.",
    },
  ],
  organs: {
    stomach: {
      affinity: 2,
      target: true,
      therapeutic: "Concentrates in the acid-making parietal cells and shuts down their proton pumps.",
      sideEffects: "Long-term use is linked to low magnesium and vitamin B12, and a higher risk of gut infections.",
      toxic: "Acute overdose is generally well tolerated: confusion, drowsiness, blurred vision, fast heartbeat have been reported.",
    },
    liver: { affinity: 1.2, therapeutic: "Metabolised by CYP2C19; omeprazole also inhibits this enzyme, affecting other drugs." },
    smallIntestine: { affinity: 1, therapeutic: "The capsule's coating protects the drug from acid until it reaches the intestine." },
    brain: { affinity: 0.4, toxic: "Confusion and drowsiness in large overdoses." },
  },
  toxicity: {
    mechanism: "Omeprazole has a wide safety margin; overdoses mainly cause non-specific symptoms. Most concerns are about long-term use.",
    warningSigns: ["Confusion, drowsiness", "Blurred vision", "Fast heartbeat, flushing, sweating"],
    treatment: "Supportive care; there is no specific antidote and it is rarely needed.",
    organs: ["stomach"],
  },
  interactions: [
    { with: "Clopidogrel", effect: "Inhibits the CYP2C19 activation of clopidogrel, possibly reducing its anti-clot effect." },
    { with: "Diazepam, citalopram", effect: "Slows their CYP2C19 clearance, raising levels." },
    { with: "Drugs that need acid to be absorbed (some antifungals, iron)", effect: "Reduced absorption." },
  ],
  didYouKnow: "Omeprazole is a 'prodrug': it is only activated in the acid of the very parietal cells it shuts down.",
  modelNotes: ["The plasma curve here vanishes within hours, but acid suppression lasts about a day."],
};

export const metformin: DrugInput = {
  id: "metformin",
  name: "Metformin",
  brands: ["Glucophage", "Glucophage SR"],
  drugClass: "biguanide",
  classLabel: "Biguanide (diabetes)",
  categories: ["Everyday"],
  mechanism:
    "Mainly reduces how much glucose the liver releases into the blood, and helps muscles respond to insulin. It does not force the pancreas to make more insulin, so on its own it rarely causes dangerously low blood sugar.",
  components: [
    {
      id: "metformin",
      name: "Metformin",
      regimens: [
        {
          id: "oral",
          label: "Immediate-release tablet",
          route: "oral",
          dose: mg(500, "dailymed-metformin", { range: [500, 1000] }),
          absorption: {
            F: frac(1, "dailymed-metformin", { note: "Absolute F is 50–60%; volume below is apparent (V/F), so F is already included" }),
            tmax: hrs(2.5, "dailymed-metformin", { range: [2, 3], needsReview: true }),
          },
        },
      ],
      vd: litres(654, "dailymed-metformin", { basis: "V/F", note: "654 ± 358 L after a single 850 mg dose" }),
      halfLife: hrs(6.2, "dailymed-metformin", { note: "Plasma; half-life in red blood cells is ~17.6 h" }),
      proteinBinding: frac(0, "dailymed-metformin", { note: "Negligible" }),
      fe: frac(0.9, "dailymed-metformin", { range: [0.9, 1], note: "Not metabolised; ~90% of absorbed drug leaves in urine within 24 h" }),
      nonRenalRoute: "tissue-uptake",
      metabolism: "Not metabolised. Excreted unchanged by the kidneys via filtration and active tubular secretion.",
      noThresholdReason: "Its glucose-lowering effect builds over days of regular dosing and does not track single-dose plasma levels.",
    },
  ],
  organs: {
    liver: {
      affinity: 1.6,
      target: true,
      therapeutic: "Taken up by liver cells, where it reduces glucose production (gluconeogenesis).",
      toxic: "Very high levels block lactate clearance by the liver, contributing to lactic acidosis.",
    },
    smallIntestine: {
      affinity: 1.6,
      sideEffects: "Concentrates in gut wall: nausea, diarrhoea and a metallic taste are common at first.",
    },
    vessels: { affinity: 1, toxic: "Lactic acid builds up in the blood: metformin-associated lactic acidosis." },
    kidneys: {
      affinity: 1.4,
      therapeutic: "Remove it unchanged; doses are cut or stopped if kidney function falls.",
      toxic: "Kidney failure lets metformin accumulate, the main setting for lactic acidosis.",
    },
    pancreas: { affinity: 0.6, therapeutic: "Does not stimulate insulin release, so hypos are uncommon." },
    bladder: { affinity: 1 },
  },
  toxicity: {
    mechanism:
      "At high concentrations metformin inhibits mitochondrial energy production. Cells switch to making lactate, and the liver clears less of it. Lactic acid builds up in the blood (metformin-associated lactic acidosis).",
    warningSigns: ["Vomiting, abdominal pain", "Fast, deep breathing", "Muscle pain, extreme tiredness", "Low blood pressure, confusion"],
    treatment: "Emergency care. Haemodialysis removes metformin and corrects the acidosis.",
    organs: ["liver", "kidneys", "vessels"],
  },
  interactions: [
    { with: "Iodinated contrast (CT scans)", effect: "Can impair kidneys; metformin is often paused around contrast." },
    { with: "Heavy alcohol", effect: "Raises lactic acidosis risk." },
    { with: "Dolutegravir (in HIV PEP)", effect: "Raises metformin levels; dose adjustment may be needed." },
  ],
  didYouKnow: "Metformin derives from goat's rue (French lilac), a plant used in medieval Europe to ease symptoms of diabetes.",
  modelNotes: [],
};

export const ondansetron: DrugInput = {
  id: "ondansetron",
  name: "Ondansetron",
  brands: ["Zofran"],
  drugClass: "antiemetic",
  classLabel: "5-HT₃ antagonist antiemetic",
  categories: ["Everyday", "ER"],
  mechanism:
    "Blocks 5-HT₃ serotonin receptors on gut nerves and in the brain's vomiting centre. When the gut lining releases serotonin (after chemotherapy, surgery or a stomach bug), the nausea signal cannot get through.",
  components: [
    {
      id: "ondansetron",
      name: "Ondansetron",
      regimens: [
        {
          id: "oral",
          label: "Oral tablet",
          route: "oral",
          dose: mg(8, "dailymed-ondansetron", { range: [4, 8] }),
          absorption: {
            F: frac(0.56, "dailymed-ondansetron"),
            tmax: hrs(1.7, "dailymed-ondansetron", { range: [1.5, 2] }),
          },
        },
        {
          id: "iv",
          label: "IV injection",
          route: "iv-bolus",
          dose: mg(4, "dailymed-ondansetron"),
        },
      ],
      vd: litres(160, "dailymed-ondansetron", { needsReview: true }),
      halfLife: hrs(3.8, "dailymed-ondansetron", { range: [3, 6], note: "Longer in older adults and liver disease" }),
      proteinBinding: frac(0.73, "dailymed-ondansetron", { range: [0.7, 0.76] }),
      fe: frac(0.05, "dailymed-ondansetron", { range: [0, 0.05] }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: several CYP enzymes (CYP3A4 mainly, also 1A2 and 2D6), so no single inhibitor has a big effect.",
      noThresholdReason: "Anti-sickness effect depends on receptor blockade; no plasma range is used clinically.",
    },
  ],
  organs: {
    brain: { affinity: 0.8, target: true, therapeutic: "Blocks 5-HT₃ receptors in the vomiting centre (chemoreceptor trigger zone).", sideEffects: "Headache is common." },
    smallIntestine: { affinity: 1.2, target: true, therapeutic: "Blocks serotonin signals on vagal nerves in the gut wall.", sideEffects: "Constipation." },
    heart: {
      affinity: 1,
      sideEffects: "Can slightly prolong the QT interval on the ECG.",
      toxic: "Larger QT prolongation raises the risk of a dangerous rhythm (torsades de pointes).",
    },
    liver: { affinity: 1, therapeutic: "Broken down by several CYP enzymes." },
  },
  toxicity: {
    mechanism: "Too much ondansetron mainly affects the heart's electrical recovery (QT prolongation). Combined with other serotonergic drugs it can contribute to serotonin syndrome.",
    warningSigns: ["Palpitations, fainting", "Dizziness, low blood pressure", "Agitation, tremor, fever (serotonin syndrome)"],
    treatment: "ECG monitoring, correcting potassium and magnesium, supportive care.",
    organs: ["heart"],
  },
  interactions: [
    { with: "Other QT-prolonging drugs (some antibiotics, antipsychotics)", effect: "Additive QT prolongation." },
    { with: "SSRIs, SNRIs, tramadol", effect: "Rare serotonin syndrome." },
    { with: "Apomorphine", effect: "Severe low blood pressure; contraindicated." },
  ],
  didYouKnow: "Ondansetron transformed chemotherapy in the early 1990s, when severe vomiting had been one of the main reasons patients stopped treatment.",
  modelNotes: [],
};

export const salbutamol: DrugInput = {
  id: "salbutamol",
  name: "Salbutamol",
  altNames: ["Albuterol"],
  brands: ["Ventolin", "ProAir", "Asthalin"],
  drugClass: "bronchodilator",
  classLabel: "Short-acting β₂-agonist",
  categories: ["Everyday", "ER"],
  mechanism:
    "Stimulates β₂-adrenergic receptors on the smooth muscle wrapped around the airways, making it relax within minutes. Inhaled, it goes straight to the lungs, so only a small amount reaches the blood.",
  components: [
    {
      id: "salbutamol",
      name: "Salbutamol",
      regimens: [
        {
          id: "oral",
          label: "Oral tablet",
          route: "oral",
          dose: mg(4, "dailymed-albuterol-oral", { range: [2, 4] }),
          absorption: {
            F: frac(0.5, "gg-appendix", { note: "Sulfated in the gut wall and liver on first pass", needsReview: true }),
            tmax: hrs(2.25, "dailymed-albuterol-oral", { range: [2, 2.5] }),
          },
          reportedCmax: mgL(0.018, "dailymed-albuterol-oral", { note: "~18 ng/mL after 4 mg", needsReview: true }),
        },
        {
          id: "inhaled",
          label: "Inhaler (2 puffs)",
          route: "inhaled",
          dose: mg(0.2, "dailymed-albuterol-oral", { note: "2 × 100 µg puffs" }),
          absorption: {
            F: frac(0.2, "needs-source", { needsReview: true, note: "Systemic availability of inhaled dose (lung + swallowed)" }),
            tmax: hrs(0.25, "needs-source", { needsReview: true }),
          },
          note: "Inhaled salbutamol acts directly on the airways; the plasma curve only shows systemic spill-over.",
        },
      ],
      vd: lkg(2.2, "gg-appendix", { needsReview: true }),
      halfLife: hrs(5, "dailymed-albuterol-oral", { range: [2.7, 6] }),
      proteinBinding: frac(0.1, "gg-appendix", { needsReview: true }),
      fe: frac(0.3, "gg-appendix", { needsReview: true, note: "Higher after inhalation, when less first-pass sulfation occurs" }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Sulfation (SULT1A3) in the gut wall and liver to an inactive 4′-O-sulfate.",
      noThresholdReason: "Inhaled salbutamol acts locally in the airways; plasma levels reflect side-effect risk, not benefit.",
    },
  ],
  organs: {
    lungs: {
      affinity: 2,
      target: true,
      therapeutic: "Relaxes airway smooth muscle within minutes, opening the airways during asthma or COPD attacks.",
      sideEffects: "Over-reliance can mask worsening asthma; needing it more often is a warning sign.",
    },
    heart: {
      affinity: 1,
      sideEffects: "Fast heartbeat and palpitations from spill-over β-stimulation.",
      toxic: "Very fast heart rate, rhythm disturbances, chest pain.",
    },
    vessels: {
      affinity: 1,
      sideEffects: "Pushes potassium into cells, lowering blood potassium.",
      toxic: "Low potassium and raised lactate can become significant.",
    },
    brain: { affinity: 0.4, sideEffects: "Tremor, nervousness.", toxic: "Agitation, severe tremor." },
    liver: { affinity: 1, therapeutic: "Sulfated to an inactive metabolite." },
  },
  toxicity: {
    mechanism: "Excess β-stimulation drives the heart and shifts potassium into cells. Muscles produce lactate and blood sugar rises.",
    warningSigns: ["Very fast heartbeat, palpitations, chest pain", "Severe shaking", "Muscle cramps, weakness (low potassium)"],
    treatment:
      "Supportive hospital care, correcting potassium and monitoring the heart. If an asthma attack is not improving, it is an emergency: call for help.",
    organs: ["heart", "vessels"],
  },
  interactions: [
    { with: "Non-selective beta-blockers (propranolol)", effect: "Block salbutamol and can trigger severe bronchospasm in asthma." },
    { with: "Diuretics, steroids, theophylline", effect: "Add to potassium loss." },
  ],
  didYouKnow: "Salbutamol was developed by Allen & Hanburys (later Glaxo) and launched as Ventolin in 1969.",
  modelNotes: [],
};
