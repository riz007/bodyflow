import type { DrugInput } from "../schema";
import { frac, hrs, litres, lkg, mg, oral } from "./_v";

const antidepressantDelay =
  "Antidepressant effect builds over 2–6 weeks of daily dosing as brain receptors adapt; it does not track single-dose plasma levels.";

const serotoninSyndrome: DrugInput["toxicity"]["warningSigns"] = [
  "Agitation, confusion, restlessness",
  "Shivering, sweating, fever",
  "Muscle twitching or rigidity, tremor",
  "Fast heartbeat, seizures (severe)",
];

const ssriInteractions: DrugInput["interactions"] = [
  { with: "MAOIs, linezolid, methylene blue", effect: "Risk of severe serotonin syndrome; contraindicated." },
  { with: "Tramadol, triptans, other antidepressants", effect: "Additive serotonin effects." },
  { with: "NSAIDs, aspirin, anticoagulants", effect: "SSRIs reduce platelet serotonin: higher bleeding risk, especially from the gut." },
];

export const sertraline: DrugInput = {
  id: "sertraline",
  name: "Sertraline",
  brands: ["Zoloft", "Lustral"],
  drugClass: "ssri",
  classLabel: "SSRI antidepressant",
  categories: ["CNS"],
  mechanism:
    "Blocks the serotonin transporter (SERT), so serotonin stays longer in the gaps between nerve cells. Over weeks, the brain adapts and mood and anxiety improve.",
  components: [
    {
      id: "sertraline",
      name: "Sertraline",
      regimens: [oral(mg(50, "dailymed-sertraline", { range: [25, 200] }), frac(0.44, "dailymed-sertraline", { needsReview: true, note: "Absolute bioavailability not well established" }), hrs(6, "dailymed-sertraline", { range: [4.5, 8.4] }))],
      vd: lkg(25, "dailymed-sertraline", { needsReview: true, note: "Label: >20 L/kg" }),
      halfLife: hrs(26, "dailymed-sertraline", { note: "Metabolite desmethylsertraline: 62–104 h (much less active)" }),
      proteinBinding: frac(0.98, "dailymed-sertraline"),
      fe: frac(0, "dailymed-sertraline", { note: "Negligible unchanged drug in urine" }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: N-demethylation via several CYPs (2B6, 2C19, 2D6, 3A4) to desmethylsertraline.",
      noThresholdReason: antidepressantDelay,
    },
  ],
  organs: {
    brain: {
      affinity: 1.8,
      target: true,
      therapeutic: "Raises serotonin signalling in mood and anxiety circuits; benefit appears after weeks.",
      sideEffects: "Early nausea, sleep changes, sexual side effects; in under-25s, monitoring for suicidal thoughts in early treatment.",
      toxic: "Serotonin syndrome: agitation, tremor, fever, seizures.",
    },
    smallIntestine: { affinity: 1.2, sideEffects: "Most of the body's serotonin is in the gut: nausea and loose stools are common at the start." },
    heart: { affinity: 0.8, toxic: "Fast heart rate; QT prolongation is uncommon with sertraline." },
    vessels: { affinity: 0.8, sideEffects: "Platelets take up less serotonin: slightly higher bleeding risk." },
    liver: { affinity: 1.2, therapeutic: "Metabolised by several CYP enzymes." },
  },
  toxicity: {
    mechanism: "Too much serotonin activity throughout the nervous system (serotonin syndrome), especially when combined with other serotonergic drugs.",
    warningSigns: serotoninSyndrome,
    treatment: "Hospital care: stopping serotonergic drugs, benzodiazepines, cooling; cyproheptadine in some cases.",
    organs: ["brain", "heart"],
  },
  interactions: [...ssriInteractions],
  didYouKnow: "Stopping an SSRI suddenly can cause 'discontinuation symptoms' such as dizziness and 'brain zaps', so doses are tapered.",
  modelNotes: [],
};

export const escitalopram: DrugInput = {
  id: "escitalopram",
  name: "Escitalopram",
  brands: ["Lexapro", "Cipralex"],
  drugClass: "ssri",
  classLabel: "SSRI antidepressant",
  categories: ["CNS"],
  mechanism:
    "The active mirror-image half of citalopram. It blocks the serotonin transporter very selectively, increasing serotonin signalling; mood and anxiety improve over weeks.",
  components: [
    {
      id: "escitalopram",
      name: "Escitalopram",
      regimens: [oral(mg(10, "dailymed-escitalopram", { range: [5, 20] }), frac(0.8, "dailymed-escitalopram"), hrs(5, "dailymed-escitalopram"))],
      vd: lkg(16, "dailymed-escitalopram", { range: [12, 26], needsReview: true }),
      halfLife: hrs(30, "dailymed-escitalopram", { range: [27, 32] }),
      proteinBinding: frac(0.56, "dailymed-escitalopram"),
      fe: frac(0.08, "dailymed-escitalopram"),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: CYP2C19, CYP3A4 and CYP2D6 to S-desmethylcitalopram.",
      noThresholdReason: antidepressantDelay,
    },
  ],
  organs: {
    brain: {
      affinity: 1.8,
      target: true,
      therapeutic: "Increases serotonin signalling, easing depression and generalised anxiety.",
      sideEffects: "Nausea, sleep changes, sexual side effects.",
      toxic: "Serotonin syndrome and seizures.",
    },
    heart: {
      affinity: 1,
      sideEffects: "Dose-related QT prolongation; maximum doses are lower in older adults.",
      toxic: "QT prolongation with risk of torsades de pointes.",
    },
    smallIntestine: { affinity: 1.2, sideEffects: "Nausea early in treatment." },
    vessels: { affinity: 0.8, sideEffects: "Slightly higher bleeding risk." },
    liver: { affinity: 1.1 },
  },
  toxicity: {
    mechanism: "Overdose causes serotonin excess and, with escitalopram, QT prolongation on the ECG that can trigger dangerous rhythms.",
    warningSigns: [...serotoninSyndrome, "Palpitations or fainting"],
    treatment: "Hospital care with ECG monitoring, magnesium and correction of electrolytes, and benzodiazepines.",
    organs: ["brain", "heart"],
  },
  interactions: [...ssriInteractions, { with: "Other QT-prolonging drugs (ondansetron, some antibiotics)", effect: "Additive QT prolongation." }],
  didYouKnow: "Citalopram is a 50:50 mix of two mirror-image molecules; escitalopram is just the active one.",
  modelNotes: [],
};

export const fluoxetine: DrugInput = {
  id: "fluoxetine",
  name: "Fluoxetine",
  brands: ["Prozac"],
  drugClass: "ssri",
  classLabel: "SSRI antidepressant",
  categories: ["CNS"],
  mechanism:
    "Blocks serotonin reuptake. Fluoxetine and its active metabolite norfluoxetine last for weeks, which smooths out missed doses but means interactions persist long after stopping.",
  components: [
    {
      id: "fluoxetine",
      name: "Fluoxetine",
      regimens: [oral(mg(20, "dailymed-fluoxetine", { range: [10, 60] }), frac(0.72, "dailymed-fluoxetine", { needsReview: true }), hrs(7, "dailymed-fluoxetine", { range: [6, 8] }), { label: "Capsule" })],
      vd: lkg(30, "dailymed-fluoxetine", { range: [20, 40] }),
      halfLife: hrs(48, "dailymed-fluoxetine", { range: [24, 72], note: "4–6 days with chronic use; norfluoxetine 4–16 days" }),
      proteinBinding: frac(0.945, "dailymed-fluoxetine"),
      fe: frac(0.025, "dailymed-fluoxetine", { needsReview: true }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: CYP2D6 (and others) to norfluoxetine, also an SSRI. Fluoxetine strongly inhibits CYP2D6.",
      noThresholdReason: antidepressantDelay,
    },
  ],
  organs: {
    brain: {
      affinity: 1.8,
      target: true,
      therapeutic: "Increases serotonin signalling for depression, OCD and bulimia.",
      sideEffects: "Insomnia, restlessness, sexual side effects.",
      toxic: "Serotonin syndrome, seizures.",
    },
    liver: { affinity: 1.4, therapeutic: "Converted to norfluoxetine.", sideEffects: "Blocks CYP2D6, raising levels of many other drugs." },
    smallIntestine: { affinity: 1.1, sideEffects: "Nausea." },
    heart: { affinity: 0.8, toxic: "QT prolongation is possible in large overdoses." },
  },
  toxicity: {
    mechanism: "Serotonin excess, made more likely by fluoxetine's long-lasting interactions.",
    warningSigns: serotoninSyndrome,
    treatment: "Hospital care: benzodiazepines, cooling, stopping serotonergic drugs.",
    organs: ["brain", "heart"],
  },
  interactions: [
    ...ssriInteractions,
    { with: "Tamoxifen, codeine, tramadol", effect: "CYP2D6 inhibition reduces their activation." },
    { with: "Starting an MAOI", effect: "A 5-week gap is needed after stopping fluoxetine." },
  ],
  didYouKnow: "Prozac, launched in 1988, was the first SSRI to become a household name.",
  modelNotes: ["The active metabolite norfluoxetine is not shown; it extends the effect for weeks."],
};

export const duloxetine: DrugInput = {
  id: "duloxetine",
  name: "Duloxetine",
  brands: ["Cymbalta"],
  drugClass: "snri",
  classLabel: "SNRI antidepressant / neuropathic pain",
  categories: ["CNS", "Pain"],
  mechanism:
    "Blocks reuptake of both serotonin and noradrenaline. Boosting these in the spinal cord's pain-dampening pathways helps nerve pain, and in the brain it treats depression and anxiety.",
  components: [
    {
      id: "duloxetine",
      name: "Duloxetine",
      regimens: [
        {
          ...oral(mg(60, "dailymed-duloxetine", { range: [30, 120] }), frac(0.5, "dailymed-duloxetine"), hrs(6, "dailymed-duloxetine"), { label: "Delayed-release capsule" }),
          absorption: {
            F: frac(0.5, "dailymed-duloxetine", { range: [0.32, 0.8] }),
            tmax: hrs(6, "dailymed-duloxetine"),
            lag: hrs(2, "dailymed-duloxetine", { note: "Enteric coating" }),
          },
        },
      ],
      vd: litres(1640, "dailymed-duloxetine"),
      halfLife: hrs(12, "dailymed-duloxetine", { range: [8, 17] }),
      proteinBinding: frac(0.95, "dailymed-duloxetine"),
      fe: frac(0.01, "dailymed-duloxetine"),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: CYP1A2 and CYP2D6. Smoking (CYP1A2 induction) lowers levels.",
      noThresholdReason: "Pain and mood benefits build over weeks; no plasma range is used.",
    },
  ],
  organs: {
    brain: {
      affinity: 1.6,
      target: true,
      therapeutic: "Strengthens descending pain-inhibiting pathways and improves mood.",
      sideEffects: "Nausea, dry mouth, drowsiness, sweating.",
      toxic: "Serotonin syndrome, seizures.",
    },
    liver: {
      affinity: 1.4,
      sideEffects: "Raised liver enzymes; avoided in heavy alcohol use and liver disease.",
      toxic: "Liver injury.",
    },
    heart: { affinity: 0.9, sideEffects: "Small rise in blood pressure and heart rate (noradrenaline).", toxic: "Fast heart rate, high blood pressure." },
    bladder: { affinity: 0.5, sideEffects: "Can cause difficulty passing urine." },
  },
  toxicity: {
    mechanism: "Excess serotonin and noradrenaline: serotonin syndrome plus raised heart rate and blood pressure.",
    warningSigns: [...serotoninSyndrome, "Pounding heart, high blood pressure"],
    treatment: "Hospital supportive care, benzodiazepines, cooling.",
    organs: ["brain", "heart", "liver"],
  },
  interactions: [...ssriInteractions, { with: "Fluvoxamine, ciprofloxacin (CYP1A2 inhibitors)", effect: "Raise duloxetine levels several-fold." }],
  didYouKnow: "Duloxetine is licensed for diabetic nerve pain and fibromyalgia as well as depression.",
  modelNotes: [],
};

const gabapentinoidToxicity: DrugInput["toxicity"] = {
  mechanism:
    "Alone, gabapentinoids cause sedation and unsteadiness. With opioids or other sedatives they add to breathing suppression, and they are increasingly involved in opioid-related deaths.",
  warningSigns: ["Marked drowsiness, slurred speech", "Unsteadiness, double vision", "Slow or shallow breathing, especially with opioids"],
  treatment: "Supportive care; haemodialysis removes them in kidney failure. Naloxone reverses any opioid involved.",
  organs: ["brain", "lungs"],
};

const gabapentinoidOrgans = (extra: string): DrugInput["organs"] => ({
  brain: {
    affinity: 1.4,
    target: true,
    therapeutic: "Binds the α2δ subunit of calcium channels, damping overactive pain and seizure signals. " + extra,
    sideEffects: "Dizziness, drowsiness, unsteadiness, weight gain.",
    toxic: "Deep sedation; with opioids, suppression of the drive to breathe.",
  },
  lungs: { affinity: 0.6, toxic: "Breathing suppression when combined with opioids or other sedatives." },
  kidneys: { affinity: 1.6, therapeutic: "Excreted unchanged: doses must be cut when kidney function falls." },
  bladder: { affinity: 1.2 },
  vessels: { affinity: 0.8, sideEffects: "Swelling of ankles (peripheral oedema)." },
});

const gabapentinoidInteractions: DrugInput["interactions"] = [
  { with: "Opioids", effect: "Increased risk of fatal respiratory depression." },
  { with: "Alcohol, benzodiazepines", effect: "Additive sedation." },
];

export const gabapentin: DrugInput = {
  id: "gabapentin",
  name: "Gabapentin",
  brands: ["Neurontin"],
  drugClass: "gabapentinoid",
  classLabel: "Gabapentinoid (anticonvulsant / neuropathic pain)",
  categories: ["CNS", "Pain"],
  mechanism: "Binds the α2δ subunit of voltage-gated calcium channels on nerve cells, reducing the release of excitatory signals. Used for nerve pain and epilepsy.",
  components: [
    {
      id: "gabapentin",
      name: "Gabapentin",
      regimens: [oral(mg(300, "dailymed-gabapentin", { range: [100, 600] }), frac(0.6, "dailymed-gabapentin", { note: "Saturable: falls to ~27% at 4800 mg/day" }), hrs(2.5, "dailymed-gabapentin", { range: [2, 3] }), { label: "Capsule" })],
      vd: litres(58, "dailymed-gabapentin"),
      halfLife: hrs(6, "dailymed-gabapentin", { range: [5, 7] }),
      proteinBinding: frac(0.03, "dailymed-gabapentin", { note: "<3%" }),
      fe: frac(1, "dailymed-gabapentin", { note: "Not metabolised" }),
      nonRenalRoute: "tissue-uptake",
      metabolism: "Not metabolised; excreted unchanged by the kidneys.",
      noThresholdReason: "Doses are titrated to effect; there is no established therapeutic plasma range.",
    },
  ],
  organs: gabapentinoidOrgans("Absorbed by a saturable gut transporter, so bigger doses are absorbed less efficiently."),
  toxicity: gabapentinoidToxicity,
  interactions: [...gabapentinoidInteractions, { with: "Antacids (aluminium/magnesium)", effect: "Reduce absorption by ~20%; take 2 h apart." }],
  didYouKnow: "Gabapentin was designed to mimic the brain chemical GABA, but it turned out to work by a different mechanism entirely.",
  modelNotes: ["Absorption is saturable, so the curve under-states how little extra drug is absorbed at high doses."],
};

export const pregabalin: DrugInput = {
  id: "pregabalin",
  name: "Pregabalin",
  brands: ["Lyrica"],
  drugClass: "gabapentinoid",
  classLabel: "Gabapentinoid (anticonvulsant / neuropathic pain)",
  categories: ["CNS", "Pain"],
  mechanism: "Like gabapentin it binds α2δ calcium-channel subunits, but it is absorbed more predictably. Used for nerve pain, fibromyalgia, epilepsy and anxiety.",
  components: [
    {
      id: "pregabalin",
      name: "Pregabalin",
      regimens: [oral(mg(75, "dailymed-pregabalin", { range: [25, 300] }), frac(0.9, "dailymed-pregabalin", { note: "≥90%, dose-independent" }), hrs(1.5, "dailymed-pregabalin", { range: [1, 1.5] }), { label: "Capsule" })],
      vd: lkg(0.5, "dailymed-pregabalin"),
      halfLife: hrs(6.3, "dailymed-pregabalin"),
      proteinBinding: frac(0, "dailymed-pregabalin"),
      fe: frac(0.9, "dailymed-pregabalin"),
      nonRenalRoute: "tissue-uptake",
      metabolism: "Negligible metabolism; ~90% excreted unchanged in urine.",
      noThresholdReason: "Titrated to effect; no therapeutic plasma range is used.",
    },
  ],
  organs: gabapentinoidOrgans("Pregabalin binds more tightly than gabapentin."),
  toxicity: gabapentinoidToxicity,
  interactions: [...gabapentinoidInteractions],
  didYouKnow: "Pregabalin is a controlled drug in the UK (since 2019) because of misuse and its role in opioid-related deaths.",
  modelNotes: [],
};

export const lorazepam: DrugInput = {
  id: "lorazepam",
  name: "Lorazepam",
  brands: ["Ativan"],
  drugClass: "benzodiazepine",
  classLabel: "Benzodiazepine",
  categories: ["CNS", "ER"],
  mechanism:
    "Enhances GABA-A receptor signalling, calming nerve activity. It is a first-line emergency treatment for prolonged seizures. Because it skips CYP metabolism, it is preferred in liver disease and older adults.",
  components: [
    {
      id: "lorazepam",
      name: "Lorazepam",
      regimens: [
        oral(mg(1, "dailymed-lorazepam", { range: [0.5, 2] }), frac(0.9, "dailymed-lorazepam"), hrs(2, "dailymed-lorazepam")),
        { id: "iv", label: "IV (seizures)", route: "iv-bolus", dose: mg(4, "dailymed-lorazepam", { note: "Status epilepticus dose in adults" }) },
      ],
      vd: lkg(1.3, "dailymed-lorazepam"),
      halfLife: hrs(12, "dailymed-lorazepam", { range: [10, 20] }),
      proteinBinding: frac(0.88, "dailymed-lorazepam", { range: [0.85, 0.91] }),
      fe: frac(0.01, "dailymed-lorazepam", { needsReview: true, note: "Excreted mainly as the glucuronide" }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: direct glucuronidation to an inactive glucuronide; no CYP metabolism and no active metabolites.",
      noThresholdReason: "Effect varies widely between people and with tolerance; no single plasma level marks 'working'.",
    },
  ],
  organs: {
    brain: {
      affinity: 1.8,
      target: true,
      therapeutic: "Reduces anxiety and stops seizures by boosting GABA signalling.",
      sideEffects: "Drowsiness, memory gaps, dependence with regular use.",
      toxic: "Deep sedation; with opioids or alcohol, suppression of brainstem breathing.",
    },
    lungs: { affinity: 0.8, toxic: "Slow, shallow breathing." },
    liver: { affinity: 1, therapeutic: "Glucuronidated; little affected by liver disease or CYP interactions." },
    kidneys: { affinity: 0.8, therapeutic: "Excrete the glucuronide." },
  },
  toxicity: {
    mechanism: "Combined with opioids, alcohol or other sedatives, the effects multiply in the brainstem's breathing centre.",
    warningSigns: ["Cannot be woken", "Slurred speech", "Slow or shallow breathing, blue lips"],
    treatment: "Airway and breathing support; flumazenil can reverse it but is used cautiously because of seizure risk.",
    organs: ["brain", "lungs"],
  },
  interactions: [
    { with: "Opioids", effect: "Profound sedation and respiratory depression (FDA boxed warning)." },
    { with: "Alcohol", effect: "Additive CNS depression." },
    { with: "Valproate", effect: "Inhibits glucuronidation, raising lorazepam levels." },
  ],
  didYouKnow: "IV lorazepam must be kept refrigerated, one reason some ambulance services use midazolam instead.",
  modelNotes: [],
};

export const zolpidem: DrugInput = {
  id: "zolpidem",
  name: "Zolpidem",
  brands: ["Ambien", "Stilnoct"],
  drugClass: "hypnotic",
  classLabel: "Non-benzodiazepine hypnotic ('Z-drug')",
  categories: ["CNS"],
  mechanism:
    "Binds selectively to the α1 subunit of GABA-A receptors, which produces sleep with less muscle relaxation or anxiety relief than benzodiazepines. Short-acting, it is meant for getting to sleep.",
  components: [
    {
      id: "zolpidem",
      name: "Zolpidem",
      regimens: [oral(mg(10, "dailymed-zolpidem", { range: [5, 10], note: "5 mg recommended starting dose for women (FDA)" }), frac(0.7, "dailymed-zolpidem"), hrs(1.6, "dailymed-zolpidem"))],
      vd: lkg(0.54, "dailymed-zolpidem"),
      halfLife: hrs(2.5, "dailymed-zolpidem", { range: [1.4, 4.5] }),
      proteinBinding: frac(0.925, "dailymed-zolpidem"),
      fe: frac(0, "dailymed-zolpidem", { note: "Inactive metabolites excreted in urine" }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: mainly CYP3A4 to inactive metabolites.",
      noThresholdReason: "Next-morning impairment correlates with level, but there is no defined therapeutic range.",
    },
  ],
  organs: {
    brain: {
      affinity: 1.7,
      target: true,
      therapeutic: "Promotes sleep onset.",
      sideEffects: "Next-day drowsiness (women clear it more slowly); complex sleep behaviours such as sleep-walking or sleep-driving (FDA boxed warning).",
      toxic: "Deep sedation and coma, worse with alcohol or opioids.",
    },
    lungs: { affinity: 0.7, toxic: "Breathing suppression when combined with other sedatives." },
    liver: { affinity: 1.2, therapeutic: "Metabolised by CYP3A4." },
  },
  toxicity: {
    mechanism: "Too much GABA-A stimulation causes deep sedation; combined with alcohol, opioids or benzodiazepines, breathing can be suppressed.",
    warningSigns: ["Cannot be woken", "Confusion, unsteadiness", "Slow breathing"],
    treatment: "Supportive care; flumazenil can reverse it.",
    organs: ["brain", "lungs"],
  },
  interactions: [
    { with: "Alcohol, opioids, benzodiazepines", effect: "Additive sedation and breathing suppression." },
    { with: "Ketoconazole, ritonavir (CYP3A4 inhibitors)", effect: "Higher levels and longer sedation." },
  ],
  didYouKnow: "In 2013 the FDA halved the recommended dose for women after finding higher next-morning levels.",
  modelNotes: [],
};

export const tramadol: DrugInput = {
  id: "tramadol",
  name: "Tramadol",
  brands: ["Ultram", "Zydol", "Tramal"],
  drugClass: "opioid",
  classLabel: "Atypical opioid analgesic",
  categories: ["Pain", "CNS"],
  mechanism:
    "Works in two ways: its metabolite O-desmethyltramadol (made by CYP2D6) activates μ-opioid receptors, and tramadol itself blocks reuptake of serotonin and noradrenaline. How well it works depends on your CYP2D6 genes.",
  components: [
    {
      id: "tramadol",
      name: "Tramadol",
      regimens: [oral(mg(50, "dailymed-tramadol", { range: [50, 100] }), frac(0.75, "dailymed-tramadol"), hrs(2, "dailymed-tramadol", { note: "Active metabolite M1 peaks ~3 h" }), { label: "Capsule" })],
      vd: lkg(2.7, "dailymed-tramadol", { range: [2.6, 2.9] }),
      halfLife: hrs(6.3, "dailymed-tramadol", { note: "M1: ~7.4 h" }),
      proteinBinding: frac(0.2, "dailymed-tramadol"),
      fe: frac(0.3, "dailymed-tramadol"),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: CYP2D6 to O-desmethyltramadol (M1, the main opioid), CYP3A4 and CYP2B6 to N-desmethyltramadol.",
      noThresholdReason: "Pain relief depends on CYP2D6 activation and varies widely; no plasma range is used.",
    },
  ],
  organs: {
    brain: {
      affinity: 1.4,
      target: true,
      therapeutic: "Opioid pain relief plus enhanced pain-inhibiting serotonin/noradrenaline pathways.",
      sideEffects: "Nausea, dizziness, drowsiness; lowers the seizure threshold.",
      toxic: "Seizures, serotonin syndrome, and opioid breathing suppression.",
    },
    lungs: { affinity: 0.7, toxic: "Respiratory depression, especially in CYP2D6 ultra-rapid metabolisers." },
    liver: { affinity: 1.3, therapeutic: "CYP2D6 converts it to the active opioid M1." },
    largeIntestine: { affinity: 0.8, sideEffects: "Constipation." },
    kidneys: { affinity: 1, therapeutic: "Excrete tramadol and metabolites; dose interval extended in kidney disease." },
  },
  toxicity: {
    mechanism: "Overdose combines opioid effects (breathing suppression) with seizures and serotonin toxicity from its reuptake blockade.",
    warningSigns: ["Pinpoint pupils, drowsiness", "Seizures", "Slow breathing", "Agitation, fever, tremor (serotonin syndrome)"],
    treatment: "Naloxone reverses the opioid part; benzodiazepines for seizures and serotonin toxicity.",
    organs: ["brain", "lungs"],
  },
  interactions: [
    { with: "SSRIs, SNRIs, MAOIs", effect: "Serotonin syndrome and seizures." },
    { with: "Benzodiazepines, alcohol, gabapentinoids", effect: "Respiratory depression." },
    { with: "CYP2D6 inhibitors (fluoxetine, paroxetine)", effect: "Less pain relief but more serotonin effects." },
  ],
  didYouKnow: "Some people inherit extra copies of the CYP2D6 gene and turn tramadol into its opioid form dangerously fast, which is why it is restricted in children.",
  modelNotes: ["The curve shows tramadol; its opioid metabolite M1 is not shown separately."],
};

export const fentanyl: DrugInput = {
  id: "fentanyl",
  name: "Fentanyl",
  brands: ["Sublimaze (injection)", "Duragesic (patch)"],
  drugClass: "opioid",
  classLabel: "Synthetic opioid",
  categories: ["ER", "Pain"],
  mechanism:
    "A highly potent μ-opioid agonist, about 50–100× stronger than morphine. It is very fat-soluble, so it reaches the brain within a minute or two of an IV dose.",
  components: [
    {
      id: "fentanyl",
      name: "Fentanyl",
      regimens: [{ id: "iv", label: "IV injection", route: "iv-bolus", dose: mg(0.1, "dailymed-fentanyl-iv", { range: [0.025, 0.1], note: "25–100 micrograms in adults" }) }],
      vd: lkg(4, "dailymed-fentanyl-iv", { range: [3, 8] }),
      halfLife: hrs(3.7, "dailymed-fentanyl-iv", { range: [2, 7], note: "Terminal; clinical effect of a single dose lasts 30–60 min due to redistribution" }),
      proteinBinding: frac(0.82, "dailymed-fentanyl-iv", { range: [0.8, 0.85] }),
      fe: frac(0.1, "dailymed-fentanyl-iv", { needsReview: true }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: CYP3A4 to norfentanyl (inactive).",
      noThresholdReason: "Effective concentrations vary greatly with tolerance; single-dose effect is ended by redistribution, not elimination.",
    },
  ],
  organs: {
    brain: {
      affinity: 1.6,
      target: true,
      therapeutic: "Rapid, powerful pain relief.",
      sideEffects: "Sedation, nausea.",
      toxic: "Very fast suppression of the brainstem breathing centre; can also stiffen chest-wall muscles ('wooden chest').",
    },
    lungs: { affinity: 0.9, toxic: "Breathing slows or stops within minutes." },
    liver: { affinity: 1.2, therapeutic: "Metabolised by CYP3A4." },
    largeIntestine: { affinity: 0.8, sideEffects: "Constipation." },
  },
  toxicity: {
    mechanism: "Because it is so potent and fat-soluble, tiny excesses can stop breathing within minutes. Illicit fentanyl drives most opioid overdose deaths in North America.",
    warningSigns: ["Pinpoint pupils", "Cannot be woken", "Slow, shallow or no breathing; blue lips", "Rigid chest"],
    treatment: "Naloxone reverses it; repeated doses may be needed. Call emergency services immediately.",
    organs: ["brain", "lungs"],
  },
  interactions: [
    { with: "Benzodiazepines, alcohol, gabapentinoids", effect: "Profound respiratory depression." },
    { with: "CYP3A4 inhibitors (ritonavir, clarithromycin, fluconazole)", effect: "Raise and prolong fentanyl levels." },
  ],
  didYouKnow: "Fentanyl was synthesised by Paul Janssen in 1960 and remains one of the most widely used anaesthetic opioids.",
  modelNotes: [
    "Fentanyl's single-dose effect ends mainly by redistribution into fat and muscle, which a one-compartment model cannot show; the curve over-states how long one dose acts.",
  ],
};
