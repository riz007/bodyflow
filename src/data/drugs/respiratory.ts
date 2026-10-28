import type { DrugInput } from "../schema";
import { frac, hrs, litres, lkg, mg, mgL, oral } from "./_v";

const nsaidOrgans = (gi: string): DrugInput["organs"] => ({
  vessels: { affinity: 1, target: true, therapeutic: "Reduces inflammatory swelling and pain throughout tissues." },
  stomach: {
    affinity: 1.3,
    sideEffects: gi,
    toxic: "Ulcers and bleeding of the stomach and duodenum.",
  },
  kidneys: {
    affinity: 1,
    sideEffects: "Reduced prostaglandins narrow kidney blood vessels, especially when dehydrated.",
    toxic: "Acute kidney injury.",
  },
  heart: { affinity: 0.8, sideEffects: "Regular use raises the risk of heart attack and stroke, and can raise blood pressure." },
  liver: { affinity: 1.1, therapeutic: "Metabolised by CYP2C9." },
  brain: { affinity: 0.4, toxic: "Drowsiness, headache; seizures in massive overdose." },
});

const nsaidInteractions: DrugInput["interactions"] = [
  { with: "Anticoagulants, SSRIs, steroids", effect: "Higher gut bleeding risk." },
  { with: "ACE inhibitors / ARBs + diuretics", effect: "The 'triple whammy' risk of acute kidney injury." },
  { with: "Lithium, methotrexate", effect: "Raised levels of these drugs." },
];

export const fluticasone: DrugInput = {
  id: "fluticasone",
  name: "Fluticasone",
  brands: ["Flovent / Flixotide (inhaled)", "Flonase / Flixonase (nasal)"],
  drugClass: "corticosteroid",
  classLabel: "Inhaled / nasal corticosteroid",
  categories: ["Respiratory", "Everyday"],
  mechanism:
    "A potent steroid delivered straight to the airways or nose, where it switches off inflammatory genes and calms swelling. Swallowed drug is almost entirely destroyed by the liver, so whole-body effects are small at normal doses.",
  relativeOnly: true,
  components: [
    {
      id: "fluticasone",
      name: "Fluticasone propionate",
      regimens: [
        {
          id: "inhaled",
          label: "Inhaler (250 µg)",
          route: "inhaled",
          dose: mg(0.25, "dailymed-fluticasone", { range: [0.1, 0.5] }),
          absorption: {
            F: frac(0.16, "dailymed-fluticasone", { needsReview: true, note: "Systemic availability via the lungs; oral F <1%" }),
            tmax: hrs(1, "dailymed-fluticasone", { range: [0.5, 2], needsReview: true }),
          },
          note: "Acts locally in the airways; the plasma curve shows only systemic spill-over.",
        },
      ],
      vd: lkg(4.2, "dailymed-fluticasone"),
      halfLife: hrs(7.8, "dailymed-fluticasone", { note: "After IV dosing" }),
      proteinBinding: frac(0.99, "dailymed-fluticasone"),
      fe: frac(0.01, "dailymed-fluticasone", { note: "<5% of a dose in urine, as metabolites" }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: CYP3A4 to an inactive 17β-carboxylic acid.",
      noThresholdReason: "Works locally in the airways over days to weeks; plasma levels only reflect side-effect risk.",
    },
  ],
  organs: {
    lungs: {
      affinity: 2.5,
      target: true,
      therapeutic: "Reduces airway inflammation, preventing asthma attacks over time (it is not a reliever).",
      sideEffects: "Hoarse voice and mouth thrush: rinse the mouth after use.",
    },
    liver: { affinity: 1.4, therapeutic: "Destroys swallowed drug on first pass." },
    vessels: {
      affinity: 0.6,
      toxic: "With strong CYP3A4 inhibitors (ritonavir), systemic levels rise enough to cause Cushing's syndrome and adrenal suppression.",
    },
    brain: { affinity: 0.2, toxic: "Long-term high exposure suppresses the brain–adrenal stress hormone axis." },
  },
  toxicity: {
    mechanism: "A single overdose is unlikely to cause harm. The concern is long-term high exposure, especially with drugs that block its breakdown.",
    warningSigns: ["Rounded face, weight gain, easy bruising (long-term)", "Weakness or dizziness when stopping after long high-dose use"],
    treatment: "Dose reduction; specialist care for adrenal suppression.",
    organs: ["vessels", "brain"],
  },
  interactions: [{ with: "Ritonavir, cobicistat, itraconazole", effect: "Block CYP3A4: Cushing's syndrome has been reported." }],
  didYouKnow: "Over 99% of a swallowed fluticasone dose is broken down by the liver before reaching the circulation.",
  modelNotes: ["Absolute levels are not shown; plasma concentrations are in the picogram range."],
};

export const prednisolone: DrugInput = {
  id: "prednisolone",
  name: "Prednisolone",
  altNames: ["Prednisone (converted to prednisolone by the liver)"],
  brands: ["Deltacortril", "Deltasone (prednisone)"],
  drugClass: "corticosteroid",
  classLabel: "Systemic corticosteroid",
  categories: ["Respiratory", "Everyday"],
  mechanism:
    "Mimics the body's stress hormone cortisol. It enters cells and switches off inflammatory and immune genes, which calms asthma, allergy, arthritis and autoimmune flares. Its effects last much longer than its plasma half-life.",
  components: [
    {
      id: "prednisolone",
      name: "Prednisolone",
      regimens: [oral(mg(40, "dailymed-prednisolone", { range: [5, 60] }), frac(0.82, "dailymed-prednisolone", { range: [0.7, 1], needsReview: true }), hrs(1.5, "dailymed-prednisolone", { range: [1, 2] }))],
      vd: lkg(0.5, "dailymed-prednisolone", { range: [0.4, 0.6], needsReview: true }),
      halfLife: hrs(3, "dailymed-prednisolone", { range: [2, 4], note: "Biological effect lasts 12–36 h" }),
      proteinBinding: frac(0.75, "dailymed-prednisolone", { range: [0.7, 0.9], note: "Falls at higher concentrations" }),
      fe: frac(0.2, "dailymed-prednisolone", { needsReview: true }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: interconverted with prednisone and metabolised (partly by CYP3A4) to inactive products.",
      noThresholdReason: "Gene-level effects outlast plasma levels; dosing is by clinical response.",
    },
  ],
  organs: {
    lungs: { affinity: 1.2, target: true, therapeutic: "Reduces airway inflammation in severe asthma and COPD flares." },
    vessels: {
      affinity: 1,
      target: true,
      therapeutic: "Damps immune and inflammatory activity throughout the body.",
      sideEffects: "Infection risk, raised blood pressure, fluid retention.",
      toxic: "Very high blood sugar and fluid retention.",
    },
    stomach: { affinity: 0.8, sideEffects: "Indigestion; ulcer risk mainly when combined with NSAIDs.", toxic: "Gastrointestinal bleeding, especially with NSAIDs." },
    brain: {
      affinity: 0.7,
      sideEffects: "Insomnia, mood changes, increased appetite.",
      toxic: "Mania, psychosis or severe agitation at high doses.",
    },
    pancreas: { affinity: 0.6, sideEffects: "Raises blood sugar (steroid-induced diabetes)." },
    liver: { affinity: 1.4, therapeutic: "Converts prednisone to active prednisolone." },
  },
  toxicity: {
    mechanism:
      "A single high dose is rarely dangerous. Problems come from high or long-term doses: high blood sugar, mood disturbance, infection and adrenal suppression. Stopping suddenly after weeks can cause adrenal crisis.",
    warningSigns: ["Very high blood sugar (thirst, passing urine often)", "Agitation, confusion, mood swings", "Signs of infection", "Collapse on stopping suddenly"],
    treatment: "Supportive care. Long courses are tapered, never stopped abruptly.",
    organs: ["vessels", "brain", "stomach"],
  },
  interactions: [
    { with: "NSAIDs", effect: "Higher risk of stomach ulcers and bleeding." },
    { with: "Diabetes medicines", effect: "Steroids raise blood sugar; doses may need increasing." },
    { with: "Live vaccines", effect: "Avoided during high-dose treatment." },
  ],
  didYouKnow: "Prednisone itself is inactive; the liver converts it into prednisolone.",
  modelNotes: ["The curve shows prednisolone; anti-inflammatory effects last far longer than the plasma level."],
};

export const loratadine: DrugInput = {
  id: "loratadine",
  name: "Loratadine",
  brands: ["Claritin", "Clarityn"],
  drugClass: "antihistamine",
  classLabel: "2nd-generation antihistamine",
  categories: ["Respiratory", "Everyday"],
  mechanism:
    "Blocks peripheral histamine H1 receptors to relieve hay fever and hives. Most of the effect comes from its long-acting metabolite desloratadine. It barely enters the brain, so it rarely causes drowsiness.",
  relativeOnly: true,
  components: [
    {
      id: "loratadine",
      name: "Loratadine",
      regimens: [oral(mg(10, "dailymed-loratadine"), frac(1, "dailymed-loratadine", { needsReview: true, note: "Absolute bioavailability not established" }), hrs(1.3, "dailymed-loratadine", { note: "Desloratadine peaks at ~2.5 h" }))],
      vd: lkg(120, "dailymed-loratadine", { basis: "V/F", needsReview: true }),
      halfLife: hrs(8.4, "dailymed-loratadine", { range: [3, 20], note: "Desloratadine: ~28 h" }),
      proteinBinding: frac(0.98, "dailymed-loratadine", { range: [0.97, 0.99] }),
      fe: frac(0, "dailymed-loratadine"),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: CYP3A4 and CYP2D6 to desloratadine (active).",
      noThresholdReason: "Antihistamine effect depends largely on the metabolite desloratadine; no plasma range is used.",
    },
  ],
  organs: {
    lungs: { affinity: 1, target: true, therapeutic: "Relieves sneezing, runny nose and itchy eyes." },
    vessels: { affinity: 1, target: true, therapeutic: "Reduces histamine-driven hives and itching." },
    brain: { affinity: 0.15, sideEffects: "Drowsiness is uncommon.", toxic: "Drowsiness, headache." },
    heart: { affinity: 0.7, toxic: "Fast heart rate in overdose." },
    liver: { affinity: 1.4, therapeutic: "Converts it to desloratadine." },
  },
  toxicity: {
    mechanism: "Overdose usually causes only mild symptoms.",
    warningSigns: ["Drowsiness", "Headache", "Fast heartbeat"],
    treatment: "Supportive care.",
    organs: ["brain", "heart"],
  },
  interactions: [{ with: "Ketoconazole, erythromycin", effect: "Raise loratadine levels (usually without clinical effect)." }],
  didYouKnow: "Desloratadine, loratadine's own metabolite, is sold separately as Clarinex / Neoclarityn.",
  modelNotes: ["Absolute levels are not shown; the active metabolite desloratadine is not modelled."],
};

export const montelukast: DrugInput = {
  id: "montelukast",
  name: "Montelukast",
  brands: ["Singulair"],
  drugClass: "leukotriene-antagonist",
  classLabel: "Leukotriene receptor antagonist",
  categories: ["Respiratory"],
  mechanism:
    "Blocks the CysLT1 receptor for leukotrienes, inflammatory messengers that tighten the airways and cause mucus and swelling. Used to prevent asthma and for allergic rhinitis.",
  components: [
    {
      id: "montelukast",
      name: "Montelukast",
      regimens: [
        oral(mg(10, "dailymed-montelukast"), frac(0.64, "dailymed-montelukast"), hrs(3.5, "dailymed-montelukast", { range: [3, 4] }), {
          reportedCmax: mgL(0.385, "dailymed-montelukast", { needsReview: true, note: "Mean peak after 10 mg in fasted adults" }),
        }),
      ],
      vd: litres(9.5, "dailymed-montelukast", { range: [8, 11] }),
      halfLife: hrs(5, "dailymed-montelukast", { range: [2.7, 5.5] }),
      proteinBinding: frac(0.99, "dailymed-montelukast"),
      fe: frac(0, "dailymed-montelukast", { note: "Excreted almost entirely in bile" }),
      nonRenalRoute: "biliary",
      metabolism: "Liver: CYP2C8 (major), CYP3A4 and CYP2C9; excreted in bile.",
      noThresholdReason: "Asthma control is judged clinically; no plasma range is used.",
    },
  ],
  organs: {
    lungs: { affinity: 1.6, target: true, therapeutic: "Prevents leukotriene-driven airway narrowing, especially exercise- and allergy-induced." },
    brain: {
      affinity: 0.5,
      sideEffects: "Neuropsychiatric effects such as nightmares, agitation, depression and, rarely, suicidal thoughts (FDA boxed warning).",
      toxic: "Agitation, drowsiness, thirst and restlessness in overdose.",
    },
    liver: { affinity: 1.3, therapeutic: "Metabolised and excreted in bile." },
    largeIntestine: { affinity: 0.8 },
  },
  toxicity: {
    mechanism: "Overdoses are usually mild. The main safety issue at normal doses is neuropsychiatric side effects.",
    warningSigns: ["Agitation, unusual mood or behaviour", "Drowsiness, thirst", "Abdominal pain"],
    treatment: "Supportive care. Stop and seek advice if mood or behaviour changes.",
    organs: ["brain"],
  },
  interactions: [{ with: "Gemfibrozil (CYP2C8 inhibitor)", effect: "Raises montelukast levels several-fold." }],
  didYouKnow: "Leukotrienes were once called 'slow-reacting substance of anaphylaxis' before their structure was known.",
  modelNotes: [],
};

export const naproxen: DrugInput = {
  id: "naproxen",
  name: "Naproxen",
  brands: ["Naprosyn", "Aleve", "Feminax Ultra"],
  drugClass: "nsaid",
  classLabel: "NSAID",
  categories: ["Pain", "Everyday"],
  mechanism: "Blocks COX-1 and COX-2, reducing prostaglandins that drive pain and inflammation. Its long half-life allows twice-daily dosing.",
  components: [
    {
      id: "naproxen",
      name: "Naproxen",
      regimens: [oral(mg(500, "dailymed-naproxen", { range: [250, 500] }), frac(0.95, "dailymed-naproxen"), hrs(3, "dailymed-naproxen", { range: [2, 4] }))],
      vd: lkg(0.16, "dailymed-naproxen"),
      halfLife: hrs(14, "dailymed-naproxen", { range: [12, 17] }),
      proteinBinding: frac(0.99, "dailymed-naproxen"),
      fe: frac(0.01, "dailymed-naproxen"),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: CYP2C9 and CYP1A2 to 6-desmethylnaproxen; glucuronidation.",
      noThresholdReason: "Pain relief depends on COX inhibition at the inflamed site, not on one plasma cut-off.",
    },
  ],
  organs: nsaidOrgans("Loss of protective prostaglandins exposes the stomach lining to acid."),
  toxicity: {
    mechanism: "Overdose causes gut irritation and bleeding, kidney injury from reduced blood flow, and in large amounts metabolic acidosis and drowsiness.",
    warningSigns: ["Stomach pain, vomiting, black stools", "Drowsiness, dizziness", "Reduced urine output"],
    treatment: "No specific antidote; supportive care is effective.",
    organs: ["stomach", "kidneys"],
  },
  interactions: [...nsaidInteractions],
  didYouKnow: "Naproxen appears to carry one of the lower cardiovascular risks among NSAIDs.",
  modelNotes: [],
};

export const diclofenac: DrugInput = {
  id: "diclofenac",
  name: "Diclofenac",
  brands: ["Voltaren", "Voltarol", "Cataflam"],
  drugClass: "nsaid",
  classLabel: "NSAID",
  categories: ["Pain", "Everyday"],
  mechanism: "Blocks COX enzymes, with a relative preference for COX-2, reducing pain and inflammation. Also available as a gel for local use.",
  components: [
    {
      id: "diclofenac",
      name: "Diclofenac",
      regimens: [oral(mg(50, "dailymed-diclofenac", { range: [25, 50] }), frac(0.55, "dailymed-diclofenac", { range: [0.5, 0.6], note: "~50% first-pass metabolism" }), hrs(1.5, "dailymed-diclofenac", { range: [1, 2] }))],
      vd: lkg(1.3, "dailymed-diclofenac", { needsReview: true }),
      halfLife: hrs(2, "dailymed-diclofenac", { range: [1.2, 2] }),
      proteinBinding: frac(0.99, "dailymed-diclofenac"),
      fe: frac(0.01, "dailymed-diclofenac"),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: CYP2C9 to 4'-hydroxydiclofenac, then glucuronidation.",
      noThresholdReason: "Diclofenac concentrates in inflamed joints and lasts longer there than in plasma.",
    },
  ],
  organs: {
    ...nsaidOrgans("Indigestion and ulcer risk."),
    heart: {
      affinity: 0.9,
      sideEffects: "Higher cardiovascular risk than naproxen or ibuprofen at usual doses; avoided after heart attack or stroke.",
    },
    liver: { affinity: 1.4, therapeutic: "Metabolised by CYP2C9.", sideEffects: "Raised liver enzymes are more common than with other NSAIDs.", toxic: "Liver injury." },
  },
  toxicity: {
    mechanism: "As with other NSAIDs, overdose irritates the gut and reduces kidney blood flow; diclofenac also carries a higher liver risk.",
    warningSigns: ["Stomach pain, vomiting, black stools", "Reduced urine", "Yellowing of skin or eyes"],
    treatment: "Supportive care; no specific antidote.",
    organs: ["stomach", "kidneys", "liver"],
  },
  interactions: [...nsaidInteractions],
  didYouKnow: "Diclofenac residues in cattle carcasses caused a catastrophic collapse in India's vulture populations in the 1990s and 2000s.",
  modelNotes: [],
};
