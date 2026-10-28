import type { DrugInput } from "../schema";
import { frac, hrs, lkg, mg } from "./_v";

export const morphine: DrugInput = {
  id: "morphine",
  name: "Morphine",
  brands: ["Oramorph", "MST Continus", "Duramorph"],
  drugClass: "opioid",
  classLabel: "Opioid analgesic",
  categories: ["ER", "CNS"],
  mechanism:
    "Activates μ-opioid receptors in the brain and spinal cord, blocking pain signals and changing how pain feels. The same receptors in the brainstem control breathing, which is why too much slows breathing.",
  components: [
    {
      id: "morphine",
      name: "Morphine",
      regimens: [
        {
          id: "iv",
          label: "IV injection",
          route: "iv-bolus",
          dose: mg(5, "dailymed-morphine-iv", { range: [2, 10], note: "Typical adult IV dose, titrated to effect" }),
        },
        {
          id: "oral",
          label: "Oral solution",
          route: "oral",
          dose: mg(10, "gg-appendix", { range: [5, 20] }),
          absorption: {
            F: frac(0.25, "gg-appendix", { range: [0.2, 0.4], note: "Heavy first-pass glucuronidation" }),
            tmax: hrs(0.75, "gg-appendix", { range: [0.5, 1], needsReview: true }),
          },
        },
      ],
      vd: lkg(3.5, "dailymed-morphine-iv", { range: [1, 6], needsReview: true }),
      halfLife: hrs(2, "dailymed-morphine-iv", { range: [1.5, 4.5] }),
      proteinBinding: frac(0.3, "dailymed-morphine-iv", { range: [0.2, 0.35] }),
      fe: frac(0.1, "dailymed-morphine-iv", { range: [0.02, 0.12], needsReview: true }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism:
        "Liver: glucuronidation by UGT2B7 to morphine-3-glucuronide and morphine-6-glucuronide. M6G is itself a potent opioid and is cleared by the kidneys, so it builds up in kidney failure.",
      noThresholdReason:
        "The concentration needed for pain relief varies several-fold between people and rises with tolerance, so no single plasma level applies.",
    },
  ],
  organs: {
    brain: {
      affinity: 1.2,
      target: true,
      therapeutic: "Blocks pain transmission and reduces the distress of pain; causes euphoria and calm.",
      sideEffects: "Drowsiness, nausea (vomiting-centre stimulation), pinpoint pupils.",
      toxic: "In the brainstem's breathing centre (pre-Bötzinger complex) it blunts the response to carbon dioxide: breathing slows, then stops.",
    },
    lungs: { affinity: 0.8, toxic: "Breathing becomes slow and shallow; oxygen falls." },
    largeIntestine: { affinity: 1, sideEffects: "Slows gut movement: constipation is almost universal." },
    smallIntestine: { affinity: 1, sideEffects: "Slower transit." },
    liver: { affinity: 1.2, therapeutic: "Converts morphine to glucuronides, one of them active." },
    kidneys: {
      affinity: 1,
      therapeutic: "Excrete the glucuronides.",
      toxic: "Poor kidney function lets the active metabolite M6G accumulate, prolonging sedation.",
    },
    bladder: { affinity: 0.4, sideEffects: "Can cause urinary retention." },
  },
  toxicity: {
    mechanism:
      "Opioid overdose suppresses the brainstem's drive to breathe. Combined with benzodiazepines, alcohol or other sedatives, the effect multiplies.",
    warningSigns: ["Pinpoint pupils", "Cannot be woken, or very drowsy", "Slow, shallow or snoring breathing; blue lips", "Limp body, pale clammy skin"],
    treatment:
      "Naloxone rapidly reverses opioid effects. Because naloxone wears off sooner than many opioids, people must be observed in hospital and may need repeat doses.",
    organs: ["brain", "lungs"],
  },
  interactions: [
    { with: "Benzodiazepines (alprazolam, diazepam)", effect: "Profound sedation and respiratory depression; FDA boxed warning." },
    { with: "Alcohol", effect: "Additive CNS and breathing depression." },
    { with: "Gabapentin, pregabalin", effect: "Increased risk of fatal respiratory depression." },
  ],
  didYouKnow: "Morphine was isolated from opium in 1804 by Friedrich Sertürner, the first active compound ever extracted from a plant.",
  modelNotes: ["The active metabolite M6G is not shown; it extends effect, particularly when kidneys are impaired."],
};

export const naloxone: DrugInput = {
  id: "naloxone",
  name: "Naloxone",
  brands: ["Narcan", "Prenoxad", "Nyxoid"],
  drugClass: "opioid-antagonist",
  classLabel: "Opioid antagonist",
  categories: ["ER"],
  mechanism:
    "Binds to opioid receptors more tightly than morphine or heroin, knocking them off without activating the receptor. Breathing and consciousness can return within minutes. It does nothing in someone without opioids in their system.",
  components: [
    {
      id: "naloxone",
      name: "Naloxone",
      regimens: [
        {
          id: "iv",
          label: "IV injection",
          route: "iv-bolus",
          dose: mg(0.4, "dailymed-naloxone", { range: [0.04, 2], note: "Titrated to breathing" }),
        },
        {
          id: "intranasal",
          label: "Nasal spray",
          route: "intranasal",
          dose: mg(4, "dailymed-naloxone"),
          absorption: {
            F: frac(0.44, "dailymed-naloxone", { needsReview: true }),
            tmax: hrs(0.33, "dailymed-naloxone", { range: [0.25, 0.5], needsReview: true }),
          },
        },
      ],
      vd: lkg(2, "dailymed-naloxone", { needsReview: true }),
      halfLife: hrs(1.1, "dailymed-naloxone", { range: [0.5, 1.35], note: "Label: 64 ± 12 min in adults" }),
      proteinBinding: frac(0.45, "dailymed-naloxone", { needsReview: true }),
      fe: frac(0.05, "needs-source", { needsReview: true }),
      nonRenalRoute: "hepatic-metabolism",
      metabolism: "Liver: glucuronidation to naloxone-3-glucuronide; very high first-pass, so it is useless as a swallowed tablet.",
      noThresholdReason: "The dose needed depends on how much opioid is on board; it is titrated to breathing, not to a plasma level.",
    },
  ],
  organs: {
    brain: {
      affinity: 1.4,
      target: true,
      therapeutic: "Displaces opioids from μ-receptors in the brainstem, restoring the drive to breathe.",
      sideEffects: "In people dependent on opioids it triggers sudden withdrawal: agitation, sweating, vomiting.",
      toxic: "Naloxone itself has low toxicity. Rapid reversal can rarely cause fluid in the lungs or heart rhythm problems.",
    },
    lungs: { affinity: 0.8, target: true, therapeutic: "Breathing rate and depth recover within minutes.", toxic: "Rare pulmonary oedema after abrupt reversal." },
    heart: { affinity: 0.8, toxic: "Surge of adrenaline during withdrawal: fast heartbeat, high blood pressure." },
    liver: { affinity: 1.2, therapeutic: "Rapidly glucuronidated, which is why it wears off within an hour or so." },
  },
  toxicity: {
    mechanism:
      "Naloxone has a very wide safety margin. The main risks come from abrupt opioid withdrawal, and from naloxone wearing off before the opioid does, so breathing slows again.",
    warningSigns: ["Withdrawal: agitation, vomiting, sweating, shaking", "Drowsiness returning 30–90 minutes later (opioid outlasting naloxone)"],
    treatment: "Observation in hospital; repeat naloxone doses or an infusion if the opioid outlasts it.",
    organs: ["brain"],
  },
  interactions: [
    { with: "Long-acting opioids (methadone, extended-release oxycodone)", effect: "The opioid can outlast naloxone, so breathing slows again." },
    { with: "Buprenorphine", effect: "Binds very tightly; larger naloxone doses may be needed." },
  ],
  didYouKnow: "Naloxone nasal sprays are available without prescription in the US and from many UK pharmacies and drug services, so bystanders can save lives.",
  modelNotes: ["Compare with morphine to see why naloxone can wear off first."],
};

export const adrenaline: DrugInput = {
  id: "adrenaline",
  name: "Adrenaline",
  altNames: ["Epinephrine"],
  brands: ["EpiPen", "Jext", "Emerade"],
  drugClass: "catecholamine",
  classLabel: "Catecholamine / sympathomimetic",
  categories: ["ER"],
  mechanism:
    "Acts on α and β adrenergic receptors. It tightens blood vessels to raise blood pressure (α₁), strengthens and speeds the heart (β₁), opens the airways (β₂) and stops mast cells releasing more histamine. That combination makes it the first treatment for anaphylaxis.",
  relativeOnly: true,
  components: [
    {
      id: "adrenaline",
      name: "Adrenaline",
      regimens: [
        {
          id: "im",
          label: "IM injection (thigh)",
          route: "im",
          dose: mg(0.5, "dailymed-epinephrine", { range: [0.3, 0.5], note: "Adult anaphylaxis dose, 1 mg/mL" }),
          absorption: {
            F: frac(1, "needs-source", { needsReview: true }),
            tmax: hrs(0.17, "needs-source", { needsReview: true, note: "~10 min from the thigh" }),
          },
          note: "Absorption from muscle is slower than its elimination, so the curve's decline reflects absorption (flip-flop kinetics).",
        },
      ],
      vd: lkg(1, "needs-source", { needsReview: true, note: "Placeholder: only sets the absolute scale, which is not shown" }),
      halfLife: hrs(0.04, "dailymed-epinephrine", { range: [0.033, 0.05], note: "~2–3 minutes in plasma" }),
      proteinBinding: frac(0.5, "needs-source", { needsReview: true }),
      fe: frac(0.05, "needs-source", { needsReview: true }),
      nonRenalRoute: "tissue-uptake",
      metabolism: "Rapid uptake into nerve endings and breakdown by COMT and MAO in the liver, kidney and other tissues.",
      noThresholdReason: "Adrenaline is also made by the body; effect is judged clinically (blood pressure, breathing), not by plasma level.",
    },
  ],
  organs: {
    heart: {
      affinity: 1.4,
      target: true,
      therapeutic: "Raises heart rate and the force of each beat (β₁), restoring blood pressure.",
      toxic: "Dangerous rhythms, very high blood pressure, strain on the heart muscle (ischaemia).",
    },
    lungs: {
      affinity: 1.2,
      target: true,
      therapeutic: "Relaxes airway muscle (β₂) and reduces swelling, easing wheeze.",
      toxic: "Severe high blood pressure can push fluid into the lungs (pulmonary oedema).",
    },
    vessels: {
      affinity: 1.2,
      target: true,
      therapeutic: "Constricts leaky blood vessels (α₁), reversing the drop in blood pressure in anaphylaxis.",
      toxic: "Extreme blood-pressure spikes; risk of stroke.",
    },
    liver: { affinity: 1, therapeutic: "Releases glucose for energy; also breaks adrenaline down." },
    brain: { affinity: 0.2, sideEffects: "Anxiety, tremor, pounding headache.", toxic: "Severe headache; bleeding in the brain from blood-pressure surges." },
  },
  toxicity: {
    mechanism:
      "Too much adrenaline, or giving the wrong strength into a vein, overstimulates the heart and blood vessels. Blood pressure spikes, the heart races, and rhythm can become dangerous.",
    warningSigns: ["Pounding heartbeat, chest pain", "Severe headache", "Pale skin, tremor, anxiety", "Shortness of breath"],
    treatment: "Its effect is short-lived; hospital care treats high blood pressure and rhythm problems. Never withhold adrenaline in anaphylaxis for fear of side effects.",
    organs: ["heart", "vessels"],
  },
  interactions: [
    { with: "Beta-blockers", effect: "Can blunt adrenaline's effect in anaphylaxis; glucagon may then be needed." },
    { with: "Tricyclic antidepressants, MAOIs", effect: "Exaggerated blood-pressure response." },
  ],
  didYouKnow: "In anaphylaxis an adrenaline injection can be repeated after 5 minutes. Its plasma half-life is only a couple of minutes.",
  modelNotes: ["Absolute concentrations are not shown: adrenaline is also produced by the body, and the source data are sparse."],
};
